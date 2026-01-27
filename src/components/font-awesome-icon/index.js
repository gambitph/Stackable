/**
 * External dependencies
 */
import { faGetIcon, faFetchIcon } from '~stackable/util'
import { pick } from 'lodash'

/**
 * WordPress dependencies
 */
import {
	useState, RawHTML, memo,
} from '@wordpress/element'
import { Spinner } from '@wordpress/components'

/**
 * Sets an aria-label to an SVG string and returning
 * the modified SVG string.
 *
 * @param {string} _svgHTML
 * @param {string} ariaLabel
 *
 * @return {string} modified SVG HTML
 */
const addSVGAriaLabel = ( _svgHTML, ariaLabel = '' ) => {
	let svgHTML = ''
	if ( ariaLabel ) {
		svgHTML = addSVGAttributes(
			_svgHTML,
			{
				'aria-label': ariaLabel,
				role: 'img',
			},
			[
				'aria-hidden',
			]
		)
	} else {
		svgHTML = addSVGAttributes(
			_svgHTML,
			{
				'aria-hidden': 'true',
			},
			[
				'aria-label',
				'role',
			]
		)
	}

	return svgHTML
}

/**
 * Given an SVG markup, sets an HTML attribute to the
 * HTML tag.
 * Optimized version using string manipulation instead of DOM operations
 *
 * @param {string} svgHTML
 * @param {Object} attributesToAdd
 * @param {Array} attributesToRemove
 *
 * @return {string} modified SVG HTML
 */
const addSVGAttributes = ( svgHTML, attributesToAdd = {}, attributesToRemove = [] ) => {
	if ( ! svgHTML || typeof svgHTML !== 'string' ) {
		return ''
	}

	// Find the opening <svg> tag (handles <svg>, <svg >, <svg...>)
	const svgTagMatch = svgHTML.match( /<svg\s*[^>]*>/i )
	if ( ! svgTagMatch ) {
		return svgHTML
	}

	const svgTagStart = svgTagMatch.index
	const svgTagEnd = svgTagStart + svgTagMatch[ 0 ].length
	const svgTag = svgTagMatch[ 0 ]
	const restOfSvg = svgHTML.substring( svgTagEnd )

	// Extract existing attributes from the SVG tag
	// Handles: key="value", key='value', key=value, and boolean attributes
	const attributes = {}
	// Extract the content between <svg and > (the attributes part)
	const attributesPart = svgTag.replace( /^<svg\s*/i, '' ).replace( />$/, '' )
	if ( attributesPart ) {
		// Match attribute name followed by = and value (with quotes or without)
		const attrRegex = /([\w:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g
		let attrMatch
		while ( ( attrMatch = attrRegex.exec( attributesPart ) ) !== null ) {
			const key = attrMatch[ 1 ]
			// Value can be in double quotes, single quotes, or unquoted
			const value = attrMatch[ 2 ] || attrMatch[ 3 ] || attrMatch[ 4 ] || ''
			attributes[ key ] = value
		}
	}

	// Remove specified attributes
	attributesToRemove.forEach( key => {
		delete attributes[ key ]
	} )

	// Add or update attributes
	Object.assign( attributes, attributesToAdd )

	// Rebuild the SVG tag
	const newAttributes = Object.keys( attributes )
		.map( key => {
			const value = attributes[ key ]
			// Escape double quotes in attribute values and wrap in double quotes
			const escapedValue = String( value ).replace( /"/g, '&quot;' )
			return `${ key }="${ escapedValue }"`
		} )
		.join( ' ' )

	const newSvgTag = newAttributes ? `<svg ${ newAttributes }>` : '<svg>'
	return svgHTML.substring( 0, svgTagStart ) + newSvgTag + restOfSvg
}

const FontAwesomeIcon = memo( props => {
	const {
		svgAttrsToAdd = { width: '32', height: '32' },
		svgAttrsToRemove = [ 'id', 'data-name' ],
	} = props
	const [ forceUpdateCount, setForceUpdateCount ] = useState( 0 )
	const forceUpdate = () => {
		setForceUpdateCount( forceUpdateCount + 1 )
	}

	const propsToPass = pick( props, [ 'className', 'color', 'fill', 'style' ] )

	// If given an svg, just display it.
	if ( typeof props.value === 'string' && props.value.match( /^<svg/ ) ) {
		let svg = addSVGAriaLabel( props.value, props.ariaLabel )
		// Add fallback SVG width and height values.
		svg = addSVGAttributes( svg, svgAttrsToAdd, svgAttrsToRemove )
		return <RawHTML { ...propsToPass }>{ props.prependRenderString + svg }</RawHTML>
	}

	const prefix = props.value ? props.value.replace( /-.*$/, '' ) : props.prefix
	const iconName = props.value ? props.value.replace( /^.*?-/, '' ) : props.iconName

	// Display the icon.
	if ( prefix && iconName ) {
		const iconHTML = faGetIcon( prefix, iconName )

		if ( ! iconHTML ) {
			faFetchIcon( prefix, iconName ).then( forceUpdate )
			return <Spinner />
		}

		let svg = addSVGAriaLabel( iconHTML, props.ariaLabel )
		// Add fallback SVG width and height values.
		svg = addSVGAttributes( svg, svgAttrsToAdd, svgAttrsToRemove )
		return <RawHTML { ...propsToPass }>{ props.prependRenderString + svg }</RawHTML>
	}

	// If no value, just display a smiley placeholder.
	const iconHTML = faGetIcon( 'far', 'smile' )

	if ( ! iconHTML ) {
		faFetchIcon( 'far', 'smile' ).then( forceUpdate )
		return <Spinner />
	}

	let svg = addSVGAriaLabel( iconHTML, props.ariaLabel )
	// Add fallback SVG width and height values.
	svg = addSVGAttributes( svg, svgAttrsToAdd, svgAttrsToRemove )
	return <RawHTML { ...propsToPass }>{ props.prependRenderString + svg }</RawHTML>
} )

FontAwesomeIcon.Content = props => {
	const propsToPass = pick( props, [ 'className', 'color', 'fill', 'style' ] )
	const {
		prependRenderString = '',
	} = props

	// const prependRenderString = props.prependRenderString ? renderToString( props.prependRenderString ) : ''

	// If given an svg, just display it.
	if ( typeof props.value === 'string' ) {
		if ( props.value.match( /^<svg/ ) ) {
			let svg = addSVGAriaLabel( props.value, props.ariaLabel )
			// Add fallback SVG width and height values.
			svg = addSVGAttributes( svg, { width: '32', height: '32' } )
			return <RawHTML { ...propsToPass }>{ prependRenderString + svg }</RawHTML>
		}
	}

	const prefix = props.value ? props.value.replace( /-.*$/, '' ) : props.prefix
	const iconName = props.value ? props.value.replace( /^.*?-/, '' ) : props.iconName

	const iconHTML = faGetIcon( prefix, iconName )
	let svg = addSVGAriaLabel( iconHTML, props.ariaLabel )
	// Add fallback SVG width and height values.
	svg = addSVGAttributes( svg, { width: '32', height: '32' } )
	return <RawHTML { ...propsToPass }>{ prependRenderString + svg }</RawHTML>
}

FontAwesomeIcon.defaultProps = {
	ariaLabel: '',
	prefix: '',
	iconName: '',
	value: '', // This is the old-style of prefix + iconName e.g. 'fab-apple'
	prependRenderString: '',
}

export default FontAwesomeIcon
