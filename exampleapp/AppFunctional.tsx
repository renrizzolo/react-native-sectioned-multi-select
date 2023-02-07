import React, { useRef } from 'react'
import { View, Button, Text, ScrollView, TouchableOpacity } from 'react-native'
import SectionedMultiSelect from 'react-native-sectioned-multi-select'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Colors } from 'react-native/Libraries/NewAppScreen'

type ItemType = {
  title: string
  id: number
}
const items: ItemType[] = [
  {
    id: 1,
    title: 'Item 1 234234'
  }
]

const App: React.FC = () => {
  const ref = useRef<SectionedMultiSelect<ItemType, 'id'>>()
  const [selectedItems, setSelectedItems] = React.useState([1, 2, 3, 'x'])

  const removeAll = () => {
    ref.current?._removeAllItems()
  }
  const toggle = () => {
    ref.current?._toggleSelector()
  }
  console.log(selectedItems)
  return (
    <View>
      <SectionedMultiSelect<ItemType, 'id'>
        uniqueKey="id"
        displayKey="title"
        onSelectedItemsChange={setSelectedItems}
        selectedItems={selectedItems}
        items={items}
        ref={ref}
        customChipsRenderer={(props) => (
          <ScrollView
            horizontal
            style={{
              height: 58,
              width: '100%'
            }}
            contentContainerStyle={{
              alignItems: 'center',
              flexDirection: 'row',
              flexWrap: 'wrap',
              padding: 8
            }}
          >
            {/* {selectedItems.map((itemId) => {
              const item = items.find(({ id }) => id === itemId)
              return (
                <View
                  style={{
                    marginRight: 10,
                    alignItems: 'center',
                    marginBottom: 6,
                    paddingVertical: 4,
                    backgroundColor: 'white',
                    borderRadius: 24,
                    flexDirection: 'row',
                    borderColor: props.colors.chipColor,
                    borderWidth: 1
                  }}
                  key={item.id}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 'bold',
                      color: props.colors.chipColor,
                      marginLeft: 16
                    }}
                  >
                    {item.title}
                  </Text>
                  <TouchableOpacity
                    style={{ padding: 4, marginRight: 8 }}
                    onPress={() => ref.current?._removeItem(item)}
                  >
                    <Icon name="close" size={18} />
                  </TouchableOpacity>
                </View>
              )
            })} */}
          </ScrollView>
        )}
        IconRenderer={Icon}
        icons={{
          check: {
            name: 'check-circle',
            style: {
              color: Colors.secondary
            },
            size: 22
          },
          search: {
            name: 'search',
            color: '#333',
            size: 22
          }
        }}
      />
      <Button title="Open" onPress={toggle} />
      <Button title="Remove All" onPress={removeAll} />
    </View>
  )
}

export default App
