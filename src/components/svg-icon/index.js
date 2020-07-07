/**
 * Internal dependencies
 */
import { FontAwesomeIcon } from '~stackable/components'
import { getShapeSVG } from '~stackable/util'
import classnames from 'classnames'

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'

const wrapBackgroundShape = ( icon, shape ) => {
	const ShapeComp = getShapeSVG( shape || 'blob1' )
	if ( ! ShapeComp ) {
		return icon
	}

	return (
		<div className="ugb-icon__bg-shape-wrapper">
			{ icon }
			<ShapeComp className="ugb-icon__bg-shape" />
		</div>
	)
}

/**
 * Extracts the first SVG tag it could find in an HTML string.
 *
 * @param {string} _htmlString String to extract the svg.
 */
const extractSvg = _htmlString => {
	const htmlString = applyFilters( 'stackable.svg-icon.extract-svg', _htmlString )
	if ( htmlString.match( /^<svg(.*?)<\/svg>$/g ) ) {
		return htmlString
	} else if ( htmlString.match( /<svg/ ) ) {
		return ( htmlString.match( /<svg.*?<\/svg>/g ) || [ htmlString ] )[ 0 ]
	}
	return htmlString
}

const SvgIcon = props => {
	const propsToPass = {
		...props,
		value: typeof props.value === 'string' ? extractSvg( props.value ) : props.value,
	}

	const classNames = classnames( [
		'ugb-icon-inner-svg',
		props.className,
	], {
		[ `ugb-icon--${ props.colorType }` ]: props.colorType && props.colorType !== 'single',
	} )

	let ret = (
		<FontAwesomeIcon { ...propsToPass } className={ classNames } />
	)

	if ( props.design === 'shaped' || props.design === 'outlined' ) {
		ret = <div className={ `ugb-icon__design-wrapper ugb-icon__design-${ props.design }` } >{ ret }</div>
	}

	if ( props.showBackgroundShape ) {
		ret = wrapBackgroundShape( ret, props.backgroundShape )
	}

	ret = applyFilters( 'stackable.component.svg-icon', ret, propsToPass )

	return ret
}

SvgIcon.defaultProps = {
	className: '',

	value: '', // The icon name or icon SVG.
	design: '', // Can be plain, shaped or outlined

	colorType: '', // Blank/single, gradient or multicolor.

	// Show background shape.
	showBackgroundShape: false,
	backgroundShape: '', // An SVG to add as a background

	// The icon has a gradient color.
	gradientColor1: '',
	gradientColor2: '',
	gradientDirection: 0, // Only supports every 45 degrees.
}

SvgIcon.Content = props => {
	const propsToPass = {
		...props,
		value: typeof props.value === 'string' ? extractSvg( props.value ) : props.value,
	}

	const classNames = classnames( [
		'ugb-icon-inner-svg',
		props.className,
	], {
		[ `ugb-icon--${ props.colorType }` ]: props.colorType && props.colorType !== 'single',
	} )

	let ret = <FontAwesomeIcon.Content { ...propsToPass } className={ classNames } />

	if ( props.design === 'shaped' || props.design === 'outlined' ) {
		ret = <div className={ `ugb-icon__design-wrapper ugb-icon__design-${ props.design }` } >{ ret }</div>
	}

	if ( props.showBackgroundShape ) {
		ret = wrapBackgroundShape( ret, props.backgroundShape )
	}

	ret = applyFilters( 'stackable.component.svg-icon', ret, propsToPass )

	return ret
}

SvgIcon.Content.defaultProps = {
	...SvgIcon.defaultProps,
}

export default SvgIcon
