import { applyFilters } from '@wordpress/hooks'
import { ArrowIcon } from './index'
import classnames from 'classnames'
import { RichText } from '@wordpress/block-editor'

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
	], applyFilters( 'stackable.accordion.mainclasses', {
		[ `ugb-accordion--design-${ design }` ]: design !== 'basic',
		'ugb-accordion--open': openStart,
	}, design, props ) )

	const headingClasses = classnames( [
		'ugb-accordion__heading',
	], applyFilters( 'stackable.accordion.headingclasses', {
		[ `ugb--shadow-${ shadow }` ]: design !== 'plain' && shadow !== 3,
	}, design, props ) )

	const styles = applyFilters( 'stackable.accordion.styles', {
		main: {},
		heading: {
			borderRadius: design !== 'plain' && borderRadius !== 12 ? borderRadius : undefined,
			backgroundColor: design !== 'plain' && headingBackgroundColor ? headingBackgroundColor : undefined,
		},
		title: {
			color: headingColor ? headingColor : undefined,
		},
	}, design, props )

	return (
		<div className={ mainClasses } style={ styles.main } role="presentation">
			{ applyFilters( 'stackable.accordion.save.output.before', null, design, props ) }
			<div className={ headingClasses }
				role="button"
				tabIndex="0"
				aria-expanded={ openStart ? 'true' : 'false' }
				style={ styles.heading }
			>
				<RichText.Content
					tagName="h4"
					role="heading"
					aria-level="3"
					style={ styles.title }
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
				value={ text }
			/>
			{ applyFilters( 'stackable.accordion.save.output.after', null, design, props ) }
		</div>
	)
}

export default save
