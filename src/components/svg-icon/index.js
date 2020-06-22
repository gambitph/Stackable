/**
 * Internal dependencies
 */
import { FontAwesomeIcon } from '~stackable/components'

const SvgIcon = props => {
	return <FontAwesomeIcon { ...props } />
}

SvgIcon.defaultProps = {
	value: '',
}

SvgIcon.Content = props => {
	return <FontAwesomeIcon.Content { ...props } />
}

SvgIcon.Content.defaultProps = {
	value: '',
}

export default SvgIcon
