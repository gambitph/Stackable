import {
	DeprecatedButtonContent_1_10,
	DeprecatedButtonContent_1_12,
	DeprecatedButtonContent_1_9,
	DeprecatedButtonContent_1_9_1,
} from '@stackable/components/button-edit'
import classnames from 'classnames'
import { descriptionPlaceholder } from '@stackable/util'
import { RichText } from '@wordpress/block-editor'

const deprecatedSave_1_12 = props => {
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
		backgroundColor = '#ffffff',
		borderRadius = 12,
		shadow = 3,
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-card',
	], {
		[ `ugb-card--design-${ design }` ]: design !== 'basic',
		[ `ugb--shadow-${ shadow }` ]: design !== 'plain' && shadow !== 3,
	} )

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
				<DeprecatedButtonContent_1_12
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
		</div>
	)
}

const deprecatedSchema_1_12 = {
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
		default: 'Title for This Block',
	},
	tagline: {
		source: 'html',
		selector: '.ugb-card__tagline',
		default: 'Subtitle for this block',
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
		default: 'Button text',
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
}

const deprecatedSave_1_10 = props => {
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
		buttonText,
		buttonColor,
		buttonTextColor,
		size,
		cornerButtonRadius,
		contentAlign,
		buttonDesign,
		buttonIcon,
		design,
		backgroundColor,
		borderRadius,
		shadow,
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-card',
	], {
		[ `ugb-design-${ design }` ]: design !== 'basic',
		[ `ugb-shadow-${ shadow }` ]: design !== 'plain',
	} )

	const mainStyles = {
		borderRadius: design !== 'plain' ? borderRadius : undefined,
		backgroundColor: design !== 'plain' ? backgroundColor : undefined,
	}

	const imageClasses = classnames( [
		'ugb-card-image-container',
	], {
		[ `ugb-shadow-${ shadow }` ]: design === 'plain',
	} )

	const imageStyles = {
		borderRadius: design === 'plain' ? borderRadius : undefined,
	}

	return (
		<div className={ mainClasses } style={ mainStyles }>
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
					style={ { color: headingColor, textAlign: contentAlign } }
					value={ heading }
				/>
			) }
			{ ! RichText.isEmpty( tagline ) && (
				<RichText.Content
					tagName="p"
					className="ugb-tagline"
					style={ { color: taglineColor, textAlign: contentAlign } }
					value={ tagline }
				/>
			) }
			{ ! RichText.isEmpty( des ) && (
				<RichText.Content
					tagName="p"
					className="ugb-card-des"
					style={ { color: desColor, textAlign: contentAlign } }
					value={ des }
				/>
			) }
			{ buttonText && !! buttonText.length && (
				<DeprecatedButtonContent_1_10
					size={ size }
					url={ buttonURL }
					align={ contentAlign }
					color={ buttonTextColor }
					text={ buttonText }
					icon={ buttonIcon }
					design={ buttonDesign }
					backgroundColor={ buttonColor }
					borderRadius={ cornerButtonRadius }
				/>
			) }
		</div>
	)
}

const deprecatedSchema_1_10 = {
	mediaID: {
		type: 'number',
	},
	mediaURL: {
		type: 'string',
		source: 'attribute',
		selector: '.ugb-card-image-container',
		attribute: 'data-src',
	},
	heading: {
		source: 'html',
		selector: '.ugb-card h4',
		default: 'Title for This Block',
	},
	tagline: {
		source: 'html',
		selector: '.ugb-tagline',
		default: 'Subtitle for this block',
	},
	des: {
		source: 'html',
		selector: '.ugb-card-des',
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
	},
	buttonText: {
		source: 'html',
		selector: '.ugb-button span',
		default: 'Button text',
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
		default: '#ffffff',
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

const deprecatedSave_1_9_1 = props => {
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
		buttonText,
		buttonColor,
		buttonTextColor,
		size,
		cornerButtonRadius,
		contentAlign,
		buttonDesign,
		buttonIcon,
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-card',
	], {
		'has-image': mediaURL,
	} )

	return (
		<div className={ mainClasses }>
			{ mediaURL && <div className="ugb-card-image-container" style={ { backgroundImage: `url(${ mediaURL })`, textAlign: contentAlign } } data-src={ mediaURL }></div> }
			{ ! RichText.isEmpty( heading ) && (
				<RichText.Content
					tagName="h4"
					style={ { color: headingColor, textAlign: contentAlign } }
					value={ heading }
				/>
			) }
			{ ! RichText.isEmpty( tagline ) && (
				<RichText.Content
					tagName="p"
					className="ugb-tagline"
					style={ { color: taglineColor, textAlign: contentAlign } }
					value={ tagline }
				/>
			) }
			{ ! RichText.isEmpty( des ) && (
				<RichText.Content
					tagName="p"
					className="ugb-card-des"
					style={ { color: desColor, textAlign: contentAlign } }
					value={ des }
				/>
			) }
			{ buttonText && !! buttonText.length && (
				<DeprecatedButtonContent_1_9_1
					size={ size }
					url={ buttonURL }
					align={ contentAlign }
					color={ buttonTextColor }
					text={ buttonText }
					icon={ buttonIcon }
					design={ buttonDesign }
					backgroundColor={ buttonColor }
					borderRadius={ cornerButtonRadius }
				/>
			) }
		</div>
	)
}

