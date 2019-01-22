import classnames from 'classnames'

const save = props => {
	const { className } = props
	const {
		height, width, color, alignment,
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-divider',
	] )

	return (
		<div className={ mainClasses }><hr align={ alignment } style={ {
			backgroundColor: color, width: width + '%', height: height,
		} } /></div>
	)
}

export default save
