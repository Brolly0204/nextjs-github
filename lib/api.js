const axios = require('axios')

const isServer = typeof window === 'undefined'

const serverRequest = axios.create({
  baseURL: 'https://api.github.com'
})

const clientRequest = axios.create({
  baseURL: '/github'
})

function requestGithub({
  method, url, data, headers
}) {
  return serverRequest({
    method,
    url,
    data,
    headers
  })
}

async function request({ method = 'GET', url, data = {} }, req, res) {
  if (!url) {
    throw Error('url must provide')
  }

  if (isServer) {
    const { session } = req
    const githubAuth = session.githubAuth || {}
    const headers = {}
    if (githubAuth.access_token) {
      headers.Authorization = `${githubAuth.token_type} ${
        githubAuth.access_token
      }`
    }
    return serverRequest({
      method, url, data, headers
    })
  } else {
    return clientRequest({ method, url, data })
  }
}

module.exports = {
  request,
  requestGithub
}
