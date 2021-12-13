import { PropTypes } from 'prop-types'
import * as React from 'react'

import { StyleSheet, Platform, ScrollView } from 'react-native'
import SMSContext from './context/SMSContext'
import { useSectionedMultiSelect } from './useSectionedMultiSelect'

const defaultFont = {
  fontFamily: Platform.OS === 'android' ? 'normal' : 'Avenir',
}

export const defaultStyles = {
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: ({ colors }) => ({
    overflow: 'hidden',
    marginHorizontal: 18,
    marginVertical: 26,
    borderRadius: 6,
    alignSelf: 'stretch',
    flex: 1,
    backgroundColor: 'white',
  }),
  modalWrapper: ({ colors }) => ({
    flex: 1,
  }),
  backdrop: ({ colors }) => ({
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 0,
  }),
  selectToggle: ({ selectIsVisible }) => ({
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    backgroundColor: '#dadada',
  }),
  selectToggleText: ({ selectIsVisible, colors }) => ({
    flex: 1,
    fontSize: 16,
    color: colors.selectToggleText,
    fontWeight: '200',
  }),
  itemWrapper: ({ colors }) => ({
    flexDirection: 'row',
    flex: 1,
  }),
  item: ({ itemSelected }) => ({
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 9,
  }),
  subItem: ({ itemSelected, itemHighlighted }) => ({
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 9,
  }),
  itemText: ({ colors, item }) => ({
    fontSize: 17,
    flex: 1,
    color: item.disabled ? colors.disabled : colors.text,
    ...defaultFont,
    fontWeight: 'bold',
  }),
  descriptionText: ({ item, colors }) => ({
    flex: 1,
    fontSize: 12,
    color: item.disabled ? colors.disabled : colors.subText,
    ...defaultFont,
  }),
  itemIcon: ({ itemSelected }) => ({
    marginHorizontal: 5,
  }),
  itemIconSelected: ({ colors }) => ({}),
  subItemText: ({ colors, itemSelected, itemHighlighted, subItem }) => ({
    fontSize: 15,
    flex: 1,
    color: subItem.disabled ? colors.disabled : colors.subText,
  }),
  itemTextContainer: ({ itemSelected }) => ({
    flex: 1,
  }),
  subItemTextContainer: ({ itemSelected, itemHighlighted }) => ({
    flex: 1,
  }),
  selectedItem: ({ colors }) => ({}),
  selectedSubItem: ({ colors }) => ({}),
  selectedItemText: ({ colors }) => ({}),
  selectedSubItemText: ({ colors }) => ({}),
  selectedIcon: ({ highlighted, colors }) => ({
    fontSize: 16,
    color: highlighted ? colors.disabled : colors.success,
    paddingLeft: 10,
  }),
  searchBar: ({ searchTerm, colors }) => ({
    backgroundColor: '#f8f8f8',
    flexDirection: 'row',
    paddingVertical: 5,
  }),
  separator: ({ colors }) => ({}),
  subSeparator: ({ colors }) => ({}),
  removeAllChipTouchable: ({ colors }) => ({}),
  removeAllChipText: ({ colors }) => ({
    color: colors.chip,
    fontSize: 13,
    marginRight: 0,
  }),
  chipsWrapper: ({ colors }) => ({
    marginVertical: 10,
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
  }),
  chipContainer: ({ colors, hideChipRemove, isParent }) => ({
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    height: 28,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    margin: 4,
    borderColor: colors.chip,
    // paddingRight: hideChipRemove ? 10 : 0,
  }),
  chipText: ({ colors, isParent }) => ({
    textAlignVertical: 'center',
    color: colors.chip,
    lineHeight: 13,
    fontSize: 13,
    marginRight: 0,
  }),

  chipIconTouchable: ({ colors }) => ({
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  }),
  chipIcon: ({ colors }) => ({
    color: colors.chip,
    fontSize: 16,
    marginLeft: 6,
    marginVertical: 5,
  }),
  searchTextInput: ({ searchTerm, resultsCount, colors }) => ({
    flex: 1,
    fontSize: 17,
    paddingVertical: 8,
    fontWeight: '200',
    color: resultsCount < 1 ? 'crimson' : 'black',
    ...defaultFont,
  }),
  itemsWrapper: ({}) => ({
    paddingHorizontal: 12,
    flex: 1,
    ...(Platform.OS === 'web' && { overflowY: 'auto' }),
  }),
  submitButton: ({ colors }) => ({
    flex: Platform.OS !== 'ios' ? 1 : 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 0,
    flexDirection: 'row',
    backgroundColor: colors.primary,
  }),
  cancelButton: ({ colors }) => ({
    width: 54,
    flex: Platform.OS === 'ios' ? 0 : 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 0,
    flexDirection: 'row',
    backgroundColor: colors.cancel,
  }),
  confirmText: ({ colors }) => ({
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
    ...defaultFont,
  }),
  dropDownToggleIconWrapper: ({ colors, isOpen }) => ({
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: 10,
    // backgroundColor: 'transparent',
  }),
  dropDownToggleIcon: ({ colors, isOpen }) => ({}),
}

