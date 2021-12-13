import {
  ADD,
  ADD_SINGLE,
  REMOVE,
  REPLACE_ITEMS,
  ADD_ITEMS,
  REMOVE_ITEMS,
  REMOVE_ALL,
} from './actionTypes'

export default function itemsReducer(state, action) {
  switch (action.type) {
    case ADD:
      return [...state, action.item]
    case ADD_SINGLE:
      return [action.item]
    case REMOVE:
      return [...state.filter((item) => item !== action.item)]
    case REPLACE_ITEMS:
      return [...action.items]
    case ADD_ITEMS:
      return [...state, ...action.items]
    case REMOVE_ITEMS:
      return [...state.filter((item) => !action.items.includes(item))]
    case REMOVE_ALL:
      return []
    case undefined:
      return state
    default:
      throw new Error(`
      react-native-sectioned-multi-select: unknown action ${action.type}
    `)
  }
}
