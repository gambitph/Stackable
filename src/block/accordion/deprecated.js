import { __ } from '@wordpress/i18n'
import { ArrowIcon } from './index'
import classnames from 'classnames'
import { descriptionPlaceholder } from '@stackable/util'
import { RichText } from '@wordpress/editor'

const deprecatedSchema_1_10 = {
	heading: {
		source: 'html',
		selector: '.ugb-accordion__heading h4',
		default: __( 'Title for This Block' ),
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
}

const deprecatedSave_1_10 = props => {
	const { className } = props
	const {
		headingColor,
		headingBackgroundColor,
		heading,
		text,
		openStart,
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-accordion',
	] )

	return (
		<div className={ mainClasses }>
			<input type="checkbox" checked={ openStart ? 'checked' : null } />
			<div className="ugb-accordion__heading"
				style={ {
					backgroundColor: headingBackgroundColor ? headingBackgroundColor : undefined,
				} }
			>
				<RichText.Content
					tagName="h4"
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
				value={ text }
			/>
		</div>
	)
}

const deprecated = [
	{
		attributes: deprecatedSchema_1_10,
		save: deprecatedSave_1_10,
		migrate: attributes => {
			return {
				...attributes,
				design: 'basic',
				borderRadius: 12,
				shadow: 3,
			}
		},
	},
]

export default deprecated
