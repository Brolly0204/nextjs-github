import React, { useState, useContext, useEffect, useReducer } from 'react'
import MyContext from '../lib/my-context'

// function MyFunc() {
//   const [count, setCount] = useState(0)
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCount(c => c + 1)
//     }, 1000)
//     return () => clearInterval(interval)
//   }, [])
//   return <span>{count}</span>
// }

function countReducer(state, action) {
  switch (action.type) {
    case 'add':
      return state + 1
    case 'minus':
      return state - 1
    default:
      return state
  }
}

function MyFunc() {
  const [count, dispatchCount] = useReducer(countReducer, 0)
  const context = useContext(MyContext)
  useEffect(() => {
    const interval = setInterval(() => {
      dispatchCount({ type: 'minus' })
    }, 1000)
    return () => clearInterval(interval)
  }, [])
  return <span>{context}</span>
}

export default MyFunc
