/**
 * External dependencies
 */
import {
	DeprecatedButtonContent_1_15_5,
} from '~stackable/components/button-edit'
import {
	descriptionPlaceholder,
	createBackgroundAttributes,
	createImageBackgroundAttributes,
	createAllCombinationAttributes,
	createResponsiveAttributes,
	createTypographyAttributes,
	createButtonAttributes,
} from '~stackable/util'
import classnames from 'classnames'
import { i18n } from 'stackable'
import {
	BlockContainer, ButtonEditHelper, DivBackground,
} from '~stackable/components'
import {
	withBlockStyles, withUniqueClass,
} from '~stackable/higher-order'
import { range } from 'lodash'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import { RichText } from '@wordpress/block-editor'
import { compose } from '@wordpress/compose'
import { Fragment } from '@wordpress/element'

/**
 * Internal dependencies
 */
import createStyles from './style'
import { showOptions } from './util'

export const deprecatedSchema_2_11_4 = {
	design: {
		type: 'string',
		default: 'basic',
	},
	columns: {
		type: 'number',
		default: 2,
	},
	borderRadius: {
		type: 'number',
		default: '',
	},
	shadow: {
		type: 'number',
		default: '',
	},

	// Background.
	...createBackgroundAttributes( 'column%s' ),

	// Image.
	showImage: {
		type: 'boolean',
		default: true,
	},
	...createImageBackgroundAttributes( 'image%s' ),
	...createAllCombinationAttributes(
		'imageBackground%s%s', {
			type: 'number',
			default: '',
		},
		[ '', 'Tablet', 'Mobile' ],
		[ 'Width', 'Height' ]
	),
	...createResponsiveAttributes( 'imageBackground%sWidthUnit', {
		type: 'string',
		default: '%',
	} ),
	...createAllCombinationAttributes(
		'image%sId', {
			type: 'number',
			default: '',
		},
		[ '1', '2', '3' ]
	),
	...createAllCombinationAttributes(
		'image%sUrl', {
			type: 'string',
			default: '',
		},
		[ '1', '2', '3' ]
	),

	// Title.
	...createAllCombinationAttributes(
		'title%s', {
			type: 'string',
			source: 'html',
			selector: '.ugb-card__item%d .ugb-card__title',
			default: __( 'Title for This Block', i18n ),
		},
		[ '1', '2', '3' ]
	),
	showTitle: {
		type: 'boolean',
		default: true,
	},
	titleTag: {
		type: 'string',
		default: '',
	},
	...createTypographyAttributes( 'title%s' ),
	titleColor: {
		type: 'string',
		default: '',
	},

	// Subtitle.
	...createAllCombinationAttributes(
		'subtitle%s', {
			type: 'string',
			source: 'html',
			selector: '.ugb-card__item%d .ugb-card__subtitle',
			default: __( 'Subtitle for This Block', i18n ),
		},
		[ '1', '2', '3' ]
	),
	showSubtitle: {
		type: 'boolean',
		default: true,
	},
	...createTypographyAttributes( 'subtitle%s' ),
	subtitleColor: {
		type: 'string',
		default: '',
	},

	// Description.
	...createAllCombinationAttributes(
		'description%s', {
			type: 'string',
			source: 'html',
			selector: '.ugb-card__item%d .ugb-card__description',
			default: descriptionPlaceholder( 'medium' ),
		},
		[ '1', '2', '3' ]
	),
	showDescription: {
		type: 'boolean',
		default: true,
	},
	...createTypographyAttributes( 'description%s' ),
	descriptionColor: {
		type: 'string',
		default: '',
	},

	// Button.
	showButton: {
		type: 'boolean',
		default: true,
	},
	...createButtonAttributes( 'button%s', {
		exclude: [
			'Text',
			'Url',
			'NewTab',
			'NoFollow',
		],
	} ),
	...createButtonAttributes( 'button1%s', {
		selector: '.ugb-card__item1 .ugb-button',
	} ),
	...createButtonAttributes( 'button2%s', {
		selector: '.ugb-card__item2 .ugb-button',
	} ),
	...createButtonAttributes( 'button3%s', {
		selector: '.ugb-card__item3 .ugb-button',
	} ),

	// Alignments.
	...createAllCombinationAttributes(
		'%s%sAlign', {
			type: 'string',
			default: '',
		},
		[ 'Image', 'Title', 'Subtitle', 'Description', 'Button' ],
		[ '', 'Tablet', 'Mobile' ]
	),

	// Spacing.
	...createAllCombinationAttributes(
		'%s%sBottomMargin', {
			type: 'number',
			default: '',
		},
		[ 'Image', 'Title', 'Subtitle', 'Description', 'Button' ],
		[ '', 'Tablet', 'Mobile' ]
	),

	// Advanced colors.
	...createAllCombinationAttributes(
		'Column%sBackgroundColor', {
			type: 'string',
			default: '',
		},
		[ '1', '2', '3' ]
	),

	hoverEffect: {
		type: 'string',
		default: '',
	},
}

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

