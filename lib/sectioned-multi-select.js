import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
	ScrollView, 
	View, 
	TouchableOpacity,
	TouchableNativeFeedback,
	TouchableWithoutFeedback,
	Text,
	TextInput,
	UIManager,
	Platform,
	LayoutAnimation,
	Modal,
	FlatList,
	StyleSheet,
} from 'react-native'
import get from 'lodash/get'
import reject from 'lodash/reject'
import Icon from 'react-native-vector-icons/MaterialIcons'

const Touchable = Platform.OS === 'android' ? TouchableNativeFeedback : TouchableOpacity;

const fonts = StyleSheet.create({
	condensed: 
		Platform.select({
			ios: {
				fontFamily:	'AvenirNextCondensed-DemiBold',
			},
			android: {
				fontFamily: 'sans-serif-condensed',
			},
	}),
	regular: 
		Platform.select({
			ios: {
				fontFamily:	'Avenir-Heavy',
			},
			android: {
				fontFamily: 'sans-serif',
			},
	}),
	light: 
		Platform.select({
			ios: {
				fontFamily:	'Avenir-Light',
			},
			android: {
				fontFamily: 'sans-serif-light',
			},
	}),
	bold: 
		Platform.select({
			ios: {
				fontFamily:	'Avenir-Black',
			},
			android: {
				fontFamily: 'sans-serif',
				fontWeight: '700',
			},
  }),
	black: 
		Platform.select({
			ios: {
				fontFamily:	'Avenir-Black',
			},
			android: {
				fontFamily: 'sans-serif',
				fontWeight: '900',
			}
	}),
	serif: 
		Platform.select({
			ios: {
				fontFamily:	'Georgia',
			},
			android: {
				fontFamily: 'serif',
			},
  }),
})

const styles = {
	categorySelectToggle: {
		marginTop: 5,
		marginBottom:15, 
		paddingHorizontal: 10, 
		paddingVertical: 12, 
		borderRadius:4,
	},
	item: {
  },
  subItem: {
  },
  itemText: {
		fontSize: 17,
  },
  subItemText: {
		fontSize: 15,
		paddingLeft: 8,
  },
  searchBar: {
  	backgroundColor: '#f8f8f8',
  	flexDirection:'row',
  },
  center: {
  	alignItems:'center',
  	justifyContent:'center',
  },
  separator: {

  }
}

class CategorySelect extends Component {
  constructor(props) {
		super(props)

    if (Platform.OS === 'android') {
			UIManager.setLayoutAnimationEnabledExperimental(true)
		}
		this.state = {
			selector: false,
			searchTerm: '',
			showSubCategories: [],
		}
		this.styles = {...styles, ...props.styles}
	}

  static propTypes = {
		single: PropTypes.bool,
		selectedItems: PropTypes.array,
		items: PropTypes.array.isRequired,
		uniqueKey: PropTypes.string.isRequired,
		uniqueSubKey: PropTypes.string,
		onSelectedItemsChange: PropTypes.func.isRequired,
		showDropDowns: PropTypes.bool,
		readOnlyHeadings: PropTypes.bool,
		selectText: PropTypes.string,
		confirmText: PropTypes.string,
		styles: PropTypes.object,
		colors: PropTypes.object,
		searchPlaceholderTextColor: PropTypes.string,
		searchPlaceholderText: PropTypes.string,
		subItemFontFamily: PropTypes.oneOfType([
		  PropTypes.string,
		  PropTypes.object
		]),
		itemFontFamily: PropTypes.oneOfType([
		  PropTypes.string,
		  PropTypes.object
		]),
		searchTextFontFamily:  PropTypes.oneOfType([
		  PropTypes.string,
		  PropTypes.object
		]),
		confirmFontFamily:  PropTypes.oneOfType([
		  PropTypes.string,
		  PropTypes.object
		]),
  }

  static defaultProps = {
		single: false,
		selectedItems: [],
		items: [],
		uniqueKey: 'id',
		uniqueSubKey: 'sub',
		onSelectedItemsChange: () => {},
		showDropDowns: true,
		showChips: true,
		readOnlyHeadings: false,
		selectText:'Select',
		confirmText:'Confirm',
		styles: {},
		colors: {
			primary:'#3f51b5',
			success: '#4caf50',
			text:'#2e2e2e',
			subText: '#848787',
			toggleTextColor: '#ffffff',
			categorySelectToggleTextColor: '#ffffff',
			searchPlaceholderTextColor: '#999',
			searchSelectionColor: 'rgba(0,0,0,0.2)',
		},

		searchPlaceholderText:'Search categories...',
		itemFontFamily: 'condensed',
		subItemFontFamily: 'light',
		searchTextFontFamily: 'black',
		confirmFontFamily: 'bold',
	}

