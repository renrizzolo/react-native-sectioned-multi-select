import * as React from 'react'
import { View, StyleSheet } from 'react-native'

import { getProp, rejectProp, removeDuplicates } from './helpers'
import useEnhancedReducer, {
  loggerMiddleware,
  thunkMiddleware,
} from './reducer/useEnhancedReducer'
import itemsReducer from './reducer/itemsReducer'
import {
  defaultStyles,
  defaultColors,
  SMSDefaultProps,
} from './sectioned-multi-select'
import { defaultComponents } from './components'

export const useSectionedMultiSelect = (props) => {
  const Icon = props.iconRenderer
  const getTheme = () => {
    return {
      styles: StyleSheet.flatten([defaultStyles, props.styles]),
      colors: StyleSheet.flatten([defaultColors, props.colors]),
    }
  }

  const [theme] = React.useState(getTheme)
  const initialProps = { ...SMSDefaultProps, ...props }
  // const [getProps,] = React.useState(initialProps);
  const getProps = React.useMemo(() => {
    return initialProps
  }, [initialProps])

  const getStyles = (key, props, stylesFromComponentProps) => {
    const { colors } = theme
    // default styles defined in sectioned-multi-select.js
    // colors is passed to every style key by default,
    // props can be any component related prop for dynamic styling
    // eg. itemSelected
    const propsObj = { colors, ...props }

    let styles = defaultStyles[key](propsObj)
    // style prop
    // custom styles would be functions like
    // option: (provided, state) => ({
    //   ...provided,
    //   borderBottom: '1px dotted pink',
    //   color: state.isSelected ? 'red' : 'blue',
    //   padding: 20,
    // }),
    const custom = getProps.styles[key]

    // this is styles passed directly to the individual component
    // which takes precedence over default and custom styles
    const extra = stylesFromComponentProps && stylesFromComponentProps[key]

    styles = custom ? custom(styles, propsObj) : styles

    return extra ? extra(styles, props) : styles
  }

  const components = React.useMemo(() => {
    const c = defaultComponents({
      components: getProps.components,
      iconNames: getProps.iconNames,
      colors: theme.colors,
      styles: theme.styles,
      getStyles,
      iconRenderer: getProps.iconRenderer,
    })

    return c
  }, [props.components])

  // if onSelectedItemsChange function is passed in as a prop, we'll call it
  // via the thunk middleware (see onSelectedItemsChangeInternal)
  const middleware = [
    ...(getProps.debug ? [loggerMiddleware] : []),
    ...(getProps.onSelectedItemsChange ? [thunkMiddleware] : []),
  ]
  const [selectedItems, dispatch] = useEnhancedReducer(
    itemsReducer,
    props.initialSelectedItems,
    middleware
  )
  console.log('SELECTED ITEMS', selectedItems)

  React.useEffect(() => {
    // if single is changed, make sure only 1 item is selected
    if (getProps.single) {
      dispatch({
        type: 'replace-items',
        items: selectedItems[0] ? [selectedItems[0]] : [],
      })
    }
  }, [getProps.single])

  React.useEffect(() => {
    // ... onSelectItemsChange could also work like this.
    // but then you couldn't adjust the dispatched action

    // in case items are initally empty (eg. fetched from somewhere)
    // and intialSelectedItems is used - this will make sure onSelectedItemObjectsChange
    // is run once items are poluated
    if (getProps.onSelectedItemObjectsChange && getProps.items.length) {
      console.log(
        'items before find be fore broadcast..',
        getProps.items,
        props.items
      )

      _broadcastItemObjects()
    }
  }, [selectedItems, getProps.items])

  const onSelectedItemsChangeInternal = (action) => {
    const { onSelectedItemsChange, onSelectedItemObjectsChange } = getProps
    // update items state if uncontrolled
    dispatch(onSelectedItemsChange ? onSelectedItemsChange(action) : action)

    // pass dispatch/params so item updates can be controlled externally
    // onSelectedItemsChange(selectedItems, dispatch, action)
  }

  const [searchTerm, setSearchTerm] = React.useState('')
  const [selectIsVisible, setSelectIsVisible] = React.useState(false)
  const [highlightedChildren, setHighlightedChildren] = React.useState([])

  const _filterItems = (searchTerm) => {
    const {
      items,
      subKey,
      itemId,
      childItemId,
      getChildren,
      displayKey,
      filterItems,
    } = getProps
    if (filterItems) {
      return filterItems(searchTerm, items, getProps)
    }
    let filteredItems = []
    let newFilteredItems = []
    items &&
      items.forEach((item) => {
        // we probably don't really need to split/pipe the words
        const parts = searchTerm
          .replace(/[\^$\\.*+?()[\]{}|]/g, '\\$&')
          .trim()
          .split(' ')
        const regex = new RegExp(`(${parts.join('|')})`, 'i')
        if (regex.test(getProp(item, displayKey))) {
          filteredItems.push(item)
        }
        if (getChildren(item)) {
          const newItem = Object.assign({}, item)
          // this is the only use of the subKey prop now :/
          newItem[subKey] = []
          getChildren(item).forEach((sub) => {
            if (regex.test(getProp(sub, displayKey))) {
              newItem[subKey] = [...getChildren(newItem), sub]
              newFilteredItems = rejectProp(
                filteredItems,
                (singleItem) => childItemId(item) !== childItemId(singleItem)
              )
              newFilteredItems.push(newItem)
              filteredItems = newFilteredItems
            }
          })
        }
      })
    return filteredItems
  }

  // returns the items that should be rendered
  // either all items or the result of
  // searchTerm run through the filter function
  const getRenderItems = () => {
    const { items } = getProps
    return searchTerm ? _filterItems(searchTerm.trim()) : items
  }

  const _checkIsParent = (item) => {
    const { getChildren, items } = getProps

    if (getChildren(item)) {
      return true
    }
    if (items) {
      // this should probably return true
      // if it's a top-level item with no children
      // but there should be a cheaper way to determine this...
      for (let i = 0; i < items.length; i++) {
        if (items[i] === item) {
          return true
        }
      }
    }
  }

  const _removeItem = (item, origin) => {
    const {
      itemId,
      childItemId,
      parentsHighlightChildren,
      onSelectedItemObjectsChange,
    } = getProps
    const itemToRemove = React.useCallback(() => _checkIsParent(item), [item])
      ? itemId(item)
      : childItemId(item)
    const newItems = rejectProp(
      selectedItems,
      (singleItem) => itemToRemove !== singleItem
    )
    const dispatchParams = { type: 'remove', item: itemToRemove, origin }
    parentsHighlightChildren && _unHighlightChildren(itemToRemove)
    // onSelectedItemObjectsChange && _broadcastItemObjects(newItems);
    // broadcast new selected items state to parent component
    onSelectedItemsChangeInternal(dispatchParams)
  }
  const _removeAllItems = (origin) => {
    const dispatchParams = { type: 'remove-all', origin }
    const { onSelectedItemObjectsChange } = getProps
    // broadcast new selected items state to parent component
    onSelectedItemsChangeInternal(dispatchParams)
    setHighlightedChildren([])
    // onSelectedItemObjectsChange && _broadcastItemObjects();
  }
  const _selectAllItems = (origin) => {
    const {
      items,
      itemId,
      getChildren,
      childItemId,
      onSelectedItemObjectsChange,
      parentsToggleChildrenOnly,
      readOnlyHeadings,
    } = getProps
    let newItems = []
    items &&
      items.forEach((item) => {
        if (!readOnlyHeadings || !parentsToggleChildrenOnly) {
          newItems.push(itemId(item))
        }
        Array.isArray(getChildren(item)) &&
          getChildren(item).forEach((childItem) => {
            newItems.push(childItemId(childItem))
          })
      })
    const dispatchParams = {
      type: 'replace-items',
      items: newItems,
      origin,
      count: newItems.length,
    }
    onSelectedItemsChangeInternal(dispatchParams)
    // onSelectedItemObjectsChange && onSelectedItemObjectsChange(items);
  }
  // maybe put toggle/search state in the reducer too
  const _toggleSelect = () => {
    const { onToggleSelect } = getProps
    const isVisible = !selectIsVisible
    onToggleSelect && onToggleSelect(isVisible)
    setSelectIsVisible(isVisible)
  }
  const _closeSelect = () => {
    const { onToggleSelect } = getProps
    setSelectIsVisible(false)
    setSearchTerm('')
    onToggleSelect && onToggleSelect(false)
  }
  const _submitSelection = () => {
    const { onConfirm } = getProps
    _toggleSelect()
    // reset searchTerm
    setSearchTerm('')
    onConfirm && onConfirm(selectedItems, dispatch)
  }
  const _cancelSelection = () => {
    const { onCancel } = getProps
    _toggleSelect()
    setSearchTerm('')
    onCancel && onCancel(selectedItems, dispatch)
  }
  const _itemSelected = (item) => {
    return selectedItems.includes(item)
  }
  const _toggleChildren = (item, includeParent, isSelected) => {
    const { onSelectedItemObjectsChange, itemId } = getProps
    const parentItem = itemId(item)
    const selected = _itemSelected(parentItem) || isSelected
    // the children of this item
    const childItems = _getChildIdsArray(parentItem)
    const removedDuplicates = removeDuplicates(childItems, selectedItems)
    let dispatchParams
    if (selected) {
      const itemsToDispatch = [
        ...childItems,
        ...(includeParent ? [parentItem] : []),
      ]
      // don't care about duplicates when removing
      dispatchParams = { type: 'remove-items', items: itemsToDispatch }
    } else {
      const itemsToDispatch = [
        ...removedDuplicates,
        ...(includeParent ? [parentItem] : []),
      ]
      dispatchParams = {
        type: 'add-items',
        items: itemsToDispatch,
        count: itemsToDispatch.length,
      }
    }
    onSelectedItemsChangeInternal(dispatchParams)
    // onSelectedItemObjectsChange && _broadcastItemObjects();
  }
  // item: item object
  // origin?: string to notify dispatch what caused the toggle
  const _toggleItem = (item, origin) => {
    const {
      single,
      itemId,
      childItemId,
      parentsToggleChildren,
      parentsHighlightChildren,
      onSelectedItemObjectsChange,
      singleShouldSubmit,
    } = getProps
    console.group('_toggleItem')
    const isParent = _checkIsParent(item)
    const itemToToggle = isParent ? itemId(item) : childItemId(item)
    // const itemToToggle = getItemId(item)
    let dispatchParams
    const selected = _itemSelected(itemToToggle)
    dispatchParams = selected
      ? { type: 'remove', item: itemToToggle, origin }
      : { type: 'add', item: itemToToggle, origin, count: 1 }
    if (single) {
      // toggling the selected single item should remove it?
      // maybe needs to be optional.
      dispatchParams = selected
        ? { type: 'remove-all', origin }
        : { type: 'add-single', item: itemToToggle, origin, count: 1 }
      onSelectedItemsChangeInternal(dispatchParams)
      // onSelectedItemObjectsChange && _broadcastItemObjects();
      singleShouldSubmit && _submitSelection()
      console.groupEnd()
      return
    }
    if (isParent) {
      if (parentsToggleChildren) {
        // toggle children runs a onSelectedItemsChangeInternal & onSelectedItemObjectsChange!
        // (2nd arg = also toggle parent item)
        _toggleChildren(item, true)
        return
      } else if (parentsHighlightChildren) {
        selected
          ? _unHighlightChildren(itemToToggle)
          : _highlightChildren(itemToToggle)
      }
    }
    console.log('toggle end dispatch params', dispatchParams)
    console.groupEnd()
    // broadcast new selected items state to parent component
    onSelectedItemsChangeInternal(dispatchParams)
    // onSelectedItemObjectsChange && _broadcastItemObjects();
  }
  const _removeParent = (item) => {
    const parent = findParent(item)
    console.log('parent to remove', parent)
    parent && _removeItem(parent)
  }
  const _findItem = (id) => {
    const { items } = getProps
    console.log('find on', items)

    return find(id, items)
  }
  function find(id, items, isChild) {
    if (!items) {
      return {}
    }
    const { getChildren, itemId, childItemId } = getProps
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
  function findParent(item) {
    const { items, itemId, childItemId, getChildren } = getProps
    if (!items) {
      return {}
    }
    const id = childItemId(item)
    if (!id) {
      return {}
    }
    let i = 0
    let found
    for (; i < items.length; i += 1) {
      if (Array.isArray(getChildren(items[i]))) {
        found = find(id, getChildren(items[i]), true)
        if (found) {
          return items[i]
        }
      }
    }
  }
  // removes items that are in array from toSplice
  // array = children item objects
  // toSplice = current selected item keys
  function reduceSelected(array, toSplice) {
    const { childItemId } = getProps
    array.reduce((prev, curr) => {
      // if a child item is selected
      toSplice.includes(childItemId(curr)) &&
        toSplice.splice(
          // remove it
          toSplice.findIndex((el) => el === childItemId(curr)),
          1
        )
    }, {})
    return toSplice
  }
  const _highlightChildren = (id) => {
    const { items, itemId, childItemId, getChildren } = getProps
    const highlighted = [...highlightedChildren]
    if (!items) {
      return
    }
    let i = 0
    for (; i < items.length; i += 1) {
      if (itemId(items[i]) === id && Array.isArray(getChildren(items[i]))) {
        getChildren(items[i]).forEach((sub) => {
          !highlighted.includes(childItemId(sub)) &&
            highlighted.push(childItemId(sub))
        })
      }
    }
    console.log('highlighting children of', id, highlighted)

    setHighlightedChildren(highlighted)
  }
  const _unHighlightChildren = (id) => {
    const { items, itemId, getChildren } = getProps
    const highlighted = [...highlightedChildren]
    const array = items.filter((item) => itemId(item) === id)
    if (!array['0']) {
      return
    }
    if (array['0'] && !getChildren(array['0'])) {
      return
    }
    const newHighlighted = reduceSelected(getChildren(array['0']), highlighted)

    setHighlightedChildren(newHighlighted)
  }
  const _selectChildren = (id) => {
    const { items, itemId, childItemId, getChildren } = getProps
    if (!items) {
      return
    }
    let i = 0
    const selected = []
    for (; i < items.length; i += 1) {
      if (itemId(items[i]) === id && Array.isArray(getChildren(items[i]))) {
        getChildren(items[i]).forEach((sub) => {
          !selectedItems.includes(childItemId(sub)) &&
            selected.push(childItemId(sub))
        })
      }
    }
    // so we have them in state for SubRowItem should update checks
    _highlightChildren(id)
    return selected
  }
  const _getChildIdsArray = (id) => {
    const { items, childItemId, getChildren, itemId } = getProps
    let newItems = []
    const item = items.filter((item) => itemId(item) === id)
    if (!item[0]) {
      return newItems
    }
    const children = getChildren(item[0])
    if (!children) {
      return newItems
    }
    for (let i = 0; i < children.length; i++) {
      newItems.push(childItemId(children[i]))
    }
    return newItems
  }
  const _rejectChildren = (id) => {
    const { items, itemId, childItemId, getChildren } = getProps
    const arrayOfChildren = items.filter((item) => itemId(item) === id)
    const selected = [...selectedItems]
    if (!arrayOfChildren['0']) {
      return
    }
    if (arrayOfChildren['0'] && !getChildren(arrayOfChildren['0'])) {
      return
    }
    const newSelected = reduceSelected(
      getChildren(arrayOfChildren['0']),
      selected
    )
    // update state for SubRowItem component should update checks
    _unHighlightChildren(id)
    return newSelected
  }
  const _getSearchTerm = () => searchTerm
  // get the items back as their full objects instead of an array of ids.

  const _broadcastItemObjects = () => {
    // @todo - after dispatch ?? - selectedItems state is behind
    const { onSelectedItemObjectsChange } = getProps

    if (onSelectedItemObjectsChange) {
      const fullItems = []
      selectedItems.forEach((singleSelectedItem) => {
        const item = _findItem(singleSelectedItem)
        fullItems.push(item)
      })
      console.log('selectedItemObjects', selectedItems, fullItems)
      onSelectedItemObjectsChange(fullItems)
    }
  }

  const getItemId = (item) => {
    const { itemId, childItemId } = getProps
    return _checkIsParent(item) ? itemId(item) : childItemId(item)
  }
  const getModalProps = () => {
    const { modalProps } = getProps

    return {
      transparent: true,
      visible: selectIsVisible,
      onRequestClose: _closeSelect,
      ...modalProps,
    }
  }

  const getFlatListItemProps = () => {
    const { getChildren, itemId, childItemId, iconKey, displayKey } = getProps

    const { styles, colors } = theme
    const renderItems = getRenderItems()

    return {
      iconKey,
      displayKey,
      selectedItems,
      highlightedChildren,
      setHighlightedChildren,
      getChildren,
      itemId,
      childItemId,
      stylesFromContext: styles,
      colors,
      renderItems,
    }
  }

  const _renderItemFlatList = ({ item }) => {
    // injecting props for usage in memo shouldNotRerender function
    const props = getFlatListItemProps()

    return <components.RowItem item={item} {...props} />
  }

  // react-select per component style / custom style handling
  // each style in default styles should be a function
  // that takes any modifying props...
  // e.g style={getStyles('modalContainer', props)}

  // default styles would be exported from each individual
  // component, and imported into the default styles object

  // e.g
  // export const groupCSS = ({ theme: { spacing } }: GroupProps) => ({
  //   paddingBottom: spacing.baseUnit * 2,
  //   paddingTop: spacing.baseUnit * 2,
  // });

  const getStateAndHelpers = () => {
    const { styles, colors } = theme
    const { items } = getProps
    const renderItems = getRenderItems()
    return {
      // components
      // helper functions
      getStyles,
      _toggleSelect,
      _toggleChildren,
      _closeSelect,
      _submitSelection,
      _cancelSelection,
      _getSearchTerm,
      _itemSelected,
      _removeAllItems,
      _removeItem,
      _toggleItem,
      _selectAllItems,
      _findItem,
      _filterItems,
      _checkIsParent,
      getModalProps,
      setSearchTerm,
      _renderItemFlatList,

      Icon,
      // props
      ...getProps,

      components,
      selectedItems,
      //state
      searchTerm,
      selectIsVisible,
      styles,
      colors,
      // items to render
      renderItems,
    }
  }
  return getStateAndHelpers()
}
