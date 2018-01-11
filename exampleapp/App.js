import React, { Component } from 'react'
import {
  Platform,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Switch,
  TouchableWithoutFeedback,
  sectionedList,
  ActivityIndicator,
} from 'react-native'
import SectionedMultiSelect from 'react-native-sectioned-multi-select'
//import SLIcon from 'react-native-vector-icons/SimpleLineIcons'


// const items = [
//   {
//     name: 'Fruits',
//     id: 0,
//     children: [
//       {
//         name: 'Apple',
//         id: 10,
//       },
//       {
//         name: 'Strawberry',
//         id: 11,
//       },
//       {
//         name: 'Pineapple',
//         id: 13,
//       },
//       {
//         name: 'Banana',
//         id: 14,
//       },
//       {
//         name: 'Watermelon',
//         id: 15,
//       },
//       {
//         name: 'אבטיח',
//         id: 17,
//       },
//       {
//         name: 'Raspberry',
//         id: 18,
//       },
//       {
//         name: 'Orange',
//         id: 19,
//       },
//       {
//         name: 'Mandarin',
//         id: 20,
//       },
//       {
//         name: 'Papaya',
//         id: 21,
//       },
//       {
//         name: 'Lychee',
//         id: 22,
//       },
//       {
//         name: 'Cherry',
//         id: 23,
//       },
//       {
//         name: 'Peach',
//         id: 24,
//       },
//       {
//         name: 'Apricot',
//         id: 25,
//       },

//     ],
//   },
//   {
//     name: 'Gems',
//     id: 1,
//     children: [
//       {
//         name: 'Quartz',
//         id: 26,
//       },
//       {
//         name: 'Zircon',
//         id: 27,
//       },
//       {
//         name: 'Sapphire',
//         id: 28,
//       },
//       {
//         name: 'Topaz',
//         id: 29,
//       },
//     ],
//   },
//   {
//     name: 'Plants',
//     id: 2,
//     children: [
//       {
//         name: "Mother In Law\'s Tongue",
//         id: 30,
//       },
//       {
//         name: 'Yucca',
//         id: 31,
//       },
//       {
//         name: 'Monsteria',
//         id: 32,
//       },
//       {
//         name: 'Palm',
//         id: 33,
//       },

//     ],
//   },
//   {
//     name: 'No child',
//     id: 34,
//   },
// ]

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
      selectedItems: [],
      selectedItemObjects: [],
      showDropDowns: false,
      single: false,
      readOnlyHeadings: false,
      highlightChildren: false,
      selectChildren: false,
      cats: [],
      hasErrored: false,
    }
  }


  noResults =
  <View key="a" style={styles.center}>
    <Text>Sorry No results...</Text>
  </View>;


  componentWillMount() {
    this.fetchCategories()
  }


  fetchCategories = () => {
    this.setState({ hasErrored: false })

    fetch('https://www.mocky.io/v2/5a5573a22f00005c04beea49?mocky-delay=500ms')
      .then(response => response.json())
      .then((responseJson) => {
        this.setState({ cats: responseJson })
      })
      .catch((error) => {
        this.setState({ hasErrored: true })
        throw error.message
      })
  }

  onSelectedItemsChange = (selectedItems) => {
    this.setState({ selectedItems })
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


  render() {
    return (
  <ScrollView style={{backgroundColor:'#f8f8f8'}} contentContainerStyle={styles.container}>
    <Text style={styles.welcome}>
          React native sectioned multi select example.
    </Text>
      <SectionedMultiSelect
        items={this.state.cats}
        ref={SectionedMultiSelect => this.SectionedMultiSelect = SectionedMultiSelect}
        uniqueKey="id"
        subKey="children"
        selectText={this.state.selectedItems.length ? 'Select categories' : 'All categories'}
        noResultsComponent={this.noResults}
        loadingComponent={
          <Loading 
            hasErrored={this.state.hasErrored}
            etchCategories={this.fetchCategories} 
          />
        }
        showDropDowns={this.state.showDropDowns}
        readOnlyHeadings={this.state.readOnlyHeadings}
        single={this.state.single}
        showRemoveAll
        selectChildren={this.state.selectChildren}
        highlightChildren={this.state.highlightChildren}
        //hideSearch
        // itemFontFamily={fonts.boldCondensed}
        onSelectedItemsChange={this.onSelectedItemsChange}
        onSelectedItemObjectsChange={this.onSelectedItemObjectsChange}
        selectedItems={this.state.selectedItems}

      />
    <View>
      <View style={styles.border}>
        <Text style={styles.heading}>Settings</Text>
      </View>

      <Toggle name="Single" onPress={this.onSingleToggle} val={this.state.single}/>
      <Toggle name="Read only headings" onPress={this.onReadOnlyHeadingsToggle} val={this.state.readOnlyHeadings}/>
      <Toggle name="Show dropdown toggles" onPress={this.onShowDropDownsToggle} val={this.state.showDropDowns}/>
      <Toggle name="Auto-highlight children" onPress={this.onHighlightChildrenToggle} val={this.state.highlightChildren}/>
      <Toggle name="Auto-select children" onPress={this.onSelectChildrenToggle} val={this.state.selectChildren}/>

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
