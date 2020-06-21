/**
 * External dependencies
 */
import { descriptionPlaceholder, isDarkColor } from '~stackable/util'
import { range } from 'lodash'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import classnames from 'classnames'
import { RichText } from '@wordpress/block-editor'

const deprecatedSchema_1_15 = {
	num1: {
		source: 'html',
		selector: '.ugb-number-box__item:nth-of-type(1) .ugb-number-box__number',
		default: '01',
	},
	num2: {
		source: 'html',
		selector: '.ugb-number-box__item:nth-of-type(2) .ugb-number-box__number',
		default: '02',
	},
	num3: {
		source: 'html',
		selector: '.ugb-number-box__item:nth-of-type(3) .ugb-number-box__number',
		default: '03',
	},
	title1: {
		source: 'html',
		selector: '.ugb-number-box__item:nth-of-type(1) .ugb-number-box__title',
		default: __( 'Title' ),
	},
	title2: {
		source: 'html',
		selector: '.ugb-number-box__item:nth-of-type(2) .ugb-number-box__title',
		default: __( 'Title' ),
	},
	title3: {
		source: 'html',
		selector: '.ugb-number-box__item:nth-of-type(3) .ugb-number-box__title',
		default: __( 'Title' ),
	},
	description1: {
		source: 'html',
		selector: '.ugb-number-box__item:nth-of-type(1) .ugb-number-box__description',
		default: descriptionPlaceholder(),
	},
	description2: {
		source: 'html',
		selector: '.ugb-number-box__item:nth-of-type(2) .ugb-number-box__description',
		default: descriptionPlaceholder(),
	},
	description3: {
		source: 'html',
		selector: '.ugb-number-box__item:nth-of-type(3) .ugb-number-box__description',
		default: descriptionPlaceholder(),
	},
	numberColor: {
		type: 'string',
	},
	numberBGColor: {
		type: 'string',
	},
	titleColor: {
		type: 'string',
	},
	descriptionColor: {
		type: 'string',
	},
	columns: {
		type: 'number',
		default: 3,
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
	backgroundColor: {
		type: 'string',
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

	// Keep the old attributes. Gutenberg issue https://github.com/WordPress/gutenberg/issues/10406
	numberBox: {
		type: 'string',
	},
	numberBoxTwo: {
		type: 'string',
	},
	numberBoxThree: {
		type: 'string',
	},
	name: {
		type: 'string',
	},
	nameTwo: {
		type: 'string',
	},
	nameThree: {
		type: 'string',
	},
	body: {
		type: 'string',
	},
	bodyTwo: {
		type: 'string',
	},
	bodyThree: {
		type: 'string',
	},
	numberBoxColor: {
		type: 'string',
	},
	nameColor: {
		type: 'string',
	},
	bodyTextColor: {
		type: 'string',
	},
}

const deprecatedSave_1_15 = props => {
	const { className, attributes } = props
	const {
		numberColor,
		titleColor,
		descriptionColor,
		numberBGColor,
		columns = 3,
		design = 'basic',
		borderRadius = 12,
		shadow = 3,
		backgroundColor,
	} = attributes

	const mainClasses = classnames( [
		className,
		'ugb-number-box',
		'ugb-number-box--v2',
		`ugb-number-box--columns-${ columns }`,
	], applyFilters( 'stackable.number-box.mainclasses_1_15', {
		[ `ugb-number-box--design-${ design }` ]: design !== 'basic',
	}, design, props ) )

	return (
		<div className={ mainClasses }>
			{ applyFilters( 'stackable.number-box.save.output.before_1_15', null, design, props ) }
			{ range( 1, columns + 1 ).map( i => {
				const num = attributes[ `num${ i }` ]
				const title = attributes[ `title${ i }` ]
				const description = attributes[ `description${ i }` ]

				const boxClasses = classnames( [
					'ugb-number-box__item',
				], applyFilters( 'stackable.number-box.boxclasses_1_15', {
					[ `ugb--shadow-${ shadow }` ]: design !== 'plain' && shadow !== 3,
				}, design, props ) )

				const styles = applyFilters( 'stackable.number-box.styles_1_15', {
					box: {
						borderRadius: design !== 'plain' && borderRadius !== 12 ? borderRadius : undefined,
						backgroundColor: design !== 'plain' && backgroundColor ? backgroundColor : undefined,
					},
					number: {
						backgroundColor: numberBGColor,
						color: numberColor ? numberColor :
						       ! numberBGColor ? undefined :
						       isDarkColor( numberBGColor ) ? '#ffffff' : '#222222',
					},
					title: {
						color: titleColor ? titleColor :
						       design === 'plain' ? undefined :
						       ! backgroundColor ? undefined :
						       isDarkColor( backgroundColor ) ? '#ffffff' : '#222222',
					},
					description: {
						color: descriptionColor ? descriptionColor :
						       design === 'plain' ? undefined :
						       ! backgroundColor ? undefined :
						       isDarkColor( backgroundColor ) ? '#ffffff' : '#222222',
					},
				}, design, props )

				return (
					<div className={ boxClasses } style={ styles.box } key={ i }>
						{ ! RichText.isEmpty( num ) && (
							<RichText.Content
								tagName="span"
								className="ugb-number-box__number"
								style={ styles.number }
								value={ num }
							/>
						) }
						{ ( ! RichText.isEmpty( title ) || ! RichText.isEmpty( description ) ) &&
							<div className="ugb-number-box__content">
								{ ! RichText.isEmpty( title ) && (
									<RichText.Content
										tagName="h4"
										className="ugb-number-box__title"
										style={ styles.title }
										value={ title }
									/>
								) }
								{ ! RichText.isEmpty( description ) && (
									<RichText.Content
										tagName="p"
										className="ugb-number-box__description"
										style={ styles.description }
										value={ description }
									/>
								) }
							</div>
						}
					</div>
				)
			} ) }
			{ applyFilters( 'stackable.number-box.save.output.after_1_15', null, design, props ) }
		</div>
	)
}

const deprecated = [
	{
		attributes: deprecatedSchema_1_15,
		save: deprecatedSave_1_15,
		migrate: attributes => {
			return {
				...attributes,
				columns: attributes.columns ? attributes.columns : 3,
				columnBackgroundColor: attributes.backgroundColor ? attributes.backgroundColor : undefined,
				backgroundColor: undefined,
			}
		},
	},
]

export default deprecated
