// import * as React from 'react'
import PropTypes from 'prop-types'
import useSMSContext from '../context/useSMSContext'
// A convenience wrapper for showing/hiding anything
// when the select is open/closed
const SelectVisibilityWrapper = ({ children }) => {
  const { selectIsVisible } = useSMSContext()
  return selectIsVisible ? children : null
}

SelectVisibilityWrapper.propTypes = {
  children: PropTypes.element.isRequired,
}

export default SelectVisibilityWrapper
