import * as React from 'react'
import { StyleSheet, View, FlatList, Platform } from 'react-native'
import useSMSContext from '../context/useSMSContext'
// const getItemProps = ({ id }) => {
//   const {
//     itemId,
//     childItemId,
//     _checkIsParent,
//     _toggleItem,
//     _findItem,
//     _toggleChildren
//   } = useSMSContext()
//   // get the item object
//   const item = React.useMemo(() => _findItem(id), [id])
//   if (!item) {
//     return null
//   }
//   // check if item has children
//   const isParent = React.useMemo(() => _checkIsParent(item), [id])
//   const itemKey = isParent ? itemId(item) : childItemId(item)
//   // get the parent id if it's a child item
//   // const parentItem = isParent ? undefined : findParent(item)
//   const onPress = () => _toggleItem(item)
//   return {
//     id,
//     item,
//     itemKey,
//     isParent,
//     onPress,
//   }
// }

export const ItemSeparator = ({
  children,
  styles: stylesFromProps = {},
  ...rest
}) => {
  const { styles, getStyles } = useSMSContext()
  const separatorStyles = React.useMemo(
    () => getStyles('separator', {}, stylesFromProps),
    [styles.separator, stylesFromProps.separator]
  )

  return React.useMemo(() => {
    return (
      <View style={separatorStyles} {...rest}>
        {children && children}
      </View>
    )
  }, [children, separatorStyles])
}

export const SubItemSeparator = ({
  children,
  styles: stylesFromProps = {},
  ...rest
}) => {
  const { styles, getStyles } = useSMSContext()
  const subSeparatorStyles = React.useMemo(
    () => getStyles('subSeparator', {}, stylesFromProps),
    [styles.subSeparator, stylesFromProps.subSeparator]
  )

  return React.useMemo(() => {
    console.log('SubItemSep render')
    return (
      <View style={subSeparatorStyles} {...rest}>
        {children && children}
      </View>
    )
  }, [children, subSeparatorStyles])
}

const Items = ({
  flatListProps: flatListPropsFromComponent,
  styles: stylesFromProps = {},
}) => {
  const {
    components,
    items,
    selectedItems,
    loading,
    _renderItemFlatList,
    itemsFlatListProps: flatListPropsFromContext,
    itemId,
    searchTerm,
    _filterItems,
    styles,
    getStyles,
  } = useSMSContext()
  const renderItems = searchTerm ? _filterItems(searchTerm.trim()) : items
  const flatListProps = {
    ...flatListPropsFromContext,
    ...flatListPropsFromComponent,
  }
  const itemWrapperStyles = React.useMemo(
    () => getStyles('itemWrapper', {}, stylesFromProps),
    [styles.itemWrapper, stylesFromProps.itemWrapper]
  )
  return (
    <View keyboardShouldPersistTaps="always" style={itemWrapperStyles}>
      {
        (loading ? (
          <components.Loading />
        ) : !renderItems || (!renderItems.length && !searchTerm) ? (
          <components.NoItems />
        ) : null,
        items && renderItems && renderItems.length ? (
          <FlatList
            keyboardShouldPersistTaps="always"
            removeClippedSubviews
            initialNumToRender={15}
            data={renderItems}
            extraData={selectedItems}
            keyExtractor={(item) => `${itemId(item)}`}
            ItemSeparatorComponent={components.ItemSeparator}
            ListFooterComponent={components.ItemsFooter}
            renderItem={_renderItemFlatList}
            {...flatListProps}
          />
        ) : searchTerm ? (
          <components.NoResults />
        ) : null)
      }
    </View>
  )
}

export default Items
