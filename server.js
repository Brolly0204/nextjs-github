const Koa = require('koa')
const Router = require('koa-router')
const session = require('koa-session')
const koaBody = require('koa-body')
const next = require('next')
const Redis = require('ioredis')
const atob = require('atob')
const RedisSessionStore = require('./server/session-store')
const auth = require('./server/auth')
const apiRouter = require('./server/api')

global.atob = atob
const redis = new Redis()
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

let id = 0
app.prepare().then(() => {
  const server = new Koa()
  const router = new Router()

  server.keys = ['Brolly session']

  const SESSION_CONFIG = {
    key: 'bid',
    maxAge: 60 * 1000 * 60 * 10,
    store: new RedisSessionStore(redis)
  }

  server.use(koaBody())
  server.use(session(SESSION_CONFIG, server))

  // GitHub OAuth
  auth(server, router)

  // Router
  server.use(apiRouter.routes()).use(apiRouter.allowedMethods())
  server.use(router.routes()).use(router.allowedMethods())

  // ssr server
  server.use(async ctx => {
    ctx.req.session = ctx.session
    await handle(ctx.req, ctx.res)
    ctx.respond = false
  })

  server.listen(3000, () => {
    console.log('koa server listening on 3000')
  })
})

// router.get('/set/user', async ctx => {
//   ctx.session.user = {
//     username: 'Brolly',
//     age: 18
//   }
//   ctx.body = 'set session success'
// })

// router.get('/del/user', async ctx => {
//   ctx.session = null
//   ctx.body = 'del session success'
// })

// router.get('/api/user/info', async ctx => {
//   const user = ctx.session.userInfo
//   if (!user) {
//     ctx.status = 401
//     ctx.body = 'Need Login'
//   } else {
//     ctx.set('Content-Type', 'application/json')
//     ctx.body = user
//   }
// })

// router.get('/a/:id', async ctx => {
//   // await app.render(ctx.req, ctx.res, '/a', { id: ctx.params.id })
//   await handle(ctx.req, ctx.res, {
//     pathname: '/a',
//     query: ctx.params
//   })
//   ctx.respond = false
// })
