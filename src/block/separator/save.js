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
		'ugb-separator',
	], applyFilters( 'stackable.separator.mainclasses', {}, design, props ) )

	return (
		<Fragment>
			{ applyFilters( 'stackable.separator.save.output.before', null, design, props ) }
			<div className={ mainClasses } style={ { height: height + 'px' } }></div>
		</Fragment>
	)
}

export default save
