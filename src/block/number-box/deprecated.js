import { __ } from '@wordpress/i18n'
import classnames from 'classnames'
import { descriptionPlaceholder } from '@stackable/util'
import { omit } from 'lodash'
import { RichText } from '@wordpress/editor'

const deprecatedSchema_1_10 = {
	numberBox: {
		source: 'html',
		selector: '.ugb-number-box-column-one span',
		default: __( '01' ),
	},
	numberBoxTwo: {
		source: 'html',
		selector: '.ugb-number-box-column-two span',
		default: __( '02' ),
	},
	numberBoxThree: {
		source: 'html',
		selector: '.ugb-number-box-column-three span',
		default: __( '03' ),
	},
	name: {
		source: 'html',
		selector: '.ugb-number-box-name',
		default: __( 'Title' ),
	},
	nameTwo: {
		source: 'html',
		selector: '.ugb-number-box-name-two',
		default: __( 'Title' ),
	},
	nameThree: {
		source: 'html',
		selector: '.ugb-number-box-name-three',
		default: __( 'Title' ),
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
