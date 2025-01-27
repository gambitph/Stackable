/**
 * External dependencies
 */
import {
	faGetIcon, faFetchIcon, createElementFromHTMLString,
} from '~stackable/util'
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
 *
 * @param {string} svgHTML
 * @param {Object} attributesToAdd
 * @param {Array} attributesToRemove
 *
 * @return {string} modified SVG HTML
 */
const addSVGAttributes = ( svgHTML, attributesToAdd = {}, attributesToRemove = [] ) => {
	const svgNode = createElementFromHTMLString( svgHTML )
	if ( ! svgNode ) {
		return ''
	}

	Object.keys( attributesToAdd ).forEach( key => {
		svgNode.setAttribute( key, attributesToAdd[ key ] )
	} )

	attributesToRemove.forEach( key => {
		svgNode.removeAttribute( key )
	} )

	return svgNode.outerHTML
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
