const Mutation = {
  createItem(_parent, args, ctx, info) {
    // TODO: check if user is logged in

    return ctx.db.mutation.createItem({ data: { ...args } }, info);
  },
  updateItem(_parent, args, ctx, info) {
    const { id, ...data } = { ...args };
    return ctx.db.mutation.updateItem({ data, where: { id } }, info);
  },
};

module.exports = Mutation;
