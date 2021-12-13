import * as React from 'react';
import {
  Platform,
  Text,
  View,
  ScrollView,
  UIManager,
  LayoutAnimation,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Animated,
  Easing,
  Dimensions
} from 'react-native';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import {ItemSeparator} from 'react-native-sectioned-multi-select';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
// web modal is a bit broken with react-native-web 0.12 +
// https://github.com/necolas/react-native-web/issues/1665#issuecomment-657161657
import WebModal from 'modal-enhanced-react-native-web';

// this example shows using the component as a render function
// which returns all the components and helpers
// so you can build the layout how you like

let date = new Date();
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

class ContextRenderFunctionExample extends React.Component {
  constructor() {
    super();
    this.ani = new Animated.Value(0);

    this.state = {
      currentSelection: [
        'child--Avocado burger',
        'child--Diet Coke',
        'child--Coke',
        'child--Classic cheeseburger',
        'child--Seltzer Water'
      ]
    };
    this.termId = 100;
    this.maxItems = 5;
    this.children = [
      null,
      null,
      [
        {
          title: 'Classic cheeseburger',
          description: 'ZA cheese-meat-bun affair.',
          id: 30
        },
        {
          title: 'Juicy Lucy',
          id: 31
        },
        {
          title: 'Avocado burger',
          id: 32
        },
        {
          title: 'BLT burger',
          id: 33
        }
      ],
      [
        {
          title: 'Classic cheeseburger',
          description: 'A cheese-meat-bun affair.',
          id: 30
        },
        {
          title: 'Juicy Lucy',
          id: 31
        },
        {
          title: 'Avocado burger',
          id: 32
        },
        {
          title: 'BLT burger',
          id: 33
        }
      ]
    ];
  }

  componentWillUpdate() {
    date = new Date();
  }
  componentDidUpdate() {
    // date = new Date()
    console.log(new Date().valueOf() - date.valueOf());
  }

  // updateItemsExternal = () => {
  //   // zoop
  //   // need to dispatch here
  //   this.setState({
  //     selectedItems: ['child--Classic cheeseburger', 'child--Seltzer Water']
  //   });
  // };

  onSelectedItemsChange = action => (getState, dispatch) => {
    const prevItems = getState();
    // if (action.origin === PARENT_ITEM) {
    //   Animated.timing(this.ani, {
    //     toValue: 0,
    //     duration: 200,
    //     useNativeDriver: true
    //   }).start();
    // }

    const count = prevItems.length + (action.count || 0);
    this.setState({
      message: `${count} selected`
    });

    const limit = 5;
    if (action.count && prevItems.length + action.count > limit) {
      this.setState({message: 'Please select 5 or less items'});
      dispatch({});
      return;
    }

    dispatch(action);
    // .then(() => {
    //   console.log('items updated', getState());
    //   this.setState({
    //     message: `${getState().length} selected`
    //   });
    //   // if chips were removed we want
    //   // that to be reflected in the current selected Items
    //   // otherwise you could remove chips, open select,
    //   // press cancel, then get the selected items before
    //   // the chips were removed
    //   if (action.origin === 'chip') {
    //     this.setState({
    //       currentSelection: getState()
    //     });
    //   }
    // });
  };

