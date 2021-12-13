import * as React from 'react'

const defaultSize = 22
const icons = ({ iconNames, colors, styles, getStyles, iconRenderer }) => {
  const Icon = iconRenderer
  return {
    SelectToggleIcon: ({ style }) => (
      <Icon
        name={iconNames.arrowDown}
        size={defaultSize}
        color={colors.selectToggleTextColor}
        style={style}
      />
    ),
    SelectToggleOpenIcon: ({ style }) => (
      <Icon
        name={iconNames.arrowUp}
        size={defaultSize}
        color={colors.selectToggleTextColor}
        style={style}
      />
    ),
    CancelIcon: () => (
      <Icon name={iconNames.cancel} size={defaultSize} color={colors.light} />
    ),
    SearchIcon: () => (
      <Icon
        name={iconNames.search}
        size={defaultSize}
        color={colors.searchIcon}
        style={{ marginHorizontal: 15 }}
      />
    ),
    SelectedIcon: ({ highlighted = false, styles: stylesFromProps = {} }) => {
      const selectedIconStyles = React.useMemo(
        () => getStyles('selectedIcon', { highlighted }, stylesFromProps),
        [stylesFromProps.selectedIcon, styles.selectedIcon, highlighted]
      )

      return (
        <Icon
          name={iconNames.checkMark}
          size={defaultSize}
          style={selectedIconStyles}
        />
      )
    },
    UnselectedIcon: () => null,
    DropDownToggleIcon: ({ styles: stylesFromProps = {}, isOpen }) => {
      const dropDownToggleIconStyles = React.useMemo(
        () => getStyles('dropDownToggleIcon', { isOpen }, stylesFromProps),
        [stylesFromProps.dropDownToggleIcon, styles.dropDownToggleIcon, isOpen]
      )

      return (
        <Icon
          name={isOpen ? iconNames.arrowDown : iconNames.arrowUp}
          size={22}
          style={dropDownToggleIconStyles}
        />
      )
    },
    ChipRemoveIcon: ({ styles: stylesFromProps = {} }) => {
      const chipIconStyles = React.useMemo(
        () => getStyles('chipIcon', {}, stylesFromProps),
        [stylesFromProps.chipIcon, styles.chipIcon]
      )
      return <Icon name={iconNames.close} style={chipIconStyles} />
    },
  }
}

export default icons
