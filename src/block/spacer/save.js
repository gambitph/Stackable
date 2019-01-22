import classnames from 'classnames'

const save = props => {
	const { className } = props
	const { height } = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-spacer',
	] )

	return (
		<div className={ mainClasses } style={ { height: height + 'px' } }></div>
	)
}

export default save