  onCancel = (items, dispatch) => {
    console.log('currentSelection', this.state.currentSelection);
    dispatch({
      type: 'replace-items',
      items: this.state.currentSelection,
      origin: 'cancel'
    });
    this.setState({
      message: `${this.state.currentSelection.length} selected`
    });
  };
  render() {
    return (
      <View style={{zIndex: 1}}>
        {/* <TouchableOpacity onPress={this.updateItemsExternal}>
          <Text>UPDATE EXTERNAL</Text>
        </TouchableOpacity> */}

        <SectionedMultiSelect
          itemId={item => `item--${item.title}`}
          childItemId={item => `child--${item.title}`}
          // testing getChildren from elsewhere //
          // possible stack overflow in Chip find() fn //
          getChildren={item => item.children}
          subKey="children"
          displayKey="title"
          iconKey="icon"
          iconRenderer={Icon}
          iconNames={{
            search: 'magnify',
            close: 'close',
            cancel: 'cancel',
            checkMark: 'check',
            arrowDown: 'chevron-down',
            arrowUp: 'chevron-up'
          }}
          modalWithSafeAreaView={true}
          {...this.props}
          debug
          onCancel={this.onCancel}
          onConfirm={items => this.setState({currentSelection: items})}
          onSelectedItemsChange={this.onSelectedItemsChange}
          onSelectedItemObjectsChange={itemObjects =>
            this.setState({itemObjects: itemObjects})
          }
          onToggleSelect={() =>
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
          }
          initialSelectedItems={this.state.currentSelection}
          styles={{
            separator: () => ({
              height: 1,
              backgroundColor: 'silver',
              marginVertical: 6
            }),
            item: (styles, {itemSelected}) => {
              const ani = new Animated.Value(0);
              Animated.timing(ani, {
                toValue: itemSelected ? 1 : 0,
                easing: Easing.elastic(),
                duration: 250,
                useNativeDriver: true
              }).start();
              const translateX = ani.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 10]
              });
              return {
                ...styles,
                transform: [
                  {
                    translateX: translateX
                  }
                ]
              };
            },
            selectToggle: (styles, {selectIsVisible}) => ({
              ...styles,
              marginBottom: 0,
              backgroundColor: selectIsVisible ? '#dadada' : '#fafafa',
              borderBottomRightRadius: selectIsVisible ? 0 : 8,
              borderBottomLeftRadius: selectIsVisible ? 0 : 8,
              borderColor: 'yellow',
              borderWidth: 1
            }),
            cancelButton: (styles, {colors}) => {
              console.log(styles, colors);
              return {
                ...styles,
                backgroundColor:
                  this.state.currentSelection.length < 2
                    ? colors.cancel
                    : colors.success
              };
            }
          }}
          components={{
            SelectModal: Platform.OS === 'web' ? WebModal : View,
            ModalHeader: () => (
              <Text style={{textAlign: 'center', padding: 4}}>
                {this.state.message}
              </Text>
            )
          }}
          showCancelButton
          // cancelIconComponent={
          //   <Icon size={20} name="close" style={{color: 'white'}} />
          // }
          modalProps={
            Platform.OS === 'web' && {
              backdropColor: 'rgba(0,0,0,0.5)',
              style: {
                backgroundColor: 'white',
                borderRadius: 12,
                overflow: 'hidden'
              },
              animationType: 'slide',
              transparent: true,
              hasBackdrop: true
            }
          }>
          {ctx => {
            const {
              selectIsVisible,
              selectedItems,
              _selectAllItems,
              _toggleSelect,
              _removeAllItems,
              colors,
              getModalProps,
              components
            } = ctx;
            const {
              ModalHeader,
              SelectModal,
              ModalControls,
              Selector,
              Chip,
              Chips,
              Items,
              SelectVisibilityWrapper,
              Search
            } = components;
            return (
              <React.Fragment>
                {/* {selectIsVisible ? (
                  <Search
                    searchAdornment={(searchTerm, setSearchTerm, submit) =>
                      searchTerm ? (
                        <TouchableOpacity
                          style={{padding: 10}}
                          onPress={() => setSearchTerm('')}>
                          <Icon size={22} name="window-close" />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={{alignSelf: 'center', padding: 10}}
                          onPress={_toggleSelect}>
                          <Icon size={22} name="chevron-up" />
                        </TouchableOpacity>
                      )
                    }
                  />
                ) : ( */}
                <Selector
                  styles={{
                    selectToggle: (styles, {selectIsVisible}) => ({
                      ...styles,
                      marginBottom: 0,
                      backgroundColor: selectIsVisible ? '#dadada' : '#ffffff',
                      borderBottomRightRadius: selectIsVisible ? 0 : 4,
                      borderBottomLeftRadius: selectIsVisible ? 0 : 4,
                      borderColor: 'orange'
                    })
                  }}
                />
                {/* <Text>{JSON.stringify(this.state.itemObjects)}</Text> */}
                {/* )} */}
                <View style={{flex: 1}}>
                  <SelectVisibilityWrapper>
                    <SelectModal
                      {...getModalProps()}
                      isVisible={
                        Platform.OS === 'web' && getModalProps().visible
                      }>
                      <Search
                        searchAdornment={(searchTerm, setSearchTerm, submit) =>
                          searchTerm ? (
                            <TouchableOpacity
                              style={{padding: 10}}
                              onPress={() => setSearchTerm('')}>
                              <Icon size={22} name="window-close" />
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity
                              style={{alignSelf: 'center', padding: 10}}
                              onPress={_toggleSelect}>
                              <Icon size={22} name="chevron-up" />
                            </TouchableOpacity>
                          )
                        }
                      />
                      <View
                        style={{
                          zIndex: 2,
                          flex: 1,
                          backgroundColor: 'white',
                          width: '100%',
                          borderWidth: 1,
                          borderColor: '#dadada',
                          borderBottomRightRadius: 2,
                          borderBottomLeftRadius: 2
                        }}>
                        <ModalHeader />
                        <View
                          style={{
                            height: 50,
                            borderBottomWidth: 1,
                            borderBottomColor: 'lightgrey'
                          }}>
                          {/*
                            showing the chips inside the SelectModal
                            in a horizontal ScrollView,
                            with a select/remove all button
                          */}
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
                              <Text
                                style={{color: 'white', fontWeight: 'bold'}}>
                                {selectedItems.length ? 'Remove' : 'Select'} all
                              </Text>
                            </TouchableOpacity>

                            <View style={{flex: 1, flexDirection: 'row'}}>
                              {selectedItems.length && selectedItems.length > 0
                                ? selectedItems.map(id => {
                                    return (
                                      <Chip
                                        items={selectedItems}
                                        key={id}
                                        id={id}
                                        styles={{
                                          chipContainer: styles => ({
                                            ...styles,
                                            backgroundColor: colors.primary,
                                            // height: 24,
                                            alignSelf: 'center',
                                            borderWidth: 0,
                                            borderRadius: 20
                                          }),
                                          chipText: styles => ({
                                            ...styles,
                                            color: 'white'
                                          }),
                                          chipIcon: styles => ({
                                            ...styles,
                                            color: 'white'
                                          })
                                        }}
                                      />
                                    );
                                  })
                                : null}
                            </View>
                          </ScrollView>
                        </View>
                        <Items />
                        <ModalControls />
                      </View>
                    </SelectModal>
                  </SelectVisibilityWrapper>
                </View>

                <Chips />
              </React.Fragment>
            );
          }}
        </SectionedMultiSelect>
      </View>
    );
  }
}

export default ContextRenderFunctionExample;
