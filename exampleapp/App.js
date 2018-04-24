import React, { Component } from 'react'
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Switch,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native'
import SectionedMultiSelect from 'react-native-sectioned-multi-select'
import Icon from 'react-native-vector-icons/MaterialIcons'


let items = [
  {
    title: 'Fruits from various places around the world, if you like',
    id: 0,
    children: [
      {
        title: 'Apple',
        id: 10,
      },
      {
        title: 'Strawberry and Banana and Pineapple and Pawpaw and Peach',
        id: 11,
      },
      {
        title: 'Pineapple',
        id: 13,
      },
      {
        title: 'Banana',
        id: 14,
      },
      {
        title: 'Watermelon',
        id: 15,
      },
      {
        title: 'אבטיח',
        id: 17,
      },
      {
        title: 'Raspberry',
        id: 18,
      },
      {
        title: 'Orange',
        id: 19,
      },
      {
        title: 'Mandarin',
        id: 20,
      },
      {
        title: 'Papaya',
        id: 21,
      },
      {
        title: 'Lychee',
        id: 22,
      },
      {
        title: 'Cherry',
        id: 23,
      },
      {
        title: 'Peach',
        id: 24,
      },
      {
        title: 'Apricot',
        id: 25,
      },

    ],
  },
  {
    title: 'Gems',
    id: 1,
    children: [
      {
        title: 'Quartz',
        id: 26,
      },
      {
        title: 'Zircon',
        id: 27,
      },
      {
        title: 'Sapphire',
        id: 28,
      },
      {
        title: 'Topaz',
        id: 29,
      },
    ],
  },
  {
    title: 'Plants',
    id: 2,
    children: [
      {
        title: "Mother In Law's Tongue",
        id: 30,
      },
      {
        title: 'Yucca',
        id: 31,
      },
      {
        title: 'Monsteria',
        id: 32,
      },
      {
        title: 'Palm',
        id: 33,
      },

    ],
  },
  {
    title: 'No child',
    id: 34,
  },
]
const items2 =
  [{
    title: 'Plants',
    id: 2,
    children: [
      {
        title: "Mother In Law's Tongue",
        id: 30,
      },
      {
        title: 'Yucca',
        id: 31,
      },
      {
        title: 'Monsteria',
        id: 32,
      },
      {
        title: 'Palm',
        id: 33,
      },

    ],
  }]
// const items2 = []
// for (let i = 0; i < 100; i++) {
//   items2.push({
//     id: i,
//     name: `item ${i}`,
//     children: [
//       {
//         id: i + 1000, name: `child ${i + 1000}`,
//       },
//       {
//         id: i + 2000, name: `child ${i + 2000}`,
//       },
//       {
//         id: i + 3000, name: `child ${i + 3000}`,
//       },
//     ],
//   })
// }

const fonts = {
  condensed:
    Platform.select({
      ios: {
        fontFamily: 'AvenirNextCondensed-DemiBold',
      },
      android: {
        fontFamily: 'sans-serif-condensed',
      },
    }),
  boldCondensed:
    Platform.select({
      ios: {
        fontFamily: 'AvenirNextCondensed-DemiBold',
      },
      android: {
        fontFamily: 'sans-serif-condensed',
        fontWeight: '700',
      },
    }),
  regular:
    Platform.select({
      ios: {
        fontFamily: 'Avenir-Heavy',
      },
      android: {
        fontFamily: 'sans-serif',
      },
    }),
  light:
    Platform.select({
      ios: {
        fontFamily: 'Avenir-Light',
      },
      android: {
        fontFamily: 'sans-serif-light',
      },
    }),
  bold:
    Platform.select({
      ios: {
        fontFamily: 'Avenir-Black',
      },
      android: {
        fontFamily: 'sans-serif',
        fontWeight: '700',
      },
    }),
  black:
    Platform.select({
      ios: {
        fontFamily: 'Avenir-Black',
      },
      android: {
        fontFamily: 'sans-serif',
        fontWeight: '900',
      },
    }),
  serif:
    Platform.select({
      ios: {
        fontFamily: 'Georgia',
      },
      android: {
        fontFamily: 'serif',
      },
    }),
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  container: {
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: '#333',
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: '#dadada',
    marginBottom: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 20,
  },
  label: {
    fontWeight: 'bold',
  },
  switch: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
})

const tintColor = '#174A87'

