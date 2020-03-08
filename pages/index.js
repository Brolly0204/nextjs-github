import getConfig from 'next/config'
import Router, { withRouter } from 'next/router'
import { useEffect } from 'react'
import { connect } from 'react-redux'
import { Button, Tabs } from 'antd'
import LRU from 'lru-cache'
import { MailOutlined } from '@ant-design/icons'
import { request } from '../lib/api'
import Repo from '../components/Repo'
import { cacheArray } from '../lib/repo-basic-cache'

const { publicRuntimeConfig } = getConfig()

const isServer = typeof window === 'undefined'

const cache = new LRU({
  maxAge: 1000 * 60 * 60
})

const Index = ({ userRepos = [], userStarredRepos = [], user, router }) => {
  const tabKey = router.query.key || '1'

  const handleTabChange = activeKey => {
    Router.push(`/?key=${activeKey}`)
  }

  useEffect(() => {
    if (!isServer) {
      if (userRepos.length) {
        cache.set('userRepos', userRepos)
      }

      if (userStarredRepos.length) {
        cache.set('userStarredRepos', userStarredRepos)
      }
    }
  }, [userRepos, userStarredRepos])

  useEffect(() => {
    if (!isServer) {
      cacheArray(userRepos)
      cacheArray(userStarredRepos)
    }
  })

  if (!user || !user.id) {
    return (
      <div className="root">
        <p>亲，您还没有登录哦~</p>
        <Button type="primary" href={publicRuntimeConfig.OAUTH_URL}>
          点击登录
        </Button>
        <style jsx>
          {`
            .root {
              display: flex;
              height: 400px;
              flex-direction: column;
              justify-content: center;
              align-items: center;
            }
          `}
        </style>
      </div>
    )
  }

  // console.log(userRepos, userStarredRepos)
  return (
    <div className="root">
      <div className="user-info">
        <img src={user.avatar_url} alt="user avatar" className="avatar" />
        <span className="login">{user.login}</span>
        <span className="name">{user.name}</span>
        <span className="bio">{user.bio}</span>
        <p className="email">
          <MailOutlined style={{ marginRight: 10 }} />
          <a href={`mailto:${user.email}`}>{user.email}</a>
        </p>
      </div>

      <div className="user-repos">
        <Tabs activeKey={tabKey} animated={false} onChange={handleTabChange}>
          <Tabs.TabPane tab="你的仓库" key="1">
            {userRepos.map(repo => (
              <Repo key={repo.id} repo={repo} />
            ))}
          </Tabs.TabPane>
          <Tabs.TabPane tab="你关注的仓库" key="2">
            {userStarredRepos.map(repo => (
              <Repo key={repo.id} repo={repo} />
            ))}
          </Tabs.TabPane>
        </Tabs>
      </div>
      <style jsx>
        {`
          .root {
            display: flex;
            align-items: flex-start;
            padding: 20px 0;
          }

          .user-info {
            flex: 0 0 200px;
            display: flex;
            flex-direction: column;
            margin-right: 40px;
          }

          .user-repos {
            flex: 1;
          }

          .avatar {
            width: 100%;
            border-radius: 5px;
          }

          .login {
            margin-top: 20px;
            font-weight: 800;
            font-size: 20px;
          }

          .name {
            font-size: 16px;
            color: #777;
          }

          .bio {
            margin-top: 20px;
            color: #333;
          }
        `}
      </style>
    </div>
  )
}

Index.getInitialProps = async function({ ctx, reduxStore }) {
  const { user } = reduxStore.getState()
  if (!user || !user.id) {
    return {
      isLogin: false
    }
  }

  if (!isServer) {
    if (cache.get('userRepos') && cache.get('userStarredRepos')) {
      return {
        userRepos: cache.get('userRepos'),
        userStarredRepos: cache.get('userStarredRepos')
      }
    }
  }

  const userRepos = await request(
    {
      url: '/user/repos'
    },
    ctx.req,
    ctx.res
  )

  const userStarredRepos = await request(
    {
      url: '/user/starred'
    },
    ctx.req,
    ctx.res
  )

  return {
    isLogin: true,
    userRepos: userRepos.data || [],
    userStarredRepos: userStarredRepos.data || []
  }
}

export default connect(state => ({
  user: state.user
}))(withRouter(Index))
