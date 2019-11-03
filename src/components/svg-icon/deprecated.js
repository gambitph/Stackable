/**
 * Internal dependencies
 */
import { getIconArray } from '../icon-control'

/**
 * External dependencies
 */
import { fab } from '@fortawesome/free-brands-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'

library.add( fab, far, fas )

export const SvgIcon_1_17_3 = props => {
	const {
		value, color, style = {}, className = '',
	} = props
	const selectedIcon = getIconArray( value )
	return (
		selectedIcon && <FontAwesomeIcon color={ color } style={ style } icon={ selectedIcon } className={ className } />
	)
}

SvgIcon_1_17_3.Content = props => {
	const { value } = props
	const selectedIcon = getIconArray( value )
	return (
		selectedIcon && <FontAwesomeIcon focusable={ undefined } icon={ selectedIcon } { ...props } />
	)
}