const deprecatedSave_2_11_4 = props => {
	const { className, attributes } = props
	const {
		columns = 2,
		design = 'basic',
		shadow = '',

		titleTag = 'h4',
		showImage = true,
		showTitle = true,
		showSubtitle = true,
		showDescription = true,
		showButton = true,
		buttonIcon = '',
	} = attributes

	const show = showOptions( props )

	const mainClasses = classnames( [
		className,
		'ugb-card--v2',
		`ugb-card--design-${ design }`,
		`ugb-card--columns-${ columns }`,
	], applyFilters( 'stackable.card.mainclasses', {
	}, props ) )

	return (
		<BlockContainer.Save className={ mainClasses } blockProps={ props } render={ () => (
			<Fragment>
				{ range( 1, columns + 1 ).map( i => {
					const imageUrl = attributes[ `image${ i }Url` ]
					const title = attributes[ `title${ i }` ]
					const subtitle = attributes[ `subtitle${ i }` ]
					const description = attributes[ `description${ i }` ]
					const buttonText = attributes[ `button${ i }Text` ]

					const itemClasses = classnames( [
						'ugb-card__item',
						`ugb-card__item${ i }`,
					], applyFilters( 'stackable.card.itemclasses', {
						[ `ugb--shadow-${ shadow }` ]: show.columnBackground && shadow !== '',
					}, props ) )

					const imageClasses = classnames( [
						'ugb-card__image',
					], applyFilters( 'stackable.card.imageclasses', {
						[ `ugb--shadow-${ shadow }` ]: ! show.columnBackground,
					}, props ) )

					return (
						<DivBackground
							className={ itemClasses }
							backgroundAttrName="column%s"
							blockProps={ props }
							showBackground={ show.columnBackground }
							key={ i }
						>
							{ showImage && imageUrl &&
								<div className={ imageClasses } />
							}
							<div className="ugb-card__content">
								{ showTitle && ! RichText.isEmpty( title ) &&
									<RichText.Content
										tagName={ titleTag || 'h4' }
										className="ugb-card__title"
										value={ title }
									/>
								}
								{ showSubtitle && ! RichText.isEmpty( subtitle ) &&
									<RichText.Content
										tagName="p"
										className="ugb-card__subtitle"
										value={ subtitle }
									/>
								}
								{ showDescription && ! RichText.isEmpty( description ) &&
									<RichText.Content
										tagName="p"
										className="ugb-card__description"
										value={ description }
									/>
								}
								{ showButton && ! RichText.isEmpty( buttonText ) &&
									<ButtonEditHelper.Content
										attrNameTemplate={ `button%s` }
										blockAttributes={ props.attributes }
										text={ buttonText }
										icon={ attributes[ `button${ i }Icon` ] || buttonIcon }
										url={ attributes[ `button${ i }Url` ] }
										newTab={ attributes[ `button${ i }NewTab` ] }
										noFollow={ attributes[ `button${ i }NoFollow` ] }
									/>
								}
							</div>
						</DivBackground>
					)
				} ) }
			</Fragment>
		) } />
	)
}

const deprecated = [
	{
		attributes: deprecatedSchema_2_11_4,
		save: compose( withUniqueClass, withBlockStyles( createStyles ) )( deprecatedSave_2_11_4 ),
		migrate: attributes => {
			return attributes
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
