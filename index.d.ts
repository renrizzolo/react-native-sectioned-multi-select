import * as React from 'react'
import * as ReactNative from 'react-native'

type IconProps = {
  name: string
  size?: number
  [x: string]: any
}

// style keys
export interface Styles {
  modalContainer?: ReactNative.StyleProp<ReactNative.ViewStyle>
  modalWrapper?: ReactNative.StyleProp<ReactNative.ViewStyle>
  selectToggle?: ReactNative.StyleProp<ReactNative.ViewStyle>
  selectToggleText?: ReactNative.StyleProp<ReactNative.TextStyle>
  item?: ReactNative.StyleProp<ReactNative.ViewStyle>
  itemWrapper?: ReactNative.StyleProp<ReactNative.ViewStyle>
  subItem?: ReactNative.StyleProp<ReactNative.ViewStyle>
  itemTextContainer?: ReactNative.StyleProp<ReactNative.TextStyle>
  itemText?: ReactNative.StyleProp<ReactNative.TextStyle>
  itemIcon?: ReactNative.StyleProp<ReactNative.ViewStyle>
  itemIconSelected?: ReactNative.StyleProp<ReactNative.ViewStyle>
  selectedIcon: ?ReactNative.StyleProp<ReactNative.ViewStyle>
  selectedItemText?: ReactNative.StyleProp<ReactNative.TextStyle>
  selectedSubItemText?: ReactNative.StyleProp<ReactNative.TextStyle>
  subItemText?: ReactNative.StyleProp<ReactNative.TextStyle>
  subItemTextContainer?: ReactNative.StyleProp<ReactNative.TextStyle>
  highlightedItem?: ReactNative.StyleProp<ReactNative.ViewStyle>
  highlightedSubItem?: ReactNative.StyleProp<ReactNative.ViewStyle>
  searchBar?: ReactNative.StyleProp<ReactNative.ViewStyle>
  center?: ReactNative.StyleProp<ReactNative.ViewStyle>
  separator?: ReactNative.StyleProp<ReactNative.ViewStyle>
  subSeparator?: ReactNative.StyleProp<ReactNative.ViewStyle>
  chipsWrapper?: ReactNative.StyleProp<ReactNative.ViewStyle>
  chipContainer?: ReactNative.StyleProp<ReactNative.ViewStyle>
  chipText?: ReactNative.StyleProp<ReactNative.TextStyle>
  chipIcon?: ReactNative.StyleProp<ReactNative.ViewStyle>
  removeAllChipText?: ReactNative.StyleProp<ReactNative.TextStyle>
  removeAllChipTouchable?: ReactNative.StyleProp<ReactNative.ViewStyle>
  chipIconTouchable?: ReactNative.StyleProp<ReactNative.ViewStyle>
  searchTextInput?: ReactNative.StyleProp<ReactNative.TextStyle>
  itemsWrapper?: ReactNative.StyleProp<ReactNative.ViewStyle>
  button?: ReactNative.StyleProp<ReactNative.ViewStyle>
  cancelButton?: ReactNative.StyleProp<ReactNative.ViewStyle>
  confirmText?: ReactNative.StyleProp<ReactNative.TextStyle>
  toggleIcon?: ReactNative.StyleProp<ReactNative.ViewStyle>
  selectedItem?: ReactNative.StyleProp<ReactNative.ViewStyle>
  selectedSubItem?: ReactNative.StyleProp<ReactNative.ViewStyle>
}
// colors
export interface Colors {
  primary?: string
  success?: string
  cancel?: string
  light?: string
  text?: string
  subText?: string
  selectToggleText?: string
  searchPlaceholderText?: string
  searchSelection?: string
  chip?: string
  itemBackground?: string
  subItemBackground?: string
  disabled?: string
}

// replaceable components
export interface Components {
  Items?: (() => void) | JSX.Element
  SubItemSeparator?: (() => void) | JSX.Element
  ItemSeparator?: (() => void) | JSX.Element
  ItemsFooter?: (() => void) | JSX.Element
  ModalFooter?: (() => void) | JSX.Element
  ModalHeader?: (() => void) | JSX.Element
  SelectToggleIcon?: (() => void) | JSX.Element
  CancelIcon?: (() => void) | JSX.Element
  SearchIcon?: (() => void) | JSX.Element
  SelectedIcon?: (() => void) | JSX.Element
  UnselectedIcon?: (() => void) | JSX.Element
  DropDownToggleIconUp?: (() => void) | JSX.Element
  DropDownToggleIconDown?: (() => void) | JSX.Element
  ChipRemoveIcon?: (() => void) | JSX.Element
  RowItem?: (() => void) | JSX.Element
  RowSubItem?: (() => void) | JSX.Element
  ItemIcon?: (() => void) | JSX.Element
  Selector?: (() => void) | JSX.Element
  Search?: (() => void) | JSX.Element
  Chip?: (() => void) | JSX.Element
  Chips?: (() => void) | JSX.Element
  NoResults?: (() => void) | JSX.Element
  NoItems?: (() => void) | JSX.Element
  Loading?: (() => void) | JSX.Element
  SelectModal?: (() => void) | JSX.Element
  ModalControls?: (() => void) | JSX.Element
  SelectVisibilityWrapper?: (() => void) | JSX.Element
}

