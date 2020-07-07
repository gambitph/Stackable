import SVGSpinner from './images/spinner.svg'
import {
	faAPILoaded,
	faIsAPILoaded,
	faGetSVGIcon,
	faIconLoaded,
} from '~stackable/util'

import {
	RawHTML, useEffect, useState,
} from '@wordpress/element'
import { pick } from 'lodash'

const Spinner = () => {
	return <SVGSpinner className="ugb-icon-is-loading" />
}

const FontAwesomeIcon = props => {
	const [ forceUpdateCount, setForceUpdateCount ] = useState( 0 )
	const forceUpdate = () => {
		setForceUpdateCount( forceUpdateCount + 1 )
	}

	// Wait for the FA API to load.
	useEffect( () => {
		faAPILoaded().then( forceUpdate )
	}, [] )

	const propsToPass = pick( props, [ 'className', 'color', 'fill', 'style' ] )

	// If given an svg, just display it.
	if ( typeof props.value === 'string' ) {
		if ( props.value.match( /^<svg/ ) ) {
			return <RawHTML { ...propsToPass }>{ props.value }</RawHTML>
		}
	}

	// There's a chance that the Font Awesome library hasn't loaded yet, wait for it.
	if ( ! faIsAPILoaded() ) {
		return <Spinner />
	}

	const prefix = props.value ? props.value.replace( /-.*$/, '' ) : props.prefix
	const iconName = props.value ? props.value.replace( /^.*?-/, '' ) : props.iconName

	// Display the icon.
	if ( prefix && iconName ) {
		const iconHTML = faGetSVGIcon( prefix, iconName )

		// Just in case the icon hasn't loaded yet, wait for it.
		if ( ! iconHTML ) {
			faIconLoaded( prefix, iconName ).then( forceUpdate )
			return <Spinner />
		}

		return <RawHTML { ...propsToPass }>{ iconHTML }</RawHTML>
	}

	// If no value, just display a smiley placeholder.
	const iconHTML = faGetSVGIcon( 'far', 'smile' )
	return <RawHTML { ...propsToPass } className={ `${ props.className } ugb-icon--faded` }>{ iconHTML }</RawHTML>
}

FontAwesomeIcon.Content = props => {
	const propsToPass = pick( props, [ 'className', 'color', 'fill', 'style' ] )

	// If given an svg, just display it.
	if ( typeof props.value === 'string' ) {
		if ( props.value.match( /^<svg/ ) ) {
			return <RawHTML { ...propsToPass }>{ props.value }</RawHTML>
		}
	}

	const prefix = props.value ? props.value.replace( /-.*$/, '' ) : props.prefix
	const iconName = props.value ? props.value.replace( /^.*?-/, '' ) : props.iconName

	const iconHTML = faGetSVGIcon( prefix, iconName )
	return <RawHTML { ...propsToPass }>{ iconHTML }</RawHTML>
}

FontAwesomeIcon.defaultProps = {
	prefix: '',
	iconName: '',
	value: '', // This is the old-style of prefix + iconName e.g. 'fab-apple'
}

export default FontAwesomeIcon
