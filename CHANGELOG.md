# Changelog

## [Unreleased] - 2018-01-08

### Added
- Custom component for no results
    - `noResultsComponent` - If your items are loaded from an API you could render an Activity Indicator like so: 
    ```
    noResultsComponent={(this.state.items && this.state.items.length) ? noResults : loading}

    ...
    const loading = 
	<View style={styles.center}>
		<ActivityIndicator size={"large"}/>
	</View>;

	const noResults = 
		<View style={styles.center}>
			<Text>Sorry No results.</Text>
		</View>;

    ```
- Custom components for icons 
    - `selectToggleIconComponent` - The icon to the right of the dropdown in its initial state (Default arrow down)
    - `searchIconComponent` - The search input icon (default Magnifying glass)
    - `selectedIconComponent` - The icon to the left of the selected item (default Checkmark)
    - `dropDownToggleIconUpComponent` - The parent dropdown icon in closed state
    - `dropDownToggleIconDownComponent` - The parent dropdown icon in opened state
- Select all child ids when a parent is selected
    - `selectChildren` - boolean
- Highlight (but don't broadcast to state) all child ids when a parent is selected
    - `highlightChildren` - boolean
    
### Removed
- Removed No results text string in favour of a component (object) to allow for more customization.

### Changed
- Moved row item and sub item to separate classes, in order to enhance performance for long lists. Use `shouldComponentUpdate` to not re-render every item on toggle.

### Fixed
- Erroneously used `item.id` instead of `item[uniqueKey]`

## [0.2.0] - 2017-12-06

### Added
- `hideSearch` Prop to hide search bar entirely 
## [0.1.2] - 2017-11-29
### Added
- Style for sub item separator

## [0.1.1] - 2017-11-22
### Added
- Props for Modal animation and orientation

## [0.1.0] - 2017-11-22
### Added
- Init
