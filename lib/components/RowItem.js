import React from 'react'
import PropTypes from 'prop-types'
import {
  View,
  TouchableOpacity,
  Text,
  Platform,
  UIManager,
  LayoutAnimation,
  FlatList,
  StyleSheet,
} from 'react-native'
import { isEqual } from 'lodash'
import RowSubItem from './RowSubItem'
import ItemIcon from './ItemIcon'
import { callIfFunction } from '../helpers'
import useSMSContext from '../context/useSMSContext'
import { PARENT_ITEM, CHILD_ITEM } from '../reducer/actionOrigins'

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

const shouldNotRerender = (prevProps, nextProps) => {
  /*
  return true if passing nextProps to render would return
  the same result as passing prevProps to render,
  otherwise return false
  */
  const { getChildren, item, childItemId, itemId } = prevProps

  // filter / items has changed
  if (nextProps.renderItems !== prevProps.renderItems) {
    return false
  }
  if (nextProps.selectedItems !== prevProps.selectedItems) {
    // a subitem of this item  gets deselected
    if (
      getChildren(item) &&
      getChildren(item).some(
        (el) =>
          !prevProps.selectedItems.includes(childItemId(el)) &&
          nextProps.selectedItems.includes(childItemId(el))
      )
    ) {
      console.log('--row render: next !sub inc, prev sub !inc', prevProps.item)

      return false
    }
    // a subitem of this item gets selected
    if (
      getChildren(item) &&
      getChildren(item).some(
        (el) =>
          prevProps.selectedItems.includes(childItemId(el)) &&
          !nextProps.selectedItems.includes(childItemId(el))
      )
    ) {
      console.log('--row render: prev sub inc, next sub inc', prevProps.item)

      return false
    }
    if (
      prevProps.selectedItems.includes(itemId(item)) &&
      !nextProps.selectedItems.includes(itemId(item))
    ) {
      console.log('--row render: next !inc, prev !inc', prevProps.item)

      return false
    }
    if (
      !prevProps.selectedItems.includes(itemId(item)) &&
      nextProps.selectedItems.includes(itemId(item))
    ) {
      console.log('--row render: next inc, prev !inc', prevProps.item)

      return false
    }
  }
  if (!isEqual(prevProps.stylesFromContext, nextProps.stylesFromContext)) {
    console.log('--row render: styles !== styles', prevProps.item)
    return false
  }
  if (!isEqual(prevProps.colors, nextProps.colors)) {
    console.log('--row render: colors !== colors', prevProps.item)
    return false
  }
  return true
}

