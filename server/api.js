const Router = require('koa-router')
const { requestGithub } = require('../lib/api')

const router = new Router({
  prefix: '/github'
})

router.all('*', async ctx => {
  const url = ctx.url.replace('/github/', '/')
  const session = ctx.session
  const githubAuth = session && session.githubAuth
  const headers = {}
  const token = githubAuth && githubAuth.access_token
  if (token) {
    headers['Authorization'] = `${githubAuth.token_type} ${token}`
  }

  try {
    const result = await requestGithub({
      method: ctx.method,
      data: ctx.request.body || {},
      url,
      headers
    })

    if (result.status === 200) {
      ctx.status = result.status
      ctx.body = result.data
      // ctx.set('Content-Type', 'application/json')
    } else {
      ctx.status = result.status
      ctx.body = {
        success: false
      }
    }
  } catch (error) {
    console.error(error)
    ctx.body = {
      success: false
    }
  }
})

module.exports = router
