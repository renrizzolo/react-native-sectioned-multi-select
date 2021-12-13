import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { isEqual } from 'lodash'
import { View, TouchableOpacity, Text } from 'react-native'
import ItemIcon from './ItemIcon'
import { callIfFunction } from '../helpers'

const shouldNotRerender = (prevProps, nextProps) => {
  /*
  return true if passing nextProps to render would return
  the same result as passing prevProps to render,
  otherwise return false
  */
  const {
    renderItems,
    selectedItems,
    subItem,
    childItemId,
    highlightedChildren,
    parentsHighlightChildren,
  } = prevProps

  // update here so the filter changes are reflected properly
  if (nextProps.renderItems !== renderItems) {
    return false
  }
  if (nextProps.selectedItems !== prevProps.selectedItems) {
    if (
      selectedItems.includes(childItemId(subItem)) &&
      !nextProps.selectedItems.includes(childItemId(subItem))
    ) {
      console.log('sub row render selectedItem !nextProps.selectedItems')

      return false
    }
    if (
      !selectedItems.includes(childItemId(subItem)) &&
      nextProps.selectedItems.includes(childItemId(subItem))
    ) {
      console.log('sub row render !selectedItem nextProps.selectedItems')

      return false
    }
  }
  if (parentsHighlightChildren) {
    console.log('parentsHighlightChildren true')

    if (highlightedChildren.includes(childItemId(subItem))) {
      console.log('subitem parents highlight all this', highlightedChildren)

      return false
    }
    if (nextProps.highlightedChildren.includes(childItemId(subItem))) {
      console.log(
        'subitem parents highlight all next',
        nextProps.highlightedChildren
      )

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

const RowSubItem = React.memo((props) => {
  const {
    stylesFromContext,
    styles: stylesFromProps = {},
    colors,
    subItem,
    selectedItems,
    SelectedIcon,
    UnselectedIcon,
    highlightedChildren,
    iconRenderer: Icon,
    childItemId,
    subItemFontFamily,
    parentsToggleChildren,
    selectedIconPosition,
    itemNumberOfLines,
    displayKey,
    iconKey,
    _toggleSubItem,
    getStyles,
  } = props

  const itemSelected = React.useMemo(() => {
    return selectedItems.includes(childItemId(subItem))
  }, [selectedItems])

  const itemHighlighted =
    !parentsToggleChildren && highlightedChildren.includes(childItemId(subItem))
  console.log('rowSubItem render', childItemId(subItem))

  const subItemStyles = React.useMemo(
    () =>
      getStyles(
        'subItem',
        {
          itemSelected,
          subItem,
          itemHighlighted,
        },
        stylesFromProps
      ),
    [
      itemSelected,
      itemHighlighted,
      stylesFromContext.subItem,
      stylesFromProps.subItem,
    ]
  )

  const toggleItem = () => {
    _toggleSubItem(subItem)
  }

  const renderSelectedIcon = () => {
    console.log('itemHighlighted', itemHighlighted)

    return itemSelected || itemHighlighted ? (
      <SelectedIcon highlighted={itemHighlighted} />
    ) : (
      <UnselectedIcon />
    )
  }
  console.log('highlighted in subs?', highlightedChildren)

  const subItemTextStyles = React.useMemo(
    () =>
      getStyles(
        'subItemText',
        {
          itemSelected,
          subItem,

          itemHighlighted,
        },
        stylesFromProps
      ),
    [
      itemSelected,
      subItem,
      itemHighlighted,
      stylesFromContext.subItemText,
      stylesFromProps.subItemText,
    ]
  )
  const subItemTextContainerStyles = React.useMemo(
    () =>
      getStyles(
        'subItemTextContainer',
        {
          itemSelected,
          subItem,

          itemHighlighted,
        },
        stylesFromProps
      ),
    [
      itemSelected,
      itemHighlighted,
      stylesFromContext.subItemTextContainer,
      stylesFromProps.subItemTextContainer,
    ]
  )

  return (
    <View
      key={childItemId(subItem)}
      style={{
        flexDirection: 'row',
        flex: 1,
        backgroundColor: colors.subItemBackground,
      }}
    >
      <TouchableOpacity
        disabled={itemHighlighted || subItem.disabled}
        onPress={toggleItem}
        style={subItemStyles}
      >
        {selectedIconPosition === 'left' && renderSelectedIcon()}

        {iconKey && subItem[iconKey] && (
          <ItemIcon
            iconRenderer={Icon}
            iconKey={iconKey}
            icon={subItem[iconKey]}
            style={[
              stylesFromContext.itemIcon,
              itemSelected && stylesFromContext.itemIconSelected,
            ]}
          />
        )}
        <View style={subItemTextContainerStyles}>
          <Text numberOfLines={itemNumberOfLines} style={subItemTextStyles}>
            {subItem[displayKey]}
          </Text>
          {subItem.description && (
            <Text
              style={[
                {
                  flex: 1,
                  fontSize: 12,
                  color: subItem.disabled ? colors.disabled : colors.subText,
                },
                subItemFontFamily,
                stylesFromContext.descriptionText,
              ]}
            >
              {subItem.description}
            </Text>
          )}
        </View>
        {selectedIconPosition === 'right' && renderSelectedIcon()}
      </TouchableOpacity>
    </View>
  )
}, shouldNotRerender)

// class RowSubItem extends Component {
//   shouldComponentUpdate(nextProps) {
//     if (nextProps.selectedItems !== this.props.selectedItems) {
//       if (
//         this.props.selectedItems.includes(this.props.childItemId(this.props.subItem)) &&
//         !nextProps.selectedItems.includes(this.props.childItemId(this.props.subItem))
//       ) {
//         return true
//       }
//       if (
//         !this.props.selectedItems.includes(this.props.childItemId(this.props.subItem)) &&
//         nextProps.selectedItems.includes(this.props.childItemId(this.props.subItem))
//       ) {
//         return true
//       }
//     }

//     if (this.props.parentsHighlightChildren) {
//       console.log('parentsHighlightChildren true');

//       if (this.props.highlightedChildren.includes(this.props.childItemId(this.props.subItem))) {
//         console.log('subitem parents highlight all this', this.props.highlightedChildren);

//         return true
//       }
//       if (nextProps.highlightedChildren.includes(this.props.childItemId(this.props.subItem))) {
//         console.log('subitem parents highlight all next', nextProps.highlightedChildren);

//         return true
//       }
//     }
//     if (!isEqual(this.props.styles, nextProps.styles)) {
//       return true
//     }

//     return false
//   }

//   _itemSelected = () => {
//     const { subItem, childItemId, selectedItems } = this.props
//     return selectedItems.includes(childItemId(subItem))
//   }

//   _toggleItem = () => {
//     const { subItem } = this.props
//     this.props._toggleSubItem(subItem)
//   }

//   _renderSelectedIcon = () => {
//     const {
//       SelectedIcon,
//       UnselectedIcon,
//       colors,
//       parentsToggleChildren,
//       highlightedChildren,
//       childItemId,
//       subItem,
//       iconRenderer: Icon,
//     } = this.props
//     const highlightChild = !parentsToggleChildren && highlightedChildren.includes(childItemId(subItem))
//     console.log('highlightChild', highlightChild);

//     const itemSelected = this._itemSelected()
//     return itemSelected || highlightChild ? <SelectedIcon highlighted={highlightChild}/> : <UnselectedIcon />
//   }

//   render() {
//     const {
//       stylesFromContext,
//       styles: stylesFromProps,
//       colors,
//       subItem,
//       childItemId,
//       subItemFontFamily,
//       parentsToggleChildren,
//       selectedIconPosition,
//       highlightedChildren,
//       itemNumberOfLines,
//       displayKey,
//       iconKey,
//       getStyles,
//       iconRenderer: Icon,
//     } = this.props
//     console.log('highlighted in subs?', highlightedChildren)

//     const highlightChild = !parentsToggleChildren && highlightedChildren.includes(childItemId(subItem))
//     const itemSelected = this._itemSelected()
//     console.log('rowSubItem render', childItemId(subItem))

//     const subItemStyles = getStyles('subItem', {itemSelected}, stylesFromProps)

//     return (
//       <View
//         key={childItemId(subItem)}
//         style={{
//           flexDirection: 'row',
//           flex: 1,
//           backgroundColor: colors.subItemBackground,
//         }}
//       >
//         <TouchableOpacity
//           disabled={highlightChild || subItem.disabled}
//           onPress={this._toggleItem}
//           style={[
//             subItemStyles,
//             stylesFromContext.subItem,
//             itemSelected && stylesFromContext.selectedItem,
//             itemSelected && stylesFromContext.selectedSubItem,
//             highlightChild && stylesFromContext.highlightedItem,
//             highlightChild && stylesFromContext.highlightedSubItem
//           ]}
//         >
//           {selectedIconPosition && this._renderSelectedIcon()}

//           {iconKey && subItem[iconKey] && (
//               <ItemIcon
//                 iconRenderer={Icon}
//                 iconKey={iconKey}
//                 icon={subItem[iconKey]}
//                 style={[stylesFromContext.itemIcon, itemSelected() && stylesFromContext.itemIconSelected]}
//               />
//           )}
//           <View style={stylesFromContext.subItemTextContainer}>
//           <Text
//             numberOfLines={itemNumberOfLines}
//             style={[
//               {
//                 flex: 1,
//                 color: subItem.disabled ? colors.disabled : colors.subText,
//               },
//               subItemFontFamily,
//               stylesFromContext.subItemText,
//               (itemSelected || highlightChild) && stylesFromContext.selectedSubItemText,
//             ]}
//           >
//             {subItem[displayKey]}

//           </Text>
//           {subItem.description && <Text style={
//             [
//               {
//                 flex: 1,
//                 fontSize: 12,
//                 color: subItem.disabled ? colors.disabled : colors.subText,
//               },
//               subItemFontFamily,
//               stylesFromContext.descriptionText,
//             ]
//           }>{subItem.description}</Text>}
//           </View>
//           {!selectedIconPosition && this._renderSelectedIcon()}
//         </TouchableOpacity>
//       </View>
//     )
//   }
// }

export default RowSubItem
