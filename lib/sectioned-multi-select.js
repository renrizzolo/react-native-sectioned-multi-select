import React, { PureComponent } from 'react'
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
	ActivityIndicator,
} from 'react-native'
import get from 'lodash/get'
import reject from 'lodash/reject'
import {Icon} from 'react-native-elements'

const Touchable = Platform.OS === 'android' ? TouchableNativeFeedback : TouchableOpacity

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
	container: {

	},
	tag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        borderColor: '#dddddd',
        borderRadius: 20,
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 3,
		marginRight: 5,
		marginBottom: 5,        
    },
    tagTitle: {
        color: '#9b9b9b',
        fontSize: 15,
        fontWeight: 'normal',
    },
	selectToggle: {
		marginTop: 5,
		marginBottom:10, 
		paddingHorizontal: 5, 
		paddingVertical: 5, 
		borderRadius:4,
	},
	selectToggleText: {

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

	},
	subSeparator: {
		height: 0,
	},
	chipContainer: {

	},
	chipText: {

	},
	chipIcon: {

	},
	searchTextInput:{

	},
	scrollView: {

	},
	button: {

	},
	confirmText: {

	},
}

class SectionedMultiSelect extends PureComponent {
	constructor(props) {
		super(props)

		if (Platform.OS === 'android') {
			UIManager.setLayoutAnimationEnabledExperimental(true)
		}
		this.state = {
			selector: false,
			searchTerm: '',
			showSubCategories: [],
			items:[],
		}
		this.styles = StyleSheet.flatten([styles, props.styles])
	}

