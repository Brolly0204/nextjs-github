import getConfig from 'next/config'
import { withRouter } from 'next/router'
import Link from 'next/link'
import { useState, useCallback } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { Layout, Input, Avatar, Tooltip, Dropdown, Menu } from 'antd'
import { GithubOutlined, UserOutlined } from '@ant-design/icons'
import Container from './Container'
import { logout } from '../store/store'

const { Header, Content, Footer } = Layout

const { publicRuntimeConfig } = getConfig()

const githubIconStyle = {
  color: 'white',
  fontSize: 40,
  display: 'block',
  paddingTop: 10,
  marginRight: 20
}

const footerStyle = {
  textAlign: 'center'
}

function AppLayout({ children, user, logout, router }) {
  const urlQuery = router.query && router.query.query
  const [search, setSearch] = useState(urlQuery)

  const handleSearchChange = useCallback(event => {
    setSearch(event.target.value)
  }, [])

  const handleOnSearch = useCallback(() => {
    router.push(`/search?query=${search}`)
  }, [search])

  const handleLogout = useCallback(
    e => {
      e.preventDefault()
      logout()
    },
    [logout]
  )
  const handleGoToOAuth = useCallback(e => {
    e.preventDefault()
    axios
      .get(`/prepare-auth?url=${router.asPath}`)
      .then(resp => {
        if (resp.status === 200) {
          location.href = publicRuntimeConfig.OAUTH_URL
        } else {
          console.log('prepare auth failed', resp)
        }
      })
      .catch(err => console.log('prepare auth failed', err))
  }, [])

  const UserDropDown = (
    <Menu>
      <Menu.Item>
        <a onClick={handleLogout}>登 出</a>
      </Menu.Item>
    </Menu>
  )

  return (
    <Layout>
      <Header>
        <Container renderer={<div className="header-inner" />}>
          <div className="header-left">
            <div className="logo">
              <Link href="/">
                <GithubOutlined style={githubIconStyle} />
              </Link>
            </div>
            <div>
              <Input.Search
                placeholder="搜索仓库"
                value={search}
                onChange={handleSearchChange}
                onSearch={handleOnSearch}
              />
            </div>
          </div>
          <div className="header-right">
            <div className="user">
              {user && user.id ? (
                <Dropdown overlay={UserDropDown}>
                  <a href="/">
                    <Avatar size={40} src={user.avatar_url} />
                  </a>
                </Dropdown>
              ) : (
                <Tooltip title="点击登录">
                  <a href={`/prepare-auth?url=${router.asPath}`}>
                    <Avatar size={40} icon={<UserOutlined />} />
                  </a>
                </Tooltip>
              )}
            </div>
          </div>
        </Container>
      </Header>
      <Content>
        <Container>{children}</Container>
      </Content>
      <Footer style={footerStyle}>
        Developer by Brolly @
        <a href="mailto:brolly@hotmail.com">brolly@hotmail.com</a>
      </Footer>
      <style jsx>{`
        .header-inner {
          display: flex;
          justify-content: space-between;
        }

        .header-left {
          display: flex;
          justify-content: flex-start;
        }
      `}</style>
      <style jsx global>
        {`
          #__next {
            height: 100%;
          }

          .ant-layout {
            min-height: 100%;
          }

          .ant-layout-header {
            padding-left: 0;
            padding-right: 0;
          }

          .ant-layout-content {
            background: #fff;
          }
        `}
      </style>
    </Layout>
  )
}

export default connect(state => ({ user: { ...state.user } }), { logout })(
  withRouter(AppLayout)
)
