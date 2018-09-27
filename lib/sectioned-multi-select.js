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
  Platform,
  Modal,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native'
import { isEqual } from 'lodash'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { RowItem } from './components'
const Touchable = Platform.OS === 'android' ? TouchableNativeFeedback : TouchableOpacity

const defaultStyles = {
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
  selectedItemText: {
  },
  selectedSubItemText: {
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
  cancelButton: {

  },
  confirmText: {

  },
  toggleIcon: {

  },
  selectedItem: {

  },
}


const defaultColors = {
  primary: '#3f51b5',
  success: '#4caf50',
  cancel: '#1A1A1A',
  text: '#2e2e2e',
  subText: '#848787',
  selectToggleTextColor: '#333',
  searchPlaceholderTextColor: '#999',
  searchSelectionColor: 'rgba(0,0,0,0.2)',
  chipColor: '#848787',
  itemBackground: '#fff',
  subItemBackground: '#ffffff',
  disabled: '#d7d7d7',
}

const ComponentContainer = ({ children }) => (
  <View style={{ marginTop: 20, alignItems: 'center', justifyContent: 'center' }}>
    {children}
  </View>
)

const noResults = (
  <ComponentContainer>
    <Text>Sorry, no results</Text>
  </ComponentContainer>
)

const noItems = (
  <ComponentContainer>
    <Text>Sorry, no items</Text>
  </ComponentContainer>
)

const loadingComp = (
  <ComponentContainer>
    <ActivityIndicator />
  </ComponentContainer>
)

// let date = new Date()
class SectionedMultiSelect extends PureComponent {
  static propTypes = {
    single: PropTypes.bool,
    selectedItems: PropTypes.array,
    items: PropTypes.array,
    displayKey: PropTypes.string,
    uniqueKey: PropTypes.string.isRequired,
    subKey: PropTypes.string,
    onSelectedItemsChange: PropTypes.func.isRequired,
    showDropDowns: PropTypes.bool,
    showChips: PropTypes.bool,
    readOnlyHeadings: PropTypes.bool,
    selectText: PropTypes.string,
    selectedText: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func,
    ]),
    renderSelectText: PropTypes.func,
    confirmText: PropTypes.string,
    styles: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object,
    ]),
    colors: PropTypes.objectOf(PropTypes.string),
    searchPlaceholderText: PropTypes.string,
    noResultsComponent: PropTypes.object,
    loadingComponent: PropTypes.object,
    loading: PropTypes.bool,
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
    cancelIconComponent: PropTypes.object,
    searchIconComponent: PropTypes.object,
    selectedIconComponent: PropTypes.object,
    dropDownToggleIconUpComponent: PropTypes.object,
    dropDownToggleIconDownComponent: PropTypes.object,
    chipRemoveIconComponent: PropTypes.object,
    selectChildren: PropTypes.bool,
    highlightChildren: PropTypes.bool,
    onSelectedItemObjectsChange: PropTypes.func,
    itemNumberOfLines: PropTypes.number,
    selectLabelNumberOfLines: PropTypes.number,
    showCancelButton: PropTypes.bool,
    hideSelect: PropTypes.bool,
    onConfirm: PropTypes.func,
    onCancel: PropTypes.func,
    headerComponent: PropTypes.object,
    alwaysShowSelectText: PropTypes.bool,
    searchAdornment: PropTypes.func,
    expandDropDowns: PropTypes.bool,
    animateDropDowns: PropTypes.bool,
    customLayoutAnimation: PropTypes.object,
    filterItems: PropTypes.func,
    onToggleSelector: PropTypes.func,
    noItemsComponent: PropTypes.object,
  }

  static defaultProps = {
    single: false,
    selectedItems: [],
    displayKey: 'name',
    showDropDowns: true,
    showChips: true,
    readOnlyHeadings: false,
    selectText: 'Select',
    selectedText: 'selected',
    confirmText: 'Confirm',
    searchPlaceholderText: 'Search categories...',
    noResultsComponent: noResults,
    loadingComponent: loadingComp,
    loading: false,
    styles: {},
    colors: {},
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
    itemNumberOfLines: null,
    selectLabelNumberOfLines: 1,
    showCancelButton: false,
    hideSelect: false,
    alwaysShowSelectText: false,
    expandDropDowns: false,
    animateDropDowns: true,
    filterItems: null,
    noItemsComponent: noItems,
  }

  constructor(props) {
    super(props)

    this.state = {
      selector: false,
      searchTerm: '',
      highlightedChildren: [],
      styles: StyleSheet.flatten([defaultStyles, props.styles]),
      colors: StyleSheet.flatten([defaultColors, props.colors])
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.styles, nextProps.styles)) {
      this.setState({ styles: StyleSheet.flatten([defaultStyles, nextProps.styles]) })
    }
    if (!isEqual(this.props.colors, nextProps.colors)) {
      this.setState({ colors: StyleSheet.flatten([defaultColors, nextProps.colors]) })
    }
  }

  // componentWillUpdate() { date = new Date();}
  // componentDidUpdate() {console.log(new Date().valueOf() - date.valueOf())}

  getProp = (object, key) => object && object[key]

  rejectProp = (items, fn) => items.filter(fn)

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
      displayKey,
      alwaysShowSelectText,
      renderSelectText,
    } = this.props

    if (renderSelectText) {
      return renderSelectText(this.props)
    }

    if (!single && alwaysShowSelectText) {
      return selectText
    }
    if (!selectedItems || selectedItems.length === 0) {
      return selectText
    } else if (single || selectedItems.length === 1) {
      const item = selectedItems[0]
      const foundItem = this._findItem(item)
      return this.getProp(foundItem, displayKey) || selectText
    }
    return `${selectText} (${selectedItems.length} ${selectedText})`
  }

  _filterItems = (searchTerm) => {
    const {
      items,
      subKey,
      uniqueKey,
      displayKey,
      filterItems,
    } = this.props

    if (filterItems) {
      return filterItems(searchTerm, items, this.props)
    }
    let filteredItems = []
    let newFilteredItems = []

    items && items.forEach((item) => {
      const parts = searchTerm.trim().split(/[[ \][)(\\/?\-:]+/)
      const regex = new RegExp(`(${parts.join('|')})`, 'i')
      if (regex.test(this.getProp(item, displayKey))) {
        filteredItems.push(item)
      }
      if (item[subKey]) {
        const newItem = Object.assign({}, item)
        newItem[subKey] = []
        item[subKey].forEach((sub) => {
          if (regex.test(this.getProp(sub, displayKey))) {
            newItem[subKey] = [...newItem[subKey], sub]
            newFilteredItems = this.rejectProp(filteredItems, singleItem =>
              item[uniqueKey] !== singleItem[uniqueKey])
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

    const newItems = this.rejectProp(selectedItems, singleItem => (
      item[uniqueKey] !== singleItem
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


  // _removeItems = (items) => {
  //   const {
  //     uniqueKey,
  //     selectedItems,
  //     onSelectedItemsChange,
  //     highlightChildren,
  //     onSelectedItemObjectsChange,
  //   } = this.props

  //   const newItems = selectedItems
  //   const filtered = newItems.filter( el => !items.includes( el ) );

  //   if (highlightChildren) {
  //     // wut
  //     items.forEach((item) => {
  //       this._unHighlightChildren(item)
  //     })
  //     filtered.forEach((item) => {
  //       this._highlightChildren(item)
  //     })
  //   }
  //   onSelectedItemObjectsChange && this._broadcastItemObjects(filtered)

  //   // broadcast new selected items state to parent component
  //   onSelectedItemsChange(filtered)
  // }

  _toggleSelector = () => {
    const { onToggleSelector } = this.props
    const newState = !this.state.selector
    this.setState({
      selector: newState,
    })
    onToggleSelector && onToggleSelector(newState)
  }

  _closeSelector = () => {
    const { onToggleSelector } = this.props
    this.setState({
      selector: false,
      searchTerm: '',
    })
    onToggleSelector && onToggleSelector(false)
  }
  _submitSelection = () => {
    const { onConfirm } = this.props
    this._toggleSelector()
    // reset searchTerm
    this.setState({ searchTerm: '' })
    onConfirm && onConfirm()
  }

  _cancelSelection = () => {
    const { onCancel } = this.props
    // this._removeAllItems()
    this._toggleSelector()
    this.setState({ searchTerm: '' })
    onCancel && onCancel()
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

            newItems = this.rejectProp(newItems, singleItem => (
              item[uniqueKey] !== singleItem
            ))
          } else if (highlightChildren) {
            this._unHighlightChildren(item[uniqueKey])
            newItems = this.rejectProp(selectedItems, singleItem => (
              item[uniqueKey] !== singleItem
            ))
          } else {
            newItems = this.rejectProp(selectedItems, singleItem => (
              item[uniqueKey] !== singleItem
            ))
          }
        } else {
          newItems = this.rejectProp(selectedItems, singleItem => (
            item[uniqueKey] !== singleItem
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
    if (!items) return
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
    if (!items) return
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

  _getSearchTerm = () => {
    return this.state.searchTerm
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
      displayKey,
      chipRemoveIconComponent,
    } = this.props
    const { styles, colors } = this.state
    return selectedItems.map((singleSelectedItem) => {
      const item = this._findItem(singleSelectedItem)

      if (!item || !item[displayKey]) return null

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
          }, styles.chipContainer]}
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
              styles.chipText]}
          >
            {item[displayKey]}
          </Text>
          <TouchableOpacity
            onPress={() => { this._removeItem(item) }}
            style={{
              borderTopRightRadius: 20,
              borderBottomRightRadius: 20,
            }}
          >
            {chipRemoveIconComponent ?
              chipRemoveIconComponent
              :
              <Icon
                name="close"
                style={[{
                  color: colors.chipColor,
                  fontSize: 16,
                  marginHorizontal: 6,
                  marginVertical: 7,
                }, styles.chipIcon]}
              />}
          </TouchableOpacity>
        </View>
      )
    })
  }

  _renderSeparator = () => (
    <View
      style={[{
        flex: 1,
        height: StyleSheet.hairlineWidth,
        alignSelf: 'stretch',
        backgroundColor: '#dadada',
      }, this.state.styles.separator]}
    />
  )


  _renderFooter = () => {
    const { footerComponent } = this.props
    return (
      <View>
        {footerComponent && footerComponent}
      </View>
    )
  }

  _renderItemFlatList = ({ item }) => {
    const { styles, colors } = this.state

    const { searchTerm } = this.state
    return (
      <View>
        <RowItem
          item={item}
          mergedStyles={styles}
          mergedColors={colors}
          _itemSelected={this._itemSelected}
          searchTerm={searchTerm}
          _toggleItem={this._toggleItem}
          highlightedChildren={this.state.highlightedChildren}
          {...this.props}
        />
      </View>
    )
  }

  // _renderSubItemFlatList = ({ item }) => (
  //   <RowSubItem
  //     item={item}
  //     _toggleItem={this._toggleItem}
  //     _itemSelected={this._itemSelected}
  //     highlightedChildren={this.state.highlightedChildren}
  //     styles={styles}
  //     {...this.props}
  //   />
  // )

  render() {
    const {
      items,
      selectedItems,
      uniqueKey,
      confirmText,
      searchPlaceholderText,
      noResultsComponent,
      loadingComponent,
      loading,
      searchTextFontFamily,
      confirmFontFamily,
      single,
      showChips,
      removeAllText,
      showRemoveAll,
      modalAnimationType,
      modalSupportedOrientations,
      hideSearch,
      selectToggleIconComponent,
      cancelIconComponent,
      searchIconComponent,
      showCancelButton,
      hideSelect,
      headerComponent,
      searchAdornment,
      selectLabelNumberOfLines,
      noItemsComponent
    } = this.props

    const {
      searchTerm,
      selector,
      styles,
      colors,
    } = this.state
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
          onRequestClose={this._closeSelector}
        >
          <View style={[{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }, styles.backdrop]}>
            <View style={[{
              overflow: 'hidden',
              marginHorizontal: 18,
              marginVertical: 26,
              borderRadius: 6,
              alignSelf: 'stretch',
              flex: 1,
              backgroundColor: 'white',
            }, styles.container]}
            >
              {headerComponent && headerComponent}
              {!hideSearch &&
                <View style={[{ flexDirection: 'row', paddingVertical: 5 }, styles.searchBar]}>
                  <View style={styles.center}>
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
                    value={this.state.searchTerm}
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
                    styles.searchTextInput,
                    ]}
                  />
                  {searchAdornment && searchAdornment(searchTerm)}
                </View>
              }

              <ScrollView
                keyboardShouldPersistTaps="always"
                style={[{ paddingHorizontal: 12, flex: 1 }, styles.scrollView]}
              >
                <View>
                  {loading ?
                    loadingComponent
                    :
                    <View>
                      {!renderItems || !renderItems.length && !searchTerm ? noItemsComponent : null}
                      {items && renderItems && renderItems.length ?
                        <View>
                          <FlatList
                            keyboardShouldPersistTaps="always"
                            removeClippedSubviews
                            initialNumToRender={15}
                            data={renderItems}
                            extraData={selectedItems}
                            keyExtractor={item => `${item[uniqueKey]}`}
                            ItemSeparatorComponent={this._renderSeparator}
                            ListFooterComponent={this._renderFooter}
                            renderItem={this._renderItemFlatList}
                          />
                        </View>
                        :
                        searchTerm ? noResultsComponent : null
                      }
                    </View>
                  }
                </View>
              </ScrollView>
              <View style={{ flexDirection: 'row' }}>
                {showCancelButton &&
                  <Touchable
                    accessibilityComponentType="button"
                    onPress={this._cancelSelection}
                  >
                    <View
                      style={[{
                        width: 54,
                        flex: Platform.OS === 'android' ? 0 : 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingVertical: 8,
                        paddingHorizontal: 16,
                        borderRadius: 0,
                        flexDirection: 'row',
                        backgroundColor: colors.cancel,
                      },
                      styles.cancelButton,
                      ]}
                    >
                      {cancelIconComponent ?
                        cancelIconComponent
                        :
                        <Icon
                          size={24}
                          name="cancel"
                          style={{ color: 'white' }}
                        />}
                    </View>
                  </Touchable>
                }
                <Touchable
                  accessibilityComponentType="button"
                  onPress={this._submitSelection}
                  style={{ flex: 1 }}
                >
                  <View
                    style={[{
                      flex: Platform.OS === 'android' ? 1 : 0,
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingVertical: 8,
                      paddingHorizontal: 16,
                      borderRadius: 0,
                      flexDirection: 'row',
                      backgroundColor: colors.primary,
                    },
                    styles.button,
                    ]}
                  >
                    <Text style={[{ fontSize: 18, color: '#ffffff' }, confirmFont, styles.confirmText]}>
                      {confirmText}
                    </Text>
                  </View>
                </Touchable>
              </View>
            </View>
          </View>
        </Modal>
        {!hideSelect &&
          <TouchableWithoutFeedback onPress={this._toggleSelector} disabled={this.state.selector}>
            <View
              style={[{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
              }, styles.selectToggle]}
            >
              <Text
                numberOfLines={selectLabelNumberOfLines}
                style={[{
                  flex: 1,
                  fontSize: 16,
                  color: colors.selectToggleTextColor,
                }, styles.selectToggleText]}
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
        }
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
                  }, styles.chipContainer]}
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
                        styles.chipText]}
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
