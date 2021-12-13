import * as React from 'react';
import {Text, View, ScrollView, TouchableOpacity} from 'react-native';
import {
  useSectionedMultiSelect,
  SMSProvider
} from 'react-native-sectioned-multi-select';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';

// this example shows the usage of the useSectionedMultiSelect hook
// all the settings are passed to the useSectionedMultiSelect function
// and the components/helpers are returned
// you need to use the SMSProvider for providing context

const UseSMSExample = props => {
  const SMSState = useSectionedMultiSelect({
    ...props,
    initialSelectedItems: [],
    itemId: item => `item--${item.title}`,
    childItemId: item => `child--${item.title}`,
    getChildren: item => item.children,
    subKey: 'children',
    displayKey: 'title',
    iconKey: 'icon',
    iconRenderer: Icon,
    iconNames: {
      search: 'magnify',
      close: 'close',
      cancel: 'cancel',
      checkMark: 'check',
      arrowDown: 'chevron-down',
      arrowUp: 'chevron-up'
    },
    modalWithSafeAreaView: true
  });

  const {
    _selectAllItems,
    _removeAllItems,
    selectedItems,
    colors,
    components: {
      ModalHeader,
      SelectModal,
      Search,
      ModalControls,
      Selector,
      Chip,
      Chips,
      Items
    }
  } = SMSState;

  return (
    <SMSProvider value={SMSState}>
      <Chips />
      <SelectModal>
        <React.Fragment>
          <ModalHeader />
          <Search />
          <View
            style={{
              height: 50,
              borderBottomWidth: 1,
              borderBottomColor: 'lightgrey'
            }}>
            <ScrollView
              horizontal
              contentContainerStyle={{
                flexDirection: 'row',
                flexWrap: 'nowrap',
                paddingHorizontal: 10
              }}>
              <TouchableOpacity
                style={{
                  justifyContent: 'center',
                  height: 24,
                  borderWidth: 0,
                  borderRadius: 20,
                  paddingHorizontal: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  alignSelf: 'center',
                  backgroundColor: colors.success
                }}
                onPress={() =>
                  selectedItems.length
                    ? _removeAllItems('modal-horizontal-chips')
                    : _selectAllItems('modal-horizontal-chips')
                }>
                <Text style={{color: 'white', fontWeight: 'bold'}}>
                  {selectedItems.length ? 'Remove' : 'Select'} all
                </Text>
              </TouchableOpacity>

              <View style={{flex: 1, flexDirection: 'row'}}>
                {selectedItems.map(id => {
                  <Chip id={id} />;
                })}
              </View>
            </ScrollView>
          </View>
          <Items />
          <ModalControls />
        </React.Fragment>
      </SelectModal>
      <Selector />
    </SMSProvider>
  );
};

export default UseSMSExample;