export const defaultColors = {
  primary: '#3f51b5',
  success: '#4caf50',
  cancel: '#1A1A1A',
  light: '#ffffff',
  text: '#2e2e2e',
  subText: '#848787',
  selectToggleText: '#333',
  searchPlaceholderText: '#999',
  searchSelection: 'rgba(0,0,0,0.2)',
  searchIcon: '#3f51b5',
  chip: '#848787',
  itemBackground: '#fff',
  subItemBackground: '#ffffff',
  disabled: '#d7d7d7',
}

const SectionedMultiSelect = (props) => {
  const SMSState = useSectionedMultiSelect(props)

  const { chipsPosition } = props
  const {
    SelectModal,
    ModalHeader,
    Search,
    Items,
    ModalControls,
    ModalFooter,
    Selector,
    Chips,
  } = SMSState.components
  //either return a default layout or just the context/children
  return props.children ? (
    <SMSContext.Provider value={SMSState}>
      {props.children(SMSState)}
    </SMSContext.Provider>
  ) : (
    <SMSContext.Provider value={SMSState}>
      <ScrollView>
        <SelectModal>
          <ModalHeader />
          <Search />
          <Items />
          <ModalControls />
          <ModalFooter />
        </SelectModal>
        {chipsPosition === 'top' && <Chips />}
        <Selector />
        {chipsPosition === 'bottom' && <Chips />}
      </ScrollView>
    </SMSContext.Provider>
  )
}

export default SectionedMultiSelect

