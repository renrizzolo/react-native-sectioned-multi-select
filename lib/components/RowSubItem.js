import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types'
import { View, TouchableOpacity, Text, Image } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import ItemIcon from './ItemIcon'
import { callIfFunction } from '../helpers'

class RowSubItem extends Component {
  shouldComponentUpdate(nextProps) {
    if (nextProps.selectedItems !== this.props.selectedItems) {
      if (
        this.props.selectedItems.includes(this.props.subItem[this.props.uniqueKey]) &&
        !nextProps.selectedItems.includes(this.props.subItem[this.props.uniqueKey])
      ) {
        return true
      }
      if (
        !this.props.selectedItems.includes(this.props.subItem[this.props.uniqueKey]) &&
        nextProps.selectedItems.includes(this.props.subItem[this.props.uniqueKey])
      ) {
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
    if (this.props.mergedStyles !== nextProps.mergedStyles) {
      return true
    }
    if (this.props.customSubItemContentRenderer !== nextProps.customSubItemContentRenderer) {
      return true
    }
    return false
  }

  _itemSelected = () => {
    const { subItem, uniqueKey, selectedItems } = this.props
    return selectedItems.includes(subItem[uniqueKey])
  }

  _toggleItem = () => {
    const { subItem } = this.props
    this.props._toggleSubItem(subItem)
  }

  _renderSelectedIcon = () => {
    const {
      selectedIconComponent,
      unselectedIconComponent,
      mergedColors,
      selectChildren,
      highlightedChildren,
      uniqueKey,
      subItem,
    } = this.props
    const highlightChild = !selectChildren && highlightedChildren.includes(subItem[uniqueKey])
    const itemSelected = this._itemSelected()
    return itemSelected || highlightChild ? (
      <View>
        {selectedIconComponent ? (
          callIfFunction(selectedIconComponent)
        ) : (
          <Icon
            name="check"
            style={{
              fontSize: 16,
              color: highlightChild ? mergedColors.disabled : mergedColors.success,
              paddingLeft: 10,
            }}
          />
        )}
      </View>
    ) : unselectedIconComponent ? (
      callIfFunction(unselectedIconComponent)
    ) : null
  }

  _renderDefaultContent = () => {
    const {
      mergedStyles,
      mergedColors,
      subItem,
      selectChildren,
      selectedIconOnLeft,
      iconKey,
      uniqueKey,
      displayKey,
      itemNumberOfLines,
      subItemFontFamily,
      highlightedChildren,
    } = this.props;

    const itemSelected = this._itemSelected();
    const highlightChild = !selectChildren && highlightedChildren.includes(subItem[uniqueKey])

    return (
      <Fragment>
        {selectedIconOnLeft && this._renderSelectedIcon()}

        {iconKey && subItem[iconKey] && (
          <ItemIcon
            iconKey={iconKey}
            icon={subItem[iconKey]}
            style={mergedStyles.itemIconStyle}
          />
        )}
        <Text
          numberOfLines={itemNumberOfLines}
          style={[
            {
              flex: 1,
              color: subItem.disabled ? mergedColors.disabled : mergedColors.subText,
            },
            subItemFontFamily,
            mergedStyles.subItemText,
            (itemSelected || highlightChild) && mergedStyles.selectedSubItemText,
          ]}
        >
          {subItem[displayKey]}
        </Text>
        {!selectedIconOnLeft && this._renderSelectedIcon()}
      </Fragment>
    )
  }

  render() {
    const {
      mergedStyles,
      mergedColors,
      subItem,
      uniqueKey,
      selectChildren,
      highlightedChildren,
      customSubItemContentRenderer: CustomSubItemContentRenderer
    } = this.props

    const highlightChild = !selectChildren && highlightedChildren.includes(subItem[uniqueKey])
    const itemSelected = this._itemSelected()

    const shouldUseCostumeRender = CustomSubItemContentRenderer ? true : false;

    return (
      <View
        key={subItem[uniqueKey]}
        style={{
          flexDirection: 'row',
          flex: 1,
          backgroundColor: mergedColors.subItemBackground,
        }}
      >
        <TouchableOpacity
          disabled={highlightChild || subItem.disabled}
          onPress={this._toggleItem}
          style={[
            {
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              paddingVertical: 6,
            },
            mergedStyles.subItem,
            (itemSelected || highlightChild) && mergedStyles.selectedItem,
            (itemSelected || highlightChild) && mergedStyles.selectedSubItem,
          ]}
        >
          {!shouldUseCostumeRender && this._renderDefaultContent()}

          {shouldUseCostumeRender && <CustomSubItemContentRenderer subItem={subItem} isItemSelected={itemSelected}/> }
        </TouchableOpacity>
      </View>
    )
  }
}

export default RowSubItem