  _getSelectLabel = () => {
		const { 
			selectText, 
			single,
			items,
			selectedItems,
			uniqueKey,
		} = this.props
		if (!selectedItems || selectedItems.length === 0) {
			return selectText
		} else if (single || selectedItems.length === 1) {
			const item = selectedItems[0]
			const foundItem = this._findItem(item)
			return get(foundItem, 'name') || selectText
		}
		return `${selectText} (${selectedItems.length} selected)`
	}

	_filterItems = (searchTerm) => {
		const { items, uniqueSubKey, uniqueKey, showDropDowns } = this.props
		let filteredItems = []
		items.forEach((item, i) => {
			const parts = searchTerm.trim().split(/[ \-:]+/)
			const regex = new RegExp(`(${parts.join('|')})`, 'ig')
			if (regex.test(get(item, 'name'))) {
				filteredItems.push(item)
			}
			if (item[uniqueSubKey]){
				const newItem = Object.assign({}, item)
				newItem[uniqueSubKey] = []
				item[uniqueSubKey].forEach((sub, i) => {
					if (regex.test(get(sub, 'name'))) {
						newItem[uniqueSubKey] = [...newItem[uniqueSubKey], sub]
						newFilteredItems = reject(filteredItems, singleItem => item[uniqueKey] === singleItem[uniqueKey] )
						console.log('newItem', newItem)
						newFilteredItems.push(newItem)
						filteredItems = newFilteredItems
					}
				})
			}  
		})
		console.log('filteredItems', filteredItems)
		return filteredItems
	}

  _removeItem = (item) => {
    const {
      uniqueKey,
      selectedItems,
      onSelectedItemsChange,
    } = this.props

    const newItems = reject(selectedItems, singleItem => (
      item[uniqueKey] === singleItem
    ))

    // broadcast new selected items state to parent component
    onSelectedItemsChange(newItems)
  }

  _removeAllItems = () => {
    const { onSelectedItemsChange } = this.props
    // broadcast new selected items state to parent component
    onSelectedItemsChange([])
  }

