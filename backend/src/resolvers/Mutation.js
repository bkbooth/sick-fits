const Mutation = {
  createItem(_parent, args, ctx, info) {
    // TODO: check if user is logged in

    return ctx.db.mutation.createItem({ data: { ...args } }, info);
  },
};

module.exports = Mutation;
