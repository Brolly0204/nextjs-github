const initialState = {
  count: 0
}

const ADD = 'ADD'
function countReducer(state = initialState, action) {
  switch (action.type) {
    case ADD:
      // state.count++
      // return state
      return {
        ...state,
        count: state.count + action.num
      }
    default:
      return state
  }
}

export default countReducer