  _toggleSelector = () => {
   // LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    this.setState({
      selector: !this.state.selector,
    })
  }
   
   _submitSelection = () => {
    const { onSelectedItemsChange } = this.props
    this._toggleSelector()
    // reset searchTerm
    this.setState({ searchTerm: '' })
  }

  _itemSelected = (item) => {
    const { uniqueKey, selectedItems } = this.props
    return (
      !!selectedItems.find(singleItem => (
        item[uniqueKey] === singleItem
      ))
    )
  }

  _toggleItem = (item) => {
    const { 
      single, 
      uniqueKey,
      selectedItems,
      onSelectedItemsChange,
    } = this.props

    if (single) {
      this._submitSelection()
      onSelectedItemsChange([item[uniqueKey]])
    } else {
      const selected = this._itemSelected(item)
      let newItems = []
      if (selected) {
        newItems = reject(selectedItems, singleItem => (
          item[uniqueKey] === singleItem
        ))
      } else {
        newItems = [...selectedItems, item[uniqueKey]]
      }

      // broadcast new selected items state to parent component
      onSelectedItemsChange(newItems)
    }
  }

  find = (id, items) => {
  	if (!items) {
  		return {}
  	}
  	const { uniqueKey, uniqueSubKey } = this.props
	  let i = 0, found
	  for (; i < items.length; i++) {
	    if (items[i][uniqueKey] === id) {
	      return items[i]
	    }
	     else if (Array.isArray(items[i][uniqueSubKey])) {
	      found = this.find(id, items[i][uniqueSubKey])
	      if (found) {
	        return found
	      }
	    }
	  }
	}
   _findItem = (id) => {
    const { items } = this.props
    return this.find(id, items)
  }

  _toggleDropDown = (id) => {
  	LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
  	const items = [...this.state.showSubCategories]
  	if ( items.includes(id) ) {
  		items.pop(id)
  	} else {
  		items.push(id)
		}
		console.log('current dropdown items', items)
		this.setState({showSubCategories: items})
  }

	// _showDropDown = (id) => {
	// 	const items = [...this.state.showSubCategories]
	// 	if ( items.includes(id) ) {
	// 		return
	// 	} else {
	// 		items.push(id)
	// 	}
	// 	this.setState({showSubCategories: items})
	// }

	_showSubCategoryDropDown = (id) => {
  	const { showDropDowns } = this.props
  	const { searchTerm } = this.state
  	if ( searchTerm.length ) {
  		return true
  	}
  	if ( showDropDowns ) {
  		return this.state.showSubCategories.includes(id)
  	} else {
  		return true
  	}
  }

  _dropDownOrToggle = (item, parent) => {
  	const { readOnlyHeadings, showDropDowns, uniqueKey, uniqueSubKey } = this.props;
  	if (readOnlyHeadings && item[uniqueSubKey] && showDropDowns) {
  		this._toggleDropDown(item[uniqueKey]);
  	} else if (readOnlyHeadings && parent) {
  		return;
  	} else {
  		this._toggleItem(item)
  	}
  }

  _displaySelectedItems = () => {
    const { 
      uniqueKey, 
      selectedItems,
    } = this.props
    console.log(selectedItems)

    return selectedItems.map(singleSelectedItem => {
      const item = this._findItem(singleSelectedItem)

      if (!item || !item.name) return null

      return (
        <View
          style={[{
						overflow:'hidden',
						justifyContent: 'center',
						height: 34,
						borderColor: '#ffffff',
						borderWidth: 1,
						flexDirection:'row',
						alignItems: 'center',
						paddingLeft: 10,
						margin: 3,
						paddingTop: 0,
						paddingRight: 0,
						paddingBottom: 0,
						borderRadius: 20,
						borderWidth: 1,
						}, this.styles.chipContainer]}
					key={item[uniqueKey]}
        >
					<Text
						style={[
							{
								color: '#ffffff',
								fontSize: 13,
								marginRight:0,
							},
						this.styles.chipText]}
					>
						{item.name}
          </Text>
          <TouchableOpacity 
						onPress={() => { this._removeItem(item) }}
						style={{
						borderTopRightRadius: 20, 
						borderBottomRightRadius: 20,
					}}>
						<Icon
						  name="close"
						  style={[{
								color: 'rgba(255,255,255,0.6)',
								fontSize: 16,
								marginHorizontal: 6,
								marginVertical:7
							}, this.styles.chipIcon]}
						/>
					</TouchableOpacity>
				</View>
			)
		})
	}

  _renderSeparator = () => {
  	return (
  		<View
        style={[{
        	flex:1,
          height: 1,
          alignSelf:'stretch',
          backgroundColor: '#dadada',
        }, this.styles.separator]}
      />
   	)
  }
  _renderItem = (item) => {
  	const { uniqueSubKey } = this.props
		return(
			<View>
       	{this._CatItem(item, true)}
		    {this._showSubCategoryDropDown(item.id) && 
		    <View>
          {item[uniqueSubKey] && item[uniqueSubKey].map((subItem, i) => (
       			this._CatItem(subItem, false)
          ))}
        </View>
        }
      </View>
    )
  }

  _CatItem = (item, parent) => {
		const {
			readOnlyHeadings,
			uniqueKey,
			uniqueSubKey, 
			showDropDowns, 
			colors,
			itemFontFamily,
			subItemFontFamily,
		} = this.props
		const hasDropDown = parent && item[uniqueSubKey] && showDropDowns
		const itemFont = itemFontFamily.fontFamily ? itemFontFamily : fonts[itemFontFamily]
		const subItemFont = subItemFontFamily.fontFamily ? subItemFontFamily : fonts[subItemFontFamily]

		return (
			<View key={item[uniqueKey]} style={{flexDirection:'row', flex:1}}>
	      <TouchableOpacity
	      	//disabled={parent && readOnlyHeadings && !showDropDowns}
	        onPress={() => this._dropDownOrToggle(item, parent)}
	        style={[{
	        	flex:1,
	        	flexDirection: 'row', 
	        	alignItems: 'center', 
	        	justifyContent:'flex-start',
	        	paddingVertical: 6,
	        }, parent ? this.styles.item : this.styles.subItem]}
	        >
	          <Text 
	          style={parent ? [{color:colors.text}, itemFont,  this.styles.itemText, ] : [{color:colors.subText}, subItemFont, this.styles.subItemText]}>
	          	{item.name}
	          </Text>
	          {
          	this._itemSelected(item) ?
	            <Icon
	              name="check"
	              style={{
	                fontSize: 16,
	                color: colors.success,
	                marginLeft:10
	              }}
	            /> :
	            null
	        	}
	        </TouchableOpacity>
	        {hasDropDown &&
	          <TouchableOpacity style={this.styles.center} onPress={() => {this._toggleDropDown(item[uniqueKey])}}>
	            <Icon
	              name="keyboard-arrow-down"
	              size={22}
	              style={{
	                color: colors.primary,
	                marginHorizontal:10
	              }}
	            />
	          </TouchableOpacity>
	        }
	    </View>
			)
	}

	render() {
		const { 
			items, 
			selectedItems, 
			uniqueKey, 
			uniqueSubKey, 
			showDropDowns,
			readOnlyHeadings,
			confirmText,
			searchPlaceholderText,
			searchTextFontFamily,
			confirmFontFamily,
			colors,
			single,
			showChips,
		} = this.props

		const { searchTerm, selector } = this.state
    const renderItems = searchTerm ? this._filterItems(searchTerm.trim()) : items
		const confirmFont = confirmFontFamily.fontFamily ? confirmFontFamily : fonts[confirmFontFamily]
		const searchTextFont = searchTextFontFamily.fontFamily ? searchTextFontFamily : fonts[searchTextFontFamily]
	return(
		<View>
		
			<Modal 
				animationType="fade"
				transparent={true} 
				visible={selector} 
				onRequestClose={this._toggleSelector}
			>
				<View style={[{flex:1, backgroundColor:'rgba(0,0,0,0.5)'}, this.styles.backdrop]}>
					<View style={[{
						borderRadius: 4, 
						marginHorizontal:18, 
						marginVertical:26,
						borderRadius: 4, 
						alignSelf:'stretch', 
						flex:1, 
						backgroundColor:'white',
					}, this.styles.container]}
					>

					<View style={{flexDirection: 'row', paddingVertical:5}, [this.styles.searchBar]}>
						<View style={this.styles.center}>
							<Icon
								name="search"
								size={18}
								style={{ marginHorizontal: 15 }}
							/>
						</View>
						<TextInput
							selectionColor={colors.searchSelectionColor}
							onChangeText={searchTerm => this.setState({ searchTerm })}
							placeholder={searchPlaceholderText}
							selectTextOnFocus={true}
							placeholderTextColor={colors.searchPlaceholderTextColor}
							underlineColorAndroid="transparent"
							style={[{ flex: 1, fontSize:18, },  searchTextFont, this.styles.searchTextInput]}
						/>
					</View>
					<ScrollView style={[{ padding:15 }, this.styles.scrollView]}>
   				{ renderItems.length ?
						<FlatList
	  					data={renderItems}
	   					extraData={selectedItems}
	   					keyExtractor={item => item[uniqueKey]}
	   					ItemSeparatorComponent={this._renderSeparator}
	   					ListFooterComponent={() => (<View style={{marginTop:25}}/>)}
	            renderItem={rowData => this._renderItem(rowData.item)}
	    			/>
           :
           		<View style={this.styles.item}>
                <Text style={this.styles.itemText, {color:colors.primary}}>Sorry, no results</Text>
              </View>
           }
        </ScrollView>
					<Touchable
					 	accessibilityComponentType="button"
					  onPress={this._submitSelection}>
					  <View style={[{	
					  		alignItems:'center', 
					 	  	justifyContent:'center', 
					 	  	paddingVertical:8, 
					 	  	paddingHorizontal: 16, 
					 	  	borderRadius:3,
					 	  	flexDirection:'row',
					 	  	backgroundColor: colors.primary},
					  	this.styles.button,
					  	]}>
							<Text style={[{fontSize: 18}, confirmFont, this.styles.confirmText]}>{confirmText}</Text>
						</View>
					</Touchable>
        	</View>
        </View>
			</Modal>
              		<TouchableWithoutFeedback onPress={this._toggleSelector}>
                    <View style={[{
                    	flex: 1, 
											flexDirection: 'row', 
											alignItems: 'center',}, this.styles.categorySelectToggle]}
										>
                      <Text
                      numberOfLines={1}
                      style={[{
                          flex: 1,
                          fontSize: 16,
                          color:colors.categorySelectToggleTextColor,
                        }, this.styles.categorySelectToggleText]}
                      >
                        {this._getSelectLabel()}
                      </Text>
                      <Icon
                      size={24}
                        name="keyboard-arrow-down"
                        style={{color:colors.categorySelectToggleTextColor}}
                      />
                    </View>
                  </TouchableWithoutFeedback> 

               {
                selectedItems.length > 0 && !single && showChips ?
                  <View
                    style={{
                      flexWrap: 'wrap',
										 	alignItems: 'center',
											justifyContent:'flex-start',
										 	flexDirection:'row',
                    }}
                  >
                   {this._displaySelectedItems()}
                  </View>
                  :
                  null
              }

            
</View>
		)
	}
}


export default CategorySelect