import { ArrowIcon } from './index'
import classnames from 'classnames'
import md5 from 'md5'
import { RichText } from '@wordpress/editor'

// Accessibility: https://www.w3.org/TR/wai-aria-practices/examples/accordion/accordion.html
const save = props => {
	const { className } = props
	const {
		headingColor,
		headingBackgroundColor,
		heading,
		text,
		openStart,
		design = 'basic',
		borderRadius = 12,
		shadow = 3,
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-accordion',
	], {
		[ `ugb-accordion--design-${ design }` ]: design !== 'basic',
		'ugb-accordion--open': openStart,
	} )

	const headingClasses = classnames( [
		'ugb-accordion__heading',
	], {
		[ `ugb--shadow-${ shadow }` ]: design !== 'plain' && shadow !== 3,
	} )

	const headingStyles = {
		borderRadius: design !== 'plain' && borderRadius !== 12 ? borderRadius : undefined,
		backgroundColor: design !== 'plain' && headingBackgroundColor ? headingBackgroundColor : undefined,
	}

	const uid = md5( text + heading ).substr( 0, 6 )

	return (
		<div className={ mainClasses } role="presentation">
			<div className={ headingClasses }
				role="button"
				tabIndex="0"
				aria-expanded={ openStart ? 'true' : 'false' }
				style={ headingStyles }
			>
				<RichText.Content
					tagName="h4"
					role="heading"
					aria-level="3"
					id={ `${ uid }__heading` }
					aria-controls={ `${ uid }__text` }
					style={ { color: headingColor ? headingColor : undefined } }
					value={ heading }
				/>
				{ ArrowIcon( {
					fill: headingColor ? headingColor : undefined,
				} ) }
			</div>
			<RichText.Content
				tagName="p"
				className="ugb-accordion__text"
				role="region"
				id={ `${ uid }__text` }
				aria-labelledby={ `${ uid }__heading` }
				value={ text }
			/>
		</div>
	)
}

export default save
