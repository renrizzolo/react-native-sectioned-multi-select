import * as React from 'react'
import * as ReactNative from 'react-native'

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

export interface SectionedMultiSelectProps<ItemType> {
  single?: boolean
  selectedItems?: any[]
  items?: ItemType[]
  displayKey?: string
  uniqueKey: string
  subKey?: string
  onSelectedItemsChange: (items: ItemType[]) => void
  showDropDowns?: boolean
  showChips?: boolean
  readOnlyHeadings?: boolean
  selectText?: string
  selectedText?: string | (() => void)
  renderSelectText?: (props: object) => void
  confirmText?: string
  hideConfirm?: boolean
  styles?: Styles
  colors?: {
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
  searchPlaceholderText?: string
  noResultsComponent?: (() => void) | JSX.Element
  loadingComponent?: (() => void) | JSX.Element
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
  footerComponent?: (() => void) | JSX.Element
  stickyFooterComponent?: (() => void) | JSX.Element
  selectToggleIconComponent?: (() => void) | JSX.Element
  cancelIconComponent?: (() => void) | JSX.Element
  searchIconComponent?: (() => void) | JSX.Element
  selectedIconComponent?: (() => void) | JSX.Element
  unselectedIconComponent?: (() => void) | JSX.Element
  dropDownToggleIconUpComponent?: (() => void) | JSX.Element
  dropDownToggleIconDownComponent?: (() => void) | JSX.Element
  chipRemoveIconComponent?: (() => void) | JSX.Element
  selectChildren?: boolean
  highlightChildren?: boolean
  onSelectedItemObjectsChange?: (items: ItemType[]) => void
  itemNumberOfLines?: number
  selectLabelNumberOfLines?: number
  showCancelButton?: boolean
  hideSelect?: boolean
  onConfirm?: () => void
  onCancel?: () => void
  headerComponent?: (() => void) | JSX.Element
  alwaysShowSelectText?: boolean
  searchAdornment?: (searchText: string) => void
  expandDropDowns?: boolean
  animateDropDowns?: boolean
  customLayoutAnimation?: object
  filterItems?: (searchTerm: string) => void
  onToggleSelector?: (selected: boolean) => void
  noItemsComponent?: (() => void) | JSX.Element
  customChipsRenderer?: (chipProperties: object) => void
  chipsPosition?: 'top' | 'bottom'
  autoFocus?: boolean
  iconKey?: string
  disabled?: boolean
  selectedIconOnLeft?: boolean
  parentChipsRemoveChildren?: boolean
  IconRenderer?: (() => void) | JSX.Element
  itemsFlatListProps?: Omit<ReactNative.FlatListProps<T>, 'data' | 'renderItem'>
  subItemsFlatListProps?: Omit<
    ReactNative.FlatListProps<T>,
    'data' | 'renderItem'
  >
  icons: {
    search: {
      name: string
      size: number
    }
    arrowUp: {
      name: string
      size: number
    }
    arrowDown: {
      name: string
      size: number
    }
    close: {
      name: string
      size: number
    }
    check: {
      name: string
      size: number
    }
    cancel: {
      name: string
      size: number
    }
  }
}
export default class SectionedMultiSelect<ItemType> extends React.Component<
  SectionedMultiSelectProps<ItemType>
> {
  _toggleSelector: () => void
}