const deprecatedSchema_1_9_1 = {
	mediaID: {
		type: 'number',
	},
	mediaURL: {
		type: 'string',
		source: 'attribute',
		selector: '.ugb-card-image-container',
		attribute: 'data-src',
	},
	heading: {
		source: 'html',
		selector: '.ugb-card h4',
		default: 'Ben Adams',
	},
	tagline: {
		source: 'html',
		selector: '.ugb-tagline',
		default: 'Ben is the head of our small team',
	},
	des: {
		source: 'html',
		selector: '.ugb-card-des',
		default: 'Ben is the head of our small team. He loves walking his dog, Walter, when he has some free time.',
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
	},
	buttonText: {
		source: 'html',
		selector: '.ugb-button span',
		default: 'Button',
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
}

export const deprecatedSchema_1_9 = {
	mediaID: {
		type: 'number',
	},
	mediaURL: {
		type: 'string',
		source: 'attribute',
		selector: '.ugb-card-image-container',
		attribute: 'data-src',
	},
	heading: {
		source: 'html',
		selector: '.ugb-card h4',
		default: 'Ben Adams',
	},
	tagline: {
		source: 'html',
		selector: '.ugb-tagline',
		default: 'Ben is the head of our small team',
	},
	des: {
		source: 'html',
		selector: '.ugb-card-des',
		default: 'Ben is the head of our small team. He loves walking his dog, Walter, when he has some free time.',
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
		selector: '.ugb-button-inner',
		attribute: 'href',
	},
	buttonText: {
		source: 'html',
		selector: '.ugb-button-inner',
		default: 'Button',
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
}

export const deprecatedSave_1_9 = props => {
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
		buttonText,
		buttonColor,
		buttonTextColor,
		size,
		cornerButtonRadius,
		contentAlign,
		buttonDesign,
		buttonIcon,
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-card',
	], {
		'has-image': mediaURL,
	} )

	return (
		<div className={ mainClasses }>
			{ mediaURL && <div className="ugb-card-image-container" style={ { backgroundImage: `url(${ mediaURL })`, textAlign: contentAlign } } data-src={ mediaURL }></div> }
			{ ! RichText.isEmpty( heading ) && (
				<RichText.Content
					tagName="h4"
					style={ { color: headingColor, textAlign: contentAlign } }
					value={ heading }
				/>
			) }
			{ ! RichText.isEmpty( tagline ) && (
				<RichText.Content
					tagName="p"
					className="ugb-tagline"
					style={ { color: taglineColor, textAlign: contentAlign } }
					value={ tagline }
				/>
			) }
			{ ! RichText.isEmpty( des ) && (
				<RichText.Content
					tagName="p"
					className="ugb-card-des"
					style={ { color: desColor, textAlign: contentAlign } }
					value={ des }
				/>
			) }
			{ buttonText && !! buttonText.length && (
				<DeprecatedButtonContent_1_9
					size={ size }
					url={ buttonURL }
					align={ contentAlign }
					color={ buttonTextColor }
					text={ buttonText }
					icon={ buttonIcon }
					design={ buttonDesign }
					backgroundColor={ buttonColor }
					borderRadius={ cornerButtonRadius }
				/>
			) }
		</div>
	)
}

const deprecated = [
	{
		attributes: deprecatedSchema_1_12,
		save: deprecatedSave_1_12,
	},
	{
		attributes: deprecatedSchema_1_10,
		save: deprecatedSave_1_10,
		migrate: attributes => {
			return {
				...attributes,
				buttonNewTab: false,
			}
		},
	},
	{
		attributes: deprecatedSchema_1_9_1,
		save: deprecatedSave_1_9_1,
		migrate: attributes => {
			return {
				...attributes,
				design: 'basic',
				backgroundColor: '#ffffff',
				borderRadius: 12,
				shadow: 3,
			}
		},
	},
	{
		attributes: deprecatedSchema_1_9,
		save: deprecatedSave_1_9,
	},
]

export default deprecated
