import App from 'next/app'
import Router from 'next/router'
import { Provider } from 'react-redux'
import 'antd/dist/antd.css'
import Layout from '../components/Layout'
import PageLoading from '../components/PageLoading'
import withRedux from '../lib/with-redux'

class MyApp extends App {
  state = {
    context: 'hello',
    loading: false
  }

  startLoading = () => {
    this.setState({
      loading: true
    })
  }

  stopLoading = () => {
    this.setState({
      loading: false
    })
  }

  componentDidMount() {
    Router.events.on('routeChangeStart', this.startLoading)
    Router.events.on('routeChangeComplete', this.stopLoading)
    Router.events.on('routeChangeError', this.stopLoading)
  }

  componentWillUnmount() {
    Router.events.off('routeChangeStart', this.startLoading)
    Router.events.off('routeChangeComplete', this.stopLoading)
    Router.events.off('routeChangeError', this.stopLoading)
  }

  static async getInitialProps(ctx) {
    const { Component } = ctx
    let pageProps
    if (typeof Component.getInitialProps === 'function') {
      pageProps = await Component.getInitialProps(ctx)
    }

    return {
      pageProps
    }
  }

  render() {
    const { Component, pageProps = {}, router, reduxStore } = this.props
    return (
      <Provider store={reduxStore}>
        {this.state.loading ? <PageLoading /> : null}
        <Layout>
          <Component {...pageProps} router={router} />
        </Layout>
      </Provider>
    )
  }
}

export default withRedux(MyApp)
