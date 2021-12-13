import * as React from 'react'
import { merge } from 'lodash'
import { View, TouchableWithoutFeedback, Text } from 'react-native'
import { getProp } from '../helpers'
import { useSMSContext } from '../../'

const Selector = ({ styles: stylesFromProps = {} }) => {
  const {
    hideSelect,
    selectIsVisible,
    disabled,
    _toggleSelect,
    components,
    getStyles,
    styles,
  } = useSMSContext()

  const selectToggleStyles = React.useMemo(
    () => getStyles('selectToggle', { selectIsVisible }, stylesFromProps),
    [stylesFromProps.selectToggle, styles.selectToggle, selectIsVisible]
  )

  return !hideSelect ? (
    <TouchableWithoutFeedback onPress={_toggleSelect} disabled={disabled}>
      <View style={selectToggleStyles}>
        <SelectLabel stylesFromProps={stylesFromProps} />
        {selectIsVisible ? (
          <components.SelectToggleOpenIcon />
        ) : (
          <components.SelectToggleIcon />
        )}
      </View>
    </TouchableWithoutFeedback>
  ) : null
}

const SelectLabel = React.memo((stylesFromProps) => {
  const {
    styles,
    getStyles,
    selectText,
    selectedText,
    single,
    selectIsVisible,
    selectedItems,
    displayKey,
    alwaysShowSelectText,
    renderSelectText,
    selectLabelNumberOfLines,
    _findItem,
  } = useSMSContext()
  let customSelect = null
  if (renderSelectText) {
    customSelect = renderSelectText(getProps)
    if (typeof customSelect !== 'string') {
      return customSelect
    }
  }

  const selectToggleTextStyles = React.useMemo(
    () => getStyles('selectToggleText', { selectIsVisible }, stylesFromProps),
    [stylesFromProps.selectToggleText, styles.selectToggleText, selectIsVisible]
  )

  let label = `${selectText} (${selectedItems.length} ${selectedText})`
  if (!single && alwaysShowSelectText) {
    label = selectText
  }
  if (!selectedItems || selectedItems.length === 0) {
    label = selectText
  } else if (single || selectedItems.length === 1) {
    const item = selectedItems[0]
    const foundItem = _findItem(item)
    label = getProp(foundItem, displayKey) || selectText
  }
  if (renderSelectText && customSelect && typeof customSelect === 'string') {
    label = customSelect
  }
  return (
    <Text
      numberOfLines={selectLabelNumberOfLines}
      style={selectToggleTextStyles}
    >
      {label}
    </Text>
  )
})

export default Selector
