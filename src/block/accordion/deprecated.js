import classnames from 'classnames'
import { descriptionPlaceholder } from '@stackable/util'
import md5 from 'md5'
import { RichText } from '@wordpress/block-editor'
import SVGArrowIconV112 from './images/arrow-v1-12.svg'

const deprecatedSchema_1_12 = {
	heading: {
		source: 'html',
		selector: '.ugb-accordion__heading h4',
		default: 'Title for This Block',
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
}

const deprecatedSave_1_12 = props => {
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
				<SVGArrowIconV112 width="20" height="20" fill={ headingColor ? headingColor : undefined } />
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

const deprecatedSchema_1_11 = {
	heading: {
		source: 'html',
		selector: '.ugb-accordion__heading h4',
		default: 'Title for This Block',
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
}

const deprecatedSave_1_11 = props => {
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

	const ArrowIcon = props => {
		return (
			<svg role="img" focusable="false" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" { ...props }>
				<polygon points="16.7,3.3 10,10 3.3,3.4 0,6.7 10,16.7 10,16.6 20,6.7 " />
			</svg>
		)
	}

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

const deprecatedSchema_1_10 = {
	heading: {
		source: 'html',
		selector: '.ugb-accordion__heading h4',
		default: 'Title for This Block',
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

	const ArrowIcon = props => {
		return (
			<svg role="img" focusable="false" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" { ...props }>
				<polygon points="16.7,3.3 10,10 3.3,3.4 0,6.7 10,16.7 10,16.6 20,6.7 " />
			</svg>
		)
	}

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
		attributes: deprecatedSchema_1_12,
		save: deprecatedSave_1_12,
	},
	{
		attributes: deprecatedSchema_1_11,
		save: deprecatedSave_1_11,
	},
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
