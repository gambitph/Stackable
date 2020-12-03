/**
 * Internal dependencies
 */
import SVGArrowIconV1173 from './deprecated/images_1_17_3/arrow.svg'

/**
 * External dependencies
 */
import { descriptionPlaceholder } from '~stackable/util'
import classnames from 'classnames'
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import { createBlock } from '@wordpress/blocks'
import { RichText } from '@wordpress/block-editor'

const ArrowIcon_1_17_3 = ( { fill } ) => <SVGArrowIconV1173 width="20" height="20" fill={ fill } />

const deprecatedSchema_1_17_3 = {
	heading: {
		source: 'html',
		selector: '.ugb-accordion__heading h4',
		default: __( 'Title for This Block', i18n ),
	},
	text: {
		source: 'html',
		selector: '.ugb-accordion__text',
		default: descriptionPlaceholder( 'long' ),
	},
	headingColor: {
		type: 'string',
	},
	headingBackgroundColor: {
		type: 'string',
	},
	openStart: {
		type: 'boolean',
		default: false,
	},
	design: {
		type: 'string',
		default: 'basic',
	},
	borderRadius: {
		type: 'number',
		default: 12,
	},
	shadow: {
		type: 'number',
		default: 3,
	},

	// Custom CSS attributes.
	customCSSUniqueID: {
		type: 'string',
		default: '',
	},
	customCSS: {
		type: 'string',
		default: '',
	},
	customCSSCompiled: {
		type: 'string',
		default: '',
	},
}

// Accessibility: https://www.w3.org/TR/wai-aria-practices/examples/accordion/accordion.html
const deprecatedSave_1_17_3 = props => {
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
	], applyFilters( 'stackable.accordion.mainclasses_1_17_3', {
		[ `ugb-accordion--design-${ design }` ]: design !== 'basic',
		'ugb-accordion--open': openStart,
	}, design, props ) )

	const headingClasses = classnames( [
		'ugb-accordion__heading',
	], applyFilters( 'stackable.accordion.headingclasses_1_17_3', {
		[ `ugb--shadow-${ shadow }` ]: design !== 'plain' && shadow !== 3,
	}, design, props ) )

	const styles = applyFilters( 'stackable.accordion.styles_1_17_3', {
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
			{ applyFilters( 'stackable.accordion.save.output.before_1_17_3', null, design, props ) }
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
				{ ArrowIcon_1_17_3( {
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

const deprecated = [
	{
		attributes: deprecatedSchema_1_17_3,
		save: deprecatedSave_1_17_3,
		migrate: attributes => {
			// Update the custom CSS since the structure has changed.
			const updateCSS = css => ( css || '' )
				.replace( /\n\.ugb-accordion__heading h4(\s*{)/g, '\n.ugb-accordion__title$1' )
				.replace( /\.ugb-accordion__text/g, '.ugb-accordion__content' )
				.replace( /\.ugb-accordion__heading svg/g, '.ugb-accordion__arrow' )

			const newAttributes = {
				...attributes,

				// Custom CSS.
				customCSS: updateCSS( attributes.customCSS ),
				customCSSCompiled: updateCSS( attributes.customCSSCompiled ),

				// Change old attribute names.
				title: attributes.heading,
				titleColor: attributes.headingColor || '#222222',
				containerBackgroundColor: attributes.headingBackgroundColor,

				// New attributes in order to replicate the old designs.
				showBorder: attributes.design !== 'plain',
				containerClosedBackgroundColor: attributes.design === 'colored' ? '#ffffff' : undefined,
				arrowColor: attributes.design === 'colored' || attributes.design === 'basic' || attributes.design === 'plain' ? attributes.headingColor || '#222222' :
					attributes.design === 'line-colored' ? attributes.headingBackgroundColor : undefined,
			}

			// Old block didn't have inner blocks.
			const newInnerBlocks = [
				createBlock( 'core/paragraph', {
					content: attributes.text,
				} ),
			]

			return [ newAttributes, newInnerBlocks ]
		},
	},
]

export default deprecated