	static propTypes = {
		single: PropTypes.bool,
		selectedItems: PropTypes.array,
		items: PropTypes.array.isRequired,
		uniqueKey: PropTypes.string.isRequired,
		subKey: PropTypes.string,
		onSelectedItemsChange: PropTypes.func.isRequired,
		showDropDowns: PropTypes.bool,
		readOnlyHeadings: PropTypes.bool,
		selectText: PropTypes.string,
		confirmText: PropTypes.string,
		styles: PropTypes.oneOfType([
			PropTypes.array,
			PropTypes.object
		]),
		colors: PropTypes.object,
		searchPlaceholderTextColor: PropTypes.string,
		searchPlaceholderText: PropTypes.string,
		noResultsText: PropTypes.string,
		subItemFontFamily: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.object
		]),
		itemFontFamily: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.object
		]),
		searchTextFontFamily:	PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.object
		]),
		confirmFontFamily:	PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.object
		]),
		showRemoveAll: PropTypes.bool,
		removeAllText: PropTypes.string,
		modalSupportedOrientations: PropTypes.array,
		modalAnimationType: PropTypes.string,
		hideSearch: PropTypes.bool,
	}

	static defaultProps = {
		single: false,
		selectedItems: [],
		items: [],
		uniqueKey: 'id',
		subKey: 'sub',
		onSelectedItemsChange: () => {},
		showDropDowns: true,
		showChips: true,
		readOnlyHeadings: false,
		selectText:'Select',
		confirmText:'Confirm',
		searchPlaceholderText:'Search categories...',
		noResultsText: 'Sorry, no results',
		styles: {},
		colors: {
			primary:'#3f51b5',
			success: '#4caf50',
			text:'#2e2e2e',
			subText: '#848787',
			toggleTextColor: '#333',
			selectToggleTextColor: '#333',
			searchPlaceholderTextColor: '#999',
			searchSelectionColor: 'rgba(0,0,0,0.2)',
			chipColor: '#848787',
			itemBackground:'#fff',
			subItemBackground:'#ffffff',
		},
		itemFontFamily: 'condensed',
		subItemFontFamily: 'light',
		searchTextFontFamily: 'black',
		confirmFontFamily: 'bold',
		removeAllText: 'Remove all',
		showRemoveAll: false,
		modalSupportedOrientations: ['portrait', 'landscape'],
		modalAnimationType: 'fade',
		hideSearch: false,
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
		const { items, subKey, uniqueKey, showDropDowns } = this.props
		let filteredItems = []

		items.forEach((item, i) => {
			const parts = searchTerm.trim().split(/[\[ \]\[\)\(\\\/\?\-:]+/)
			const regex = new RegExp(`(${parts.join('|')})`, 'ig')
			if (regex.test(get(item, 'name'))) {
				filteredItems.push(item)
			}
			if (item[subKey]){
				const newItem = Object.assign({}, item)
				newItem[subKey] = []
				item[subKey].forEach((sub, i) => {
					if (regex.test(get(sub, 'name'))) {
						newItem[subKey] = [...newItem[subKey], sub]
						newFilteredItems = reject(filteredItems, singleItem => 
							item[uniqueKey] === singleItem[uniqueKey])
						newFilteredItems.push(newItem)
						filteredItems = newFilteredItems
					}
				})
			}	
		})

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
		return selectedItems.includes(item[uniqueKey])
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
		const { uniqueKey, subKey } = this.props
		let i = 0, found
		for (; i < items.length; i++) {
			if (items[i][uniqueKey] === id) {
				return items[i]
			}
			 else if (Array.isArray(items[i][subKey])) {
				found = this.find(id, items[i][subKey])
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
		const items = [...this.state.showSubCategories]
		if ( items.includes(id) ) {
			items.splice(
				items.findIndex( el => (
					el === id
				)
			), 1)
		} else {
			items.push(id)
		}
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
		this.setState({showSubCategories: items})
	}

	// _showDropDown = (id) => {
	//	const items = [...this.state.showSubCategories]
	//	if ( items.includes(id) ) {
	//		return
	//	} else {
	//		items.push(id)
	//	}
	//	this.setState({showSubCategories: items})
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
		const { readOnlyHeadings, showDropDowns, uniqueKey, subKey } = this.props
		if (readOnlyHeadings && item[subKey] && showDropDowns) {
			this._toggleDropDown(item[uniqueKey])
		} else if (readOnlyHeadings && parent) {
			return
		} else {
			this._toggleItem(item)
		}
	}

	_displaySelectedItems = () => {
		const { 
			uniqueKey, 
			selectedItems,
			colors,
		} = this.props


		return selectedItems.map(singleSelectedItem => {
			const item = this._findItem(singleSelectedItem)

			if (!item || !item.name) return null

				return (
				<TouchableOpacity
					key={item[uniqueKey]}
                    style={styles.tag}
                    onPress={() => this._removeItem(item)}>
                    <Icon name="ios-close-circle-outline" type="ionicon" size={16} color="#999"/>
                    <Text>{' '}</Text>
                    <Text style={styles.tagTitle}>{item.name}</Text>
                </TouchableOpacity>
				)
			})
	}

	_renderSeparator = (sub) => {
		return (
			<View
				style={[{
					flex:1,
					height: StyleSheet.hairlineWidth,
					alignSelf:'stretch',
					backgroundColor: '#dadada',
				}, sub ? this.styles.subSeparator : this.styles.separator]}
			/>
		)
	}

	_renderFooter = () => {
		const { footerComponent } = this.props
		return (	
			<View>
				{footerComponent && footerComponent}
			</View>
		)
	}


	_renderItemFlatList = (item) => {
		const { selectedItems, subKey, uniqueKey } = this.props
		return(
			<View>
				{this._rowItem(item, true)}
				{this._showSubCategoryDropDown(item.id) && 
				<View>
					{item[subKey] && 
					<FlatList
						keyExtractor={item => item[uniqueKey]}
						data={item[subKey]}
						extraData={selectedItems}
						ItemSeparatorComponent={() => this._renderSeparator(true)}
						renderItem={rowData => this._rowSubItem(rowData.item)}
						/>
					}
				</View>
				}
			</View>
		)
	}

	_rowItem = (item) => {
		const {
			readOnlyHeadings,
			uniqueKey,
			subKey, 
			showDropDowns, 
			colors,
			itemFontFamily,
			subItemFontFamily,
		} = this.props
		const hasDropDown = item[subKey] && item[subKey].length > 0 && showDropDowns
		const itemFont = itemFontFamily.fontFamily ? itemFontFamily : fonts[itemFontFamily]

		return (
			<View 
			key={item[uniqueKey]} 
			style={{
				flexDirection:'row',
				flex:1,
				backgroundColor: colors.itemBackground
			}}>
				<TouchableOpacity
					disabled={readOnlyHeadings && !showDropDowns}
					onPress={() => this._dropDownOrToggle(item, true)}
					style={[{
						flex:1,
						flexDirection: 'row', 
						alignItems: 'center', 
						justifyContent:'flex-start',
						paddingVertical: 6,
					}, this.styles.item]}
					>
						<Text 
							style={[{color:colors.text}, itemFont,	this.styles.itemText]}
						>
							{item.name}
						</Text>
						{
						this._itemSelected(item) ?
							<Icon
								name="check"
								style={{
									fontSize: 16,
									color: colors.success,
									paddingLeft:10
								}}
							/> :
							null
						}
					</TouchableOpacity>
					{hasDropDown &&
						<TouchableOpacity 
						style={[{alignItems:'flex-end', justifyContent:'center', paddingLeft:10,}, this.styles.toggleIcon]} 
						onPress={() => {this._toggleDropDown(item[uniqueKey])}}>
							<Icon
								name={this._showSubCategoryDropDown(item[uniqueKey]) ? "keyboard-arrow-up" : "keyboard-arrow-down"}
								size={22}
								style={{
									color: colors.primary,
								}}
							/>
						</TouchableOpacity>
					}
			</View>
			
			)
	}

	_rowSubItem = (item) => {
		const {
			uniqueKey,
			colors,
			itemFontFamily,
			subItemFontFamily,
		} = this.props
		const subItemFont = subItemFontFamily.fontFamily ? subItemFontFamily : fonts[subItemFontFamily]
		return (
			<View 
			key={item[uniqueKey]} 
			style={{
				flexDirection:'row',
				flex:1,
				backgroundColor: colors.subItemBackground
			}}>
				<TouchableOpacity
					onPress={() => this._toggleItem(item)}
					style={[{
						flex:1,
						flexDirection: 'row', 
						alignItems: 'center', 
						justifyContent:'flex-start',
						paddingVertical: 6,
					}, this.styles.subItem]}
					>
						<Text 
							style={[{color:colors.subText}, subItemFont, this.styles.subItemText]}
						>
							{item.name}
						</Text>
						{
						this._itemSelected(item) ?
							<Icon
								name="check"
								style={{
									fontSize: 16,
									color: colors.success,
									paddingLeft:10
								}}
							/> :
							null
						}
					</TouchableOpacity>
			</View>
			
			)
	}

	render() {
		const { 
			items, 
			selectedItems, 
			uniqueKey, 
			subKey, 
			showDropDowns,
			readOnlyHeadings,
			confirmText,
			searchPlaceholderText,
			noResultsText,
			searchTextFontFamily,
			confirmFontFamily,
			colors,
			single,
			showChips,
			removeAllText,
			showRemoveAll,
			modalAnimationType,
			modalSupportedOrientations,
			hideSearch,
		} = this.props

		const { searchTerm, selector } = this.state
		const renderItems = searchTerm ? this._filterItems(searchTerm.trim()) : items
		const confirmFont = confirmFontFamily.fontFamily ? confirmFontFamily : fonts[confirmFontFamily]
		const searchTextFont = searchTextFontFamily.fontFamily ? searchTextFontFamily : fonts[searchTextFontFamily]

	return(
		<View>
			<Modal 
			  supportedOrientations={modalSupportedOrientations}
				animationType={modalAnimationType}
				transparent={true} 
				visible={selector} 
				onRequestClose={this._toggleSelector}
			>
				<View style={[{flex:1, backgroundColor:'rgba(0,0,0,0.5)'}, this.styles.backdrop]}>
					<View style={[{
						overflow:'hidden',
						borderRadius: 6, 
						marginHorizontal:18, 
						marginVertical:26,
						borderRadius: 4, 
						alignSelf:'stretch', 
						flex:1, 
						backgroundColor:'white',
						}, this.styles.container]}
					>
					{!hideSearch &&
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
								style={[{ 
									flex: 1, 
									fontSize:17, 
									paddingVertical: 8 },	
									searchTextFont, 
									this.styles.searchTextInput
								]}
							/>
						</View>
						}

					<View style={[{ paddingHorizontal:12, flex:1, }, this.styles.scrollView]}>
					{ renderItems.length ?
						<ScrollView>	
							<FlatList
								removeClippedSubviews={false}
								data={renderItems}
								extraData={selectedItems}
								keyExtractor={item => item[uniqueKey]}
								ItemSeparatorComponent={() => this._renderSeparator(false)}
								ListFooterComponent={this._renderFooter}
								renderItem={rowData => this._renderItemFlatList(rowData.item)}
							/> 
						</ScrollView>
						:
						<View style={this.styles.item}>
							<Text style={this.styles.itemText, {color:colors.primary}}>{noResultsText}</Text>
						</View>
					}
				</View>
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
							<Text style={[{fontSize: 18, color:'#ffffff'}, confirmFont, this.styles.confirmText]}>
								{confirmText}
							</Text>
						</View>
					</Touchable>
					</View>
				</View>
			</Modal>
			<TouchableWithoutFeedback onPress={this._toggleSelector}>
				<View style={[{
					flex: 1, 
					flexDirection: 'row', 
					alignItems: 'center',}, this.styles.selectToggle]}
				>
					<Text
					numberOfLines={1}
					style={[{
							flex: 1,
							fontSize: 16,
							color:colors.selectToggleTextColor,
						}, this.styles.selectToggleText]}
					>
						{this._getSelectLabel()}
					</Text>
					<Icon
					size={24}
						name="keyboard-arrow-down"
						style={{color:colors.selectToggleTextColor}}
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
					        paddingBottom: 2,
					        paddingHorizontal: 0,
					        paddingTop: 2,							
						}}
					>
						{selectedItems.length > 1 && showRemoveAll ? 
							<View
								style={[{
								overflow:'hidden',
								justifyContent: 'center',
								height: 34,
								borderColor: colors.text,
								borderWidth: 1,
								flexDirection:'row',
								alignItems: 'center',
								paddingLeft: 10,
								margin: 3,
								paddingTop: 0,
								paddingRight: 10,
								paddingBottom: 0,
								borderRadius: 20,
								borderWidth: 1,
								}, this.styles.chipContainer]}
							>
								<TouchableOpacity 
									onPress={() => { this._removeAllItems() }}
									style={{
									borderTopRightRadius: 20, 
									borderBottomRightRadius: 20,
								}}>
								<Text
									style={[
										{
											color: colors.text,
											fontSize: 13,
											marginRight:0,
										},
									this.styles.chipText]}
								>
									{removeAllText}
								</Text>
								</TouchableOpacity>
							</View>
						:
						null
					}

					{this._displaySelectedItems()}
					</View>
					:
					null
			}		
		</View>
		)
	}
}


export default SectionedMultiSelect