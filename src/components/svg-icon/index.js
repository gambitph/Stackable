/**
 * Internal dependencies
 */
import FontAwesomeIcon from '../font-awesome-icon'

/**
 * WordPress dependencies
 */
import { useMemo } from '@wordpress/element'

const extractSvg = htmlString => {
	if ( htmlString.match( /^<svg(.*?)<\/svg>$/g ) ) {
		return htmlString
	} else if ( htmlString.match( /<svg/ ) ) {
		return ( htmlString.match( /<svg.*?<\/svg>/g ) || [ htmlString ] )[ 0 ]
	}
	return htmlString
}

const SVGIcon = props => {
	const {
		...propsToPass
	} = props

	propsToPass.value = useMemo( () => props.value === 'string' ? extractSvg( props.value ) : props.value, [ props.value ] )

	return <FontAwesomeIcon { ...propsToPass } />
}

SVGIcon.Content = props => {
	const {
		...propsToPass
	} = props

	propsToPass.value = props.value === 'string' ? extractSvg( props.value ) : props.value

	return <FontAwesomeIcon.Content { ...propsToPass } />
}

export default SVGIcon
