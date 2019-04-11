export const createStyles = props => {
	const {
		height,
		backgroundColor = '',
		layer1Color = '',
		layer1Width = 1,
		layer1Flip = false,

		marginTop = 0,
		marginBottom = 0,
		marginUnit = 'px',
		paddingTop = 0,
		paddingBottom = 0,
		paddingUnit = 'px',
	} = props.attributes

	return {
		'.ugb-separator': {
			backgroundColor: backgroundColor ? backgroundColor : undefined,
			marginTop: `${ marginTop - 1 }${ marginUnit }`, // -1 to prevent white lines.
			marginBottom: `${ marginBottom - 1 }${ marginUnit }`, // -1 to prevent white lines.
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
	}
}

export default createStyles
