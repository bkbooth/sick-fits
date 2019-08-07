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
};

module.exports = Query;
