import classnames from 'classnames'
import { getIconSVGBase64 as deprecatedGetIconSVGBase64 } from './deprecated-util'
import { getIconSVGBase64 } from './util'
import { RichText } from '@wordpress/block-editor'

const deprecatedSave_1_13_3 = props => {
	const { className } = props
	const {
		icon,
		iconShape,
		iconColor,
		iconSize,
		text,
		columns,
		gap,
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-icon-list',
		`ugb-icon--icon-${ icon }`,
		`ugb-icon--columns-${ columns }`,
	] )

	const iconSVGString = getIconSVGBase64( icon, iconShape, iconColor )
	const style = {
		'--icon': 'url(\'data:image/svg+xml;base64,' + iconSVGString + '\')',
		'--icon-size': iconSize ? `${ iconSize }px` : undefined,
		'--gap': gap ? `${ gap }px` : undefined,
	}

	return (
		<RichText.Content
			tagName="ul"
			className={ mainClasses }
			style={ style }
			value={ text }
		/>
	)
}

const deprecatedSchema_1_13_3 = {
	icon: {
		type: 'string',
		default: 'check',
	},
	iconShape: {
		type: 'string',
	},
	iconColor: {
		type: 'string',
	},
	iconSize: {
		type: 'number',
		default: 20,
	},
	columns: {
		type: 'number',
		default: 1,
	},
	text: {
		source: 'html',
		selector: 'ul',
		multiline: 'li',
	},
	gap: {
		type: 'number',
		default: 16,
	},
}

const deprecatedSave_1_11 = props => {
	const { className } = props
	const {
		icon,
		iconShape,
		iconColor,
		iconSize,
		text,
		columns,
		gap,
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-icon-list',
		`ugb-icon--icon-${ icon }`,
		`ugb-icon--columns-${ columns }`,
	] )

	const iconSVGString = deprecatedGetIconSVGBase64( icon, iconShape, iconColor )
	const style = {
		'--icon': 'url(\'data:image/svg+xml;base64,' + iconSVGString + '\')',
		'--icon-size': iconSize ? `${ iconSize }px` : undefined,
		'--gap': gap ? `${ gap }px` : undefined,
	}

	return (
		<RichText.Content
			tagName="ul"
			className={ mainClasses }
			style={ style }
			value={ text }
		/>
	)
}

const deprecatedSchema_1_11 = {
	icon: {
		type: 'string',
		default: 'check',
	},
	iconShape: {
		type: 'string',
	},
	iconColor: {
		type: 'string',
	},
	iconSize: {
		type: 'number',
		default: 20,
	},
	columns: {
		type: 'number',
		default: 1,
	},
	text: {
		source: 'html',
		selector: 'ul',
		multiline: 'li',
	},
	gap: {
		type: 'number',
		default: 16,
	},
}

const deprecatedSave_1_10 = props => {
	const { className } = props
	const {
		icon,
		iconShape,
		iconColor,
		iconSize,
		text,
		columns,
		gap,
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-icon-list',
		`ugb-icon-${ icon }`,
		`column-${ columns }`,
	] )

	const iconSVGString = deprecatedGetIconSVGBase64( icon, iconShape, iconColor )
	const style = {
		'--icon': 'url(\'data:image/svg+xml;base64,' + iconSVGString + '\')',
		'--icon-size': iconSize ? `${ iconSize }px` : undefined,
		'--gap': gap ? `${ gap }px` : undefined,
	}

	return (
		<RichText.Content
			tagName="ul"
			className={ mainClasses }
			style={ style }
			value={ text }
		/>
	)
}

const deprecatedSchema_1_10 = {
	icon: {
		type: 'string',
		default: 'check',
	},
	iconShape: {
		type: 'string',
	},
	iconColor: {
		type: 'string',
	},
	iconSize: {
		type: 'number',
		default: 20,
	},
	columns: {
		type: 'number',
		default: 1,
	},
	text: {
		source: 'html',
		selector: 'ul',
		multiline: 'li',
	},
	gap: {
		type: 'number',
		default: 16,
	},
}

const deprecated = [
	{
		attributes: deprecatedSchema_1_13_3,
		save: deprecatedSave_1_13_3,
	},
	{
		attributes: deprecatedSchema_1_11,
		save: deprecatedSave_1_11,
	},
	{
		attributes: deprecatedSchema_1_10,
		save: deprecatedSave_1_10,
	},
]

export default deprecated
