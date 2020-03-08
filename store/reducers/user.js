const userInitialState = {}

const LOGOUT = 'LOGOUT'
function userReducer(state = userInitialState, action) {
  switch (action.type) {
    case LOGOUT:
      return {}
    default:
      return state
  }
}

export default userReducer
