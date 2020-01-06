import React, { Component } from 'react'
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
import Icon from 'react-native-vector-icons/MaterialIcons'
import RowSubItem from './RowSubItem'
import ItemIcon from './ItemIcon'
import { callIfFunction } from '../helpers'

class RowItem extends Component {
  constructor(props) {
    super(props)

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true)
    }
    this.state = {
      showSubCategories: false,
      subToggled: null,
    }
  }

  componentDidMount() {
    this._expandDropDowns()
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.selectedItems !== this.props.selectedItems) {
      if (
        this.props.selectedItems.includes(this.props.item[this.props.uniqueKey]) &&
        !nextProps.selectedItems.includes(this.props.item[this.props.uniqueKey])
      ) {
        return true
      }
      if (
        !this.props.selectedItems.includes(this.props.item[this.props.uniqueKey]) &&
        nextProps.selectedItems.includes(this.props.item[this.props.uniqueKey])
      ) {
        return true
      }

      if (this.state.subToggled !== nextState.subToggled) {
        return true
      }

      // propagate updates to child items
      // when adding/removing child items when
      // parent isn't selected

      if (
        this.props.item[this.props.subKey] &&
        this.props.item[this.props.subKey].findIndex(el =>
          nextProps.selectedItems.includes(el[this.props.uniqueKey])) !== -1
      ) {
        return true
      }
      if (
        this.props.item[this.props.subKey] &&
        this.props.item[this.props.subKey].findIndex(el =>
          this.props.selectedItems.includes(el[this.props.uniqueKey])) !== -1
      ) {
        return true
      }
    }

    if (this.props.searchTerm !== nextProps.searchTerm) {
      return true
    }
    if (this.state.showSubCategories !== nextState.showSubCategories) {
      return true
    }
    if (this.props.mergedStyles !== nextProps.mergedStyles) {
      return true
    }
    return false
  }

  _itemSelected = (item) => {
    const { uniqueKey, selectedItems } = this.props
    return selectedItems.includes(item[uniqueKey])
  }

  _toggleItem = (item, hasChildren) => {
    this.props._toggleItem(item, hasChildren)
  }

  _toggleSubItem = (item) => {
    const { uniqueKey } = this.props
    const { subToggled } = this.state
    // we are only concerned about
    // triggering shouldComponentUpdate
    if (subToggled === item[uniqueKey]) {
      this.setState({ subToggled: false })
    } else {
      this.setState({ subToggled: item[uniqueKey] })
    }
    this.props._toggleItem(item, false)
  }

  _expandDropDowns = () => {
    const { expandDropDowns } = this.props
    if (expandDropDowns) {
      this.setState({ showSubCategories: true })
    }
  }

  _toggleDropDown = () => {
    const { customLayoutAnimation, animateDropDowns } = this.props
    const animation = customLayoutAnimation || LayoutAnimation.Presets.easeInEaseOut
    animateDropDowns && LayoutAnimation.configureNext(animation)
    this.setState({ showSubCategories: !this.state.showSubCategories })
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

  _dropDownOrToggle = () => {
    const {
      readOnlyHeadings, showDropDowns, uniqueKey, subKey, item,
    } = this.props

    const hasChildren = !!(item[subKey] && item[subKey].length)

    if (readOnlyHeadings && item[subKey] && showDropDowns) {
      this._toggleDropDown()
    } else if (readOnlyHeadings) {
    } else {
      this._toggleItem(item, hasChildren)
    }
  }

  _renderSubItemFlatList = ({ item }) => (
    <RowSubItem
      _toggleSubItem={this._toggleSubItem}
      subItem={item}
      highlightedChildren={this.props.highlightedChildren}
      {...this.props}
    />
  )

  _renderSubSeparator = () => (
    <View
      style={[
        {
          flex: 1,
          height: StyleSheet.hairlineWidth,
          alignSelf: 'stretch',
          backgroundColor: '#dadada',
        },
        this.props.mergedStyles.subSeparator,
      ]}
    />
  )
  _renderSelectedIcon = () => {
    const {
      item,
      selectedIconComponent,
      mergedColors,
      unselectedIconComponent,
      iconRenderer: Icon,
    } = this.props
    return this._itemSelected(item)
      ? callIfFunction(selectedIconComponent) || (
      <Icon
        name="check"
        style={{
              fontSize: 16,
              color: mergedColors.success,
              paddingLeft: 10,
            }}
      />
      )
      : callIfFunction(unselectedIconComponent) || null
  }

  render() {
    const {
      item,
      mergedStyles,
      mergedColors,
      uniqueKey,
      subKey,
      showDropDowns,
      readOnlyHeadings,
      itemFontFamily,
      selectedIconOnLeft,
      dropDownToggleIconUpComponent,
      dropDownToggleIconDownComponent,
      itemNumberOfLines,
      displayKey,
      selectedItems,
      iconKey,
      iconRenderer: Icon,
      subItemsFlatListProps,
    } = this.props
    const hasDropDown = item[subKey] && item[subKey].length > 0 && showDropDowns

    return (
      <View>
        <View
          key={item[uniqueKey]}
          style={{
            flexDirection: 'row',
            flex: 1,
            backgroundColor: mergedColors.itemBackground,
          }}
        >
          <TouchableOpacity
            disabled={(readOnlyHeadings && !showDropDowns) || item.disabled}
            onPress={this._dropDownOrToggle}
            style={[
              {
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                paddingVertical: 6,
              },
              mergedStyles.item,
              this._itemSelected(item) && mergedStyles.selectedItem,
            ]}
          >
            {selectedIconOnLeft && this._renderSelectedIcon()}
            {iconKey && item[iconKey] && (
              <ItemIcon
                iconRenderer={Icon}
                iconKey={iconKey}
                icon={item[iconKey]}
                itemIconStyle={mergedStyles.itemIconStyle}
              />
            )}
            <Text
              numberOfLines={itemNumberOfLines}
              style={[
                {
                  flex: 1,
                  color: item.disabled ? mergedColors.disabled : mergedColors.text,
                },
                itemFontFamily,
                mergedStyles.itemText,
                this._itemSelected(item) && mergedStyles.selectedItemText,
              ]}
            >
              {item[displayKey]}
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
                  backgroundColor: 'transparent',
                },
                mergedStyles.toggleIcon,
              ]}
              onPress={this._toggleDropDown}
            >
              {this._showSubCategoryDropDown() ? (
                <View>
                  {callIfFunction(dropDownToggleIconUpComponent) || (
                    <Icon
                      name="keyboard-arrow-up"
                      size={22}
                      style={{
                        color: mergedColors.primary,
                      }}
                    />
                  )}
                </View>
              ) : (
                <View>
                  {callIfFunction(dropDownToggleIconDownComponent) || (
                    <Icon
                      name="keyboard-arrow-down"
                      size={22}
                      style={{
                        color: mergedColors.primary,
                      }}
                    />
                  )}
                </View>
              )}
            </TouchableOpacity>
          )}
        </View>
        {item[subKey] && this._showSubCategoryDropDown() && (
          <FlatList
            keyExtractor={i => `${i[uniqueKey]}`}
            data={item[subKey]}
            extraData={selectedItems}
            ItemSeparatorComponent={this._renderSubSeparator}
            renderItem={this._renderSubItemFlatList}
            initialNumToRender={20}
            {...subItemsFlatListProps}
          />
        )}
      </View>
    )
  }
}

export default RowItem
