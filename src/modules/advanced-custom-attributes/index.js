/**
 * External dependencies
 */
import {
	PanelAdvancedSettings, CustomAttributesControl,
} from '~stackable/components'
import { i18n } from 'stackable'
import { isUndefined, omit } from 'lodash'
import striptags from 'striptags'

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'
import {
	Fragment,
} from '@wordpress/element'
import { __ } from '@wordpress/i18n'

const INVALID_HTML_ATTRIBUTES = [
	'class',
	'className',
	'id',
	'ref',
	'style',
	'dangerouslySetInnerHTML',
]

const INVALID_BLOCK_ATTRIBUTES = [
	'customAttributes',
]

const createAddSaveProps = ( extraProps, blockProps ) => {
	if ( ! Array.isArray( blockProps.attributes.customAttributes ) || blockProps.attributes.customAttributes.length === 0 ) {
		return extraProps
	}

	const customAttributes = Object.fromEntries( blockProps.attributes.customAttributes )
	Object.keys( customAttributes ).forEach( key => {
		try {
			let value = customAttributes[ key ]
			// Replace the value if it's dynamic
			const dynamicAttributeMatch = value.match( /%[^\%]*%/g )
			if ( dynamicAttributeMatch ) {
				dynamicAttributeMatch.forEach( _match => {
					const match = _match.substr( 1, _match.length - 2 )
					if (
						! INVALID_BLOCK_ATTRIBUTES.includes( match ) &&
						blockProps.attributes.hasOwnProperty( match ) &&
						! isUndefined( blockProps.attributes[ match ] )
					) {
						value = value.replace( _match, striptags( blockProps.attributes[ match ].toString() ) )
					}
				} )
			}
			customAttributes[ key ] = value
		} catch {}
	} )

	return {
		...extraProps,
		...omit( customAttributes, INVALID_HTML_ATTRIBUTES ),
	}
}

const addAttributes = attributes => ( {
	...attributes,
	customAttributes: {
		type: 'array',
		default: [],
	},
} )

const addInspectorControls = ( output, props ) => {
	return (
		<Fragment>
			{ output }
			<PanelAdvancedSettings
				title={ __( 'Custom Attributes', i18n ) }
				initialOpen={ false }
			>

				<CustomAttributesControl
					label={ __( 'Custom Attributes', i18n ) }
					value={ props.attributes.customAttributes }
					invalidHtmlAttributes={ INVALID_HTML_ATTRIBUTES }
					onChange={ value => props.setAttributes( { customAttributes: value } ) }
				/>
			</PanelAdvancedSettings>
		</Fragment>
	)
}

const advancedCustomAttributes = ( blockName, options = {} ) => {
	const {} = options

	addFilter( `stackable.${ blockName }.attributes`, `stackable/${ blockName }/advanced-custom-attributes`, addAttributes )
	addFilter( `stackable.${ blockName }.edit.inspector.advanced.before`, `stackable/${ blockName }/advanced-custom-attributes`, addInspectorControls )
	addFilter( `stackable.${ blockName }.main-block.extraProps`, `stackable/${ blockName }/advanced-custom-attributes`, createAddSaveProps )
}

export default advancedCustomAttributes
