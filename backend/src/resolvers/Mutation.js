const Mutation = {
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
