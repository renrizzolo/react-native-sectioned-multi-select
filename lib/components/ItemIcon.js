import React from 'react'
import PropTypes from 'prop-types'
import { Image } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'

const ItemIcon = ({ icon, iconKey, itemIconStyle }) => {
  return (
    typeof icon === 'object' || typeof icon === 'number' ?
      <Image
        source={icon}
        style={[{
          width: 16,
          height: 16,
          marginHorizontal: 10,
        }, itemIconStyle]
        }
      />
      :
      <Icon
        name={icon}
        style={[{ fontSize: 16 }, itemIconStyle]}
      />
  )
}
ItemIcon.PropTypes = {
  iconKey: PropTypes.string,
  itemIconStyle: PropTypes.object,
  icon: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      uri: PropTypes.string,
    }),
    PropTypes.number,
  ]).isRequired,
}
export default ItemIcon
