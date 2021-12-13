import * as React from 'react'
import { PropTypes } from 'prop-types'
import { View, TouchableOpacity, Text } from 'react-native'
import { isEqual } from 'lodash'
import { callIfFunction } from '../helpers'
import { useSMSContext } from '../../'
import { CHIPS_REMOVE_ALL } from '../reducer/actionOrigins'

export const RemoveAllChip = React.memo(({ styles: stylesFromProps = {} }) => {
  const {
    selectedItems,
    showRemoveAll,
    colors,
    getStyles,
    styles,
    removeAllText,
    _removeAllItems,
  } = useSMSContext()

  const chipTextStyles = React.useMemo(
    () => getStyles('chipText', {}, stylesFromProps),
    [styles.chipText, stylesFromProps.chipText]
  )

  const removeAllChipTextStyles = React.useMemo(
    () => getStyles('removeAllChipText', {}, stylesFromProps),
    [styles.removeAllChipText, stylesFromProps.removeAllChipText]
  )

  const removeAllChipTouchableStyles = React.useMemo(
    () => getStyles('removeAllChipTouchable', {}, stylesFromProps),
    [styles.removeAllChipTouchable, stylesFromProps.removeAllChipTouchable]
  )

  const chipContainerStyles = React.useMemo(
    () => getStyles('chipContainer', {}, stylesFromProps),
    [styles.chipContainer, stylesFromProps.chipContainer]
  )

  return selectedItems && selectedItems.length > 1 && showRemoveAll ? (
    <View style={chipContainerStyles}>
      <TouchableOpacity
        onPress={() => _removeAllItems(CHIPS_REMOVE_ALL)}
        style={removeAllChipTouchableStyles}
      >
        <Text style={[chipTextStyles, removeAllChipTextStyles]}>
          {removeAllText}
        </Text>
      </TouchableOpacity>
    </View>
  ) : null
})

export const Chips = ({ styles: stylesFromProps = {}, children }) => {
  // const { styles, colors } = state
  const {
    components,
    styles,
    colors,
    single,
    singleShowsChip,
    _removeAllItems,
    getStyles,
    selectedItems,
    showRemoveAll,
    removeAllText,
    showChips,
  } = useSMSContext()

  const showIfSingle = single ? singleShowsChip : true
  const chipsWrapperStyles = React.useMemo(
    () => getStyles('chipsWrapper', {}, stylesFromProps),
    [styles.chipsWrapper, stylesFromProps.chipsWrapper]
  )

  return (
    children ||
    (selectedItems.length > 0 && showIfSingle && showChips ? (
      <View style={chipsWrapperStyles}>
        <RemoveAllChip />
        {selectedItems &&
          selectedItems.length > 0 &&
          selectedItems.map((id) => (
            <components.Chip
              styles={stylesFromProps}
              key={id}
              id={id}
              selectedItems={selectedItems}
            />
          ))}
      </View>
    ) : null)
  )
}

const ChipWrapper = (Comp) => (props) => {
  const {
    components,
    items,
    styles,
    getStyles,
    colors,
    displayKey,
    Icon,
    hideChipRemove,
    hideParentChips,
    iconNames,
    selectedItems,
    _toggleChildren,
    _toggleItem,
    getChildren,
    itemId,
    childItemId,
    _checkIsParent,
  } = useSMSContext()
  const { styles: stylesFromProps, id } = props

  // this is repeated because
  // the props (in find) weren't defined on first render
  const _findItem = (id) => find(id, items)
  const find = (id, items, isChild) => {
    if (!items) {
      return {}
    }

    const getFn = isChild ? childItemId : itemId
    let i = 0
    let found
    for (; i < items.length; i += 1) {
      if (getFn(items[i]) === id) {
        return items[i]
      } else if (Array.isArray(getChildren(items[i]))) {
        found = find(id, getChildren(items[i]), true)
        if (found) {
          return found
        }
      }
    }
  }
  const item = React.useMemo(() => _findItem(id), [_findItem, id])
  if (!item) {
    return null
  }
  // check if item has children
  const isParent = _checkIsParent(item)
  // get the parent id if it's a child item
  // const parentItem = isParent ? undefined : findParent(item)
  const onPress = () => _toggleItem(item, 'chip')
  const hideChip = isParent && hideParentChips
  if (!item || !item[displayKey] || hideChip) {
    return null
  }
  return (
    <Comp
      onPress={onPress}
      styles={styles}
      stylesFromProps={stylesFromProps}
      getStyles={getStyles}
      colors={colors}
      displayKey={displayKey}
      Icon={Icon}
      isParent={isParent}
      ChipRemoveIcon={components.ChipRemoveIcon}
      hideChipRemove={hideChipRemove}
      hideParentChips={hideParentChips}
      iconNames={iconNames}
      item={item}
      selectedItems={selectedItems}
    />
  )
}

export const Chip = ChipWrapper(
  React.memo(
    (props) => {
      const {
        ChipRemoveIcon,
        styles,
        stylesFromProps = {},
        colors,
        displayKey,
        item,
        onPress,
        Icon,
        hideChipRemove,
        iconNames,
        getStyles,
        isParent,
      } = props

      const chipContainerStyles = React.useMemo(
        () =>
          getStyles(
            'chipContainer',
            { isParent, hideChipRemove },
            stylesFromProps
          ),
        [styles.chipContainer, stylesFromProps.chipContainer]
      )
      const chipTextStyles = React.useMemo(
        () => getStyles('chipText', { isParent }, stylesFromProps),
        [styles.chipText, stylesFromProps.chipText]
      )

      const chipIconTouchableStyles = React.useMemo(
        () => getStyles('chipIconTouchable', { isParent }, stylesFromProps),
        [styles.chipIconTouchable, stylesFromProps.chipIconTouchable]
      )

      console.log('chip render', item)

      return (
        <View style={chipContainerStyles}>
          <Text numberOfLines={2} style={chipTextStyles}>
            {item[displayKey]}
          </Text>
          {!hideChipRemove && (
            <TouchableOpacity onPress={onPress} style={chipIconTouchableStyles}>
              <ChipRemoveIcon styles={stylesFromProps} />
            </TouchableOpacity>
          )}
        </View>
      )
    },
    (prevProps, nextProps) => {
      // return false;
      if (!isEqual(prevProps.styles, nextProps.styles)) {
        // console.log('should Re-render ', 'styles not equal', prevProps.selectedItems);
        return false
      }
      if (
        prevProps.selectedItems.includes(prevProps.id) &&
        nextProps.selectedItems.includes(prevProps.id)
      ) {
        // console.log('Chip shouldNotRerender ', 'item selected', prevProps.item);
        return true
      }
      if (
        !prevProps.selectedItems.includes(prevProps.id) &&
        !nextProps.selectedItems.includes(prevProps.id)
      ) {
        // console.log('Chip shouldNotRerender ', 'item not selected', prevProps.item);
        return true
      }
      return false
    }
  )
)
Chip.propTypes = {
  styles: PropTypes.object,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
}
