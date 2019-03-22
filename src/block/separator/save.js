import { separators, shadows } from './separators'
import { applyFilters } from '@wordpress/hooks'
import classnames from 'classnames'

const save = props => {
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
			{ applyFilters( 'stackable.separator.save.output.before', null, design, props ) }
			<div className="ugb-separator__top-pad" style={ topPadStyle }></div>
			<div className="ugb-separator__svg-wrapper" style={ svgWrapperStyle }>
				{ layer1Shadow && <Shadow preserveAspectRatio="none" style={ layer1Style } /> }
				<Separator preserveAspectRatio="none" style={ layer1Style } />
				{ applyFilters( 'stackable.separator.save.output.layers', null, design, props ) }
			</div>
			<div className="ugb-separator__bottom-pad" style={ bottomPadStyle }></div>
		</div>
	)
}

export default save
