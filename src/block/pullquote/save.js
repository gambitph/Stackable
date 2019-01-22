import classnames from 'classnames'
import { RichText } from '@wordpress/editor'

const save = props => {
	const { className } = props
	const {
		color, text, quoteColor,
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-pullquote',
	] )

	return (
		<blockquote
			className={ mainClasses }
			style={ { '--quote-color': quoteColor } }>
			<RichText.Content
				tagName="p"
				style={ { color } }
				value={ text }
			/>
		</blockquote>
	)
}

export default save
