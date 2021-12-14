import * as React from 'react'
import * as ReactNative from 'react-native'

type IconProps = {
  name: string
  size?: number
  [x: string]: any
}

export interface Styles {
  container?: ReactNative.StyleProp<ReactNative.ViewStyle>
  modalWrapper?: ReactNative.StyleProp<ReactNative.ViewStyle>
  selectToggle?: ReactNative.StyleProp<ReactNative.ViewStyle>
  selectToggleText?: ReactNative.StyleProp<ReactNative.TextStyle>
  item?: ReactNative.StyleProp<ReactNative.ViewStyle>
  subItem?: ReactNative.StyleProp<ReactNative.ViewStyle>
  itemText?: ReactNative.StyleProp<ReactNative.TextStyle>
  selectedItemText?: ReactNative.StyleProp<ReactNative.TextStyle>
  selectedSubItemText?: ReactNative.StyleProp<ReactNative.TextStyle>
  subItemText?: ReactNative.StyleProp<ReactNative.TextStyle>
  searchBar?: ReactNative.StyleProp<ReactNative.ViewStyle>
  center?: ReactNative.StyleProp<ReactNative.ViewStyle>
  separator?: ReactNative.StyleProp<ReactNative.ViewStyle>
  subSeparator?: ReactNative.StyleProp<ReactNative.ViewStyle>
  chipsWrapper?: ReactNative.StyleProp<ReactNative.ViewStyle>
  chipContainer?: ReactNative.StyleProp<ReactNative.ViewStyle>
  chipText?: ReactNative.StyleProp<ReactNative.TextStyle>
  chipIcon?: ReactNative.StyleProp<ReactNative.ViewStyle>
  searchTextInput?: ReactNative.StyleProp<ReactNative.TextStyle>
  scrollView?: ReactNative.StyleProp<ReactNative.ViewStyle>
  button?: ReactNative.StyleProp<ReactNative.ViewStyle>
  cancelButton?: ReactNative.StyleProp<ReactNative.ViewStyle>
  confirmText?: ReactNative.StyleProp<ReactNative.TextStyle>
  toggleIcon?: ReactNative.StyleProp<ReactNative.ViewStyle>
  selectedItem?: ReactNative.StyleProp<ReactNative.ViewStyle>
  selectedSubItem?: ReactNative.StyleProp<ReactNative.ViewStyle>
  backdrop?: ReactNative.StyleProp<ReactNative.ViewStyle>
  listContainer?: ReactNative.StyleProp<ReactNative.ViewStyle>
}

export interface Colors {
  primary?: string
  success?: string
  cancel?: string
  text?: string
  subText?: string
  selectToggleTextColor?: string
  searchPlaceholderTextColor?: string
  searchSelectionColor?: string
  chipColor?: string
  itemBackground?: string
  subItemBackground?: string
  disabled?: string
}

export interface SectionedMultiSelectProps<ItemType> {
  single?: boolean
  selectedItems?: any[]
  items?: ItemType[]
  displayKey?: string
  uniqueKey: string
  subKey?: string
  onSelectedItemsChange: (items: any[]) => void
  showDropDowns?: boolean
  showChips?: boolean
  readOnlyHeadings?: boolean
  selectText?: string
  selectedText?: string | (() => void)
  renderSelectText?: (props: this) => void
  confirmText?: string
  hideConfirm?: boolean
  styles?: Styles
  colors?: Colors
  searchPlaceholderText?: string
  noResultsComponent?: React.ReactNode
  loadingComponent?: React.ReactNode
  loading?: boolean
  subItemFontFamily?: object
  itemFontFamily?: object
  searchTextFontFamily?: object
  confirmFontFamily?: object
  showRemoveAll?: boolean
  removeAllText?: string
  modalSupportedOrientations?: ReactNative.ModalProps['supportedOrientations']
  modalAnimationType?: string
  modalWithSafeAreaView?: boolean
  modalWithTouchable?: boolean
  hideSearch?: boolean
  footerComponent?: React.ReactNode
  stickyFooterComponent?: React.ReactNode
  selectToggleIconComponent?: React.ReactNode
  cancelIconComponent?: React.ReactNode
  searchIconComponent?: React.ReactNode
  selectedIconComponent?: React.ReactNode
  unselectedIconComponent?: React.ReactNode
  dropDownToggleIconUpComponent?: React.ReactNode
  dropDownToggleIconDownComponent?: React.ReactNode
  chipRemoveIconComponent?: React.ReactNode
  selectChildren?: boolean
  highlightChildren?: boolean
  onSelectedItemObjectsChange?: (items: ItemType[]) => void
  itemNumberOfLines?: number
  selectLabelNumberOfLines?: number
  showCancelButton?: boolean
  hideSelect?: boolean
  onConfirm?: () => void
  onCancel?: () => void
  headerComponent?: React.ReactNode
  alwaysShowSelectText?: boolean
  searchAdornment?: (searchText: string) => void
  expandDropDowns?: boolean
  animateDropDowns?: boolean
  customLayoutAnimation?: object
  onChangeSearchText?: (searchTerm: string) => void
  filterItems?: (searchTerm: string) => void
  onToggleSelector?: (selected: boolean) => void
  noItemsComponent?: React.ReactNode
  customChipsRenderer?: (chipProperties: {
    colors: Colors
    displayKey: string
    items: ItemType[]
    selectedItems: any[]
    styles: Styles
    subKey: string
    uniqueKey: string
  }) => void
  chipsPosition?: 'top' | 'bottom'
  autoFocus?: boolean
  iconKey?: string
  disabled?: boolean
  selectedIconOnLeft?: boolean
  parentChipsRemoveChildren?: boolean
  hideChipRemove?: boolean
  IconRenderer: React.ReactNode
  itemsFlatListProps?: Omit<
    ReactNative.FlatListProps<ItemType>,
    'data' | 'renderItem'
  >
  subItemsFlatListProps?: Omit<
    ReactNative.FlatListProps<ItemType>,
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
> {
  _toggleSelector: () => void
  _removeAllItems: () => void
  _removeItem: (item: ItemType) => void
  _selectAllItems: () => void
  _findItem: (id: any) => ItemType | undefined
  _itemSelected: (item: ItemType) => boolean
  _getSearchTerm: () => string
  _submitSelection: () => void
  _cancelSelection: () => void
}
