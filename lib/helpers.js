export const callIfFunction = maybeFn =>
  (maybeFn ? (typeof maybeFn === 'function' ? maybeFn() : maybeFn) : null)
