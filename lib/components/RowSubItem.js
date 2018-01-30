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
    if (this.props.selectedItems.includes(this.props.item[this.props.uniqueKey]) &&
      !nextProps.selectedItems.includes(this.props.item[this.props.uniqueKey])) {
      return true
    }
    if (!this.props.selectedItems.includes(this.props.item[this.props.uniqueKey]) &&
      nextProps.selectedItems.includes(this.props.item[this.props.uniqueKey])) {
      return true
    }
    if (this.props.showSubCategories !== nextProps.showSubCategories) {
      return true
    }

    if (this.props.highlightChildren || this.props.selectChildren) {
      if (this.props.highlightedChildren.includes(this.props.item[this.props.uniqueKey])) {
        return true
      }
      if (nextProps.highlightedChildren.includes(this.props.item[this.props.uniqueKey])) {
        return true
      }
    }
    return false
  }

  _itemSelected = (item) => {
    const { uniqueKey, selectedItems } = this.props
    return selectedItems.includes(item[uniqueKey])
  }

  _toggleItem = (item) => {
    this.props._toggleItem(item)
  }


  render(){
    const {
      item,
      styles,
      selectedItems,
      uniqueKey,
      subKey,
      showDropDowns,
      colors,
      readOnlyHeadings,
      subItemFontFamily,
      selectedIconComponent,
      highlightChildren,
      dropDownToggleIconUpComponent,
      dropDownToggleIconDownComponent,
      selectChildren,
      highlightedChildren,
      numberOfLines,
    } = this.props

    const highlightChild = highlightedChildren.includes(item[uniqueKey]) && !selectChildren

    return (
      <View
        key={item[uniqueKey]}
        style={{
          flexDirection: 'row',
          flex: 1,
          backgroundColor: colors.subItemBackground,
        }}
      >
        <TouchableOpacity
          disabled={highlightChild}
          onPress={() => this._toggleItem(item)}
          style={[{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingVertical: 6,
          }, styles.subItem, (this._itemSelected(item) || highlightChild) && styles.selectedItem]}
        >
          <Text
            numberOfLines={numberOfLines}
            style={[{ flex: 1, color: colors.subText }, subItemFontFamily, styles.subItemText]}
          >
            {item.name}
          </Text>
          {
          this._itemSelected(item) || highlightChild ?
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
