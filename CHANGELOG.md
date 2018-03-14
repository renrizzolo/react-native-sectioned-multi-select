# Changelog
## 0.4.5 - 2018-03-13
### Added
    - Cancel button #15
        - shows on the modal to the leftof the confirm button. Pressing it dismisses the modal AND removes all selected items.
        - show with `showCancelButton` prop.
        - `cancelButton` style and `cancelIconComponent` are available. (It is a 'close' icon by default, but you could make it a text component if you want).
    - Hide select #16
        - hide the select entirely with `hideSelect` prop.
    - Title key #14
        - customize the title key with `titleKey` prop, instaed of being forced to use 'name'.
        
## 0.3.5 - 2018-03-08
### Added
    - customizable `selectedText` string (defaults to 'selected'). #13
## 0.3.4 - 2018-02-14
### Fixed
    - fixed `onSelectedItemObjectsChange` for single select mode #9

## 0.3.3 - 2018-01-30
### Added
	- Added `numberOfLines` prop, so long labels can be truncated (defaults to null - no truncation).
### Changed
	- add flex to label text so checkmark is visible for long items

## 0.3.2 - 2018-01-18
### Changed
	- Make remove all chip use chipColor

## 0.3.1 - 2018-01-17
### Changed
	- Add changelog to Readme

## 0.3.0 - 2018-01-16

### Added
- disabled color. When highlightChildren is true, the child checkmarks become the disabled color
- highlighted children TouchableOpacity disabled. You can't / it doesn't make sense to cherry pick sub items in this mode
- Custom component for no results text
    - `noResultsComponent` - More customizable than a string.
- custom component for loading
    - `loadingComponent` - display an ActivityIndicator (default) component when items are empty / undefined
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
- 
### Removed
- Removed No results text string in favour of a component (object) to allow for more customization.
- removed / streamlined fonts

### Changed
- Moved row item and sub item to separate classes, in order to enhance performance for long lists. Use `shouldComponentUpdate` to not re-render every item on toggle.
- moved RowItem and SubRowItem into separate files

### Fixed
- fixed `reduceSelected` function - rejecting children works properly now
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
