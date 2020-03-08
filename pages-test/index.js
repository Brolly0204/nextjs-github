import axios from 'axios'
import Router from 'next/router'
import getConfig from 'next/config'
import { Button } from 'antd'
import { useEffect } from 'react'
import { connect } from 'react-redux'
import { add, addAsync } from '../store/store'

const { publicRuntimeConfig } = getConfig()

const events = [
  'routeChangeStart',
  'routeChangeComplete',
  'routeChangeError',
  'beforeHistoryChange',
  'hashChangeStart',
  'hashChangeComplete'
]

function makeEvent(type) {
  return (...args) => {
    console.log(type, ...args)
  }
}

events.forEach(event => {
  Router.events.on(event, makeEvent(event))
})

const Index = props => {
  useEffect(() => {
    axios.get('/api/user/info').then(resp => console.log(resp))
  }, [])
  return (
    <div>
      <button onClick={() => props.changeCount()}>{props.counter.count}</button>
      <button onClick={() => props.changeName()}>{props.user.username}</button>
      <a href={publicRuntimeConfig.OAUTH_URL}>
        <Button type="primary">去登录</Button>
      </a>
    </div>
  )
}

Index.getInitialProps = function({ reduxStore }) {
  reduxStore.dispatch(addAsync(6))
  return {}
}

export default connect(state => ({ ...state }), {
  changeCount() {
    return dispatch => dispatch(addAsync(2))
  },
  changeName() {
    return dispatch => dispatch({ type: 'UPDATE_USERNAME', name: 'Lee' })
  }
})(Index)
