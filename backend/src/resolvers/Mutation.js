const Mutation = {
  async createItem(parent, args, ctx, info) {
    // TODO: check if they are logged in

    const item = await ctx.db.mutation.createItem({
      data: {
        ...args,
      },
    }, info)

    return item
  },

  updateItem(parent, args, ctx, info) {
    // First take a copy of the updates
    const updates = { ...args }
    // Remove the ID from the updates
    delete updates.id
    // Run the update method
    return ctx.db.mutation.updateItem({
      data: updates,
      where: { id: args.id },
    }, info)
  },

  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id }
    // 1. find the item
    const item = await ctx.db.query.item({ where }, `{ id title }`)
    // 2. check if the user owns the item, or has permissions
    // TODO
    // 3. delete it!
    return ctx.db.mutation.deleteItem({ where }, info)
  },
}

module.exports = Mutation
