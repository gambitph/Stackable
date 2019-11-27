/**
 * Internal dependencies
 */
import { getIconSVGBase64 as deprecatedGetIconSVGBase64 } from './deprecated-util'
import { getIconSVGBase64 } from './util'

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { RichText } from '@wordpress/block-editor'

const deprecatedSave_1_15_4 = props => {
	const { className } = props
	const {
		icon,
		iconShape,
		iconColor,
		iconSize,
		text,
		columns,
		gap,
		design = '',
	} = props.attributes

	const mainClasses = classnames( [
		className.split( ' ' ).filter( name => name !== 'ugb-icon-list' ),
		'ugb-icon-list-wrapper',
	], applyFilters( 'stackable.icon-list.mainclasses_1_15_4', {}, design, props ) )

	const ulClasses = classnames( [
		'ugb-icon-list',
		`ugb-icon--icon-${ icon }`,
		`ugb-icon--columns-${ columns }`,
	], applyFilters( 'stackable.icon-list.ulclasses_1_15_4', {}, design, props ) )

	const iconSVGString = getIconSVGBase64( icon, iconShape, iconColor )
	const style = {
		'--icon': 'url(\'data:image/svg+xml;base64,' + iconSVGString + '\')',
		'--icon-size': iconSize ? `${ iconSize }px` : undefined,
		'--gap': gap ? `${ gap }px` : undefined,
	}

	return (
		<div className={ mainClasses }>
			{ applyFilters( 'stackable.icon-list.save.output.before_1_15_4', null, design, props ) }
			<RichText.Content
				tagName="ul"
				className={ ulClasses }
				style={ style }
				value={ text }
			/>
			{ applyFilters( 'stackable.icon-list.save.output.after_1_15_4', null, design, props ) }
		</div>
	)
}

export const deprecatedSchema_1_15_4 = {
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
		default: '',
	},
	gap: {
		type: 'number',
		default: 16,
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
		attributes: deprecatedSchema_1_15_4,
		save: deprecatedSave_1_15_4,
		migrate: attributes => {
			// Update the custom CSS since the structure has changed.
			const updateCSS = css => ( css || '' )
				.replace( /.ugb-icon-list-wrapper .ugb-icon-list li/g, '.ugb-icon-list li' )
				.replace( /.ugb-icon-list-wrapper .ugb-icon-list/g, '.ugb-icon-list ul' )
				.replace( /.ugb-icon-list-wrapper/g, '.ugb-icon-list' )

			return {
				...attributes,
				columns: attributes.columns ? attributes.columns : 1,
				customCSS: updateCSS( attributes.customCSS ),
				customCSSCompiled: updateCSS( attributes.customCSSCompiled ),
			}
		},
	},
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
