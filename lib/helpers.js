export function callIfFunction(maybeFn) {
  return maybeFn
    ? maybeFn && typeof maybeFn === 'function'
      ? maybeFn()
      : maybeFn
    : null
}

export function getProp(object, key) {
  return object && object[key]
}

export function rejectProp(items, fn) {
  return items.filter(fn)
}

// remove overlapping keys of 2 arrays
export function removeDuplicates(a, b) {
  return a.filter((item) => !b.includes(item))
}
