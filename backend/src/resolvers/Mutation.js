const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { randomBytes } = require('crypto')
const { promisify } = require('util')
const { transport, makeANiceEmail } = require('../mail')
const { hasPermission } = require('../utils')

const Mutation = {
  async createItem(parent, args, ctx, info) {
    if (!ctx.request.userId) throw new Error('You must be logged in to do that!')

    const item = await ctx.db.mutation.createItem({
      data: {
        // This is how we create a relationship
        user: {
          connect: {
            id: ctx.request.userId,
          },
        },
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
    const item = await ctx.db.query.item({ where }, `{ id title user { id } }`)
    // 2. check if the user owns the item, or has permissions
    const ownsItem = item.user.id === ctx.request.userId
    const hasPermission = ctx.request.user.permissions
      .some(permission => ['ADMIN', 'ITEMDELETE'].includes(permission))
    if (!ownsItem && !hasPermission) throw new Error('You don\'t have permission to do that!')
    // 3. delete it!
    return ctx.db.mutation.deleteItem({ where }, info)
  },

  async signup(parent, args, ctx, info) {
    args.email = args.email.toLowerCase()
    const password = await bcrypt.hash(args.password, 10)
    const user = await ctx.db.mutation.createUser({
      data: {
        ...args,
        password,
        permissions: { set: ['USER'] },
      },
    }, info)

    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET)
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie
    })

    return user
  },

  async signin(parent, { email, password }, ctx, info) {
    // 1. check if there is a user with the given email
    const user = await ctx.db.query.user({ where: { email } })
    if (!user) throw new Error(`No user found for email ${email}`)
    // 2. check if their password is correct
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) throw new Error('Invalid password')
    // 3. generate the JWT token
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET)
    // 4. set the cookie with the token
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie
    })
    // 5. return the user
    return user
  },

  signout(parent, args, ctx, info) {
    ctx.response.clearCookie('token')
    return { message: 'Goodbye!' }
  },

  async requestReset(parent, args, ctx, info) {
    // 1. check if this is a real user
    const user = await ctx.db.query.user({ where: { email: args.email } })
    if (!user) throw new Error(`No user found for email ${args.email}`)
    // 2. set a reset token and expiry on the user
    const randomBytesPromisified = promisify(randomBytes)
    const resetToken = (await randomBytesPromisified(20)).toString('hex')
    const resetTokenExpiry = Date.now() + 3600000 // 1 hour from now
    const res = await ctx.db.mutation.updateUser({
      where: { email: args.email },
      data: { resetToken, resetTokenExpiry },
    })
    // 3. email them the reset token
    const mailRes = await transport.sendMail({
      from: 'toosick@sickfits.com',
      to: user.email,
      subject: 'Your Password Reset Token',
      html: makeANiceEmail(`
        Your Password Reset Token is here!
        <br>
        <a href="${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}">
          Click Here to Reset
        </a>
      `)
    })

    // 4. return the message
    return { message: 'Thanks!' }
  },

  async resetPassword(parent, args, ctx, info) {
    // 1. check if the passwords match
    if (args.password !== args.confirmPassword) throw new Error('Passwords don\'t match!')
    // 2. check if it's a legit reset token
    // 3. check if it's expired
    const [user] = await ctx.db.query.users({
      where: {
        resetToken: args.resetToken,
        resetTokenExpiry_gte: Date.now() - 3600000,
      },
    })
    if (!user) throw new Error('Reset token is either invalid or expired!')
    // 4. hash their new password
    const password = await bcrypt.hash(args.password, 10)
    // 5. save the new password to the user and remove old resetToken fields
    const updatedUser = await ctx.db.mutation.updateUser({
      where: { email: user.email },
      data: {
        password,
        resetToken: null,
        resetTokenExpiry: null,
      },
    })
    // 6. generate JWT
    const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET)
    // 7. set the JWT cookie
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie
    })
    // 8. return the updated user
    return updatedUser
  },

  async updatePermissions(parent, args, ctx, info) {
    // 1. check if the user is logged in
    if (!ctx.request.userId) throw new Error('You must be logged in!')
    // 2. query the current user
    const currentUser = await ctx.db.query.user({
      where: { id: ctx.request.userId },
    }, info)
    // 3. check if they have permissions for action
    hasPermission(currentUser, ['ADMIN', 'PERMISSIONUPDATE'])
    // 4. update the permissions
    return ctx.db.mutation.updateUser({
      data: {
        permissions: {
          set: args.permissions,
        },
      },
      where: {
        id: args.userId,
      },
    }, info)
  },

  async addToCart(parent, args, ctx, info) {
    // 1. make sure user is signed in
    const { userId } = ctx.request
    if (!userId) throw new Error('You must be signed in!')
    // 2. query the users current cart
    const [existingCartItem] = await ctx.db.query.cartItems({
      where: {
        user: { id: userId },
        item: { id: args.id },
      },
    })
    // 3. check if that item is already in their cart and increment quantity
    if (existingCartItem) {
      console.log('This item is already in their cart')
      return ctx.db.mutation.updateCartItem({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + 1 },
      }, info)
    }
    // 4. if not, create a fresh CartItem for the user
    return ctx.db.mutation.createCartItem({
      data: {
        user: {
          connect: { id: userId },
        },
        item: {
          connect: { id: args.id },
        },
      },
    }, info)
  },
}

module.exports = Mutation
