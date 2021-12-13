import * as React from 'react'

import {
  Platform,
  StyleSheet,
  View,
  Text,
  Modal,
  SafeAreaView,
  TouchableOpacity,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
} from 'react-native'
import useSMSContext from '../context/useSMSContext'
import { callIfFunction } from '../helpers'

const Touchable =
  Platform.OS === 'android' ? TouchableNativeFeedback : TouchableOpacity

export const SelectModal = ({ children, styles: stylesFromProps, ...rest }) => {
  const {
    _closeSelect,
    getModalProps,
    modalWithSafeAreaView,
    modalWithTouchable,
    selectIsVisible,
    getStyles,
  } = useSMSContext()
  console.log('is vis in modal', selectIsVisible)
  const Component = modalWithSafeAreaView ? SafeAreaView : View
  const Wrapper = modalWithTouchable ? TouchableWithoutFeedback : null
  const Backdrop = (props) =>
    Wrapper ? (
      <Wrapper onPress={_closeSelect}>
        <View {...props} />
      </Wrapper>
    ) : (
      <View {...props} />
    )

  return (
    <Modal {...getModalProps()} {...rest}>
      <Component style={getStyles('modalWrapper', {}, stylesFromProps)}>
        <Backdrop style={getStyles('backdrop', {}, stylesFromProps)} />

        <View style={getStyles('modalContainer', {}, stylesFromProps)}>
          {children}
        </View>
      </Component>
    </Modal>
  )
}

export const ModalControls = ({ styles: stylesFromProps = {} }) => {
  const {
    getStyles,
    confirmText,
    hideConfirm,
    components,
    showCancelButton,
    _submitSelection,
    styles,
    _cancelSelection,
  } = useSMSContext()

  const cancelButtonStyles = React.useMemo(
    () => getStyles('cancelButton', {}, stylesFromProps),
    [stylesFromProps.cancelButton, styles.cancelButton]
  )

  const submitButtonStyles = React.useMemo(
    () => getStyles('submitButton', {}, stylesFromProps),
    [stylesFromProps.submitButton, styles.submitButton]
  )
  const confirmTextStyles = React.useMemo(
    () => getStyles('confirmText', {}, stylesFromProps),
    [stylesFromProps.confirmText, styles.confirmText]
  )

  return (
    <View style={{ flexDirection: 'row' }}>
      {showCancelButton && (
        <Touchable
          accessibilityComponentType="button"
          onPress={_cancelSelection}
        >
          <View style={cancelButtonStyles}>
            <components.CancelIcon />
          </View>
        </Touchable>
      )}
      {!hideConfirm && (
        <Touchable
          accessibilityComponentType="button"
          onPress={_submitSelection}
          style={{ flex: 1 }}
        >
          <View style={submitButtonStyles}>
            <Text style={confirmTextStyles}>{confirmText}</Text>
          </View>
        </Touchable>
      )}
    </View>
  )
}
