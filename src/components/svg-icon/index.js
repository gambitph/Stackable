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

const SvgIcon = props => {
	let ret = (
		<FontAwesomeIcon { ...props } className={ classnames( [ 'ugb-icon-inner-svg', props.className ] ) } />
	)

	if ( props.design === 'shaped' || props.design === 'outlined' ) {
		ret = <div className={ `ugb-icon__design-wrapper ugb-icon__design-${ props.design }` } >{ ret }</div>
	}

	if ( props.showBackgroundShape ) {
		ret = wrapBackgroundShape( ret, props.backgroundShape )
	}

	ret = applyFilters( 'stackable.component.svg-icon', ret, props )

	return ret
}

SvgIcon.defaultProps = {
	className: '',

	value: '', // The icon name or icon SVG.
	design: '', // Can be plain, shaped or outlined

	// Show background shape.
	showBackgroundShape: false,
	backgroundShape: '', // An SVG to add as a background

	// The icon has a gradient color.
	useGradient: false,
	gradientColor1: '',
	gradientColor2: '',
	gradientDirection: 0, // Only supports every 45 degrees.
}

SvgIcon.Content = props => {
	let ret = <FontAwesomeIcon.Content { ...props } className={ classnames( [ 'ugb-icon-inner-svg', props.className ] ) } />

	if ( props.design === 'shaped' || props.design === 'outlined' ) {
		ret = <div className={ `ugb-icon__design-wrapper ugb-icon__design-${ props.design }` } >{ ret }</div>
	}

	if ( props.showBackgroundShape ) {
		ret = wrapBackgroundShape( ret, props.backgroundShape )
	}

	ret = applyFilters( 'stackable.component.svg-icon', ret, props )

	return ret
}

SvgIcon.Content.defaultProps = {
	...SvgIcon.defaultProps,
}

export default SvgIcon
