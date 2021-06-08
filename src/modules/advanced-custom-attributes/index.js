/**
 * External dependencies
 */
import { PanelAdvancedSettings } from '~stackable/components'
import { i18n } from 'stackable'
import {
	isString, omit,
} from 'lodash'

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'
import {
	Fragment, useState, useEffect,
} from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import { TextControl } from '@wordpress/components'

/**
 * We need to filter unsupported attributes
 * to avoid block errors.
 */
const INVALID_ATTRIBUTES = [
	'children',
	'class',
	'className',
	'id',
	'ref',
	'style',
	'dangerouslySetInnerHTML',
]

const createAddSaveProps = ( extraProps, blockProps ) => {
	if ( ! isString( blockProps.attributes.customAttributes ) || blockProps.attributes.customAttributes === '' ) {
		return extraProps
	}

	const customAttributes = {}
	try {
		const customAttributesMatch = blockProps.attributes.customAttributes.match( /(.*?(?=\=))\="[^\"]*"/g )
		if ( Array.isArray( customAttributesMatch ) ) {
			customAttributesMatch.forEach( attribute => {
				const [ key, ..._value ] = attribute.trim().split( '=' )
				const value = JSON.parse( _value.join( '=' ) )
				customAttributes[ key ] = value
			} )
		}
	} catch {}

	return {
		...extraProps,
		...omit( customAttributes, INVALID_ATTRIBUTES ),
	}
}

const addAttributes = attributes => ( {
	...attributes,
	customAttributes: {
		type: 'string',
		default: '',
	},
} )

export const CustomAttributesControl = props => {
	const [ customAttributes, setCustomAttributes ] = useState( props.value || '' )
	const [ error, setError ] = useState( '' )

	useEffect( () => {
		const timeout = setTimeout( () => {
			try {
				if ( customAttributes.trim() === '' ) {
					props.onChange( '' )
					setError( '' )
					return
				}

				let tempCustomAttributes = customAttributes
				const customAttributesMatch = customAttributes.match( /(.*?(?=\=))\="[^\"]*"/g )
				if ( customAttributes.trim() !== '' && ! customAttributesMatch ) {
					throw new Error( 'Not a valid attribute. Input must be of pattern key1="value1" key2="value2".' )
				}

				// Trim the original input value to check if there are unnecessary characters added.
				customAttributesMatch.forEach( attribute => {
					tempCustomAttributes = tempCustomAttributes.replace( attribute.trim(), '' )
				} )

				if ( tempCustomAttributes.trim() !== '' ) {
					throw new Error( `Unexpected syntax: '${ tempCustomAttributes.trim() }'.` )
				}

				customAttributesMatch.forEach( attribute => {
					const [ key, ..._value ] = attribute.trim().split( '=' )
					const value = JSON.parse( _value.join( '=' ) )

					if ( INVALID_ATTRIBUTES.includes( key ) ) {
						throw new Error( `Attribute key '${ key }' is not allowed.` )
					}

					/**
					 * Check if the attribute key and value can be a valid html attribute.
					 * Throws an error if not valid.
					 */
					document.createElement( 'div' ).setAttribute( key, value )

					props.onChange( customAttributes )
					setError( '' )
				} )
			} catch ( e ) {
				setError( e.toString().trim() )
				return false
			}
		}, 300 )

		return () => clearTimeout( timeout )
	}, [ customAttributes ] )

	return (
		<Fragment>
			<TextControl
				label={ __( 'Custom Attributes' ) }
				value={ customAttributes }
				onChange={ setCustomAttributes }
			/>
			{ !! error && <p>{ error }</p> }
		</Fragment>
	)
}

const addInspectorControls = ( output, props ) => {
	return (
		<Fragment>
			{ output }
			<PanelAdvancedSettings
				title={ __( 'Custom Attributes', i18n ) }
				initialOpen={ false }
			>
				<CustomAttributesControl
					label={ __( 'Custom Attributes' ) }
					value={ props.attributes.customAttributes }
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
