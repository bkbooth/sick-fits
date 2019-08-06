const { forwardTo } = require('prisma-binding');

const Query = {
  me(_parent, _args, ctx, info) {
    if (!ctx.request.userId) return null;
    return ctx.db.query.user({ where: { id: ctx.request.userId } }, info);
  },

  item: forwardTo('db'),
  items: forwardTo('db'),
  itemsConnection: forwardTo('db'),
};

module.exports = Query;
