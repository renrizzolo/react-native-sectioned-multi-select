
# Changelog
## 0.6.4 - 2019-01-17
### Added
- added ability to show an icon before the item text #87. Use prop `iconKey`, then add the key to your item as either a string (to show a material icons `Icon` component by `name`), object (to show an image e.g {uri: 'imageUrl' }, or a number (that is returned from require('./localimage.png') )). use style key `itemIconStyle` to style the Icon / Image
- added `autoFocus` prop (bool) #86, to autofocus the search input when the modal is opened.

## 0.6.3 - 2018-11-27
### Added
- Add `modalWithTouchable` prop. Set to true to wrap the backdrop in a `TouchableWithoutFeedback`, which will close the selector (also fires `onToggleSelector(false)`) #76

## 0.6.1 - 2018-10-23

### Fixed
- properly escape regex special chars for test in filter function #64
### Added
- Add `hideConfirm` prop - hides the confirm button from the modal #62
- Add `stickyFooterComponent` shows below the confirm button (but, unlike `footerComponent`, outside of the scroll view so it's always visible)
- Add `chipsPosition` to position the chips above or below the select. Sstring, either 'top' or 'bottom' #56
- Add `customChipsRenderer` function. receives all props. #56
- Add `modalSafeAreaView` prop. Set to true to use a `SafeAreaView` instead of a `View` as the backdrop inside the `Modal`.

## 0.6.0 - 2018-10-02

### Fixed
- prevent crash when pressing select toggle rapidly
- fix formatting of this document
### Added
- Add `onToggleSelector` callback function #48
- Add `noItemsComponent` to be shown when there are no items
- Add `loading` boolean prop for loading state
### Changed
- Change `loadingComponent` to be shown when `loading` prop is true (previously was shown when items were empty)

## 0.5.2 - 2018-07-10
### Fixed
- Added `keyboardShouldPersistTaps` props where needed
### Added
- Add `selectedItemText` and `selectedSubItemText` styles (previously only the parent view style was editable when selected).
## 0.5.1 - 2018-06-29
### Added
- Add `chipRemoveIconComponent`, this icon wasn't user replaceable before.
- Add `filterItems` function prop. It will replace the filter used for searching. parameters are `searchTerm`, `items`, `props`. You need to return an array of item objects. (example in `exampleapp/App.js`).

## 0.5.0 - 2018-06-12
### Added
- Add `expandDropDowns` prop. Set to true to expand all parent dropdowns (when using `showDropDowns`).
- Add `animateDropDowns` prop. Set to false to not use LayoutAnimation when toggling the dropdowns.
- Add `customLayoutAnimation` prop. Use your own LayoutAnimation preset or custom layout animation object for the toggling of dropdowns.
- Add `selectLabelNumberOfLines` prop.
- Add `renderSelectText` function that receives props. This allows you to fully customize what the select label says and when, overriding `selectText`, `selectedText` etc.
### Changed
- `numberOfLines` is now `itemNumberOfLines`, to avoid confusion.
- There were serious perf issues for things like toggling dropdowns with larger lists. To mitigate this, the sub items have been moved inside of the parent items and some functions have been rafactored or moved. The only noticeable difference should be that the parent item's `itemSeparator` shows at the bottom of the group of items, rather than always being directly below the parent item.
### Fixed
- Cast keyExtractor ids to string #31
- Should be generally faster...

## 0.4.7 - 2018-05-07
### Changed
- Removed lodash dependency: replaced get and reject functions with internal functions.

## 0.4.4 - 2018-04-13
### Added
- `alwaysShowSelectText` prop - if true the select label won't show the amount selected + `selectedText` or the name of the selected item if only one items is selected. Not applied when `single` is true as single shows the `dispayKey` on the select label only. #23
- `searchAdornment` prop - function that receives the text of the search input, and is output on the right hand side of the search input. Useful if you need to do something with the search text like add a new item.

## 0.4.2 - 2018-03-29
### Fixed / Added
- disabled items
    - sub item Touchable wasn't being disabled when a truthy disabled key is present
    - make item text colors.disabled when item has truthy disabled key

## 0.4.1 - 2018-03-26
### Fixed
- cancel / confirm buttons not displaying properly on iOS. Cancel takes a fixed width instead of a flex ratio now. #19

## 0.4.0 - 2018-03-23
### Added
- Cancel button #15
    - shows on the modal to the left of the confirm button. Pressing it dismisses the modal AND removes all selected items.
    - show with `showCancelButton` prop.
    - `cancelButton` style and `cancelIconComponent` are available. (It is a 'close' icon by default, but you could make it a text component if you want).
- Hide select #16
    - hide the select entirely with `hideSelect` prop.
- Display key #14
    - customize the title key with `displayKey` prop, instaed of being forced to use 'name'.
- Added `headerComponent` prop  - goes above search bar #17
- Added `onCancel` and `onConfirm` function props

### Changed
- `SelectedText` now allowed to be a function, for more complex translations/
 
        
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
