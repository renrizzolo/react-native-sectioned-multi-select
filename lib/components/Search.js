import * as React from 'react'
import { View, TextInput } from 'react-native'
import { callIfFunction } from '../helpers'
import { useSMSContext } from '../../'

const Search = ({
  searchAdornment: searchAdornmentFromProps,
  styles: stylesFromProps = {},
}) => {
  const {
    hideSearch,
    components,
    searchPlaceholderText,
    searchTextFont,
    searchAdornment,
    autoFocus,
    searchTerm,
    setSearchTerm,
    _submitSelection,
    colors,
    getStyles,
    styles,
    renderItems,
  } = useSMSContext()
  const searchStyleParams = { searchTerm, resultsCount: renderItems.length }
  const searchBarStyles = React.useMemo(
    () => getStyles('searchBar', searchStyleParams, stylesFromProps),
    [
      stylesFromProps.searchBar,
      styles.searchBar,
      searchTerm,
      renderItems.length,
    ]
  )
  const searchTextInputStyles = React.useMemo(
    () => getStyles('searchTextInput', searchStyleParams, stylesFromProps),
    [
      stylesFromProps.searchTextInput,
      styles.searchTextInput,
      searchTerm,
      renderItems.length,
    ]
  )

  const adornment = searchAdornmentFromProps
    ? searchAdornmentFromProps
    : searchAdornment
  return !hideSearch ? (
    <View style={searchBarStyles}>
      <View style={styles.center}>
        <components.SearchIcon />
      </View>
      <TextInput
        clearButtonMode="while-editing"
        value={searchTerm}
        selectionColor={colors.searchSelection}
        onChangeText={(searchTerm) => setSearchTerm(searchTerm)}
        placeholder={searchPlaceholderText}
        autoFocus={autoFocus}
        selectTextOnFocus
        placeholderTextColor={colors.searchPlaceholderText}
        underlineColorAndroid="transparent"
        style={searchTextInputStyles}
      />
      {adornment && adornment(searchTerm, setSearchTerm, _submitSelection)}
    </View>
  ) : null
}

export default Search
