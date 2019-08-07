const bcrypt = require('bcryptjs');
const { randomBytes } = require('crypto');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const { makeANiceEmail, transport } = require('../mail');

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
