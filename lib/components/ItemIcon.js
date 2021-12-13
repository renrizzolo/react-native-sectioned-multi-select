import React from 'react'
import PropTypes from 'prop-types'
import { Image } from 'react-native'
import { ViewPropTypes, Text } from 'react-native'

// import Icon from 'react-native-vector-icons/MaterialIcons'

const ItemIcon = ({ iconRenderer: Icon, icon, iconKey, style }) => {
  return typeof icon === 'object' || typeof icon === 'number' ? (
    <Image
      source={icon}
      style={[
        {
          width: 16,
          height: 16,
          marginHorizontal: 10,
        },
        style,
      ]}
    />
  ) : (
    <Icon name={icon} style={[{ fontSize: 16 }, style]} />
  )
}
ItemIcon.propTypes = {
  iconKey: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  icon: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      uri: PropTypes.string,
    }),
    PropTypes.number,
  ]).isRequired,
}
export default ItemIcon
