const bcrypt = require('bcryptjs');
const { randomBytes } = require('crypto');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const { makeANiceEmail, transport } = require('../mail');
const { checkPermissions } = require('../utils');

// 1 year cookie
const COOKIE_MAX_AGE = 1000 * 60 * 60 * 24 * 365;

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
    ctx.response.cookie('token', token, { httpOnly: true, maxAge: COOKIE_MAX_AGE });

    return user;
  },
  async signin(_parent, { email, password }, ctx, _info) {
    const user = await ctx.db.query.user({ where: { email } });
    if (!user) throw new Error(`No user found for email '${email}'`);

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new Error('Invalid password');

    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    ctx.response.cookie('token', token, { httpOnly: true, maxAge: COOKIE_MAX_AGE });

    return user;
  },
  async signout(_parent, _args, ctx, _info) {
    ctx.response.clearCookie('token');
    return { message: 'Signed out' };
  },
  async requestReset(_parent, { email }, ctx, _info) {
    const user = await ctx.db.query.user({ where: { email } });
    if (!user) throw new Error(`No user found for email '${email}'`);

    const resetToken = (await promisify(randomBytes)(20)).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now
    await ctx.db.mutation.updateUser({
      where: { email },
      data: { resetToken, resetTokenExpiry },
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}`;
    await transport.sendMail({
      from: 'hello@sickfits.com',
      to: user.email,
      subject: 'Password Reset Request',
      html: makeANiceEmail(`
        Someone (probably you) requested a password reset for your Sick Fits account.
        Click or copy the following link to set a new password:
        <br />
        <a href="${resetLink}">${resetLink}</a>
        <br /><br />
        If you did not request a password reset, you can safely ignore and discard this email.
      `),
    });

    return { message: `Sent reset token to '${email}'` };
  },
  async resetPassword(_parent, args, ctx, _info) {
    const [user] = await ctx.db.query.users({
      where: { resetToken: args.resetToken, resetTokenExpiry_gte: Date.now() - 3600000 },
    });
    if (!user) throw new Error('This token is either invalid or expired');

    const passwordHash = await bcrypt.hash(args.password, 10);
    const updatedUser = await ctx.db.mutation.updateUser({
      where: { email: user.email },
      data: { passwordHash, resetToken: null, resetTokenExpiry: null },
    });

    const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET);
    ctx.response.cookie('token', token, { httpOnly: true, maxAge: COOKIE_MAX_AGE });

    return updatedUser;
  },
  updatePermissions(_parent, { permissions, userId }, ctx, info) {
    if (!ctx.request.userId) throw new Error('You need to be logged in to update permissions');
    checkPermissions(ctx.request.user, ['ADMIN', 'PERMISSION_UPDATE']);
    return ctx.db.mutation.updateUser(
      {
        where: { id: userId },
        data: { permissions: { set: permissions } },
      },
      info
    );
  },

  createItem(_parent, args, ctx, info) {
    if (!ctx.request.userId) throw new Error('You need to be logged in to create items');

    return ctx.db.mutation.createItem(
      {
        data: {
          // Connect user to item
          user: { connect: { id: ctx.request.userId } },
          ...args,
        },
      },
      info
    );
  },
  updateItem(_parent, args, ctx, info) {
    const { id, ...data } = args;
    return ctx.db.mutation.updateItem({ data, where: { id } }, info);
  },
  async deleteItem(_parent, args, ctx, info) {
    const where = { id: args.id };
    const item = await ctx.db.query.item({ where }, '{ id title user { id } }');

    const ownsItem = item.user.id === ctx.request.userId;
    const hasPermission = ctx.request.user.permissions.some(permission =>
      ['ADMIN', 'ITEM_DELETE'].includes(permission)
    );
    if (!(ownsItem || hasPermission))
      throw new Error(`You don't have permission to delete this item`);

    return ctx.db.mutation.deleteItem({ where }, info);
  },

  async addToCart(_parent, { itemId }, ctx, info) {
    const { userId } = ctx.request;
    if (!userId) throw new Error('You need to be logged in to add items to your cart');

    const [existingCartItem] = await ctx.db.query.cartItems({
      where: {
        user: { id: userId },
        item: { id: itemId },
      },
    });

    if (existingCartItem) {
      return ctx.db.mutation.updateCartItem(
        {
          where: { id: existingCartItem.id },
          data: { quantity: existingCartItem.quantity + 1 },
        },
        info
      );
    } else {
      return ctx.db.mutation.createCartItem(
        {
          data: {
            user: { connect: { id: userId } },
            item: { connect: { id: itemId } },
          },
        },
        info
      );
    }
  },
};

module.exports = Mutation;
