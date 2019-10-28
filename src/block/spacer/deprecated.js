/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'

/**
 * External dependencies
 */
import classnames from 'classnames'

export const deprecatedSave_1_15_4_err = props => {
	const { className } = props
	const {
		design = '',
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-spacer',
	] )

	return (
		<div className={ mainClasses } style="height:undefinedpx">
			{ applyFilters( 'stackable.spacer.save.output.before_1_15_4', null, design, props ) }
		</div>
	)
}

export const deprecatedSave_1_15_4 = props => {
	const { className } = props
	const {
		height,
		design = '',
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-spacer',
	] )

	return (
		<div className={ mainClasses } style={ { height: height + 'px' } }>
			{ applyFilters( 'stackable.spacer.save.output.before_1_15_4', null, design, props ) }
		</div>
	)
}

export const deprecatedSchema_1_15_4 = {
	height: {
		default: 50,
		type: 'number',
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

export const deprecatedSave_1_3 = props => {
	const { height } = props.attributes

	return (
		<div style={ { height: height + 'px' } }></div>
	)
}

export const deprecatedSchema_1_3 = {
	height: {
		default: 50,
		type: 'number',
	},
}

const deprecated = [
	{
		attributes: deprecatedSave_1_15_4_err,
		save: deprecatedSave_1_15_4,
	},
	{
		attributes: deprecatedSchema_1_15_4,
		save: deprecatedSave_1_15_4,
	},
	{
		attributes: deprecatedSchema_1_3,
		save: deprecatedSave_1_3,
	},
]

export default deprecated
