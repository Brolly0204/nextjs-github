const axios = require('axios')
const { github, OAUTH_URL } = require('../config')

const { client_id, client_secret, request_token_url } = github

module.exports = (server, router) => {
  server.use(async (ctx, next) => {
    if (ctx.path === '/auth') {
      const { code } = ctx.query
      if (!code) {
        ctx.body = 'code not exist'
        return
      }
      // 根据code获取access token
      const result = await axios({
        url: request_token_url,
        data: {
          client_id,
          client_secret,
          code
        },
        headers: {
          Accept: 'application/json'
        }
      })

      if (result.status === 200 && result.data && !result.data.error) {
        ctx.session.githubAuth = result.data

        const { token_type, access_token } = result.data
        const userInfoResp = await axios({
          method: 'GET',
          url: 'https://api.github.com/user',
          headers: {
            Authorization: `${token_type} ${access_token}`
          }
        })
        ctx.session.userInfo = userInfoResp.data
        ctx.redirect((ctx.session && ctx.session.urlBeforeOAuth) || '/')
        ctx.session.urlBeforeOAuth = ''
      } else {
        const errorMsg = result.data && result.data.error
        ctx.body = `request token failed ${errorMsg}`
      }
    } else {
      await next()
    }
  })

  router.get('/prepare-auth', async ctx => {
    const { url } = ctx.query
    ctx.session.urlBeforeOAuth = url
    ctx.redirect(OAUTH_URL)
  })

  router.post('/logout', async ctx => {
    ctx.session = null
    ctx.body = 'logout success'
  })
}
