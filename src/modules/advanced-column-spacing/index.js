/**
 * External dependencies
 */
import { ProControl } from '~stackable/components'
import { createAllCombinationAttributes } from '~stackable/util'
import { i18n, showProNotice } from 'stackable'

/**
 * WordPress dependencies
 */
import {
	addFilter, doAction,
} from '@wordpress/hooks'
import { __ } from '@wordpress/i18n'
import { Fragment } from '@wordpress/element'
import { PanelBody } from '@wordpress/components'

const fineGrainedProPanel = output => {
	return (
		<Fragment>
			{ output }
			<PanelBody
				title={ __( 'Column Spacing & More', i18n ) }
				initialOpen={ false }
			>
				{ <ProControl type="advanced" /> }
			</PanelBody>
		</Fragment>
	)
}

const addAttributes = attributes => {
	return {
		...attributes,

		...createAllCombinationAttributes(
			'%sColumnPadding%s',
			{
				type: 'number',
				default: '',
			},
			[ '', 'Tablet', 'Mobile' ],
			[ 'Top', 'Right', 'Bottom', 'Left' ]
		),

		...createAllCombinationAttributes(
			'%sColumnPaddingUnit',
			{
				type: 'string',
				default: 'px',
			},
			[ '', 'Tablet', 'Mobile' ],
		),

		...createAllCombinationAttributes(
			'%sColumnGap',
			{
				type: 'number',
				default: '',
			},
			[ '', 'Tablet', 'Mobile' ]
		),

		...createAllCombinationAttributes(
			'%sColumnHeight',
			{
				type: 'number',
				default: '',
			},
			[ '', 'Tablet', 'Mobile' ]
		),

		...createAllCombinationAttributes(
			'%sColumnContent%sAlign',
			{
				type: 'string',
				default: '',
			},
			[ '', 'Tablet', 'Mobile' ],
			[ 'Vertical', 'Horizontal' ]
		),
		...createAllCombinationAttributes(
			'%sColumn%sAlign',
			{
				type: 'string',
				default: '',
			},
			[ '', 'Tablet', 'Mobile' ],
			[ 'Vertical', 'Horizontal' ]
		),
	}
}

const advancedColumnSpacing = ( blockName, options = {} ) => {
	if ( showProNotice ) {
		addFilter( `stackable.${ blockName }.edit.inspector.advanced.before`, `stackable/${ blockName }/fine-grained`, fineGrainedProPanel, 6 )
	}
	addFilter( `stackable.${ blockName }.attributes`, `stackable/${ blockName }/advanced-column-spacing`, addAttributes )
	doAction( `stackable.module.advanced-column-spacing`, blockName, options )
}

export default advancedColumnSpacing
