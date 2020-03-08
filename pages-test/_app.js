import App from 'next/app'
import { Provider } from 'react-redux'
import 'antd/dist/antd.css'
import { Button } from 'antd'
import Layout from '../components/Layout'
import MyContext from '../lib/my-context'
import withRedux from '../lib/with-redux'

class MyApp extends App {
  state = {
    context: 'hello'
  }
  static async getInitialProps(ctx) {
    const { Component } = ctx
    let pageProps
    if ('getInitialProps' in Component) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return {
      pageProps
    }
  }

  render() {
    const { Component, pageProps = {}, router, reduxStore } = this.props
    return (
      <Layout>
        <Provider store={reduxStore}>
          <MyContext.Provider value={this.state.context}>
            <Component {...pageProps} router={router} />
          </MyContext.Provider>
        </Provider>
      </Layout>
    )
  }
}

export default withRedux(MyApp)
