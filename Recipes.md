# Recipes

Examples of commonly requested functions/patterns. Required props/functions ommited for brevity.

## Ref

Some of these examples use a ref to the component like this: `ref={SectionedMultiSelect => (this.SectionedMultiSelect = SectionedMultiSelect)}`

## Custom select text

```js
  }
  renderSelectText = () => {
    const { selectedItemObjects } = this.state

    return selectedItemObjects.length
      ? `I like ${selectedItemObjects
        // list each selected item with custom separators.
        .map((item, i) => {
          let label = `${item.title}, `
          if (i === selectedItemObjects.length - 2) label = `${item.title} and `
          if (i === selectedItemObjects.length - 1) label = `${item.title}.`
          return label
        })
        .join('')}`
        // nothing selected
      : 'Select a fruit'
  }
```

Add the props:

```js
<SectionedMultiSelect
  renderSelectText={this.renderSelectText}
  onSelectedItemObjectsChange={(selectedItemObjects) => this.setState({ selectedItemObjects })}
/>
```

## Limit selection count

A basic example of using the confirm button text to show the user how many items they have selected / can select

```js
  // set the max you want
  this.maxItem = 5;
  ...
  onSelectedItemsChange = (selectedItems) => {

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

    this.setState({ selectedItems })
  }

```

Add the prop:

```js
<SectionedMultiSelec
  confirmText={`${this.state.selectedItems.length}/${this.maxItems} - ${
    this.state.maxItems ? 'Max selected' : 'Confirm'
  }`}
/>
```

## Select or remove all items

Renders a button that removes all items if anything is selected, or selects all items if nothing is selected.

```js
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
  );
```

## Item icons

You can add custom icons next to individual items/sub items by adding them to your items.
For the example below you would add the prop `iconKey="icon"` to SectionedMultiSelect.
There are 3 ways to put a custom icon next to an item: locally required image, uri object, or icon component name.

```js

// This is how you can load a local icon
const icon = require('./icon.png');

const items = [
  {
    name: 'Fruits',
    id: 0,

    // using local imported image:
    icon: icon,
    // using a web uri:
    icon: { uri: 'https://cdn4.iconfinder.com/data/icons/free-crystal-icons/512/Gemstone.png' },
    //using  material icons icon name (or your own icons if using iconRenderer)
    icon: 'filter_vintage',
    ...
  }
]
```

## Custom icon renderer

Create your icon function

```js
icon = ({ name, size = 18, style }) => {
  // flatten the styles
  const flat = StyleSheet.flatten(style);
  // remove out the keys that aren't accepted on View
  const { color, fontSize, ...styles } = flat;

  let iconComponent;
  // the colour in the url on this site has to be a hex w/o hash
  const iconColor = color && color.substr(0, 1) === '#' ? `${color.substr(1)}/` : '';

  const Search = (
    <Image
      source={{ uri: `https://png.icons8.com/search/${iconColor}ios/` }}
      style={{ width: size, height: size }}
    />
  );
  const Down = (
    <Image
      source={{ uri: `https://png.icons8.com/arrow-down/${iconColor}ios/` }}
      style={{ width: size, height: size }}
    />
  );
  const Up = (
    <Image
      source={{ uri: `https://png.icons8.com/arrow-up/${iconColor}ios/` }}
      style={{ width: size, height: size }}
    />
  );
  const Close = (
    <Image
      source={{ uri: `https://png.icons8.com/close-button/${iconColor}ios/` }}
      style={{ width: size, height: size }}
    />
  );

  const Check = (
    <Image
      source={{ uri: `https://png.icons8.com/check-mark/${iconColor}android/` }}
      style={{ width: size / 1.5, height: size / 1.5 }}
    />
  );
  const Cancel = (
    <Image
      source={{ uri: `https://png.icons8.com/cancel/${iconColor}ios/` }}
      style={{ width: size, height: size }}
    />
  );

  switch (name) {
    case 'search':
      iconComponent = Search;
      break;
    case 'keyboard-arrow-up':
      iconComponent = Up;
      break;
    case 'keyboard-arrow-down':
      iconComponent = Down;
      break;
    case 'close':
      iconComponent = Close;
      break;
    case 'check':
      iconComponent = Check;
      break;
    case 'cancel':
      iconComponent = Cancel;
      break;
    default:
      iconComponent = null;
      break;
  }
  return <View style={styles}>{iconComponent}</View>;
};
```

Another example using a different icon font

```js
import Icon from 'react-native-vector-icons/SimpleLineIcons'

icon = ({ name, size = 18, style }) => {
    switch (name) {
      case 'search':
        iconName = 'magnifier'
        break
      case 'keyboard-arrow-up':
        iconName = 'arrow-up'
        break
      case 'keyboard-arrow-down':
        iconName = 'arrow-down'
        break
      case 'close':
        iconName = 'close
        break
      case 'check':
        iconName = 'check'
        break
      case 'cancel':
        iconName = 'close'
        break
      default:
        iconName = null
        break
    }
    return <Icon style={style} size={size} name={iconName}/>
  }
```

Add the prop:

```js
<SectionedMultiSelect iconRenderer={this.icon} />
```

## Search adornment

Adds a button next to search bar when searching something that doesn't exist in the items.
The button adds a new item to the items list with the name being current search text.

```js
this.termId = this.items[this.items.length - 1].id;

handleAddSearchTerm = (searchTerm) => {
  // this is not how you'd want to generate an id in a real scenario.
  const id = (this.termId += 1);
  if (
    searchTerm.length &&
    !(this.state.items || []).some((item) => item.title.includes(searchTerm))
  ) {
    const newItem = { id, title: searchTerm };
    this.setState((prevState) => ({ items: [...(prevState.items || []), newItem] }));
    this.onSelectedItemsChange([...this.state.selectedItems, id]);
    this.SectionedMultiSelect._submitSelection();
  }
};

searchAdornment = (searchTerm) =>
  searchTerm.length ? (
    <TouchableOpacity
      style={{ alignItems: 'center', justifyContent: 'center' }}
      onPress={() => this.handleAddSearchTerm(searchTerm)}
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
```

Add the prop:

```js
<SectionedMultiSelect searchAdornment={(searchTerm) => this.searchAdornment(searchTerm)} />
```
