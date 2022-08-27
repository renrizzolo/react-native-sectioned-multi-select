import React, { Component } from 'react'
import isEqual from 'lodash.isequal'
import {
  View,
  TouchableOpacity,
  Text,
  FlatList,
  LayoutAnimation
} from 'react-native'
import ItemIcon from './ItemIcon'
import { callIfFunction } from '../helpers'

class RowSubItem extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showSubCategories: false,
      subToggled: null
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.selectedItems !== this.props.selectedItems) {
      if (
        this.props.selectedItems.includes(
          this.props.subItem[this.props.uniqueKey]
        ) &&
        !nextProps.selectedItems.includes(
          this.props.subItem[this.props.uniqueKey]
        )
      ) {
        return true
      }
      if (
        !this.props.selectedItems.includes(
          this.props.subItem[this.props.uniqueKey]
        ) &&
        nextProps.selectedItems.includes(
          this.props.subItem[this.props.uniqueKey]
        )
      ) {
        return true
      }

      if (
        this.props.subItem[this.props.subKey] &&
        this.props.subItem[this.props.subKey].findIndex((el) =>
          nextProps.selectedItems.includes(el[this.props.uniqueKey])
        ) !== -1
      ) {
        return true
      }
      if (
        this.props.subItem[this.props.subKey] &&
        this.props.subItem[this.props.subKey].findIndex((el) =>
          this.props.selectedItems.includes(el[this.props.uniqueKey])
        ) !== -1
      ) {
        return true
      }

      if (this.props.highlightChildren || this.props.selectChildren) {
        if (
          this.props.highlightedChildren.includes(
            this.props.subItem[this.props.uniqueKey]
          )
        ) {
          return true
        }
        if (
          nextProps.highlightedChildren.includes(
            this.props.subItem[this.props.uniqueKey]
          )
        ) {
          return true
        }
      }
    }
    if (!isEqual(this.props.mergedStyles, nextProps.mergedStyles)) {
      return true
    }
    if (!isEqual(this.props.mergedColors, nextProps.mergedColors)) {
      return true
    }
    if (this.state.showSubCategories !== nextState.showSubCategories) {
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
    this.props.toggleSubItem(subItem)
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
      icons,
      iconRenderer: Icon
    } = this.props
    const highlightChild =
      !selectChildren && highlightedChildren.includes(subItem[uniqueKey])
    const itemSelected = this._itemSelected()
    return itemSelected || highlightChild ? (
      <View>
        {selectedIconComponent ? (
          callIfFunction(selectedIconComponent)
        ) : (
          <Icon
            style={{
              color: highlightChild
                ? mergedColors.disabled
                : mergedColors.success,
              paddingLeft: 10
            }}
            {...icons.check}
          />
        )}
      </View>
    ) : unselectedIconComponent ? (
      callIfFunction(unselectedIconComponent)
    ) : null
  }

  _showSubCategoryDropDown = () => {
    const { showDropDowns, searchTerm } = this.props
    if (searchTerm.length) {
      return true
    }
    if (showDropDowns) {
      return this.state.showSubCategories
    }

    return true
  }

  _renderSubItemFlatList = ({ item }) => (
    <RowSubItem
      toggleSubItem={this._toggleSubItem}
      highlightedChildren={this.props.highlightedChildren}
      {...this.props}
      subItem={item}
    />
  )

  _toggleDropDown = () => {
    const { customLayoutAnimation, animateDropDowns } = this.props
    const animation =
      customLayoutAnimation || LayoutAnimation.Presets.easeInEaseOut
    animateDropDowns && LayoutAnimation.configureNext(animation)
    this.setState({ showSubCategories: !this.state.showSubCategories })
  }

  render() {
    const {
      mergedStyles,
      mergedColors,
      subItem,
      uniqueKey,
      subItemFontFamily,
      selectChildren,
      selectedIconOnLeft,
      highlightedChildren,
      itemNumberOfLines,
      displayKey,
      iconKey,
      iconRenderer: Icon,
      subKey,
      subItemsFlatListProps,
      selectedItems,
      showDropDowns,
      dropDownToggleIconDownComponent,
      dropDownToggleIconUpComponent,
      icons
    } = this.props
    const hasDropDown =
      subItem[subKey] && subItem[subKey].length > 0 && showDropDowns

    const highlightChild =
      !selectChildren && highlightedChildren.includes(subItem[uniqueKey])
    const itemSelected = this._itemSelected()

    return (
      <View>
        <View
          key={subItem[uniqueKey]}
          style={{
            flexDirection: 'row',
            flex: 1,
            backgroundColor: mergedColors.subItemBackground
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
                paddingVertical: 6
              },
              mergedStyles.subItem,
              (itemSelected || highlightChild) && mergedStyles.selectedItem,
              (itemSelected || highlightChild) && mergedStyles.selectedSubItem
            ]}
          >
            {selectedIconOnLeft && this._renderSelectedIcon()}

            {iconKey && subItem[iconKey] && (
              <ItemIcon
                iconRenderer={Icon}
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
                  color: subItem.disabled
                    ? mergedColors.disabled
                    : mergedColors.subText
                },
                subItemFontFamily,
                mergedStyles.subItemText,
                (itemSelected || highlightChild) &&
                  mergedStyles.selectedSubItemText
              ]}
            >
              {subItem[displayKey]}
            </Text>
            {!selectedIconOnLeft && this._renderSelectedIcon()}
          </TouchableOpacity>
          {hasDropDown && (
            <TouchableOpacity
              style={[
                {
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  paddingHorizontal: 10,
                  backgroundColor: 'transparent'
                },
                mergedStyles.toggleIcon
              ]}
              onPress={this._toggleDropDown}
            >
              {this._showSubCategoryDropDown() ? (
                <View>
                  {callIfFunction(dropDownToggleIconUpComponent) || (
                    <Icon
                      style={{
                        color: mergedColors.primary
                      }}
                      {...icons.arrowUp}
                    />
                  )}
                </View>
              ) : (
                <View>
                  {callIfFunction(dropDownToggleIconDownComponent) || (
                    <Icon
                      style={{
                        color: mergedColors.primary
                      }}
                      {...icons.arrowDown}
                    />
                  )}
                </View>
              )}
            </TouchableOpacity>
          )}
        </View>
        {subItem[subKey] && this._showSubCategoryDropDown() && (
          <View
            style={{
              paddingLeft: 8
            }}
          >
            <FlatList
              keyExtractor={(i) => `${i[uniqueKey]}`}
              data={subItem[subKey]}
              extraData={selectedItems}
              ItemSeparatorComponent={this._renderSubSeparator}
              renderItem={this._renderSubItemFlatList}
              initialNumToRender={20}
              {...subItemsFlatListProps}
            />
          </View>
        )}
      </View>
    )
  }
}

export default RowSubItem
