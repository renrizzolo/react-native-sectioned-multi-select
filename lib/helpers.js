export const callIfFunction = maybeFn =>
  (maybeFn ? (maybeFn && typeof maybeFn === 'function' ? maybeFn() : maybeFn) : null)
