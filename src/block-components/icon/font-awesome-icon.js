/**
 * External dependencies
 */
import {
	faAPILoaded, faIsAPILoaded, faGetSVGIcon, faIconLoaded,
} from '~stackable/util'
import { pick } from 'lodash'

/**
 * WordPress dependencies
 */
import {
	useState, useEffect, RawHTML, useMemo, renderToString,
} from '@wordpress/element'
import { Spinner } from '@wordpress/components'

const FontAwesomeIcon = props => {
	const [ forceUpdateCount, setForceUpdateCount ] = useState( 0 )
	const forceUpdate = () => {
		setForceUpdateCount( forceUpdateCount + 1 )
	}

	const prependRender = useMemo( () => props.prependRender ? renderToString( props.prependRender ) : '', [ props.prependRender ] )

	// Wait for the FA API to load.
	useEffect( () => {
		faAPILoaded().then( forceUpdate )
	}, [] )

	const propsToPass = pick( props, [ 'className', 'color', 'fill', 'style' ] )

	// If given an svg, just display it.
	if ( typeof props.value === 'string' && props.value.match( /^<svg/ ) ) {
		return <RawHTML { ...propsToPass }>{ prependRender + props.value }</RawHTML>
	}

	if ( ! faIsAPILoaded() ) {
		return <Spinner />
	}

	const prefix = props.value ? props.value.replace( /-.*$/, '' ) : props.prefix
	const iconName = props.value ? props.value.replace( /^.*?-/, '' ) : props.iconName

	// Display the icon.
	if ( prefix && iconName ) {
		const iconHTML = faGetSVGIcon( prefix, iconName )

		if ( ! iconHTML ) {
			faIconLoaded( prefix, iconName ).then( forceUpdate )
			return <Spinner />
		}

		return <RawHTML { ...propsToPass }>{ prependRender + iconHTML }</RawHTML>
	}

	// If no value, just display a smiley placeholder.
	const iconHTML = faGetSVGIcon( 'far', 'smile' )
	return <RawHTML { ...propsToPass }>{ prependRender + iconHTML }</RawHTML>
}

FontAwesomeIcon.Content = props => {
	const propsToPass = pick( props, [ 'className', 'color', 'fill', 'style' ] )

	const prependRender = props.prependRender ? renderToString( props.prependRender ) : ''

	if ( typeof props.value === 'string' ) {
		if ( props.value.match( /^<svg/ ) ) {
			return <RawHTML { ...propsToPass }>{ prependRender + props.value }</RawHTML>
		}
	}

	const prefix = props.value ? props.value.replace( /-.*$/, '' ) : props.prefix
	const iconName = props.value ? props.value.replace( /^.*?-/, '' ) : props.iconName

	const iconHTML = faGetSVGIcon( prefix, iconName )
	return <RawHTML { ...propsToPass }>{ prependRender + iconHTML }</RawHTML>
}

export default FontAwesomeIcon
