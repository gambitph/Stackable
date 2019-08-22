/**
 * External dependencies
 */
import { descriptionPlaceholder, isDarkColor } from '~stackable/util'
import { omit, range } from 'lodash'

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

const deprecatedSchema_1_10 = {
	numberBox: {
		source: 'html',
		selector: '.ugb-number-box-column-one span',
		default: '01',
	},
	numberBoxTwo: {
		source: 'html',
		selector: '.ugb-number-box-column-two span',
		default: '02',
	},
	numberBoxThree: {
		source: 'html',
		selector: '.ugb-number-box-column-three span',
		default: '03',
	},
	name: {
		source: 'html',
		selector: '.ugb-number-box-name',
		default: 'Title',
	},
	nameTwo: {
		source: 'html',
		selector: '.ugb-number-box-name-two',
		default: 'Title',
	},
	nameThree: {
		source: 'html',
		selector: '.ugb-number-box-name-three',
		default: 'Title',
	},
	body: {
		source: 'html',
		selector: '.ugb-number-box-body',
		default: descriptionPlaceholder(),
	},
	bodyTwo: {
		source: 'html',
		selector: '.ugb-number-box-body-two',
		default: descriptionPlaceholder(),
	},
	bodyThree: {
		source: 'html',
		selector: '.ugb-number-box-body-three',
		default: descriptionPlaceholder(),
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
	numberBGColor: {
		type: 'string',
	},
	columns: {
		type: 'number',
		default: 3,
	},
}

const deprecatedSave_1_10 = props => {
	const { className } = props
	const {
		numberBox,
		numberBoxTwo,
		numberBoxThree,
		body,
		bodyTwo,
		bodyThree,
		name,
		nameTwo,
		nameThree,
		numberBoxColor,
		nameColor,
		bodyTextColor,
		numberBGColor,
		columns = 3,
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-number-box',
		`column-${ columns }`,
	] )

	return (
		<div className={ mainClasses }>
			<div className="ugb-number-box-column-one">
				{ ! RichText.isEmpty( numberBox ) && (
					<RichText.Content
						tagName="span"
						style={ { color: numberBoxColor, backgroundColor: numberBGColor } }
						value={ numberBox }
					/>
				) }
				{ ! RichText.isEmpty( name ) && (
					<RichText.Content
						tagName="h4"
						className="ugb-number-box-name"
						style={ { color: nameColor } }
						value={ name }
					/>
				) }
				{ ! RichText.isEmpty( body ) && (
					<RichText.Content
						tagName="p"
						className="ugb-number-box-body"
						style={ { color: bodyTextColor } }
						value={ body }
					/>
				) }
			</div>
			{ columns > 1 && (
				<div className="ugb-number-box-column-two">
					{ ! RichText.isEmpty( numberBoxTwo ) && (
						<RichText.Content
							tagName="span"
							style={ { color: numberBoxColor, backgroundColor: numberBGColor } }
							value={ numberBoxTwo }
						/>
					) }
					{ ! RichText.isEmpty( nameTwo ) && (
						<RichText.Content
							tagName="h4"
							className="ugb-number-box-name-two"
							style={ { color: nameColor } }
							value={ nameTwo }
						/>
					) }
					{ ! RichText.isEmpty( bodyTwo ) && (
						<RichText.Content
							tagName="p"
							className="ugb-number-box-body-two"
							style={ { color: bodyTextColor } }
							value={ bodyTwo }
						/>
					) }
				</div>
			) }
			{ columns > 2 && (
				<div className="ugb-number-box-column-three">
					{ ! RichText.isEmpty( numberBoxThree ) && (
						<RichText.Content
							tagName="span"
							style={ { color: numberBoxColor, backgroundColor: numberBGColor } }
							value={ numberBoxThree }
						/>
					) }
					{ ! RichText.isEmpty( nameThree ) && (
						<RichText.Content
							tagName="h4"
							className="ugb-number-box-name-three"
							style={ { color: nameColor } }
							value={ nameThree }
						/>
					) }
					{ ! RichText.isEmpty( bodyThree ) && (
						<RichText.Content
							tagName="p"
							className="ugb-number-box-body-three"
							style={ { color: bodyTextColor } }
							value={ bodyThree }
						/>
					) }
				</div>
			) }
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
	{
		attributes: deprecatedSchema_1_10,
		save: deprecatedSave_1_10,
		migrate: attributes => {
			return {
				...omit( attributes, [
					'numberBox',
					'numberBoxTwo',
					'numberBoxThree',
					'name',
					'nameTwo',
					'nameThree',
					'body',
					'bodyTwo',
					'bodyThree',
					'numberBoxColor',
					'nameColor',
					'bodyTextColor',
				] ),
				design: 'basic',
				borderRadius: 12,
				shadow: 3,
				num1: attributes.numberBox,
				num2: attributes.numberBoxTwo,
				num3: attributes.numberBoxThree,
				title1: attributes.name,
				title2: attributes.nameTwo,
				title3: attributes.nameThree,
				description1: attributes.body,
				description2: attributes.bodyTwo,
				description3: attributes.bodyThree,
				numberColor: attributes.numberBoxColor,
				titleColor: attributes.nameColor,
				descriptionColor: attributes.bodyTextColor,
			}
		},
	},
]

export default deprecated
