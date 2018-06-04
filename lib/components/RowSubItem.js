import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  View,
  TouchableOpacity,
  Text,
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'

class RowSubItem extends Component {
  shouldComponentUpdate(nextProps) {
    if (nextProps.selectedItems !== this.props.selectedItems) {

    if (this.props.selectedItems.includes(this.props.subItem[this.props.uniqueKey]) &&
      !nextProps.selectedItems.includes(this.props.subItem[this.props.uniqueKey])) {
      return true
    }
    if (!this.props.selectedItems.includes(this.props.subItem[this.props.uniqueKey]) &&
      nextProps.selectedItems.includes(this.props.subItem[this.props.uniqueKey])) {
      return true
    }
    if (this.props.highlightChildren || this.props.selectChildren) {
      if (this.props.highlightedChildren.includes(this.props.subItem[this.props.uniqueKey])) {
        return true
      }
      if (nextProps.highlightedChildren.includes(this.props.subItem[this.props.uniqueKey])) {
        return true
      }
    }
  }
    return false
  }

  _itemSelected = () => {
    const { subItem, uniqueKey, selectedItems } = this.props
    return selectedItems.includes(subItem[uniqueKey])
  }

  _toggleItem = (item) => {
    this.props._toggleSubItem(item)
  }

  render() {
    const {
      subItem,
      mergedStyles,
      uniqueKey,
      colors,
      subItemFontFamily,
      selectedIconComponent,
      selectChildren,
      highlightedChildren,
      numberOfLines,
      displayKey,
    } = this.props

    const highlightChild = !selectChildren && highlightedChildren.includes(subItem[uniqueKey])
    const itemSelected = this._itemSelected()

    return (
      <View
        key={subItem[uniqueKey]}
        style={{
          flexDirection: 'row',
          flex: 1,
          backgroundColor: colors.subItemBackground,
        }}
      >
        <TouchableOpacity
          disabled={highlightChild || subItem.disabled}
          onPress={() => this._toggleItem(subItem)}
          style={[{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingVertical: 6,
          }, mergedStyles.subItem, (itemSelected || highlightChild) && mergedStyles.selectedItem]}
        >
          <Text
            numberOfLines={numberOfLines}
            style={[{ flex: 1, color: subItem.disabled ? colors.disabled : colors.subText }, subItemFontFamily, mergedStyles.subItemText]}
          >
            {subItem[displayKey]}
          </Text>
          {
          itemSelected || highlightChild ?
            <View>
              { selectedIconComponent ?
                selectedIconComponent
                :
                <Icon
                  name="check"
                  style={{
                    fontSize: 16,
                    color: highlightChild ? colors.disabled : colors.success,
                    paddingLeft: 10,
                  }}
                />
             }
            </View>
          :
          null
          }
        </TouchableOpacity>
      </View>
    )
  }
}

export default RowSubItem
