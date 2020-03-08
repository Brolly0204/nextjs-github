import { createStore, applyMiddleware } from 'redux'
import ReduxThunk from 'redux-thunk'
import axios from 'axios'
import { composeWithDevTools } from 'redux-devtools-extension'
import reducers from './reducers'

const userInitialState = {}

const LOGOUT = 'LOGOUT'

export function logout() {
  return dispatch => {
    axios
      .post('/logout')
      .then(resp => {
        if (resp.status === 200) {
          dispatch({
            type: LOGOUT
          })
        } else {
          console.log('logout failed', resp)
        }
      })
      .catch(err => console.log('logout failed', err))
  }
}

export default state => {
  return createStore(
    reducers,
    Object.assign(
      {},
      {
        user: userInitialState
      },
      state
    ),
    composeWithDevTools(applyMiddleware(ReduxThunk))
  )
}
