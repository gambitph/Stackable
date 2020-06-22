import SVGSpinner from './images/spinner.svg'
import {
	faAPILoaded,
	faIsAPILoaded,
	faGetSVGIcon,
} from '~stackable/util'

import {
	RawHTML, useEffect, useState,
} from '@wordpress/element'
import { omit } from 'lodash'

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

	const propsToPass = omit( props.propsToPass, [ 'prefix', 'iconName', 'value' ] )

	// If given an svg, just display it.
	if ( props.value.match( /^<svg/ ) ) {
		return <RawHTML { ...propsToPass }>{ props.value }</RawHTML>
	}

	// There's a chance that the Font Awesome library hasn't loaded yet, wait for it.
	if ( ! faIsAPILoaded() ) {
		return <Spinner />
	}

	const prefix = props.value ? props.value.replace( /-.*$/, '' ) : props.prefix
	const iconName = props.value ? props.value.replace( /^.*?-/, '' ) : props.iconName

	const iconHTML = faGetSVGIcon( prefix, iconName )
	return <RawHTML { ...propsToPass }>{ iconHTML }</RawHTML>
}

FontAwesomeIcon.Content = props => {
	const propsToPass = omit( props, [ 'prefix', 'iconName', 'value' ] )

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
