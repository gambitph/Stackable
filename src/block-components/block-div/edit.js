/**
 * Internal dependencies
 */
import { Edit as BackgroundControls } from '../helpers/backgrounds'
import { attributes } from './attributes'

/**
 * External dependencies
 */
import { i18n } from 'stackable'
import { pick } from 'lodash'
import {
	InspectorSectionControls,
	PanelAdvancedSettings,
} from '~stackable/components'

/**
 * WordPress dependencies
 */
import { useBlockEditContext } from '@wordpress/block-editor'
import { useSelect, useDispatch } from '@wordpress/data'
import { useCallback } from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import { useDidAttributesChange } from '~stackable/hooks'

// These attributes will turn on the block background.
const toggleAttributes = Object.keys( attributes ).filter( attr => ! [ 'uniqueId', 'hasBackground' ].includes( attr ) )

export const Edit = () => {
	const { clientId, name: blockName } = useBlockEditContext()

	const { updateBlockAttributes } = useDispatch( 'core/block-editor' )
	const { attributes } = useSelect(
		select => {
			const { getBlockAttributes } = select( 'core/block-editor' )
			return {
				attributes: getBlockAttributes( clientId ),
			}
		},
		[ clientId ]
	)

	// Turn on hasBackground when background attributes are changed.
	const onAttributesChanged = useCallback( () => {
		updateBlockAttributes( clientId, { hasBackground: true } )
	}, [ clientId ] )
	useDidAttributesChange( onAttributesChanged, blockName, pick( attributes, toggleAttributes ) )

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
		</InspectorSectionControls>
	)
}
