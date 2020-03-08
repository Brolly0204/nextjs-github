const GITHUB_OAUTH_URL = 'https://github.com/login/oauth/authorize'
const SCOPE = 'user'

const client_id = '9e9d8d40160aeaae7fdc'
module.exports = {
  github: {
    client_id,
    client_secret: '0b034c27d02128c7fe3d7c2dae15c2681180aabf',
    request_token_url: 'https://github.com/login/oauth/access_token'
  },
  GITHUB_OAUTH_URL,
  OAUTH_URL: `${GITHUB_OAUTH_URL}?client_id=${client_id}&scope=${SCOPE}`
}

// token
// access_token=14bb404508c69807b4a4281fb6131fd3927ba324&scope=repo%2Cuser&token_type=bearer
