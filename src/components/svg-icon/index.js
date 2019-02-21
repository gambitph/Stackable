import { fab } from '@fortawesome/free-brands-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getIconArray } from '../icon-control'
import { library } from '@fortawesome/fontawesome-svg-core'

library.add( fab, far, fas )

const SvgIcon = props => {
	const { value, color, style = {} } = props
	const selectedIcon = getIconArray( value )
	return (
		selectedIcon && <FontAwesomeIcon color={ color } style={ style } icon={ selectedIcon } />
	)
}

SvgIcon.Content = props => {
	const { value } = props
	const selectedIcon = getIconArray( value )
	return (
		selectedIcon && <FontAwesomeIcon focusable={ undefined } icon={ selectedIcon } { ...props } />
	)
}

export default SvgIcon
