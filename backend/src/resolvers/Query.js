const { forwardTo } = require('prisma-binding')
const { hasPermission } = require('../utils')

const Query = {
  items: forwardTo('db'),
  item: forwardTo('db'),
  itemsConnection: forwardTo('db'),

  me(parent, args, ctx, info) {
    // check if there is a current user ID
    if (!ctx.request.userId) return null
    return ctx.db.query.user({
      where: { id: ctx.request.userId },
    }, info)
  },

  users(parent, args, ctx, info) {
    // 1. check if the user is logged in
    if (!ctx.request.userId) throw new Error('You must be logged in!')
    // 2. check if the user has permissions to query all users
    hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE'])
    // 3. query all the users!
    return ctx.db.query.users({}, info)
  },

  async order(parent, args, ctx, info) {
    // 1. make sure they are logged in
    if (!ctx.request.userId) throw new Error('You must be logged in!')
    // 2. query the current order
    const order = await ctx.db.query.order({
      where: { id: args.id },
    }, info)
    // 3. check if they have the permissions to see this order
    const ownsOrder = order.user.id === ctx.request.userId
    const hasPermissionToSeeOrder = ctx.request.user.permissions.includes('ADMIN')
    if (!ownsOrder || !hasPermissionToSeeOrder) throw new Error('You can\'t see this buuuuddy')
    // 4. return the order
    return order
  },

  orders(parent, args, ctx, info) {
    const { userId } = ctx.request
    if (!userId) throw new Error('You must be logged in!')
    return ctx.db.query.orders({
      where: {
        user: { id: userId },
      },
    }, info)
  },
}

module.exports = Query
