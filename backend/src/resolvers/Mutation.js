const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Mutation = {
  async signup(_parent, args, ctx, info) {
    const data = {
      name: args.name,
      email: args.email.toLowerCase(),
      passwordHash: await bcrypt.hash(args.password, 10),
      permissions: { set: ['USER'] },
    };
    const user = await ctx.db.mutation.createUser({ data }, info);

    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    ctx.response.cookie('token', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 365 });

    return user;
  },

  createItem(_parent, args, ctx, info) {
    // TODO: check if user is logged in

    return ctx.db.mutation.createItem({ data: { ...args } }, info);
  },
  updateItem(_parent, args, ctx, info) {
    const { id, ...data } = args;
    return ctx.db.mutation.updateItem({ data, where: { id } }, info);
  },
  async deleteItem(_parent, args, ctx, info) {
    const where = { id: args.id };
    // const item = await ctx.db.query.item({ where }, `{ id title }`);
    // TODO: check if current user owns the item or has permissions
    return ctx.db.mutation.deleteItem({ where }, info);
  },
};

module.exports = Mutation;
