import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import {
  ScrollView,
  View,
  TouchableOpacity,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  Text,
  TextInput,
  UIManager,
  Platform,
  LayoutAnimation,
  Modal,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native'
import get from 'lodash/get'
import reject from 'lodash/reject'
import Icon from 'react-native-vector-icons/MaterialIcons'

import { RowItem, RowSubItem } from './components'

const Touchable = Platform.OS === 'android' ? TouchableNativeFeedback : TouchableOpacity

const styles = {
  container: {

  },
  selectToggle: {
    marginTop: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 4,
  },
  selectToggleText: {

  },
  item: {
  },
  subItem: {
  },
  itemText: {
    fontSize: 17,
  },
  subItemText: {
    fontSize: 15,
    paddingLeft: 8,
  },
  searchBar: {
    backgroundColor: '#f8f8f8',
    flexDirection: 'row',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {

  },
  subSeparator: {
    height: 0,
  },
  chipContainer: {

  },
  chipText: {

  },
  chipIcon: {

  },
  searchTextInput: {

  },
  scrollView: {

  },
  button: {

  },
  confirmText: {

  },
  toggleIcon: {

  },
  selectedItem: {

  },
}

// let date = new Date()

const noResults = <Text>Sorry, no results</Text>

const loading = (
  <View style={{ marginTop: 20, alignItems: 'center', justifyContent: 'center' }}>
    <ActivityIndicator />
  </View>
)

class SectionedMultiSelect extends PureComponent {
  static propTypes = {
    single: PropTypes.bool,
    selectedItems: PropTypes.array,
    items: PropTypes.array.isRequired,
    titleKey: PropTypes.string,
    uniqueKey: PropTypes.string.isRequired,
    subKey: PropTypes.string,
    onSelectedItemsChange: PropTypes.func.isRequired,
    showDropDowns: PropTypes.bool,
    showChips: PropTypes.bool,
    readOnlyHeadings: PropTypes.bool,
    selectText: PropTypes.string,
    selectedText: PropTypes.string,
    confirmText: PropTypes.string,
    styles: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object,
    ]),
    colors: PropTypes.objectOf(PropTypes.string),
    searchPlaceholderText: PropTypes.string,
    noResultsComponent: PropTypes.object,
    loadingComponent: PropTypes.object,
    subItemFontFamily: PropTypes.object,
    itemFontFamily: PropTypes.object,
    searchTextFontFamily: PropTypes.object,
    confirmFontFamily: PropTypes.object,
    showRemoveAll: PropTypes.bool,
    removeAllText: PropTypes.string,
    modalSupportedOrientations: PropTypes.arrayOf(PropTypes.string),
    modalAnimationType: PropTypes.string,
    hideSearch: PropTypes.bool,
    footerComponent: PropTypes.object,
    selectToggleIconComponent: PropTypes.object,
    searchIconComponent: PropTypes.object,
    selectedIconComponent: PropTypes.object,
    dropDownToggleIconUpComponent: PropTypes.object,
    dropDownToggleIconDownComponent: PropTypes.object,
    selectChildren: PropTypes.bool,
    highlightChildren: PropTypes.bool,
    onSelectedItemObjectsChange: PropTypes.func,
    numberOfLines: PropTypes.number,
  }

  static defaultProps = {
    single: false,
    selectedItems: [],
    titleKey: 'name',
    showDropDowns: true,
    showChips: true,
    readOnlyHeadings: false,
    selectText: 'Select',
    selectedText: 'selected',
    confirmText: 'Confirm',
    searchPlaceholderText: 'Search categories...',
    noResultsComponent: noResults,
    loadingComponent: loading,
    styles: {},
    colors: {
      primary: '#3f51b5',
      success: '#4caf50',
      text: '#2e2e2e',
      subText: '#848787',
      selectToggleTextColor: '#333',
      searchPlaceholderTextColor: '#999',
      searchSelectionColor: 'rgba(0,0,0,0.2)',
      chipColor: '#848787',
      itemBackground: '#fff',
      subItemBackground: '#ffffff',
      disabled: '#d7d7d7',
    },
    itemFontFamily: { fontFamily: Platform.OS === 'android' ? 'normal' : 'Avenir', fontWeight: 'bold' },
    subItemFontFamily: { fontFamily: Platform.OS === 'android' ? 'normal' : 'Avenir', fontWeight: '200' },
    searchTextFontFamily: { fontFamily: Platform.OS === 'android' ? 'normal' : 'Avenir', fontWeight: '200' },
    confirmFontFamily: { fontFamily: Platform.OS === 'android' ? 'normal' : 'Avenir', fontWeight: 'bold' },
    removeAllText: 'Remove all',
    showRemoveAll: false,
    modalSupportedOrientations: ['portrait', 'landscape'],
    modalAnimationType: 'fade',
    hideSearch: false,
    selectChildren: false,
    highlightChildren: false,
    numberOfLines: null,

  }

  constructor(props) {
    super(props)

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true)
    }
    this.state = {
      selector: false,
      searchTerm: '',
      showSubCategories: [],
      highlightedChildren: [],
    }
    this.styles = StyleSheet.flatten([styles, props.styles])
  }

  // componentWillUpdate() { date = new Date();}
  // componentDidUpdate() {console.log(new Date().valueOf() - date.valueOf())}


  find = (id, items) => {
    if (!items) {
      return {}
    }
    const { uniqueKey, subKey } = this.props
    let i = 0
    let found
    for (; i < items.length; i += 1) {
      if (items[i][uniqueKey] === id) {
        return items[i]
      } else if (Array.isArray(items[i][subKey])) {
        found = this.find(id, items[i][subKey])
        if (found) {
          return found
        }
      }
    }
  }

  reduceSelected = (array, toSplice) => {
    const { uniqueKey } = this.props
    array.reduce((prev, curr) => {
      toSplice.includes(curr[uniqueKey]) &&
        toSplice.splice(toSplice.findIndex(el => (
          el === curr[uniqueKey]
        )), 1)
    }, {})
    return toSplice
  }

  _getSelectLabel = () => {
    const {
      selectText,
      selectedText,
      single,
      selectedItems,
      titleKey,
    } = this.props
    if (!selectedItems || selectedItems.length === 0) {
      return selectText
    } else if (single || selectedItems.length === 1) {
      const item = selectedItems[0]
      const foundItem = this._findItem(item)
      return get(foundItem, titleKey) || selectText
    }
    return `${selectText} (${selectedItems.length} ${selectedText})`
  }

  _filterItems = (searchTerm) => {
    const {
      items,
      subKey,
      uniqueKey,
      titleKey
    } = this.props

    let filteredItems = []
    let newFilteredItems = []

    items.forEach((item) => {
      const parts = searchTerm.trim().split(/[[ \][)(\\/?\-:]+/)
      const regex = new RegExp(`(${parts.join('|')})`, 'ig')
      if (regex.test(get(item, titleKey))) {
        filteredItems.push(item)
      }
      if (item[subKey]) {
        const newItem = Object.assign({}, item)
        newItem[subKey] = []
        item[subKey].forEach((sub) => {
          if (regex.test(get(sub, titleKey))) {
            newItem[subKey] = [...newItem[subKey], sub]
            newFilteredItems = reject(filteredItems, singleItem =>
              item[uniqueKey] === singleItem[uniqueKey])
            newFilteredItems.push(newItem)
            filteredItems = newFilteredItems
          }
        })
      }
    })

    return filteredItems
  }

  _removeItem = (item) => {
    const {
      uniqueKey,
      selectedItems,
      onSelectedItemsChange,
      highlightChildren,
      onSelectedItemObjectsChange,
    } = this.props

    const newItems = reject(selectedItems, singleItem => (
      item[uniqueKey] === singleItem
    ))

    highlightChildren && this._unHighlightChildren(item[uniqueKey])
    onSelectedItemObjectsChange && this._broadcastItemObjects(newItems)

    // broadcast new selected items state to parent component
    onSelectedItemsChange(newItems)
  }

  _removeAllItems = () => {
    const { onSelectedItemsChange, onSelectedItemObjectsChange } = this.props
    // broadcast new selected items state to parent component
    onSelectedItemsChange([])
    this.setState({ highlightedChildren: [] })
    onSelectedItemObjectsChange && this._broadcastItemObjects([])
  }

  _toggleSelector = () => {
    this.setState({
      selector: !this.state.selector,
    })
  }

  _submitSelection = () => {
    this._toggleSelector()
    // reset searchTerm
    this.setState({ searchTerm: '' })
  }

  _itemSelected = (item) => {
    const { uniqueKey, selectedItems } = this.props
    return selectedItems.includes(item[uniqueKey])
  }

  _toggleItem = (item, hasChildren) => {
    const {
      single,
      uniqueKey,
      selectedItems,
      onSelectedItemsChange,
      selectChildren,
      highlightChildren,
      onSelectedItemObjectsChange,
    } = this.props


    if (single) {
      this._submitSelection()
      onSelectedItemsChange([item[uniqueKey]])
      onSelectedItemObjectsChange && this._broadcastItemObjects([item[uniqueKey]])
    } else {
      const selected = this._itemSelected(item)
      let newItems = []
      if (selected) {
        if (hasChildren) {
          if (selectChildren) {
            newItems = [...this._rejectChildren(item[uniqueKey])]

            newItems = reject(newItems, singleItem => (
              item[uniqueKey] === singleItem
            ))
          } else if (highlightChildren) {
            this._unHighlightChildren(item[uniqueKey])
            newItems = reject(selectedItems, singleItem => (
              item[uniqueKey] === singleItem
            ))
          } else {
            newItems = reject(selectedItems, singleItem => (
              item[uniqueKey] === singleItem
            ))
          }
        } else {
          newItems = reject(selectedItems, singleItem => (
            item[uniqueKey] === singleItem
          ))
        }
      } else {
        newItems = [...selectedItems, item[uniqueKey]]

        if (hasChildren) {
          if (selectChildren) {
            newItems = [...newItems, ...this._selectChildren(item[uniqueKey])]
          } else if (highlightChildren) {
            this._highlightChildren(item[uniqueKey])
          }
        }
      }
      // broadcast new selected items state to parent component
      onSelectedItemsChange(newItems)
      onSelectedItemObjectsChange && this._broadcastItemObjects(newItems);
    }
  }

  _findItem = (id) => {
    const { items } = this.props
    return this.find(id, items)
  }

  _highlightChildren = (id) => {
    const { items, uniqueKey, subKey } = this.props
    const { highlightedChildren } = this.state
    const highlighted = [...highlightedChildren]

    let i = 0
    for (; i < items.length; i += 1) {
      if (items[i][uniqueKey] === id && Array.isArray(items[i][subKey])) {
        items[i][subKey].forEach((sub) => {
          !highlighted.includes(sub[uniqueKey]) && highlighted.push(sub[uniqueKey])
        })
      }
    }
    this.setState({ highlightedChildren: highlighted })
  }

  _unHighlightChildren = (id) => {
    const { items, uniqueKey, subKey } = this.props
    const { highlightedChildren } = this.state
    const highlighted = [...highlightedChildren]

    const array = items.filter(item => item[uniqueKey] === id)

    if (!array['0']) {
      return
    }
    if (array['0'] && !array['0'][subKey]) {
      return
    }

    const newHighlighted = this.reduceSelected(array['0'][subKey], highlighted)

    this.setState({ highlightedChildren: newHighlighted })
  }

  _selectChildren = (id) => {
    const {
      items,
      selectedItems,
      uniqueKey,
      subKey,
    } = this.props

    let i = 0
    const selected = []
    for (; i < items.length; i += 1) {
      if (items[i][uniqueKey] === id && Array.isArray(items[i][subKey])) {
        items[i][subKey].forEach((sub) => {
          !selectedItems.includes(sub[uniqueKey]) && selected.push(sub[uniqueKey])
        })
      }
    }

    // so we have them in state for SubRowItem should update checks
    this._highlightChildren(id)
    return selected
  }

  _rejectChildren = (id) => {
    const {
      items,
      selectedItems,
      uniqueKey,
      subKey,
    } = this.props
    const arrayOfChildren = items.filter(item => item[uniqueKey] === id)
    const selected = [...selectedItems]
    if (!arrayOfChildren['0']) {
      return
    }
    if (arrayOfChildren['0'] && !arrayOfChildren['0'][subKey]) {
      return
    }

    const newSelected = this.reduceSelected(arrayOfChildren['0'][subKey], selected)

    // update state for SubRowItem component should update checks
    this._unHighlightChildren(id)
    return newSelected
  }

  _toggleDropDown = (id) => {
    const items = [...this.state.showSubCategories]
    if (items.includes(id)) {
      items.splice(items.findIndex(el => (
        el === id
      )), 1)
    } else {
      items.push(id)
    }
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    this.setState({ showSubCategories: items })
  }

  _showSubCategoryDropDown = (id) => {
    const { showDropDowns } = this.props
    const { searchTerm } = this.state
    if (showDropDowns) {
      return this.state.showSubCategories.includes(id)
    }
    if (searchTerm.length) {
      return true
    }
    return true
  }


  // get the items back as their full objects instead of an array of ids.
  _broadcastItemObjects = (newItems) => {
    const {
      onSelectedItemObjectsChange,
    } = this.props

    const fullItems = []
    newItems.forEach((singleSelectedItem) => {
      const item = this._findItem(singleSelectedItem)
      fullItems.push(item)
    })
    onSelectedItemObjectsChange(fullItems)
  }

  _displaySelectedItems = () => {
    const {
      uniqueKey,
      selectedItems,
      colors,
      titleKey
    } = this.props

    return selectedItems.map((singleSelectedItem) => {
      const item = this._findItem(singleSelectedItem)

      if (!item || !item[titleKey]) return null

      return (

        <View
          style={[{
            overflow: 'hidden',
            justifyContent: 'center',
            height: 34,
            borderColor: colors.chipColor,
            borderWidth: 1,
            borderRadius: 20,
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: 10,
            margin: 3,
            paddingTop: 0,
            paddingRight: 0,
            paddingBottom: 0,
            }, this.styles.chipContainer]}
          key={item[uniqueKey]}
        >
          <Text
            numberOfLines={1}
            style={[
              {
                color: colors.chipColor,
                fontSize: 13,
                marginRight: 0,
              },
            this.styles.chipText]}
          >
            {item[titleKey]}
          </Text>
          <TouchableOpacity
            onPress={() => { this._removeItem(item) }}
            style={{
              borderTopRightRadius: 20,
              borderBottomRightRadius: 20,
            }}
          >
            <Icon
              name="close"
              style={[{
                color: colors.chipColor,
                fontSize: 16,
                marginHorizontal: 6,
                marginVertical: 7,
              }, this.styles.chipIcon]}
            />
          </TouchableOpacity>
        </View>
      )
    })
  }

  _renderSeparator = sub =>
    <View
      style={[{
        flex: 1,
        height: StyleSheet.hairlineWidth,
        alignSelf: 'stretch',
        backgroundColor: '#dadada',
      }, sub ? this.styles.subSeparator : this.styles.separator]}
    />


  _renderFooter = () => {
    const { footerComponent } = this.props
    return (
      <View>
        {footerComponent && footerComponent}
      </View>
    )
  }


  _renderItemFlatList = ({ item }) => {
    const {
      selectedItems,
      uniqueKey,
      subKey,
    } = this.props

    return (
      <View>
        <RowItem
          item={item}
          _showSubCategoryDropDown={this._showSubCategoryDropDown}
          _toggleDropDown={this._toggleDropDown}
          _toggleItem={this._toggleItem}
          _itemSelected={this._itemSelected}
          showSubCategories={this.state.showSubCategories}
          styles={this.styles}
          {...this.props}
        />
        {this._showSubCategoryDropDown(item[uniqueKey]) &&
        <View>
          {item[subKey] &&
          <FlatList
            keyExtractor={i => i[uniqueKey]}
            data={item[subKey]}
            extraData={selectedItems}
            ItemSeparatorComponent={() => this._renderSeparator(true)}
            renderItem={this._renderSubItemFlatList}
          />
          }
        </View>
        }
      </View>
    )
  }

  _renderSubItemFlatList = ({ item }) => {
    const {
      selectedItems,
      uniqueKey,
      subKey,
    } = this.props

   return (
    <RowSubItem
      item={item}
      _showSubCategoryDropDown={this._showSubCategoryDropDown}
      _toggleDropDown={this._toggleDropDown}
      _toggleItem={this._toggleItem}
      _itemSelected={this._itemSelected}
      highlightedChildren={this.state.highlightedChildren}
      showSubCategories={this.state.showSubCategories}
      styles={this.styles}
      {...this.props}
    />
    )
  }

  render() {
    const {
      items,
      selectedItems,
      uniqueKey,
      confirmText,
      searchPlaceholderText,
      noResultsComponent,
      loadingComponent,
      searchTextFontFamily,
      confirmFontFamily,
      colors,
      single,
      showChips,
      removeAllText,
      showRemoveAll,
      modalAnimationType,
      modalSupportedOrientations,
      hideSearch,
      selectToggleIconComponent,
      searchIconComponent,
    } = this.props

    const { searchTerm, selector } = this.state
    const renderItems = searchTerm ? this._filterItems(searchTerm.trim()) : items
    const confirmFont = confirmFontFamily.fontFamily && confirmFontFamily
    const searchTextFont = searchTextFontFamily.fontFamily && searchTextFontFamily
    return (
      <View>
        <Modal
          supportedOrientations={modalSupportedOrientations}
          animationType={modalAnimationType}
          transparent
          visible={selector}
          onRequestClose={this._toggleSelector}
        >
          <View style={[{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }, this.styles.backdrop]}>
            <View style={[{
              overflow: 'hidden',
              marginHorizontal: 18,
              marginVertical: 26,
              borderRadius: 6,
              alignSelf: 'stretch',
              flex: 1,
              backgroundColor: 'white',
              }, this.styles.container]}
            >
              {!hideSearch &&
              <View style={[{ flexDirection: 'row', paddingVertical: 5 }, this.styles.searchBar]}>
                <View style={this.styles.center}>
                  {searchIconComponent ?
                  searchIconComponent
                  :
                  <Icon
                    name="search"
                    size={18}
                    style={{ marginHorizontal: 15 }}
                  />}
                </View>
                <TextInput
                  selectionColor={colors.searchSelectionColor}
                  onChangeText={searchTerm => this.setState({ searchTerm })}
                  placeholder={searchPlaceholderText}
                  selectTextOnFocus
                  placeholderTextColor={colors.searchPlaceholderTextColor}
                  underlineColorAndroid="transparent"
                  style={[{
                      flex: 1,
                      fontSize: 17,
                      paddingVertical: 8,
                    },
                    searchTextFont,
                    this.styles.searchTextInput,
                  ]}
                />
              </View>
              }

              <ScrollView style={[{ paddingHorizontal: 12, flex: 1 }, this.styles.scrollView]}>
                { (items && items.length) ?
                  <View>
                    {renderItems.length ?
                      <View>
                        <FlatList
                          removeClippedSubviews
                          initialNumToRender={15}
                          data={renderItems}
                          extraData={selectedItems}
                          keyExtractor={item => item[uniqueKey]}
                          ItemSeparatorComponent={() => this._renderSeparator(false)}
                          ListFooterComponent={this._renderFooter}
                          renderItem={this._renderItemFlatList}
                        />
                      </View>
                    :
                      <View>
                        {noResultsComponent}
                      </View>
                    }
                  </View>
                :
                  <View>
                    {loadingComponent}
                  </View>
                }
              </ScrollView>
              <Touchable
                accessibilityComponentType="button"
                onPress={this._submitSelection}
              >
                <View
                  style={[{
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    borderRadius: 3,
                    flexDirection: 'row',
                    backgroundColor: colors.primary,
                  },
                  this.styles.button,
                  ]}
                >
                  <Text style={[{ fontSize: 18, color: '#ffffff' }, confirmFont, this.styles.confirmText]}>
                    {confirmText}
                  </Text>
                </View>
              </Touchable>
            </View>
          </View>
        </Modal>
        <TouchableWithoutFeedback onPress={this._toggleSelector}>
          <View
            style={[{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
            }, this.styles.selectToggle]}
          >
            <Text
              numberOfLines={1}
              style={[{
                flex: 1,
                fontSize: 16,
                color: colors.selectToggleTextColor,
              }, this.styles.selectToggleText]}
            >
              {this._getSelectLabel()}
            </Text>
            {selectToggleIconComponent ?
              selectToggleIconComponent
              :
              <Icon
                size={24}
                name="keyboard-arrow-down"
                style={{ color: colors.selectToggleTextColor }}
              />}
          </View>
        </TouchableWithoutFeedback>

        {
          selectedItems.length > 0 && !single && showChips ?
            <View
              style={{
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'flex-start',
                flexDirection: 'row',
              }}
            >
              {selectedItems.length > 1 && showRemoveAll ?
                <View
                  style={[{
                  overflow: 'hidden',
                  justifyContent: 'center',
                  height: 34,
                  borderColor: colors.chipColor,
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingLeft: 10,
                  margin: 3,
                  paddingTop: 0,
                  paddingRight: 10,
                  paddingBottom: 0,
                  borderRadius: 20,
                  borderWidth: 1,
                  }, this.styles.chipContainer]}
                >
                  <TouchableOpacity
                    onPress={() => { this._removeAllItems() }}
                    style={{
                      borderTopRightRadius: 20,
                      borderBottomRightRadius: 20,
                    }}
                  >
                    <Text
                      style={[
                        {
                          color: colors.chipColor,
                          fontSize: 13,
                          marginRight: 0,
                        },
                      this.styles.chipText]}
                    >
                      {removeAllText}
                    </Text>
                  </TouchableOpacity>
                </View>
              :
              null
            }
              {this._displaySelectedItems()}
            </View>
            :
            null
        }
      </View>
    )
  }
}


export default SectionedMultiSelect