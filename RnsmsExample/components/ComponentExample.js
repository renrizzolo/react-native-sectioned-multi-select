import * as React from 'react';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';

// this example outlines using SectionedMultiSelect as a component
// this is the classic/legacy implementation, everything is configured via props
class ComponentExample extends React.Component {
  render() {
    return (
      <SectionedMultiSelect
        itemId={item => `item--${item.title}`}
        getChildren={item => item.children}
        childItemId={item => `child--${item.title}`}
        subKey="children"
        displayKey="title"
        iconKey="icon"
        iconNames={{
          search: 'magnify',
          close: 'close',
          checkMark: 'check',
          arrowDown: 'chevron-down',
          arrowUp: 'chevron-up'
        }}
        modalWithSafeAreaView={true}
        {...this.props}
      />
    );
  }
}

export default ComponentExample;
