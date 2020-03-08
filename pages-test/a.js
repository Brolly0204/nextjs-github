import React from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import styled from 'styled-components'
// import Comp from '../components/comp.js'

const Comp = dynamic(import('../components/comp'))

const Title = styled.h1`
  color: yellow;
  font-size: 40px;
`

class A extends React.Component {
  static async getInitialProps() {
    const promise = new Promise(resolve => {
      setTimeout(() => {
        resolve({
          name: 'Brolly'
        })
      }, 1000)
    })
    return await promise
    // return {
    //   name: 'Lee'
    // }
  }

  render() {
    return (
      <>
        <Comp />
        <Title>This is Title</Title>
        <Link href="#aaa">
          <a>
            hello {this.props.name} {this.props.router.query.id}
          </a>
        </Link>
        <style jsx global>
          {`
            a {
              color: red;
            }
          `}
        </style>
      </>
    )
  }
}

export default A
