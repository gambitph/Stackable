/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'

/**
 * External dependencies
 */
import classnames from 'classnames'

const deprecatedSchema_1_17_3 = {
	height: {
		default: 1,
		type: 'number',
	},
	width: {
		default: 50,
		type: 'number',
	},
	color: {
		type: 'string',
		default: '#dddddd',
	},
	alignment: {
		type: 'string',
		default: 'center',
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

const deprecatedSave_1_17_3 = props => {
	const { className } = props
	const {
		height,
		width,
		color,
		alignment,
		design = '',
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-divider',
	], applyFilters( 'stackable.divider.mainclasses_1_17_3', {}, design, props ) )

	return (
		<div className={ mainClasses }>
			{ applyFilters( 'stackable.divider.save.output.before_1_17_3', null, design, props ) }
			<hr align={ alignment } style={ {
				backgroundColor: color,
				width: width + '%',
				height,
			} }
			/>
			{ applyFilters( 'stackable.divider.save.output.after_1_17_3', null, design, props ) }
		</div>
	)
}

const deprecatedSave_1_17_3_v2 = props => {
	const { className } = props
	const {
		height,
		width,
		color,
		design = '',
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-divider',
	], applyFilters( 'stackable.divider.mainclasses_1_17_3', {}, design, props ) )

	return (
		<div className={ mainClasses }>
			{ applyFilters( 'stackable.divider.save.output.before_1_17_3', null, design, props ) }
			<hr style={ {
				backgroundColor: color,
				width: width + '%',
				height,
			} }
			/>
			{ applyFilters( 'stackable.divider.save.output.after_1_17_3', null, design, props ) }
		</div>
	)
}

const deprecated = [
	{
		attributes: deprecatedSchema_1_17_3,
		save: deprecatedSave_1_17_3,
		migrate: attributes => {
			return {
				...attributes,
				design: 'basic',
				contentAlign: attributes.alignment,
			}
		},
	},
	// This next deprecation is needed since there is a bug in the migration of v1.17.3 -> v2 when there is no alignment selected.
	// This next migration allows the block to be migrated properly.
	{
		attributes: deprecatedSchema_1_17_3,
		save: deprecatedSave_1_17_3_v2,
		migrate: attributes => {
			return {
				...attributes,
				design: 'basic',
				contentAlign: attributes.alignment,
			}
		},
	},
]

export default deprecated