// all props
export interface SectionedMultiSelectProps<ItemType> {
  single?: boolean
  singleShouldSubmit?: boolean
  singleShowsChip?: boolean
  selectedItems?: any[]
  items: ItemType[]
  displayKey?: string
  uniqueKey: string
  subKey?: string
  childItemId: () => void
  itemId: () => void
  iconNames?: {
    close: string
    cancel: string
    search: string
    checkMark: string
    arrowDown: string
    arrowUp: string
  }
  onSelectedItemsChange?: (
    action: object
  ) => (getState: () => void, dispatch: () => void) => void
  showDropDowns?: boolean
  showChips?: boolean
  readOnlyHeadings?: boolean
  selectText?: string
  selectedText?: string | (() => void)
  renderSelectText?: (props: object) => void
  confirmText?: string
  hideConfirm?: boolean
  styles?: Styles
  colors?: Colors
  components?: Components
  searchPlaceholderText?: string
  loading?: boolean
  subItemFontFamily?: object
  itemFontFamily?: object
  searchTextFontFamily?: object
  confirmFontFamily?: object
  showRemoveAll?: boolean
  removeAllText?: string
  modalProps?: ReactNative.ModalProps
  modalWithSafeAreaView?: boolean
  modalWithTouchable?: boolean
  hideSearch?: boolean
  parentsToggleChildren?: boolean
  parentsToggleChildrenOnly?: boolean
  parentsHighlightChildren?: boolean
  onSelectedItemObjectsChange?: () => void
  itemNumberOfLines?: number
  selectLabelNumberOfLines?: number
  showCancelButton?: boolean
  hideSelect?: boolean
  onConfirm?: () => void
  onCancel?: () => void
  alwaysShowSelectText?: boolean
  searchAdornment?: (searchText: string) => void
  expandDropDowns?: boolean
  animateDropDowns?: boolean
  customLayoutAnimation?: object
  filterItems?: (searchTerm: string) => void
  onToggleSelect?: (selected: boolean) => void
  chipsPosition?: 'top' | 'bottom'
  autoFocus?: boolean
  iconKey?: string
  disabled?: boolean
  selectedIconPosition?: 'left' | 'right'
  itemIconPosition?: 'left' | 'right'
  parentChipsRemoveChildren?: boolean
  iconRenderer?: (() => void) | JSX.Element
  itemsFlatListProps?: Omit<ReactNative.FlatListProps<T>, 'data' | 'renderItem'>
  subItemsFlatListProps?: Omit<
    ReactNative.FlatListProps<T>,
    'data' | 'renderItem'
  >

  icons?: Partial<{
    search: IconProps
    arrowUp: IconProps
    arrowDown: IconProps
    close: IconProps
    check: IconProps
    cancel: IconProps
  }>
}

export default class SectionedMultiSelect<ItemType> extends React.Component<
  SectionedMultiSelectProps<ItemType>
> {}

// props + helper functions + state
export interface UseSMSContext extends SectionedMultiSelectProps<ItemType> {
  _toggleSelector: () => void
  _removeAllItems: () => void
  _removeItem: (item: ItemType) => void
  _selectAllItems: () => void
  _findItem: (id: string | number) => ItemType | object | undefined
  _itemSelected: (item: ItemType) => boolean
  _toggleSelect: () => void
  _toggleChildren: () => void
  _closeSelect: () => void
  _submitSelection: () => void
  _cancelSelection: () => void
  _getSearchTerm: () => void
  _toggleItem: () => void
  _filterItems: () => void
  _checkIsParent: () => void
  _renderItemFlatList: () => void
  _renderSeparator: () => void
  _renderFooter: () => void
  getModalProps: () => void
  setSearchTerm: () => void
  Icon: (() => void) | JSX.Element
  selectedItems: any[]
  searchTerm: string
  selectIsVisible: boolean
  renderItems: []
}

export function useSMSContext(): UseSMSContext

export interface UseSectionedMultiSelect extends UseSMSContext {}

export function useSectionedMultiSelect({}: SectionedMultiSelectProps<
  ItemType
>): UseSectionedMultiSelect
