import { applyFilters } from '@wordpress/hooks'
import classnames from 'classnames'
import { Fragment } from '@wordpress/element'

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
		<Fragment>
			{ applyFilters( 'stackable.spacer.save.output.before', null, design, props ) }
			<div className={ mainClasses } style={ { height: height + 'px' } }></div>
		</Fragment>
	)
}

export default save
