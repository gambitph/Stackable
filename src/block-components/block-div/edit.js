/**
 * Internal dependencies
 */
import {
	backgroundAttributes,
	BackgroundControls,
	BorderControls,
	SizeControls,
} from '../helpers'

/**
 * External dependencies
 */
import { i18n } from 'stackable'
import { pick } from 'lodash'
import {
	InspectorSectionControls,
	PanelAdvancedSettings,
} from '~stackable/components'
import {
	useBlockAttributes, useBlockEl, useDidAttributesChange,
} from '~stackable/hooks'
import { getAttrName } from '~stackable/util'

/**
 * WordPress dependencies
 */
import { useBlockEditContext } from '@wordpress/block-editor'
import { useDispatch } from '@wordpress/data'
import { useCallback } from '@wordpress/element'
import { __ } from '@wordpress/i18n'

// These attributes will turn on the block background.
const backgroundAttributeNames = Object.keys( backgroundAttributes ).map( name => getAttrName( 'block%s', name ) )

export const Edit = () => {
	const { clientId, name: blockName } = useBlockEditContext()

	const { updateBlockAttributes } = useDispatch( 'core/block-editor' )
	const attributes = useBlockAttributes( clientId )
	const blockEl = useBlockEl()

	// Turn on hasBackground when background attributes are changed.
	const onAttributesChanged = useCallback( () => {
		updateBlockAttributes( clientId, { hasBackground: true } )
	}, [ clientId ] )
	useDidAttributesChange( onAttributesChanged, blockName, pick( attributes, backgroundAttributeNames ) )

	return (
		<InspectorSectionControls>
			<PanelAdvancedSettings
				title={ __( 'Background', i18n ) }
				id="background"
				checked={ attributes.hasBackground }
				onChange={ hasBackground => updateBlockAttributes( clientId, { hasBackground } ) }
			>
				<BackgroundControls attrNameTemplate="block%s" />
			</PanelAdvancedSettings>
			<PanelAdvancedSettings
				title={ __( 'Borders & Shadows', i18n ) }
				id="borders"
			>
				<BorderControls
					attrNameTemplate="block%s"
					blockEl={ blockEl }
				/>
			</PanelAdvancedSettings>
			<PanelAdvancedSettings
				title={ __( 'Size & Spacing', i18n ) }
				id="size"
			>
				<SizeControls
					attrNameTemplate="block%s"
					blockEl={ blockEl }
				/>
			</PanelAdvancedSettings>
		</InspectorSectionControls>
	)
}