const SMSPropTypes = {
  single: PropTypes.bool,
  singleShouldSubmit: PropTypes.bool,
  singleShowsChip: PropTypes.bool,
  initialSelectedItems: PropTypes.array,
  items: PropTypes.array.isRequired,
  itemId: PropTypes.func.isRequired,
  childItemId: PropTypes.func.isRequired,
  getChildren: PropTypes.func.isRequired,
  displayKey: PropTypes.string.isRequired,
  subKey: PropTypes.string.isRequired,
  iconNames: PropTypes.object,
  onSelectedItemsChange: PropTypes.func,
  showDropDowns: PropTypes.bool,
  showChips: PropTypes.bool,
  readOnlyHeadings: PropTypes.bool,
  selectText: PropTypes.string,
  selectedText: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  renderSelectText: PropTypes.func,
  confirmText: PropTypes.string,
  hideConfirm: PropTypes.bool,
  styles: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  colors: PropTypes.shape({
    primary: PropTypes.string,
    success: PropTypes.string,
    cancel: PropTypes.string,
    light: PropTypes.string,
    text: PropTypes.string,
    subText: PropTypes.string,
    selectToggleText: PropTypes.string,
    searchPlaceholderText: PropTypes.string,
    searchSelection: PropTypes.string,
    chip: PropTypes.string,
    itemBackground: PropTypes.string,
    subItemBackground: PropTypes.string,
    disabled: PropTypes.string,
  }),
  searchPlaceholderText: PropTypes.string,
  loading: PropTypes.bool,
  subItemFontFamily: PropTypes.object,
  itemFontFamily: PropTypes.object,
  searchTextFontFamily: PropTypes.object,
  confirmFontFamily: PropTypes.object,
  showRemoveAll: PropTypes.bool,
  removeAllText: PropTypes.string,
  modalSupportedOrientations: PropTypes.arrayOf(PropTypes.string),
  modalAnimationType: PropTypes.string,
  modalWithSafeAreaView: PropTypes.bool,
  modalWithTouchable: PropTypes.bool,
  modalComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  hideSearch: PropTypes.bool,
  parentsToggleChildren: PropTypes.bool,
  parentsToggleChildrenOnly: PropTypes.bool,
  parentsHighlightChildren: PropTypes.bool,
  onSelectedItemObjectsChange: PropTypes.func,
  itemNumberOfLines: PropTypes.number,
  selectLabelNumberOfLines: PropTypes.number,
  showCancelButton: PropTypes.bool,
  hideSelect: PropTypes.bool,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  alwaysShowSelectText: PropTypes.bool,
  searchAdornment: PropTypes.func,
  expandDropDowns: PropTypes.bool,
  animateDropDowns: PropTypes.bool,
  customLayoutAnimation: PropTypes.object,
  filterItems: PropTypes.func,
  onToggleSelect: PropTypes.func,
  chipsPosition: PropTypes.oneOf(['top', 'bottom']),
  hideChipRemove: PropTypes.bool,
  autoFocus: PropTypes.bool,
  iconKey: PropTypes.string,
  disabled: PropTypes.bool,
  selectedIconPosition: PropTypes.oneOf(['left', 'right']),
  itemIconPosition: PropTypes.oneOf(['left', 'right']),
  iconRenderer: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  itemsFlatListProps: PropTypes.object,
  subItemsFlatListProps: PropTypes.object,
}

export const SMSDefaultProps = {
  single: false,
  singleShouldSubmit: true,
  singleShowsChip: false,
  initialSelectedItems: [],
  itemId: (item) => `parent-${item.id}`,
  childItemId: (item) => `child-${item.id}`,
  getChildren: (item) => item.children && item.children,
  displayKey: 'name',
  iconNames: {
    close: 'close',
    checkMark: 'check',
    cancel: 'cancel',
    arrowDown: 'keyboard-arrow-down',
    arrowUp: 'keyboard-arrow-up',
    search: 'search',
  },
  showDropDowns: true,
  showChips: true,
  readOnlyHeadings: false,
  selectText: 'Select',
  selectedText: 'selected',
  confirmText: 'Confirm',
  hideConfirm: false,
  searchPlaceholderText: 'Search categories...',
  loading: false,
  styles: {},
  colors: {},
  removeAllText: 'Remove all',
  showRemoveAll: false,
  modalProps: {
    modalSupportedOrientations: ['portrait', 'landscape'],
    modalAnimationType: 'fade',
  },
  modalWithSafeAreaView: false,
  modalWithTouchable: false,
  hideSearch: false,
  parentsToggleChildren: false,
  parentsToggleChildrenOnly: false,
  parentsHighlightChildren: false,
  itemNumberOfLines: null,
  selectLabelNumberOfLines: 1,
  showCancelButton: false,
  hideSelect: false,
  alwaysShowSelectText: false,
  expandDropDowns: false,
  animateDropDowns: true,
  filterItems: null,
  chipsPosition: 'bottom',
  hideChipRemove: false,
  autoFocus: false,
  disabled: false,
  selectedIconPosition: 'right',
  itemIconPosition: 'left',
  itemsFlatListProps: {},
  subItemsFlatListProps: {},
}

SectionedMultiSelect.defaultProps = SMSDefaultProps
SectionedMultiSelect.propTypes = SMSPropTypes