const RowItem = React.memo((props) => {
  const [toggled, setToggled] = React.useState(false)
  const [subToggled, setSubToggled] = React.useState(null)
  const [showChildItems, setShowChildItems] = React.useState(null)
  const { item, highlightedChildren, styles: stylesFromProps = {} } = props

  const {
    customLayoutAnimation,
    readOnlyHeadings,
    animateDropDowns,
    _toggleItem,
    _toggleChildren,
    searchTerm,
    styles,
    colors,
    getStyles,
    itemId,
    childItemId,
    getChildren,
    showDropDowns,
    expandDropDowns,
    selectedIconPosition,
    itemIconPosition,
    parentsToggleChildrenOnly,
    itemNumberOfLines,
    displayKey,
    selectedItems,
    iconKey,
    iconRenderer: Icon,
    subItemsFlatListProps,
    components,
  } = useSMSContext()

  //expand dropdowns on mount if prop is set
  React.useEffect(() => {
    if (expandDropDowns) {
      setShowChildItems(true)
    }
  }, [])

  const itemSelected = React.useMemo(() => {
    return selectedItems.includes(itemId(item))
  }, [selectedItems])

  const toggleItem = (item) => {
    _toggleItem(item, PARENT_ITEM)
  }

  const toggleSubItem = (item) => {
    // we are only concerned about
    // triggering shouldComponentUpdate
    const id = itemId(item)
    if (subToggled === itemId(item)) {
      setSubToggled(false)
    } else {
      setSubToggled(id)
    }
    _toggleItem(item, CHILD_ITEM)
  }

  const toggleDropDown = () => {
    const animation =
      customLayoutAnimation || LayoutAnimation.Presets.easeInEaseOut
    animateDropDowns && LayoutAnimation.configureNext(animation)
    setShowChildItems(!showChildItems)
  }

  const dropDownIsOpen = React.useMemo(() => {
    if (searchTerm.length) {
      return true
    }
    if (showDropDowns) {
      return showChildItems
    }

    return true
  }, [searchTerm, showDropDowns, showChildItems])

  const hasChildren = React.useMemo(() => {
    // check if the children array is empty
    // so we can not show the dropdown toggle
    return getChildren(item) && getChildren(item).length > 0
  }, [item])

  const dropDownOrToggle = () => {
    if (readOnlyHeadings && hasChildren && showDropDowns) {
      toggleDropDown()
    } else if (hasChildren && parentsToggleChildrenOnly) {
      // we need to keep track of whether
      // the parent is toggled even though
      // we're not actually toggling it
      setToggled(!toggled)
      _toggleChildren(item, false, toggled)
    } else {
      toggleItem(item)
    }
  }

  const renderSubItemFlatList = ({ item: subItem }) => (
    <components.RowSubItem
      _toggleSubItem={toggleSubItem}
      subItem={subItem}
      highlightedChildren={highlightedChildren}
      selectedItems={selectedItems}
      SelectedIcon={components.SelectedIcon}
      UnselectedIcon={components.UnselectedIcon}
      getStyles={getStyles}
      selectedIconPosition={selectedIconPosition}
      {...props}
    />
  )

  const renderSelectedIcon = () => {
    return itemSelected ? (
      <components.SelectedIcon />
    ) : (
      <components.UnselectedIcon />
    )
  }

  const hasDropDown = hasChildren && showDropDowns

  console.log('row render2', item)

  // this is kinda ugly.
  const selectedItemStyles = React.useMemo(
    () => getStyles('selectedItem', {}, stylesFromProps),
    [stylesFromProps.selectedItem, styles.selectedItem, itemSelected]
  )

  const itemStyles = React.useMemo(
    () => getStyles('item', { itemSelected }, stylesFromProps),
    [stylesFromProps.item, styles.item, itemSelected]
  )

  const itemWrapperStyles = React.useMemo(
    () => getStyles('itemWrapper', { itemSelected }, stylesFromProps),
    [stylesFromProps.itemWrapper, styles.itemWrapper, itemSelected]
  )

  const itemIconStyles = React.useMemo(
    () => getStyles('itemIcon', { itemSelected }, stylesFromProps),
    [stylesFromProps.itemIcon, styles.itemIcon, itemSelected]
  )

  const itemIconSelectedStyles = React.useMemo(
    () => getStyles('itemIconSelected', {}, stylesFromProps),
    [stylesFromProps.itemIconSelected, styles.itemIconSelected]
  )

  const itemTextContainerStyles = React.useMemo(
    () => getStyles('itemTextContainer', { itemSelected }, stylesFromProps),
    [stylesFromProps.itemTextContainer, styles.itemTextContainer, itemSelected]
  )

  const itemTextStyles = React.useMemo(
    () => getStyles('itemText', { item, itemSelected }, stylesFromProps),
    [stylesFromProps.itemText, styles.itemText, itemSelected]
  )

  const selectedItemTextStyles = React.useMemo(
    () => getStyles('selectedItemText', { item }, stylesFromProps),
    [stylesFromProps.selectedItemText, styles.selectedItemText]
  )

  const dropDownToggleIconWrapperStyles = React.useMemo(
    () =>
      getStyles(
        'dropDownToggleIconWrapper',
        { isOpen: dropDownIsOpen },
        stylesFromProps
      ),
    [
      stylesFromProps.dropDownToggleIconWrapper,
      styles.dropDownToggleIconWrapper,
      dropDownIsOpen,
    ]
  )

  const descriptionTextStyles = React.useMemo(
    () => getStyles('descriptionText', { item }, stylesFromProps),
    [stylesFromProps.descriptionText, styles.descriptionText]
  )

  return (
    <View>
      <View style={itemWrapperStyles}>
        <TouchableOpacity
          disabled={(readOnlyHeadings && !showDropDowns) || item.disabled}
          onPress={dropDownOrToggle}
          style={[itemStyles, itemSelected && selectedItemStyles]}
        >
          {selectedIconPosition === 'left' && renderSelectedIcon()}
          {itemIconPosition === 'left' && iconKey && item[iconKey] && (
            <ItemIcon
              iconRenderer={Icon}
              iconKey={iconKey}
              icon={item[iconKey]}
              style={[itemIconStyles, itemSelected && itemIconSelectedStyles]}
            />
          )}
          <View style={itemTextContainerStyles}>
            <Text
              numberOfLines={itemNumberOfLines}
              style={[itemTextStyles, itemSelected && selectedItemTextStyles]}
            >
              {item[displayKey]}
            </Text>
            {item.description && (
              <Text style={descriptionTextStyles}>{item.description}</Text>
            )}
          </View>
          {itemIconPosition === 'right' && iconKey && item[iconKey] && (
            <ItemIcon
              iconRenderer={Icon}
              iconKey={iconKey}
              icon={item[iconKey]}
              style={[itemIconStyles, itemSelected && itemIconSelectedStyles]}
            />
          )}
          {selectedIconPosition === 'right' && renderSelectedIcon()}
        </TouchableOpacity>
        {hasDropDown && (
          <TouchableOpacity
            style={dropDownToggleIconWrapperStyles}
            onPress={toggleDropDown}
          >
            <components.DropDownToggleIcon isOpen={dropDownIsOpen} />
          </TouchableOpacity>
        )}
      </View>
      {getChildren(item) && dropDownIsOpen && (
        <FlatList
          keyExtractor={(item) => `${childItemId(item)}`}
          data={getChildren(item)}
          extraData={selectedItems}
          ItemSeparatorComponent={components.SubItemSeparator}
          renderItem={renderSubItemFlatList}
          initialNumToRender={20}
          {...subItemsFlatListProps}
        />
      )}
    </View>
  )
}, shouldNotRerender)

export default RowItem
