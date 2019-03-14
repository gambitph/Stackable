import { applyFilters } from '@wordpress/hooks'
import classnames from 'classnames'

const save = props => {
	const { className } = props
	const {
		height,
		design = '',
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-spacer',
	], applyFilters( 'stackable.spacer.mainclasses', {}, design, props ) )

	return (
		<div className={ mainClasses } style={ { height: height + 'px' } }>
			{ applyFilters( 'stackable.spacer.save.output.before', null, design, props ) }
		</div>
	)
}

export default save
