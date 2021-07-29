/**
 * External dependencies
 */
import {
	faAPILoaded, faIsAPILoaded, faGetSVGIcon, faIconLoaded, createElementFromHTMLString,
} from '~stackable/util'
import { pick } from 'lodash'

/**
 * WordPress dependencies
 */
import {
	useState, useEffect, RawHTML, useMemo, renderToString,
} from '@wordpress/element'
import { Spinner } from '@wordpress/components'

/**
 * Sets an aria-label to an SVG string and returning
 * the modified SVG string.
 *
 * @param {string} svgHTML
 * @param {string} ariaLabel
 *
 * @return {string} modified SVG HTML
 */
const addSVGAriaLabel = ( svgHTML, ariaLabel = '' ) => {
	const svgNode = createElementFromHTMLString( svgHTML )
	svgNode.removeAttribute( 'role' )
	if ( ariaLabel ) {
		svgNode.setAttribute( 'aria-label', ariaLabel )
	} else {
		svgNode.setAttribute( 'aria-hidden', 'true' )
	}

	return svgNode.outerHTML
}

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
		const svg = addSVGAriaLabel( props.value, props.ariaLabel )
		return <RawHTML { ...propsToPass }>{ prependRender + svg }</RawHTML>
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

		if ( ! iconHTML ) {
			faIconLoaded( prefix, iconName ).then( forceUpdate )
			return <Spinner />
		}

		return <RawHTML { ...propsToPass }>{ prependRender + addSVGAriaLabel( iconHTML, props.ariaLabel ) }</RawHTML>
	}

	// If no value, just display a smiley placeholder.
	const iconHTML = faGetSVGIcon( 'far', 'smile' )
	return <RawHTML { ...propsToPass }>{ prependRender + addSVGAriaLabel( iconHTML, props.ariaLabel ) }</RawHTML>
}

FontAwesomeIcon.Content = props => {
	const propsToPass = pick( props, [ 'className', 'color', 'fill', 'style' ] )

	const prependRender = props.prependRender ? renderToString( props.prependRender ) : ''

	// If given an svg, just display it.
	if ( typeof props.value === 'string' ) {
		if ( props.value.match( /^<svg/ ) ) {
			const svg = addSVGAriaLabel( props.value, props.ariaLabel )
			return <RawHTML { ...propsToPass }>{ prependRender + svg }</RawHTML>
		}
	}

	const prefix = props.value ? props.value.replace( /-.*$/, '' ) : props.prefix
	const iconName = props.value ? props.value.replace( /^.*?-/, '' ) : props.iconName

	const iconHTML = faGetSVGIcon( prefix, iconName )
	return <RawHTML { ...propsToPass }>{ prependRender + addSVGAriaLabel( iconHTML, props.ariaLabel ) }</RawHTML>
}

FontAwesomeIcon.defaultProps = {
	ariaLabel: '',
	prefix: '',
	iconName: '',
	value: '', // This is the old-style of prefix + iconName e.g. 'fab-apple'
}

export default FontAwesomeIcon
