import * as React from 'react'
import { View, Text, ActivityIndicator } from 'react-native'

import RowItem from './RowItem'
import RowSubItem from './RowSubItem'
import ItemIcon from './ItemIcon'
import Selector from './Selector'
import Search from './Search'
import Items, { ItemSeparator, SubItemSeparator } from './Items'
import { Chip, Chips } from './Chips'
import { ModalControls, SelectModal } from './SelectModal'
import SelectVisibilityWrapper from './SelectVisibilityWrapper'

export { default as RowItem } from './RowItem'
export { default as RowSubItem } from './RowSubItem'
export { default as ItemIcon } from './ItemIcon'
export { default as Selector } from './Selector'
export { default as Search } from './Search'
export { default as Items, ItemSeparator, SubItemSeparator } from './Items'
export { Chip, Chips } from './Chips'
export { ModalControls, SelectModal } from './SelectModal'
export { default as SelectVisibilityWrapper } from './SelectVisibilityWrapper'

import icons from './icons'
// components for defaults
const ComponentContainer = ({ children, style }) => (
  <View
    style={{
      padding: 20,
      borderRadius: 8,
      backgroundColor: '#f8f8f8',
      alignItems: 'center',
      justifyContent: 'center',
      ...style,
    }}
  >
    {children}
  </View>
)

const NoResults = ({ children, style }) => (
  <ComponentContainer style={style}>
    <Text>Sorry, no results</Text>
    {children}
  </ComponentContainer>
)

const NoItems = ({ children, style }) => (
  <ComponentContainer>
    <Text>Sorry, no items</Text>
  </ComponentContainer>
)

const Loading = ({ children, style }) => (
  <ComponentContainer>
    <ActivityIndicator />
  </ComponentContainer>
)

export const components = {
  RowItem: RowItem,
  RowSubItem: RowSubItem,
  ItemIcon: ItemIcon,
  Selector: Selector,
  Search: Search,
  Items: Items,
  ItemSeparator: ItemSeparator,
  SubItemSeparator: SubItemSeparator,
  Chip: Chip,
  Chips: Chips,
  NoResults: NoResults,
  NoItems: NoItems,
  Loading: Loading,
  SelectModal: SelectModal,
  ModalControls: ModalControls,
  SelectVisibilityWrapper: SelectVisibilityWrapper,
  ModalFooter: () => null,
  ModalHeader: () => null,
  ItemsFooter: () => null,
}

export const defaultComponents = (props) => {
  return {
    ...components,
    ...icons({
      iconRenderer: props.iconRenderer,
      iconNames: props.iconNames,
      getStyles: props.getStyles,
      colors: props.colors,
      styles: props.styles,
    }),
    ...props.components,
  }
}
