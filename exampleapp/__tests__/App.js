import 'react-native'
import React from 'react'
import SectionedMultiSelect from 'react-native-sectioned-multi-select'
import App from '../App'
// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer'

// 'it probably didn't break'

const tree = renderer.create(<App />)
it('renders example app correctly', () => {
  tree
})
it('matches the snapshot', () => {
  // make assertions on tree
  expect(tree.toJSON()).toMatchSnapshot()
})

const testInstance = tree.root
it('has an expected prop', () => {
  expect(testInstance.findAllByType(SectionedMultiSelect)[0].props.single).toBe(
    false
  )
})
