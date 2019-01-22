import classnames from 'classnames'
import { RichText } from '@wordpress/editor'

const save = props => {
	const { className } = props
	const {
		url,
		text,
		align,
		color,
		size,
		cornerButtonRadius,
		borderThickness,
	} = props.attributes

	const buttonStyle = {
		borderColor: color,
		borderRadius: cornerButtonRadius + 'px',
		borderWidth: borderThickness + 'px',
	}

	const mainClasses = classnames( [
		className,
		`ugb-button`,
		`ugb-ghost-button`,
		`ugb-button-${ align }`,
		`ugb-button-${ size }`,
	] )

	return (
		<div className={ mainClasses } style={ buttonStyle }>
			<RichText.Content
				className="ugb-button-inner"
				tagName="a"
				value={ text }
				href={ url }
				style={ { color } }
			/>
		</div>
	)
}

export default save
