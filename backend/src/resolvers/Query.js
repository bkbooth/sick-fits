const Query = {
  items(_parent, _args, ctx, _info) {
    return ctx.db.query.items();
  },
};

module.exports = Query;