const Loading = props => (
  props.hasErrored ?
    <TouchableWithoutFeedback onPress={props.fetchCategories}>
      <View style={styles.center}>
        <Text>oops... something went wrong. Tap to reload</Text>
      </View>
    </TouchableWithoutFeedback>
    :
    <View style={styles.center}>
      <ActivityIndicator size="large" />
    </View>
)

const Toggle = props => (
  <TouchableWithoutFeedback onPress={() => props.onPress(!props.val)}>
    <View style={styles.switch}>
      <Text style={styles.label}>{props.name}</Text>
      <Switch onTintColor={tintColor} onValueChange={v => props.onPress(v)} value={props.val} />
    </View>
  </TouchableWithoutFeedback>
)

export default class App extends Component {
  constructor() {
    super()
    this.state = {
      items: items,
      selectedItems: [],
      selectedItems2: [],
      selectedItemObjects: [],
      currentItems: [],
      showDropDowns: false,
      single: false,
      readOnlyHeadings: false,
      highlightChildren: false,
      selectChildren: false,
      hasErrored: false,
    }
  }


  componentWillMount() {
   // this.fetchCategories()
  }
  componentDidMount() {
    // programatically opening the select
    // this.SectionedMultiSelect._toggleSelector()
  }

  onSelectedItemsChange = (selectedItems) => {
    const filteredItems = selectedItems.filter(val => !this.state.selectedItems2.includes(val))
    this.setState({ selectedItems: filteredItems })
    console.log(selectedItems)
  }

  onSelectedItemsChange2 = (selectedItems) => {
    const filteredItems = selectedItems.filter(val => !this.state.selectedItems.includes(val))
    this.setState({ selectedItems2: filteredItems })
  }
  onConfirm = () => {
    this.setState({ currentItems: this.state.selectedItems })
  }

  onCancel = () => {
    this.SectionedMultiSelect._removeAllItems()

    this.setState({
      selectedItems: this.state.currentItems,
    })
    console.log(this.state.selectedItems);
  }
  onSelectedItemObjectsChange = (selectedItemObjects) => {
    this.setState({ selectedItemObjects })
    console.log(selectedItemObjects)
  }
  onShowDropDownsToggle = (showDropDowns) => {
    this.setState({ showDropDowns })
  }
  onReadOnlyHeadingsToggle = (readOnlyHeadings) => {
    this.setState({ readOnlyHeadings })
  }
  onSingleToggle = (single) => {
    this.setState({ single })
  }

  onHighlightChildrenToggle = (highlightChildren) => {
    this.setState({ highlightChildren })
  }
  onSelectChildrenToggle = (selectChildren) => {
    this.setState({ selectChildren })
  }
  fetchCategories = () => {
    this.setState({ hasErrored: false })
    fetch('http://www.mocky.io/v2/5a5573a22f00005c04beea49?mocky-delay=500ms', { headers: 'no-cache' })
      .then(response => response.json())
      .then((responseJson) => {
        this.setState({ cats: responseJson })
      })
      .catch((error) => {
        this.setState({ hasErrored: true })
        throw error.message
      })
  }
  filterDuplicates = items => items.sort().reduce((accumulator, current) => {
    const length = accumulator.length
    if (length === 0 || accumulator[length - 1] !== current) {
      accumulator.push(current)
    }
    return accumulator
  }, []);


  noResults =
    <View key="a" style={styles.center}>
      <Text>Sorry No results...</Text>
    </View>;

handleAddSearchTerm = () => {
  const searchTerm = this.SectionedMultiSelect._getSearchTerm();
  const id = this.state.items[this.state.items.length - 1].id + 1;
  if ( searchTerm.length && !this.state.items.some( item => item.title.includes(searchTerm) ) ) {
    const newItem = {id: id, title: searchTerm};
    this.setState(prevState => ({items: [...prevState.items, newItem]}));
    this.onSelectedItemsChange([...this.state.selectedItems, id])
    this.SectionedMultiSelect._submitSelection()
  }
}

searchAdornment = (searchTerm) => {
  return(
    searchTerm.length ?
      <TouchableOpacity 
        style={{ alignItems: 'center', justifyContent: 'center'}} 
        onPress={this.handleAddSearchTerm}
      >
        <View>
          <Icon
            size={18}
            style={{ marginHorizontal: 15 }}
            name="add"
           />
        </View>
      </TouchableOpacity>
    : 
    null
  )
}

