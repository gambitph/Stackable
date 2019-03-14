import { applyFilters } from '@wordpress/hooks'
import classnames from 'classnames'
import { Fragment } from '@wordpress/element'

const save = props => {
	const { className } = props
	const {
		height,
		width,
		color,
		alignment,
		design = '',
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-divider',
	], applyFilters( 'stackable.divider.mainclasses', {}, design, props ) )

	return (
		<Fragment>
			{ applyFilters( 'stackable.divider.save.output.before', null, design, props ) }
			<div className={ mainClasses }>
				<hr align={ alignment } style={ {
					backgroundColor: color,
					width: width + '%',
					height: height,
				} }
				/>
			</div>
		</Fragment>
	)
}

export default save
