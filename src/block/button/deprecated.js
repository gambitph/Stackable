import {
	DeprecatedButtonContent_1_1,
	DeprecatedButtonContent_1_10,
	DeprecatedButtonContent_1_4,
	DeprecatedButtonContent_1_9,
} from '@stackable/components/button-edit'
import { merge, omit } from 'lodash'
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import classnames from 'classnames'
import { range } from '@stackable/util'

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
		selector: 'div:nth-child(2) .ugb-button',
		attribute: 'href',
	},
	text2: {
		source: 'html',
		selector: 'div:nth-child(2) .ugb-button span',
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
		selector: 'div:nth-child(3) .ugb-button',
		attribute: 'href',
	},
	text3: {
		source: 'html',
		selector: 'div:nth-child(3) .ugb-button span',
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

	const saved = (
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

	return applyFilters( 'stackable.designs.button.save', saved, props )
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
		selector: '.ugb-button:nth-child(2) a',
		attribute: 'href',
	},
	text2: {
		source: 'html',
		selector: '.ugb-button:nth-child(2) a',
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
		selector: '.ugb-button:nth-child(3) a',
		attribute: 'href',
	},
	text3: {
		source: 'html',
		selector: '.ugb-button:nth-child(3) a',
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

	const saved = (
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

	return applyFilters( 'stackable.designs.button.save', saved, props )
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
		url, text, align, color, textColor, size, cornerButtonRadius, design,
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-button',
	] )

	const saved = <DeprecatedButtonContent_1_4 className={ mainClasses } align={ align } size={ size } url={ url } color={ textColor } text={ text } backgroundColor={ color } borderRadius={ cornerButtonRadius } />

	return applyFilters( 'stackable.designs.button.save', saved, design, props )
}

export const deprecatedSave_1_1 = props => {
	const {
		url, text, align, color, textColor, size, cornerButtonRadius, design,
	} = props.attributes

	const saved = <DeprecatedButtonContent_1_1 align={ align } size={ size } url={ url } color={ textColor } text={ text } backgroundColor={ color } borderRadius={ cornerButtonRadius } />

	return applyFilters( 'stackable.designs.button.save', saved, design, props )
}

export const deprecatedSchema_1_1 = {
	url: {
		type: 'string',
		source: 'attribute',
		selector: 'a',
		attribute: 'href',
	},
	text: {
		type: 'html',
		selector: 'a',
	},
	align: {
		type: 'string',
		default: 'center',
	},
	color: {
		type: 'string',
		// default: '#2091e1',
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

export const deprecatedSave_0_7 = props => {
	const {
		url, text, textAlignment, color, textColor, size, cornerButtonRadius,
	} = props.attributes

	const buttonStyle = {
		backgroundColor: color,
		color: textColor,
		borderRadius: cornerButtonRadius + 'px',
	}

	return (
		<div className={ `ugb-button-${ textAlignment }` }>
			<a href={ url } className={ `wp-ugb-button ugb-button-${ size }` } style={ buttonStyle }>
				{ text }
			</a>
		</div>
	)
}

export const deprecatedSchema_0_7 = {
	url: {
		type: 'string',
		source: 'attribute',
		selector: 'a',
		attribute: 'href',
	},
	text: {
		type: 'array',
		source: 'children',
		selector: 'a',
	},
	align: {
		type: 'string',
		default: 'center',
	},
	color: {
		type: 'string',
		default: '#2091e1',
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
}

const deprecated = [
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
	{
		attributes: deprecatedSchema_1_1,
		save: deprecatedSave_1_1,
	},
	{
		attributes: deprecatedSchema_0_7,
		migrate: attributes => {
			return omit( merge( attributes, { align: attributes.textAlignment } ), [ 'textAlignment' ] )
		},
		save: deprecatedSave_0_7,
	},
]

export default deprecated
