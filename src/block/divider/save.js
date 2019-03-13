import { applyFilters } from '@wordpress/hooks'
import classnames from 'classnames'

const save = props => {
	const { className } = props
	const {
		height, width, color, alignment,
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-divider',
	], applyFilters( 'stackable.divider.mainclasses', {}, props ) )

	return (
		<div className={ mainClasses }>
			{ applyFilters( 'stackable.divider.save.output.before', null, props ) }
			<hr align={ alignment } style={ {
				backgroundColor: color,
				width: width + '%',
				height: height,
			} }
			/>
		</div>
	)
}

export default save
