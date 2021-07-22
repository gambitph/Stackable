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
	InspectorStyleControls,
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

// These attributes will turn on the container background.
const containerAttributeNames = Object.keys( backgroundAttributes ).map( name => getAttrName( 'container%s', name ) )

export const Edit = props => {
	const {
		sizeSelector = '.stk--container',
		borderSelector = '.stk--container',
	} = props

	const { clientId, name: blockName } = useBlockEditContext()

	const { updateBlockAttributes } = useDispatch( 'core/block-editor' )
	const attributes = useBlockAttributes( clientId )
	const blockElSize = useBlockEl( sizeSelector )
	const blockElBorder = useBlockEl( borderSelector )

	// Turn on hasContainer when background attributes are changed.
	const onAttributesChanged = useCallback( () => {
		updateBlockAttributes( clientId, { hasContainer: true } )
	}, [ clientId ] )
	useDidAttributesChange( onAttributesChanged, blockName, pick( attributes, containerAttributeNames ) )

	return (
		<InspectorStyleControls>
			<PanelAdvancedSettings
				title={ __( 'Container Background', i18n ) }
				id="container"
				checked={ attributes.hasContainer }
				onChange={ hasContainer => updateBlockAttributes( clientId, { hasContainer } ) }
			>
				<BackgroundControls attrNameTemplate="container%s" />
			</PanelAdvancedSettings>
			<PanelAdvancedSettings
				title={ __( 'Container Size & Spacing', i18n ) }
				id="container-size"
			>
				<SizeControls
					attrNameTemplate="container%s"
					blockEl={ blockElSize }
					enableMargin={ false }
				/>
			</PanelAdvancedSettings>
			<PanelAdvancedSettings
				title={ __( 'Container Borders & Shadow', i18n ) }
				id="container-size"
			>
				<BorderControls
					attrNameTemplate="container%s"
					blockEl={ blockElBorder }
				/>
			</PanelAdvancedSettings>
		</InspectorStyleControls>
	)
}
