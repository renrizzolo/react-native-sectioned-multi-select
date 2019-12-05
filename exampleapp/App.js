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
  LayoutAnimation,
  Image,
} from 'react-native'
import SectionedMultiSelect from 'react-native-sectioned-multi-select'
// import Icon from 'react-native-vector-icons/MaterialIcons'

const img = require('./z.jpg')

// Sorry for the mess

const items = [
  {
    title: 'Fruits',
    id: 0,

    children: [
      {
        title: 'Apple',
        id: 10,
      },
      {
        title: 'Strawberry',
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
        title: 'Wátermelon',
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
    title: 'Gèms',
    id: 1,
    icon: 'cake',
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
        title: 'Sapphirè',
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
    icon: img,

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
console.log(items)

// const items2 =
//   [{
//     title: 'Plants',
//     id: 2,
//     children: [
//       {
//         title: "Mother In Law's Tongue",
//         id: 30,
//       },
//       {
//         title: 'Yucca',
//         id: 31,
//       },
//       {
//         title: 'Monsteria',
//         id: 32,
//       },
//       {
//         title: 'Palm',
//         id: 33,
//       },

//     ],
//   }]
const items2 = []
for (let i = 0; i < 100; i++) {
  items2.push({
    id: i,
    title: `item ${i}`,
    children: [
      {
        id: `10${i}`,
        title: `child 10${i}`,
      },
      {
        id: `11${i}`,
        title: `child 11${i}`,
      },
      {
        id: `12${i}`,
        title: `child 12${i}`,
      },
    ],
  })
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
const accentMap = {
  â: 'a',
  Â: 'A',
  à: 'a',
  À: 'A',
  á: 'a',
  Á: 'A',
  ã: 'a',
  Ã: 'A',
  ê: 'e',
  Ê: 'E',
  è: 'e',
  È: 'E',
  é: 'e',
  É: 'E',
  î: 'i',
  Î: 'I',
  ì: 'i',
  Ì: 'I',
  í: 'i',
  Í: 'I',
  õ: 'o',
  Õ: 'O',
  ô: 'o',
  Ô: 'O',
  ò: 'o',
  Ò: 'O',
  ó: 'o',
  Ó: 'O',
  ü: 'u',
  Ü: 'U',
  û: 'u',
  Û: 'U',
  ú: 'u',
  Ú: 'U',
  ù: 'u',
  Ù: 'U',
  ç: 'c',
  Ç: 'C',
}
const tintColor = '#174A87'

const Loading = (props) =>
  props.hasErrored ? (
    <TouchableWithoutFeedback onPress={props.fetchCategories}>
      <View style={styles.center}>
        <Text>oops... something went wrong. Tap to reload</Text>
      </View>
    </TouchableWithoutFeedback>
  ) : (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    )

const Toggle = (props) => (
  <TouchableWithoutFeedback onPress={() => props.onPress(!props.val)} disabled={props.disabled}>
    <View style={styles.switch}>
      <Text style={styles.label}>{props.name}</Text>
      <Switch
        trackColor={tintColor}
        onValueChange={(v) => props.onPress(v)}
        value={props.val}
        disabled={props.disabled}
      />
    </View>
  </TouchableWithoutFeedback>
)

export default class App extends Component {
  constructor() {
    super()
    this.state = {
      items: null,
      loading: false,
      selectedItems: [],
      selectedItems2: [],
      selectedItemObjects: [],
      currentItems: [],
      showDropDowns: false,
      single: false,
      readOnlyHeadings: false,
      highlightChildren: false,
      selectChildren: false,
      hideChipRemove: false,
      hasErrored: false,
    }
    this.termId = 100
    this.maxItems = 5
  }

  componentDidMount() {
    this.pretendToLoad()
    // programatically opening the select
    // this.SectionedMultiSelect._toggleSelector()
  }

  // custom icon renderer passed to iconRenderer prop
  // see the switch for possible icon name
  // values
  icon = ({ name, size = 18, style }) => {
    // flatten the styles
    const flat = StyleSheet.flatten(style)
    // remove out the keys that aren't accepted on View
    const { color, fontSize, ...styles } = flat

    let iconComponent
    // the colour in the url on this site has to be a hex w/o hash
    const iconColor = color && color.substr(0, 1) === '#' ? `${color.substr(1)}/` : '/'

    const Search = (
      <Image
        source={{ uri: `https://png.icons8.com/search/${iconColor}ios/` }}
        style={{ width: size, height: size }}
      />
    )
    const Down = (
      <Image
        source={{ uri: `https://png.icons8.com/down/${iconColor}ios/` }}
        style={{ width: size, height: size }}
      />
    )
    const Up = (
      <Image
        source={{ uri: `https://png.icons8.com/up/${iconColor}ios/` }}
        style={{ width: size, height: size }}
      />
    )
    const Close = (
      <Image
        source={{ uri: `https://png.icons8.com/multiply/${iconColor}ios/` }}
        style={{ width: size, height: size }}
      />
    )

    const Check = (
      <Image
        source={{ uri: `https://png.icons8.com/checkmark/${iconColor}android/` }}
        style={{ width: size / 1.5, height: size / 1.5 }}
      />
    )
    const Cancel = (
      <Image
        source={{ uri: `https://png.icons8.com/cancel/${iconColor}ios/` }}
        style={{ width: size, height: size }}
      />
    )

    switch (name) {
      case 'search':
        iconComponent = Search
        break
      case 'keyboard-arrow-up':
        iconComponent = Up
        break
      case 'keyboard-arrow-down':
        iconComponent = Down
        break
      case 'close':
        iconComponent = Close
        break
      case 'check':
        iconComponent = Check
        break
      case 'cancel':
        iconComponent = Cancel
        break
      default:
        iconComponent = null
        break
    }
    return <View style={styles}>{iconComponent}</View>
  }

  getProp = (object, key) => object && this.removerAcentos(object[key])

  rejectProp = (items, fn) => items.filter(fn)

  pretendToLoad = () => {
    this.setState({ loading: true })
    setTimeout(() => {
      this.setState({ loading: false, items })
    }, 4000)
  }

  // testing a custom filtering function that ignores accents
  removerAcentos = (s) => s.replace(/[\W\[\] ]/g, (a) => accentMap[a] || a)

  filterItems = (searchTerm, items, { subKey, displayKey, uniqueKey }) => {
    let filteredItems = []
    let newFilteredItems = []
    items.forEach((item) => {
      const parts = this.removerAcentos(searchTerm.trim()).split(/[[ \][)(\\/?\-:]+/)
      const regex = new RegExp(`(${parts.join('|')})`, 'i')
      if (regex.test(this.getProp(item, displayKey))) {
        filteredItems.push(item)
      }
      if (item[subKey]) {
        const newItem = Object.assign({}, item)
        newItem[subKey] = []
        item[subKey].forEach((sub) => {
          if (regex.test(this.getProp(sub, displayKey))) {
            newItem[subKey] = [...newItem[subKey], sub]
            newFilteredItems = this.rejectProp(
              filteredItems,
              (singleItem) => item[uniqueKey] !== singleItem[uniqueKey]
            )
            newFilteredItems.push(newItem)
            filteredItems = newFilteredItems
          }
        })
      }
    })
    return filteredItems
  }

  onSelectedItemsChange = (selectedItems) => {
    console.log(selectedItems, selectedItems.length)

    if (selectedItems.length >= this.maxItems) {
      if (selectedItems.length === this.maxItems) {
        this.setState({ selectedItems })
      }
      this.setState({
        maxItems: true,
      })
      return
    }
    this.setState({
      maxItems: false,
    })

    const filteredItems = selectedItems.filter((val) => !this.state.selectedItems2.includes(val))
    this.setState({ selectedItems: filteredItems })
  }

  onSelectedItemsChange2 = (selectedItems) => {
    const filteredItems = selectedItems.filter((val) => !this.state.selectedItems.includes(val))
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
    console.log(this.state.selectedItems)
  }
  onSelectedItemObjectsChange = (selectedItemObjects) => {
    this.setState({ selectedItemObjects })
    console.log(selectedItemObjects)
  }

  onSwitchToggle = (k) => {
    const v = !this.state[k]
    this.setState({ [k]: v })
  }

  fetchCategories = () => {
    this.setState({ hasErrored: false })
    fetch('http://www.mocky.io/v2/5a5573a22f00005c04beea49?mocky-delay=500ms', {
      headers: 'no-cache',
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({ cats: responseJson })
      })
      .catch((error) => {
        this.setState({ hasErrored: true })
        throw error.message
      })
  }
  filterDuplicates = (items) =>
    items.sort().reduce((accumulator, current) => {
      const length = accumulator.length
      if (length === 0 || accumulator[length - 1] !== current) {
        accumulator.push(current)
      }
      return accumulator
    }, [])

  noResults = (
    <View key="a" style={styles.center}>
      <Text>Sorry! No results...</Text>
    </View>
  )

  handleAddSearchTerm = () => {
    const searchTerm = this.SectionedMultiSelect._getSearchTerm()
    const id = (this.termId += 1)
    if (
      searchTerm.length &&
      !(this.state.items || []).some((item) => item.title.includes(searchTerm))
    ) {
      const newItem = { id, title: searchTerm }
      this.setState((prevState) => ({
        items: [...(prevState.items || []), newItem],
      }))
      this.onSelectedItemsChange([...this.state.selectedItems, id])
      this.SectionedMultiSelect._submitSelection()
    }
  }

  searchAdornment = (searchTerm) =>
    searchTerm.length ? (
      <TouchableOpacity
        style={{ alignItems: 'center', justifyContent: 'center' }}
        onPress={this.handleAddSearchTerm}
      >
        <View style={{}}>
          <Image
            source={{ uri: 'https://png.icons8.com/plus' }}
            style={{ width: 16, height: 16, marginHorizontal: 15 }}
          />
          {/*   <Icon size={18} style={{ marginHorizontal: 15 }} name="add" /> */}
        </View>
      </TouchableOpacity>
    ) : null;

  renderSelectText = () => {
    const { selectedItemObjects } = this.state

    const selectText = selectedItemObjects.length
      ? `I like ${selectedItemObjects
        .map((item, i) => {
          let label = `${item.title}, `
          if (i === selectedItemObjects.length - 2) label = `${item.title} and `
          if (i === selectedItemObjects.length - 1) label = `${item.title}.`
          return label
        })
        .join('')}`
      : 'Select a fruit'
    return <Text style={{ color: 'red', fontSize: 24 }}>{selectText}</Text>
  }

  SelectOrRemoveAll = () =>
    this.SectionedMultiSelect && (
      <TouchableOpacity
        style={{
          justifyContent: 'center',
          height: 44,
          borderWidth: 0,
          paddingHorizontal: 10,
          backgroundColor: 'darkgrey',
          alignItems: 'center',
        }}
        onPress={
          this.state.selectedItems.length
            ? this.SectionedMultiSelect._removeAllItems
            : this.SectionedMultiSelect._selectAllItems
        }
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>
          {this.state.selectedItems.length ? 'Remove' : 'Select'} all
        </Text>
      </TouchableOpacity>
    )

  onToggleSelector = (toggled) => {
    console.log('selector is ', toggled ? 'open' : 'closed')
  }
  customChipsRenderer = (props) => {
    console.log('props', props)
    return (
      <View style={{ backgroundColor: 'yellow', padding: 15 }}>
        <Text>Selected:</Text>
        {props.selectedItems.map((singleSelectedItem) => {
          const item = this.SectionedMultiSelect._findItem(singleSelectedItem)

          if (!item || !item[props.displayKey]) return null

          return (
            <View
              key={item[props.uniqueKey]}
              style={{
                flex: 0,
                marginRight: 5,
                padding: 10,
                backgroundColor: 'orange',
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  this.SectionedMultiSelect._removeItem(item)
                }}
              >
                <Text>{item[props.displayKey]}</Text>
              </TouchableOpacity>
            </View>
          )
        })}
      </View>
    )
  }
  render() {
    return (
      <ScrollView
        keyboardShouldPersistTaps="always"
        style={{ backgroundColor: '#f8f8f8' }}
        contentContainerStyle={styles.container}
      >
        <Text style={styles.welcome}>React native sectioned multi select example.</Text>
        <SectionedMultiSelect
          items={this.state.items}
          ref={(SectionedMultiSelect) => (this.SectionedMultiSelect = SectionedMultiSelect)}
          uniqueKey="id"
          subKey="children"
          displayKey="title"
          iconKey="icon"
          autoFocus
          modalWithTouchable
          modalWithSafeAreaView
          // showCancelButton
          // headerComponent={this.SelectOrRemoveAll}
          // hideConfirm
          loading={this.state.loading}
          // filterItems={this.filterItems}
          // alwaysShowSelectText
          // customChipsRenderer={this.customChipsRenderer}
          chipsPosition="top"
          searchAdornment={(searchTerm) => this.searchAdornment(searchTerm)}
          renderSelectText={this.renderSelectText}
          // noResultsComponent={this.noResults}
          loadingComponent={
            <Loading hasErrored={this.state.hasErrored} fetchCategories={this.fetchCategories} />
          }
          // iconRenderer={this.icon}
          //  cancelIconComponent={<Text style={{color:'white'}}>Cancel</Text>}
          showDropDowns={this.state.showDropDowns}
          expandDropDowns={this.state.expandDropDowns}
          animateDropDowns={false}
          readOnlyHeadings={this.state.readOnlyHeadings}
          single={this.state.single}
          showRemoveAll
          hideChipRemove={this.state.hideChipRemove}
          selectChildren={this.state.selectChildren}
          highlightChildren={this.state.highlightChildren}
          //  hideSearch
          //  itemFontFamily={fonts.boldCondensed}
          onSelectedItemsChange={this.onSelectedItemsChange}
          onSelectedItemObjectsChange={this.onSelectedItemObjectsChange}
          onCancel={this.onCancel}
          onConfirm={this.onConfirm}
          confirmText={`${this.state.selectedItems.length}/${this.maxItems} - ${
            this.state.maxItems ? 'Max selected' : 'Confirm'
            }`}
          selectedItems={this.state.selectedItems}
          colors={{ primary: '#5c3a9e', success: '#5c3a9e' }}
          itemNumberOfLines={3}
          selectLabelNumberOfLines={3}
          styles={{
            // chipText: {
            //   maxWidth: Dimensions.get('screen').width - 90,
            // },
            // itemText: {
            //   color: this.state.selectedItems.length ? 'black' : 'lightgrey'
            // },
            // selectedItemText: {
            //   color: 'blue',
            // },
            // subItemText: {
            //   color: this.state.selectedItems.length ? 'black' : 'lightgrey'
            // },
            item: {
              paddingHorizontal: 10,
            },
            subItem: {
              paddingHorizontal: 10,
            },
            selectedItem: {
              backgroundColor: 'rgba(0,0,0,0.1)',
            },
            selectedSubItem: {
              backgroundColor: 'rgba(0,0,0,0.1)',
            },
            // selectedSubItemText: {
            //   color: 'blue',
            // },
            scrollView: { paddingHorizontal: 0 },
          }}
        // cancelIconComponent={<Icon size={20} name="close" style={{ color: 'white' }} />}
        />
        <View>
          <View style={styles.border}>
            <Text style={styles.heading}>Settings</Text>
          </View>

          <Toggle
            name="Single"
            onPress={() => this.onSwitchToggle('single')}
            val={this.state.single}
          />
          <Toggle
            name="Read only headings"
            onPress={() => this.onSwitchToggle('readOnlyHeadings')}
            val={this.state.readOnlyHeadings}
          />
          <Toggle
            name="Expand dropdowns"
            onPress={() => this.onSwitchToggle('expandDropDowns')}
            val={this.state.expandDropDowns}
            disabled={!this.state.showDropDowns}
          />
          <Toggle
            name="Show dropdown toggles"
            onPress={() => this.onSwitchToggle('showDropDowns')}
            val={this.state.showDropDowns}
          />
          <Toggle
            name="Auto-highlight children"
            onPress={() => this.onSwitchToggle('highlightChildren')}
            val={this.state.highlightChildren}
            disabled={this.state.selectChildren}
          />
          <Toggle
            name="Auto-select children"
            onPress={() => this.onSwitchToggle('selectChildren')}
            disabled={this.state.highlightChildren}
            val={this.state.selectChildren}
          />
          <Toggle
            name="Hide Chip Remove Buttons"
            onPress={() => this.onSwitchToggle('hideChipRemove')}
            val={this.state.hideChipRemove}
          />

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