  render() {
    return (
      <ScrollView style={{ backgroundColor: '#f8f8f8' }} contentContainerStyle={styles.container}>
        <Text style={styles.welcome}>
            React native sectioned multi select example.
        </Text>
        <SectionedMultiSelect
          items={this.state.items}
          ref={SectionedMultiSelect => this.SectionedMultiSelect = SectionedMultiSelect}
          uniqueKey="id"
          subKey="children"
          displayKey="title"
          showCancelButton
          alwaysShowSelectText
          searchAdornment={(searchTerm) => this.searchAdornment(searchTerm)}
          selectText={this.state.selectedItems.length ? 'Select categories' : 'All categories'}
          noResultsComponent={this.noResults}
          loadingComponent={
            <Loading
              hasErrored={this.state.hasErrored}
              fetchCategories={this.fetchCategories}
            />
          }
          //  cancelIconComponent={<Text style={{color:'white'}}>Cancel</Text>}
          showDropDowns={this.state.showDropDowns}
          readOnlyHeadings={this.state.readOnlyHeadings}
          single={this.state.single}
          showRemoveAll
          selectChildren={this.state.selectChildren}
          highlightChildren={this.state.highlightChildren}
          //  hideSearch
          //  itemFontFamily={fonts.boldCondensed}
          onSelectedItemsChange={this.onSelectedItemsChange}
          onSelectedItemObjectsChange={this.onSelectedItemObjectsChange}
          onCancel={this.onCancel}
          onConfirm={this.onConfirm}
          selectedItems={this.state.selectedItems}
          styles={{
            chipText: {
              maxWidth: Dimensions.get('screen').width - 90,
            },
            container: {

            },
            cancelButton: {
              backgroundColor: 'lightgrey',

            },
            button: {

              backgroundColor: 'silver',
            },
            confirmText: {
              color: 'black',
            }
          }}
           numberOfLines={1}
           cancelIconComponent={
            <Icon
                       size={20}
                       name="cancel"
                       style={{ color: 'black' }}
                     />
           }
        />
        <SectionedMultiSelect
          items={items2}
          ref={SectionedMultiSelect2 => this.SectionedMultiSelect2 = SectionedMultiSelect2}
          uniqueKey="id"
          subKey="children"
          displayKey="title"
         // showCancelButton
          // hideSelect={true}
          selectText={this.state.selectedItems2.length ? 'Select categories' : 'All categories'}
          noResultsComponent={this.noResults}
          loadingComponent={
            <Loading
              hasErrored={this.state.hasErrored}
              fetchCategories={this.fetchCategories}
            />
          }
          //  cancelIconComponent={<Text style={{color:'white'}}>Cancel</Text>}
          showDropDowns={this.state.showDropDowns}
          readOnlyHeadings={this.state.readOnlyHeadings}
          single={this.state.single}
          showRemoveAll
          selectChildren={this.state.selectChildren}
          highlightChildren={this.state.highlightChildren}
          //  hideSearch
          //  itemFontFamily={fonts.boldCondensed}
          onSelectedItemsChange={this.onSelectedItemsChange2}
          onSelectedItemObjectsChange={this.onSelectedItemObjectsChange}
          onCancel={this.onCancel}
          onConfirm={this.onConfirm}
          selectedItems={this.state.selectedItems2}
          styles={{
            chipText: {
              maxWidth: Dimensions.get('screen').width - 90,
            },
            cancelButton: {
           //   flex: 6,
            },
          }}
          // numberOfLines={1}
        />
        <View>
          <View style={styles.border}>
            <Text style={styles.heading}>Settings</Text>
          </View>

          <Toggle name="Single" onPress={this.onSingleToggle} val={this.state.single} />
          <Toggle name="Read only headings" onPress={this.onReadOnlyHeadingsToggle} val={this.state.readOnlyHeadings} />
          <Toggle name="Show dropdown toggles" onPress={this.onShowDropDownsToggle} val={this.state.showDropDowns} />
          <Toggle name="Auto-highlight children" onPress={this.onHighlightChildrenToggle} val={this.state.highlightChildren} />
          <Toggle name="Auto-select children" onPress={this.onSelectChildrenToggle} val={this.state.selectChildren} />

          <TouchableWithoutFeedback onPress={() => this.SectionedMultiSelect._removeAllItems()}>
            <View style={styles.switch}>
              <Text style={styles.label}>Remove All</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </ScrollView>
    )
  }
}
