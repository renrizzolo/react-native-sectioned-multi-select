import * as React from 'react'

function compose(fns) {
  return (initial) => fns.reduceRight((prev, fn) => fn(prev), initial)
}

// (mostly) from https://github.com/coinbase/rest-hooks/tree/master/packages/use-enhanced-reducer
export default function useEnhancedReducer(
  reducer,
  initalState,
  middlewares = []
) {
  const stateRef = React.useRef(initalState)
  const [state, realDispatch] = React.useReducer(reducer, initalState)
  React.useEffect(() => {
    stateRef.current = state
  }, [state])
  if (!Array.isArray(middlewares) || middlewares.length === 0) {
    return [state, realDispatch]
  }
  const dispatchWithPromise = usePromisifiedDispatch(realDispatch, state)

  const outerDispatch = React.useMemo(() => {
    let dispatch = () => {
      throw new Error(
        'Dispatching while constructing your middleware is not allowed. ' +
          'Other middleware would not be applied to this dispatch.'
      )
    }
    // closure here around dispatch allows us to change it after middleware is constructed
    const middlewareAPI = {
      getState: () => stateRef.current,
      dispatch: (action) => dispatch(action),
      reducer: reducer,
    }
    const chain = middlewares.map((middleware) => middleware(middlewareAPI))
    dispatch = compose(chain)(dispatchWithPromise)
    return dispatch
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatchWithPromise, ...middlewares])
  console.log('reducer1', state, outerDispatch)
  return [state, outerDispatch]
}

/** Turns a dispatch function into one that resolves once it has been commited */
function usePromisifiedDispatch(dispatch, state) {
  const dispatchPromiseRef = React.useRef(null)
  React.useEffect(() => {
    if (dispatchPromiseRef.current) {
      dispatchPromiseRef.current.resolve(state)
      dispatchPromiseRef.current = null
    }
  }, [state])
  return React.useCallback(
    (action) => {
      if (!dispatchPromiseRef.current) {
        dispatchPromiseRef.current = NewPromiseHolder()
      }
      // we use the promise before dispatch so we know it will be resolved
      // however that can also make the ref clear, so we need to make sure we have to promise before
      // dispatching so we can return it even if the ref changes.
      const promise = dispatchPromiseRef.current.promise
      dispatch(action)
      return promise
    },
    [dispatch]
  )
}
function NewPromiseHolder() {
  const promiseHolder = {}
  promiseHolder.promise = new Promise((resolve) => {
    promiseHolder.resolve = resolve
  })
  return promiseHolder
}

export function loggerMiddleware({ getState, dispatch }) {
  return (next) => async (action) => {
    console.group(typeof action === 'function' ? 'thunk' : action.type)
    console.info(
      '%cPrevious State:',
      'color: salmon; font-weight: 700;',
      getState()
    )
    await next(action)
    console.log('%cNext State:', 'color: teal; font-weight: 700;', getState())
    console.groupEnd()
  }
}
export function thunkMiddleware({ getState, dispatch }) {
  return (next) => async (action) => {
    if (typeof action === 'function') {
      console.log('thunking - action is function')
      action(getState, dispatch)
      return
    }
    console.log('dispatching - action not function')
    return next(action)
  }
}
