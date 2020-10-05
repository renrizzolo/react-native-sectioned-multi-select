import React from 'react'
import PropTypes from 'prop-types'
import { Image } from 'react-native'

const ItemIcon = ({ iconRenderer: Icon, icon, iconKey, itemIconStyle }) => {
  return typeof icon === 'object' || typeof icon === 'number' ? (
    <Image
      accessibilityIgnoresInvertColors
      source={icon}
      style={[
        {
          width: 32,
          height: 32,
          marginHorizontal: 10
        },
        itemIconStyle
      ]}
    />
  ) : (
    <Icon name={icon} style={[{ fontSize: 16 }, itemIconStyle]} />
  )
}
ItemIcon.propTypes = {
  iconKey: PropTypes.string,
  itemIconStyle: PropTypes.object,
  icon: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      uri: PropTypes.string
    }),
    PropTypes.number
  ]).isRequired
}
export default ItemIcon
