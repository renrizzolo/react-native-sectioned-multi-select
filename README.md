# react-native-sectioned-multi-select
A multi (or single) select component with support for sub categories, search, chips.
It's intended for long-ish lists, as it opens in a Modal (I might make this optional in the future).


This is based on https://github.com/toystars/react-native-multiple-select. 
The problems I had were that I needed it to be in a modal, because of nested ScrollViews not working on Android, and I needed to display categories with sub-categories.


![preview 1](https://github.com/renrizzolo/react-native-sectioned-multi-select/blob/master/previews/example_recording-1.gif)
![preview 2](https://github.com/renrizzolo/react-native-sectioned-multi-select/blob/master/previews/example_recording-2.gif)
![preview 3](https://github.com/renrizzolo/react-native-sectioned-multi-select/blob/master/previews/example_recording-3.gif)
![preview 4](https://github.com/renrizzolo/react-native-sectioned-multi-select/blob/master/previews/example_recording-4.gif)

## Usage
[![NPM Version](https://img.shields.io/npm/v/react-native-sectioned-multi-select.svg?style=flat)](https://www.npmjs.com/package/react-native-sectioned-multi-select)

`npm i -S react-native-sectioned-multi-select`

react-native-vector-icons package is required, [set it up](https://github.com/oblador/react-native-vector-icons) if you haven't already.

Required props:  
`items` | array  
`uniqueKey` | string  
`onSelectedItemsChange` | function  

```javascript
import React, { Component } from 'react';
import {
  View
} from 'react-native';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';

const items = [
  {  
    name: "Fruits",
    id: 0,
    children: [{
        name: "Apple",
        id: 10,
      },{
        name: "Strawberry",
        id: 17,
      },{
        name: "Pineapple",
        id: 13,
      },{
        name: "Banana",
        id: 14,
      },{
        name: "Watermelon",
        id: 15,
      },{
        name: "Kiwi fruit",
        id: 16,
      }]
  },
  {
    name: "Gems",
    id: 1,
    children: [{
        name: "Quartz",
        id: 20,
      },{
        name: "Zircon",
        id: 21,
      },{
        name: "Sapphire",
        id: 22,
      },{
        name: "Topaz",
        id: 23,
      }]
  },
  {
    name: "Plants",
    id: 2,
    children: [{
        name: "Mother In Law\'s Tongue",
        id: 30,
      },{
        name: "Yucca",
        id: 31,
      },{
        name: "Monsteria",
        id: 32,
      },{
        name: "Palm",
        id: 33,
      }]
  },
]

export default class App extends Component {
  constructor(){
    super()
    this.state = {
      selectedItems: [],
    }
  }
  onSelectedItemsChange = (selectedItems) => {
    this.setState({ selectedItems });
  }

  render() {
    return (
      <View>
      
        <SectionedMultiSelect
          items={items} 
          uniqueKey='id'
          subKey='children'
          selectText='Choose some things...'
          showDropDowns={true}
          readOnlyHeadings={true}
          onSelectedItemsChange={this.onSelectedItemsChange}
          selectedItems={this.state.selectedItems}
        />

      </View>
    );
  }
}

```

You can programatically remove all items by setting up a ref to the component:
```
<SectionedMultiSelect
    ...
    ref={SectionedMultiSelect => this.SectionedMultiSelect = SectionedMultiSelect}
/>
```
and then use the `_removeAllItems` function:
```
onPress={() => this.SectionedMultiSelect._removeAllItems()}
```

## Items

Your items should have a `uniqueKey` and a `name`. Any child items of that item should be in `subKey`, and they will have `uniqueKey` and `name` properties. As you can see from the example above, my items all have a unique `id` property and the child items is an array within the `subKey` property.

Sub categories are optional, there's no need to have `subKey` items if you don't want to.

## Props

Props, there are lots.


| Prop        					| Default       | type 			| Desc  |
| ------------- 				|-------------	| -----			|-----	|
| single     						| false 				| bool 			|allow only one selection |
|selectedItems					| []						| array 		|the selected items |
|uniqueKey							| 'id'					| string		|the unique key for your items
|subKey						| 'sub'					| string		|the array of sub items within items |
|onSelectedItemsChange	| () => {}			| function	|function that runs when an item is toggled|
|showDropDowns					| true					| bool			|whether to allow dropdown toggles to show/hide the sub items (if false, sub items are always shown)|
|showChips							| true					| bool			|whether to show the chips of the selected items |
|readOnlyHeadings				| false					| bool			|whether the parent items can be pressed or not. If true and `showDropdowns` is true, pressing the parent item will toggle the dropdown  |
|selectText							|'Select'				| string		|the text for the select component |
|confirmText						|'Confirm'			| string		|the text for the confirm button|
|searchPlaceholderText	|'Search categories...'| string		|the placeholder text for the search input |
|removeAllText	|'Remove all'| string		|Text for optional remove all button |
|showRemoveAll	|false| bool		| Whether to show a Remove all chip at the beginning of the selected items chips |
|noResultsText					| 'Sorry, no results'| string		|the text to display when the search result is empty |
|modalSupportedOrientations	|['landscape', 'portrait']| array		| The suppoertedOirentations of the Modal |
|modalAnimationType	|'fade'| string		|The animation type of the Modal (fade or slide) |
|styles									| {}						| object		|Styles object - see styles section |
|colors									| {...}	| object				|colors object - see colors section |
|itemFontFamily				| 'condensed'		| string\|object	|font family for the parent items. Can be a regular style object or a string that coresponds to my own platform specific mappings (see Fonts section). |
|subItemFontFamily		| 'light'				| string\|object	|font family for the sub items. Can be a regular style object or a string that coresponds to my own platform specific mappings (see Fonts section).|
|searchTextFontFamily	| 'black'				| string\|object	|font family for the search input. Can be a regular style object or a string that coresponds to my own platform specific mappings (see Fonts section).|
|confirmFontFamily		| 'bold'				| string\|object	|font family for the confirm button. Can be a regular style object or a string that coresponds to my own platform specific mappings (see Fonts section).|

## Colors
You can pass a colors object to theme it how you like.

These are the available options and their defaults:
```
primary:'#3f51b5',
success: '#4caf50',
text:'#2e2e2e',
subText: '#848787',
toggleTextColor: '#ffffff',
selectToggleTextColor: '#ffffff',
searchPlaceholderTextColor: '#999',
searchSelectionColor: 'rgba(0,0,0,0.2)',
chipColor: '#848787',
```

Primary is used for the dropdown toggle icon, the no results text and the background of the confirm button.  
Success is used for the selected checkmark icon.  
Text is the parent item text.  
subText is the sub item text.  

## Styles
You can pass a styles object to style it how you like.

These are the styles you can change:  
	`container`  
	`listContainer`  
	`selectToggle`  
	`selectToggleText`  
	`item`  
	`subItem`  
	`itemText`  
	`subItemText`  
	`searchBar`  
	`center`  
	`separator`
	`subSeparator`
	`chipContainer`  
	`chipText`  
	`chipIcon`  
	`searchTextInput`  
	`scrollView`  
	`button`  
	`confirmText`  


## Fonts

You can customize fonts with these props:  
`itemFontFamily`  
`subItemFontFamily`  
`searchTextFontFamily`  
`confirmFontFamily`  

you can pass in a string of `regular`, `condensed`, `light`, `bold`, `black` or `serif`.

|font 					| ios 							| android 				|
|----						|----								|----							|
|regular				|	Avenir-Heavy				|sans-serif				|
|condensed				|AvenirNextCondensed-DemiBold		|sans-serif-condensed		|
|light				|Avenir-Light								|sans-serif-light		|
|bold				|Avenir-Black			|	sans-serif (700)	|
|black				|Avenir-Black					|sans-serif (900)			|
|serif				|	Georgia	| serif |

If you prefer to use your own fonts, you can pass in an object instead:
```
searchTextFontFamily={{fontFamily:'sans-serif-light'}}
```
