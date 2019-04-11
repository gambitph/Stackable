import { applyFilters } from '@wordpress/hooks'

export const createStyles = props => {
	const {
		height,
		design = 'wave-1',
		backgroundColor = '',
		flipVertically = false,
		flipHorizontally = false,
		layer1Color = '',
		layer1Width = 1,
		layer1Flip = false,
		layer1Shadow = false,

		marginTop = 0,
		marginRight = '',
		marginBottom = 0,
		marginLeft = '',
		marginUnit = 'px',
		paddingTop = 0,
		paddingRight = '',
		paddingBottom = 0,
		paddingLeft = '',
		paddingUnit = 'px',

		tabletMarginTop = '',
		tabletMarginRight = '',
		tabletMarginBottom = '',
		tabletMarginLeft = '',
		tabletMarginUnit = 'px',
		tabletPaddingTop = '',
		tabletPaddingBottom = '',
		tabletPaddingRight = '',
		tabletPaddingLeft = '',
		tabletPaddingUnit = 'px',

		mobileMarginTop = '',
		mobileMarginRight = '',
		mobileMarginBottom = '',
		mobileMarginLeft = '',
		mobileMarginUnit = 'px',
		mobilePaddingTop = '',
		mobilePaddingBottom = '',
		mobilePaddingRight = '',
		mobilePaddingLeft = '',
		mobilePaddingUnit = 'px',
	} = props.attributes

	return {
		'.ugb-separator': {
			backgroundColor: backgroundColor ? backgroundColor : undefined,
			marginTop: `${ marginTop - 1 }${ marginUnit }`, // -1 to prevent white lines.
			marginBottom: `${ marginBottom - 1 }${ marginUnit }`, // -1 to prevent white lines.
			marginRight: marginRight !== '' ? `${ marginRight }${ marginUnit }` : undefined,
			marginLeft: marginLeft !== '' ? `${ marginLeft }${ marginUnit }` : undefined,
			paddingLeft: paddingLeft !== '' ? `${ paddingLeft }${ paddingUnit }` : undefined,
			paddingRight: paddingRight !== '' ? `${ paddingRight }${ paddingUnit }` : undefined,
		},
		'.ugb-separator__bottom-pad': {
			height: paddingBottom !== '' ? `${ paddingBottom }${ paddingUnit }` : undefined,
			background: layer1Color ? layer1Color : undefined,
		},
		'.ugb-separator__top-pad': {
			height: paddingTop !== '' ? `${ paddingTop }${ paddingUnit }` : undefined,
			background: backgroundColor ? backgroundColor : undefined,
		},
		'.ugb-separator__svg-wrapper': {
			height: height !== '' ? `${ height }px` : undefined,
		},
		'.ugb-separator__shadow, .ugb-separator__layer-1': {
			fill: layer1Color ? layer1Color : undefined,
			transform: ( () => {
				let transform = layer1Width ? `scaleX(${ layer1Width })` : undefined
				if ( layer1Flip ) {
					transform = transform ? `${ transform } scaleX(-1)` : 'scaleX(-1)'
				}
				return transform
			} )(),
		},
		tablet: {
			'.ugb-separator': {
				marginTop: tabletMarginTop !== '' ? `${ tabletMarginTop - 1 }${ tabletMarginUnit }` : undefined, // -1 to prevent white lines.
			},
		},
	}
}

export default createStyles
