/**
 * External dependencies
 */
import {
	DeprecatedButtonContent_1_15_5,
} from '~stackable/components/button-edit'
import {
	descriptionPlaceholder,
} from '~stackable/util'
import classnames from 'classnames'
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import { RichText } from '@wordpress/block-editor'

import schema from './schema'
import save from './save'

export const deprecatedSchema_1_17_3 = {
	mediaID: {
		type: 'number',
	},
	mediaURL: {
		type: 'string',
		source: 'attribute',
		selector: '.ugb-card__image-container',
		attribute: 'data-src',
	},
	heading: {
		source: 'html',
		selector: '.ugb-card__title',
		default: __( 'Title for This Block', i18n ),
	},
	tagline: {
		source: 'html',
		selector: '.ugb-card__tagline',
		default: __( 'Subtitle for this block', i18n ),
	},
	des: {
		source: 'html',
		selector: '.ugb-card__description',
		default: descriptionPlaceholder( 'long' ),
	},
	headingColor: {
		type: 'string',
	},
	taglineColor: {
		type: 'string',
	},
	desColor: {
		type: 'string',
	},
	buttonURL: {
		type: 'string',
		source: 'attribute',
		selector: '.ugb-button',
		attribute: 'href',
		default: '',
	},
	buttonNewTab: {
		type: 'boolean',
		source: 'attribute',
		selector: '.ugb-button',
		attribute: 'target',
		default: false,
	},
	buttonText: {
		source: 'html',
		selector: '.ugb-button span',
		default: __( 'Button text', i18n ),
	},
	buttonColor: {
		type: 'string',
	},
	buttonIcon: {
		type: 'string',
	},
	buttonTextColor: {
		type: 'string',
		default: '#ffffff',
	},
	size: {
		type: 'string',
		default: 'normal',
	},
	cornerButtonRadius: {
		type: 'number',
		default: 4,
	},
	buttonDesign: {
		type: 'string',
		default: 'basic',
	},
	contentAlign: {
		type: 'string',
		default: 'left',
	},
	// Design related attributes.
	design: {
		type: 'string',
		default: 'basic',
	},
	backgroundColor: {
		type: 'string',
		// default: '#ffffff',
	},
	borderRadius: {
		type: 'number',
		default: 12,
	},
	shadow: {
		type: 'number',
		default: 3,
	},
	hoverEffect: {
		type: 'string',
		default: '',
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

const deprecatedSave_1_17_3 = props => {
	const { className } = props
	const {
		heading,
		tagline,
		des,
		mediaURL,
		headingColor,
		taglineColor,
		desColor,
		buttonURL,
		buttonNewTab,
		buttonText,
		buttonColor,
		buttonTextColor,
		size,
		cornerButtonRadius,
		contentAlign,
		buttonDesign,
		buttonIcon,
		design = 'basic',
		backgroundColor,
		borderRadius = 12,
		shadow = 3,
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-card',
	], applyFilters( 'stackable.card.mainclasses_1_17_3', {
		[ `ugb-card--design-${ design }` ]: design !== 'basic',
		[ `ugb--shadow-${ shadow }` ]: design !== 'plain' && shadow !== 3,
	}, design, props ) )

	const mainStyles = {
		borderRadius: design !== 'plain' ? borderRadius : undefined,
		backgroundColor: design !== 'plain' ? backgroundColor : undefined,
	}

	const imageClasses = classnames( [
		'ugb-card__image-container',
	], {
		[ `ugb--shadow-${ shadow }` ]: design === 'plain',
	} )

	const imageStyles = {
		borderRadius: design === 'plain' ? borderRadius : undefined,
	}

	return (
		<div className={ mainClasses } style={ mainStyles }>
			{ applyFilters( 'stackable.card.save.output.before_1_17_3', null, design, props ) }
			{ mediaURL && (
				<div
					className={ imageClasses }
					style={ {
						...imageStyles,
						backgroundImage: `url(${ mediaURL })`,
						textAlign: contentAlign,
					} }
					data-src={ mediaURL }
				/>
			) }
			{ ! RichText.isEmpty( heading ) && (
				<RichText.Content
					tagName="h4"
					className="ugb-card__title"
					style={ { color: headingColor, textAlign: contentAlign } }
					value={ heading }
				/>
			) }
			{ ! RichText.isEmpty( tagline ) && (
				<RichText.Content
					tagName="p"
					className="ugb-card__tagline"
					style={ { color: taglineColor, textAlign: contentAlign } }
					value={ tagline }
				/>
			) }
			{ ! RichText.isEmpty( des ) && (
				<RichText.Content
					tagName="p"
					className="ugb-card__description"
					style={ { color: desColor, textAlign: contentAlign } }
					value={ des }
				/>
			) }
			{ buttonText && !! buttonText.length && (
				<DeprecatedButtonContent_1_15_5
					size={ size }
					url={ buttonURL }
					newTab={ buttonNewTab }
					align={ contentAlign }
					color={ buttonTextColor }
					text={ buttonText }
					icon={ buttonIcon }
					design={ buttonDesign }
					backgroundColor={ buttonColor }
					borderRadius={ cornerButtonRadius }
				/>
			) }
			{ applyFilters( 'stackable.card.save.output.after_1_17_3', null, design, props ) }
		</div>
	)
}

const deprecated = [
	// The design attribute should now be blank be default.
	{
		attributes: {
			...schema,
			design: {
				type: 'string',
				default: 'basic',
			},
		},
		save,
		migrate: attributes => {
			return {
				...attributes,
				design: attributes.design || 'basic',
			}
		},
	},
	{
		attributes: deprecatedSchema_1_17_3,
		save: deprecatedSave_1_17_3,
		migrate: attributes => {
			// Update the custom CSS since the structure has changed.
			const updateCSS = css => ( css || '' )
				.replace( /\.ugb-card([\s\{\[\.\#\:])/g, '.ugb-card__item$1' )
				.replace( /\.ugb-card__tagline([\s\{\[\.\#\:])/g, '.ugb-card__subtitle$1' )
				.replace( /\.ugb-card__image-container([\s\{\[\.\#\:])/g, '.ugb-card__image$1' )

			return {
				...attributes,

				// Custom CSS.
				customCSS: updateCSS( attributes.customCSS ),
				customCSSCompiled: updateCSS( attributes.customCSSCompiled ),

				columns: 1,
				showButton: !! attributes.buttonText,
				image1Id: attributes.mediaID,
				image1Url: attributes.mediaURL,
				title1: attributes.heading,
				subtitle1: attributes.tagline,
				description1: attributes.des,
				titleColor: attributes.headingColor,
				subtitleColor: attributes.taglineColor,
				descriptionColor: attributes.desColor,
				button1Url: attributes.buttonURL,
				button1NewTab: attributes.buttonNewTab,
				button1Text: attributes.buttonText,
				buttonBackgroundColor: attributes.buttonColor,
				buttonIcon: attributes.buttonIcon,
				buttonTextColor: attributes.buttonTextColor,
				buttonSize: attributes.size,
				buttonBorderRadius: attributes.cornerButtonRadius,
				buttonDesign: attributes.buttonDesign,
				columnBackgroundColor: attributes.backgroundColor,
			}
		},
	},
]

export default deprecated
