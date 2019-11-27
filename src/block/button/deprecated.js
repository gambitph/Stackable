/**
 * External dependencies
 */
import {
	DeprecatedButtonContent_1_10,
	DeprecatedButtonContent_1_12,
	DeprecatedButtonContent_1_15_5,
	DeprecatedButtonContent_1_4,
	DeprecatedButtonContent_1_9,
} from '~stackable/components/button-edit'
import { range } from '~stackable/util'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import classnames from 'classnames'

const deprecatedSchema_1_15_5 = {
	buttons: {
		type: 'number',
		default: 1,
	},
	url: {
		type: 'string',
		source: 'attribute',
		selector: 'a',
		attribute: 'href',
		default: '',
	},
	newTab: {
		type: 'boolean',
		source: 'attribute',
		selector: 'a',
		attribute: 'target',
		default: false,
	},
	text: {
		source: 'html',
		selector: 'a span',
		default: __( 'Button text' ),
	},
	align: {
		type: 'string',
		default: 'center',
	},
	color: {
		type: 'string',
	},
	textColor: {
		type: 'string',
	},
	size: {
		type: 'string',
		default: 'normal',
	},
	cornerButtonRadius: {
		type: 'number',
		default: 4,
	},
	design: {
		type: 'string',
		default: 'basic',
	},
	icon: {
		type: 'string',
	},

	url2: {
		type: 'string',
		source: 'attribute',
		selector: 'div:nth-of-type(2) .ugb-button',
		attribute: 'href',
		default: '',
	},
	newTab2: {
		type: 'boolean',
		source: 'attribute',
		selector: 'div:nth-of-type(2) .ugb-button',
		attribute: 'target',
		default: false,
	},
	text2: {
		source: 'html',
		selector: 'div:nth-of-type(2) .ugb-button span',
		default: __( 'Button text' ),
	},
	color2: {
		type: 'string',
	},
	textColor2: {
		type: 'string',
		default: '#ffffff',
	},
	size2: {
		type: 'string',
		default: 'normal',
	},
	design2: {
		type: 'string',
		default: 'basic',
	},
	icon2: {
		type: 'string',
	},

	url3: {
		type: 'string',
		source: 'attribute',
		selector: 'div:nth-of-type(3) .ugb-button',
		attribute: 'href',
		default: '',
	},
	newTab3: {
		type: 'boolean',
		source: 'attribute',
		selector: 'div:nth-of-type(3) .ugb-button',
		attribute: 'target',
		default: false,
	},
	text3: {
		source: 'html',
		selector: 'div:nth-of-type(3) .ugb-button span',
		default: __( 'Button text' ),
	},
	color3: {
		type: 'string',
	},
	textColor3: {
		type: 'string',
		default: '#ffffff',
	},
	size3: {
		type: 'string',
		default: 'normal',
	},
	design3: {
		type: 'string',
		default: 'basic',
	},
	icon3: {
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
}

const deprecatedSchema_1_15_5_ = {
	...deprecatedSchema_1_15_5,
	textColor2: {
		type: 'string',
	},
	textColor3: {
		type: 'string',
	},
}

export const deprecatedSave_1_15_5 = props => {
	const { className, attributes } = props
	const {
		align = 'center',
		cornerButtonRadius,
		buttons = 1,
		design = '',
	} = attributes

	// Remove align attribute from the class for migration.
	const newClassName = className.replace( /^align\w+/g, '' ).replace( /\salign\w+/g, ' ' ).replace( /\s+/g, ' ' ).trim()

	const mainClasses = classnames( [
		newClassName,
		'ugb-button-wrapper',
	], applyFilters( 'stackable.button.mainclasses_1_15_5', {
		[ `ugb-button--align-${ align }` ]: align,
	}, design, props ) )

	const saved = (
		<div className={ mainClasses }>
			{ range( 1, buttons + 1 ).map( i => {
				const {
					[ `text${ i === 1 ? '' : i }` ]: text,
					[ `size${ i === 1 ? '' : i }` ]: size = 'normal',
					[ `url${ i === 1 ? '' : i }` ]: url,
					[ `design${ i === 1 ? '' : i }` ]: design = 'basic',
					[ `color${ i === 1 ? '' : i }` ]: color,
					[ `textColor${ i === 1 ? '' : i }` ]: textColor,
					[ `icon${ i === 1 ? '' : i }` ]: icon,
					[ `newTab${ i === 1 ? '' : i }` ]: newTab,
				} = attributes

				// const buttonClasses = classnames(
				// 	applyFilters( 'stackable.button.buttonclasses', {}, design, i, props )
				// )

				return (
					<DeprecatedButtonContent_1_15_5 key={ i }
						// className={ buttonClasses }
						align={ align }
						size={ size }
						url={ url }
						newTab={ newTab }
						color={ textColor }
						text={ text }
						backgroundColor={ color }
						borderRadius={ cornerButtonRadius }
						design={ design }
						icon={ icon }
					/>
				)
			} ) }
			{ applyFilters( 'stackable.button.save.output.after_1_15_5', null, design, props ) }
		</div>
	)

	return saved
	// return applyFilters( 'stackable.designs.button.save', saved, props )
}

export const deprecatedSchema_1_12 = {
	buttons: {
		type: 'number',
		default: 1,
	},
	url: {
		type: 'string',
		source: 'attribute',
		selector: 'a',
		attribute: 'href',
		default: '',
	},
	newTab: {
		type: 'boolean',
		source: 'attribute',
		selector: 'a',
		attribute: 'target',
		default: false,
	},
	text: {
		source: 'html',
		selector: 'a span',
		default: 'Button text',
	},
	align: {
		type: 'string',
		default: 'center',
	},
	color: {
		type: 'string',
	},
	textColor: {
		type: 'string',
	},
	size: {
		type: 'string',
		default: 'normal',
	},
	cornerButtonRadius: {
		type: 'number',
		default: 4,
	},
	design: {
		type: 'string',
		default: 'basic',
	},
	icon: {
		type: 'string',
	},

	url2: {
		type: 'string',
		source: 'attribute',
		selector: 'div:nth-of-type(2) .ugb-button',
		attribute: 'href',
		default: '',
	},
	newTab2: {
		type: 'boolean',
		source: 'attribute',
		selector: 'div:nth-of-type(2) .ugb-button',
		attribute: 'target',
		default: false,
	},
	text2: {
		source: 'html',
		selector: 'div:nth-of-type(2) .ugb-button span',
		default: 'Button text',
	},
	color2: {
		type: 'string',
	},
	textColor2: {
		type: 'string',
		default: '#ffffff',
	},
	size2: {
		type: 'string',
		default: 'normal',
	},
	design2: {
		type: 'string',
		default: 'basic',
	},
	icon2: {
		type: 'string',
	},

	url3: {
		type: 'string',
		source: 'attribute',
		selector: 'div:nth-of-type(3) .ugb-button',
		attribute: 'href',
		default: '',
	},
	newTab3: {
		type: 'boolean',
		source: 'attribute',
		selector: 'div:nth-of-type(3) .ugb-button',
		attribute: 'target',
		default: false,
	},
	text3: {
		source: 'html',
		selector: 'div:nth-of-type(3) .ugb-button span',
		default: 'Button text',
	},
	color3: {
		type: 'string',
	},
	textColor3: {
		type: 'string',
		default: '#ffffff',
	},
	size3: {
		type: 'string',
		default: 'normal',
	},
	design3: {
		type: 'string',
		default: 'basic',
	},
	icon3: {
		type: 'string',
	},
}

const deprecatedSave_1_12 = props => {
	const { className, attributes } = props
	const {
		align = 'center',
		cornerButtonRadius,
		buttons = 1,
	} = attributes

	const mainClasses = classnames( [
		className,
		'ugb-button-wrapper',
	], {
		[ `ugb-button--align-${ align }` ]: align,
	} )

	return (
		<div className={ mainClasses }>
			{ range( 1, buttons + 1 ).map( i => {
				const {
					[ `text${ i === 1 ? '' : i }` ]: text,
					[ `size${ i === 1 ? '' : i }` ]: size = 'normal',
					[ `url${ i === 1 ? '' : i }` ]: url,
					[ `design${ i === 1 ? '' : i }` ]: design = 'basic',
					[ `color${ i === 1 ? '' : i }` ]: color,
					[ `textColor${ i === 1 ? '' : i }` ]: textColor = '#ffffff',
					[ `icon${ i === 1 ? '' : i }` ]: icon,
					[ `newTab${ i === 1 ? '' : i }` ]: newTab,
				} = attributes
				return (
					<DeprecatedButtonContent_1_12 key={ i }
						align={ align }
						size={ size }
						url={ url }
						newTab={ newTab }
						color={ textColor }
						text={ text }
						backgroundColor={ color }
						borderRadius={ cornerButtonRadius }
						design={ design }
						icon={ icon }
					/>
				)
			} ) }
		</div>
	)
}

const deprecatedSchema_1_10 = {
	buttons: {
		type: 'number',
		default: 1,
	},
	url: {
		type: 'string',
		source: 'attribute',
		selector: 'a',
		attribute: 'href',
	},
	text: {
		source: 'html',
		selector: 'a span',
		default: 'Button text',
	},
	align: {
		type: 'string',
		default: 'center',
	},
	color: {
		type: 'string',
	},
	textColor: {
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
	design: {
		type: 'string',
		default: 'basic',
	},
	icon: {
		type: 'string',
	},

	url2: {
		type: 'string',
		source: 'attribute',
		selector: 'div:nth-of-type(2) .ugb-button',
		attribute: 'href',
	},
	text2: {
		source: 'html',
		selector: 'div:nth-of-type(2) .ugb-button span',
		default: 'Button text',
	},
	color2: {
		type: 'string',
	},
	textColor2: {
		type: 'string',
		default: '#ffffff',
	},
	size2: {
		type: 'string',
		default: 'normal',
	},
	design2: {
		type: 'string',
		default: 'basic',
	},
	icon2: {
		type: 'string',
	},

	url3: {
		type: 'string',
		source: 'attribute',
		selector: 'div:nth-of-type(3) .ugb-button',
		attribute: 'href',
	},
	text3: {
		source: 'html',
		selector: 'div:nth-of-type(3) .ugb-button span',
		default: 'Button text',
	},
	color3: {
		type: 'string',
	},
	textColor3: {
		type: 'string',
		default: '#ffffff',
	},
	size3: {
		type: 'string',
		default: 'normal',
	},
	design3: {
		type: 'string',
		default: 'basic',
	},
	icon3: {
		type: 'string',
	},
}

const deprecatedSave_1_10 = props => {
	const { className, attributes } = props
	const {
		align = 'center',
		cornerButtonRadius,
		buttons = 1,
	} = attributes

	const mainClasses = classnames( [
		className,
		'ugb-button-wrapper',
	], {
		[ `ugb-button-${ align }` ]: align,
	} )

	return (
		<div className={ mainClasses }>
			{ range( 1, buttons + 1 ).map( i => {
				const {
					[ `text${ i === 1 ? '' : i }` ]: text,
					[ `size${ i === 1 ? '' : i }` ]: size = 'normal',
					[ `url${ i === 1 ? '' : i }` ]: url,
					[ `design${ i === 1 ? '' : i }` ]: design,
					[ `color${ i === 1 ? '' : i }` ]: color,
					[ `textColor${ i === 1 ? '' : i }` ]: textColor,
					[ `icon${ i === 1 ? '' : i }` ]: icon,
				} = attributes
				return (
					<DeprecatedButtonContent_1_10 key={ i }
						align={ align }
						size={ size }
						url={ url }
						color={ textColor }
						text={ text }
						backgroundColor={ color }
						borderRadius={ cornerButtonRadius }
						design={ design }
						icon={ icon }
					/>
				)
			} ) }
		</div>
	)
}

const deprecatedSchema_1_9 = {
	buttons: {
		type: 'number',
		default: 1,
	},
	url: {
		type: 'string',
		source: 'attribute',
		selector: 'a',
		attribute: 'href',
	},
	text: {
		source: 'html',
		selector: 'a',
		default: 'Button',
	},
	align: {
		type: 'string',
		default: 'center',
	},
	color: {
		type: 'string',
	},
	textColor: {
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
	design: {
		type: 'string',
		default: 'basic',
	},
	icon: {
		type: 'string',
	},

	url2: {
		type: 'string',
		source: 'attribute',
		selector: '.ugb-button:nth-of-type(2) a',
		attribute: 'href',
	},
	text2: {
		source: 'html',
		selector: '.ugb-button:nth-of-type(2) a',
		default: 'Button',
	},
	color2: {
		type: 'string',
	},
	textColor2: {
		type: 'string',
		default: '#ffffff',
	},
	size2: {
		type: 'string',
		default: 'normal',
	},
	design2: {
		type: 'string',
		default: 'basic',
	},
	icon2: {
		type: 'string',
	},

	url3: {
		type: 'string',
		source: 'attribute',
		selector: '.ugb-button:nth-of-type(3) a',
		attribute: 'href',
	},
	text3: {
		source: 'html',
		selector: '.ugb-button:nth-of-type(3) a',
		default: 'Button',
	},
	color3: {
		type: 'string',
	},
	textColor3: {
		type: 'string',
		default: '#ffffff',
	},
	size3: {
		type: 'string',
		default: 'normal',
	},
	design3: {
		type: 'string',
		default: 'basic',
	},
	icon3: {
		type: 'string',
	},
}

export const deprecatedSave_1_9 = props => {
	const { className, attributes } = props
	const {
		align = 'center',
		cornerButtonRadius,
		buttons = 1,
	} = attributes

	const mainClasses = classnames( [
		className,
		'ugb-button-wrapper',
	], {
		[ `ugb-button-${ align }` ]: align,
	} )

	return (
		<div className={ mainClasses }>
			{ range( 1, buttons + 1 ).map( i => {
				const {
					[ `text${ i === 1 ? '' : i }` ]: text,
					[ `size${ i === 1 ? '' : i }` ]: size = 'normal',
					[ `url${ i === 1 ? '' : i }` ]: url,
					[ `design${ i === 1 ? '' : i }` ]: design,
					[ `color${ i === 1 ? '' : i }` ]: color,
					[ `textColor${ i === 1 ? '' : i }` ]: textColor,
					[ `icon${ i === 1 ? '' : i }` ]: icon,
				} = attributes
				return (
					<DeprecatedButtonContent_1_9 key={ i }
						align={ align }
						size={ size }
						url={ url }
						color={ textColor }
						text={ text }
						backgroundColor={ color }
						borderRadius={ cornerButtonRadius }
						design={ design }
						icon={ icon }
					/>
				)
			} ) }
		</div>
	)
}

export const deprecatedSchema_1_8 = {
	url: {
		type: 'string',
		source: 'attribute',
		selector: 'a',
		attribute: 'href',
	},
	text: {
		source: 'html',
		selector: 'a',
	},
	align: {
		type: 'string',
		default: 'center',
	},
	color: {
		type: 'string',
	},
	textColor: {
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
	design: {
		type: 'string',
		default: 'basic',
	},
}

export const deprecatedSave_1_8 = props => {
	const { className } = props
	const {
		url,
		text,
		align,
		color,
		textColor,
		size,
		cornerButtonRadius,
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-button',
	] )

	return <DeprecatedButtonContent_1_4 className={ mainClasses } align={ align } size={ size } url={ url } color={ textColor } text={ text } backgroundColor={ color } borderRadius={ cornerButtonRadius } />
}

const migrate_1_15_5 = attributes => {
	// Update the custom CSS since the structure has changed.
	const updateCSS = css => ( css || '' )
		.replace( /.ugb-button-wrapper > \*:nth-child\((\d)\) .ugb-button--inner/g, '.ugb-button-wrapper .ugb-button$1 .ugb-button--inner' )
		.replace( /.ugb-button-wrapper > \*:nth-child\((\d)\) .ugb-button([^-])/g, '.ugb-button-wrapper .ugb-button$1$2' )

	return {
		...attributes,
		showButton2: attributes.buttons ? attributes.buttons >= 2 : false,
		showButton3: attributes.buttons ? attributes.buttons >= 3 : false,
		design: attributes.align === 'full' ? 'fullwidth' : undefined,
		columns: undefined,
		contentAlign: attributes.align !== 'full' ? attributes.align : undefined,
		align: undefined,
		cornerButtonRadius: undefined,

		button1Url: attributes.url,
		button1NewTab: attributes.newTab,
		button1Text: attributes.text,
		button1BackgroundColor: attributes.color,
		button1TextColor: attributes.textColor,
		button1Size: attributes.size,
		button1BorderRadius: attributes.cornerButtonRadius,
		button1Design: attributes.design,
		button1Icon: attributes.icon,

		url: undefined,
		newTab: undefined,
		text: undefined,
		color: undefined,
		textColor: undefined,
		size: undefined,
		icon: undefined,

		button2Url: attributes.url2,
		button2NewTab: attributes.newTab2,
		button2Text: attributes.text2,
		button2BackgroundColor: attributes.color2,
		button2TextColor: attributes.textColor2,
		button2Size: attributes.size2,
		button2BorderRadius: attributes.cornerButtonRadius,
		button2Design: attributes.design2,
		button2Icon: attributes.icon2,

		url2: undefined,
		newTab2: undefined,
		text2: undefined,
		color2: undefined,
		textColor2: undefined,
		size2: undefined,
		design2: undefined,
		icon2: undefined,

		button3Url: attributes.url3,
		button3NewTab: attributes.newTab3,
		button3Text: attributes.text3,
		button3BackgroundColor: attributes.color3,
		button3TextColor: attributes.textColor3,
		button3Size: attributes.size3,
		button3BorderRadius: attributes.cornerButtonRadius,
		button3Design: attributes.design3,
		button3Icon: attributes.icon3,

		url3: undefined,
		newTab3: undefined,
		text3: undefined,
		color3: undefined,
		textColor3: undefined,
		size3: undefined,
		design3: undefined,
		icon3: undefined,

		customCSS: updateCSS( attributes.customCSS ),
		customCSSCompiled: updateCSS( attributes.customCSSCompiled ),
	}
}

const deprecated = [
	{
		attributes: deprecatedSchema_1_15_5_,
		save: deprecatedSave_1_15_5,
		migrate: migrate_1_15_5,
	},
	{
		attributes: deprecatedSchema_1_15_5,
		save: deprecatedSave_1_15_5,
		migrate: migrate_1_15_5,
	},
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
				newTab1: false,
				newTab2: false,
				newTab3: false,
			}
		},
	},
	{
		attributes: deprecatedSchema_1_9,
		save: deprecatedSave_1_9,
	},
	{
		attributes: deprecatedSchema_1_8,
		save: deprecatedSave_1_8,
		migrate: attributes => {
			return {
				...attributes,
				buttons: 1,
			}
		},
	},
]

export default deprecated
