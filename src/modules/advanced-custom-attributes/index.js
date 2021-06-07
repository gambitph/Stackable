/**
 * External dependencies
 */
import { PanelAdvancedSettings } from '~stackable/components'
import { i18n } from 'stackable'
import {
	compact, isString, omit, toLower,
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

const INVALID_ATTRIBUTES = [
	'id',
	'class',
	'className',
	'style',
	'ref',
	'children',
]

const createAddSaveProps = ( extraProps, blockProps ) => {
	if ( ! isString( blockProps.attributes.customAttributes ) || blockProps.attributes.customAttributes === '' ) {
		return extraProps
	}

	const customAttributes = {}
	try {
		compact( blockProps.attributes.customAttributes.split( ' ' ) ).forEach( attribute => {
			const [ key, ..._value ] = attribute.split( '=' )
			const value = JSON.parse( _value.join( '=' ) )
			customAttributes[ toLower( key ) ] = value
		} )
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

const CustomAttributesControl = props => {
	const [ customAttributes, setCustomAttributes ] = useState( props.value )
	const [ error, setError ] = useState( '' )

	useEffect( () => {
		const timeout = setTimeout( () => {
			const customAttributesSplit = compact( customAttributes.split( ' ' ) )

			try {
				customAttributesSplit.forEach( attribute => {
					const attributePair = attribute.split( '=' )
					if ( attributePair.length < 2 ) {
						throw new Error( 'Not a valid attribute. Input must be of pattern key1="value1" key2="value2".' )
					}

					const [ key, ..._value ] = attributePair
					const value = JSON.parse( _value.join( '=' ) )

					if ( ! isString( value ) ) {
						throw new Error( `The attribute value of ${ key } is not valid. Must be of type string but received: '${ typeof value }'.` )
					}

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

	addFilter( `stackable.${ blockName }.main-block.extraProps`, `stackable/${ blockName }/advanced-custom-attributes`, createAddSaveProps )
	addFilter( `stackable.${ blockName }.attributes`, `stackable/${ blockName }/advanced-custom-attributes`, addAttributes )
	addFilter( `stackable.${ blockName }.edit.inspector.advanced.before`, `stackable/${ blockName }/advanced-custom-attributes`, addInspectorControls )
}

export default advancedCustomAttributes
