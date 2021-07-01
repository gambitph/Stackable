/**
 * Internal dependencies
 */
import { separators, shadows } from './deprecated/separators_1_15'

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'

/**
 * External dependencies
 */
import classnames from 'classnames'

export const deprecatedSave_1_15 = props => {
	const { className } = props

	const {
		height,
		design = 'wave-1',
		marginTop = 0,
		marginBottom = 0,
		paddingTop = 0,
		paddingBottom = 0,
		backgroundColor = '',
		flipVertically = false,
		flipHorizontally = false,
		layer1Color = '',
		layer1Width = 1,
		layer1Flip = false,
		layer1Shadow = false,
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-separator',
		`ugb-separator--design-${ design }`,
	], applyFilters( 'stackable.separator.mainclasses', {
		'ugb-separator--flip-vertical': flipVertically,
		'ugb-separator--flip-horizontal': flipHorizontally,
	}, design, props ) )

	const mainStyle = {
		backgroundColor: backgroundColor ? backgroundColor : undefined,
		marginTop: `${ marginTop - 1 }px`, // -1 to prevent white lines.
		marginBottom: `${ marginBottom - 1 }px`, // -1 to prevent white lines.
	}

	const bottomPadStyle = {
		height: `${ paddingBottom }px`,
		background: layer1Color ? layer1Color : undefined,
	}

	const topPadStyle = {
		height: `${ paddingTop }px`,
		background: backgroundColor ? backgroundColor : undefined,
	}

	const svgWrapperStyle = {
		height: height + 'px',
	}

	const layer1Style = {
		fill: layer1Color ? layer1Color : undefined,
		transform: layer1Width ? `scaleX(${ layer1Width })` : undefined,
	}

	if ( layer1Flip ) {
		layer1Style.transform = layer1Style.transform ? `${ layer1Style.transform } scaleX(-1)` : 'scaleX(-1)'
	}

	const Separator = separators[ design ]
	const Shadow = shadows[ design ]

	return (
		<div className={ mainClasses } style={ mainStyle } aria-hidden="true">
			{ applyFilters( 'stackable.separator.save.output.before_1_15', null, design, props ) }
			<div className="ugb-separator__top-pad" style={ topPadStyle }></div>
			<div className="ugb-separator__svg-wrapper" style={ svgWrapperStyle }>
				<div className="ugb-separator__svg-inner">
					{ layer1Shadow && <Shadow preserveAspectRatio="none" style={ layer1Style } /> }
					<Separator preserveAspectRatio="none" style={ layer1Style } />
					{ applyFilters( 'stackable.separator.save.output.layers_1_15', null, design, props ) }
				</div>
			</div>
			<div className="ugb-separator__bottom-pad" style={ bottomPadStyle }></div>
		</div>
	)
}

export const deprecatedSchema_1_15 = {
	align: {
		type: 'string',
		default: 'full',
	},
	design: {
		type: 'string',
		default: 'wave-1',
	},
	height: {
		type: 'number',
		default: 200,
	},
	flipVertically: {
		type: 'boolean',
		default: false,
	},
	flipHorizontally: {
		type: 'boolean',
		default: false,
	},
	backgroundColor: {
		type: 'string',
		default: '',
	},
	marginTop: {
		type: 'number',
		default: 0,
	},
	marginBottom: {
		type: 'number',
		default: 0,
	},
	paddingTop: {
		type: 'number',
		default: 0,
	},
	paddingBottom: {
		type: 'number',
		default: 0,
	},

	// Separator
	layer1Color: {
		type: 'string',
		default: '',
	},
	layer1Width: {
		type: 'number',
		default: 1,
	},
	layer1Flip: {
		type: 'boolean',
		default: false,
	},
	layer1Shadow: {
		type: 'boolean',
		default: false,
	},

	// Layer 2
	layer2: {
		type: 'boolean',
		default: false,
	},
	layer2Color: {
		type: 'string',
		default: '',
	},
	layer2Height: {
		type: 'number',
		default: 1,
	},
	layer2Width: {
		type: 'number',
		default: 1,
	},
	layer2Flip: {
		type: 'boolean',
		default: false,
	},
	layer2Opacity: {
		type: 'number',
		default: 0.5,
	},

	// Layer 3
	layer3: {
		type: 'boolean',
		default: false,
	},
	layer3Color: {
		type: 'string',
		default: '',
	},
	layer3Height: {
		type: 'number',
		default: 1,
	},
	layer3Width: {
		type: 'number',
		default: 1,
	},
	layer3Flip: {
		type: 'boolean',
		default: false,
	},
	layer3Opacity: {
		type: 'number',
		default: 0.5,
	},

	// Custom CSS attributes.
	customCSSUniqueID: {
		type: 'string',
		default: '',
	},
	customCSS: {
		type: 'string',
		default: '',
	},
	customCSSCompiled: {
		type: 'string',
		default: '',
	},
}

const deprecated = [
	{
		attributes: deprecatedSchema_1_15,
		save: deprecatedSave_1_15,
	},
]

export default deprecated
