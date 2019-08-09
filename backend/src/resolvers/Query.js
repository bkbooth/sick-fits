const { forwardTo } = require('prisma-binding');
const { checkPermissions } = require('../utils');

const Query = {
  me(_parent, _args, ctx, info) {
    if (!ctx.request.userId) return null;
    return ctx.db.query.user({ where: { id: ctx.request.userId } }, info);
  },
  users(_parent, _args, ctx, info) {
    if (!ctx.request.userId) throw new Error('You need to be logged in to request a list of users');
    checkPermissions(ctx.request.user, ['ADMIN', 'PERMISSION_UPDATE']);
    return ctx.db.query.users({}, info);
  },

  item: forwardTo('db'),
  items: forwardTo('db'),
  itemsConnection: forwardTo('db'),

  async order(_parent, { id }, ctx, info) {
    if (!ctx.request.userId) throw new Error('You need to be logged in to view your orders');

    const order = await ctx.db.query.order({ where: { id } }, info);

    const ownsOrder = order.user.id === ctx.request.userId;
    const hasPermissionToSeeOrder = ctx.request.user.permissions.includes('ADMIN');
    if (!(ownsOrder || hasPermissionToSeeOrder))
      throw new Error('You do not have permission to view this order');

    return order;
  },
};

module.exports = Query;
