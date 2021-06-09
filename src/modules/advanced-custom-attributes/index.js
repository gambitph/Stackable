/**
 * External dependencies
 */
import { PanelAdvancedSettings } from '~stackable/components'
import { i18n } from 'stackable'
import { omit, isUndefined } from 'lodash'
import striptags from 'striptags'

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'
import {
	Fragment, useState, useEffect,
} from '@wordpress/element'
import { __, sprintf } from '@wordpress/i18n'
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

const INVALID_BLOCK_ATTRIBUTES = [
	'customAttributes',
]

const createAddSaveProps = ( extraProps, blockProps ) => {
	if ( ! Array.isArray( blockProps.attributes.customAttributes ) || blockProps.attributes.customAttributes.length === 0 ) {
		return extraProps
	}

	const customAttributes = {}
	try {
		blockProps.attributes.customAttributes.forEach( ( [ key, _value ] ) => {
			let value = _value
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
		type: 'array',
		default: [],
	},
} )

export const CustomAttributesControl = props => {
	const [ customAttributes, setCustomAttributes ] = useState(
		Array.isArray( props.value ) ?
			props.value.map( attribute => {
				const [ key, _value ] = attribute
				const value = `"${ _value }"`
				return [ key, value ].join( '=' )
			} ).join( ' ' ) :
			''
	)

	const [ error, setError ] = useState( '' )

	useEffect( () => {
		const timeout = setTimeout( () => {
			try {
				if ( customAttributes.trim() === '' ) {
					props.onChange( [] )
					setError( '' )
					return
				}

				let tempCustomAttributes = customAttributes
				const customAttributesMatch = customAttributes.match( /(.*?(?=\=))\="[^\"]*"/g )
				if ( customAttributes.trim() !== '' && ! customAttributesMatch ) {
					throw new Error( __( 'Not a valid attribute. Input must be of pattern key1="value1" key2="value2".', i18n ) )
				}

				// Trim the original input value to check if there are unnecessary characters added.
				customAttributesMatch.forEach( attribute => {
					tempCustomAttributes = tempCustomAttributes.replace( attribute.trim(), '' )
				} )

				if ( tempCustomAttributes.trim() !== '' ) {
					throw new Error( sprintf( __( "Unexpected syntax: '%s'.", i18n ), tempCustomAttributes.trim() ) )
				}

				const newCustomAttributes = []
				customAttributesMatch.forEach( attribute => {
					const [ key, ..._value ] = attribute.trim().split( '=' )
					const value = JSON.parse( _value.join( '=' ) )

					if ( INVALID_ATTRIBUTES.includes( key ) ) {
						throw new Error( sprintf( __( "Attribute key '%s' is not allowed.", i18n ), key ) )
					}

					/**
					 * Check if the attribute key and value can be a valid html attribute.
					 * Throws an error if not valid.
					 */
					document.createElement( 'div' ).setAttribute( key, value )
					newCustomAttributes.push( [ key, value ] )
				} )

				props.onChange( newCustomAttributes )
				setError( '' )
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
				label={ __( 'Custom Attributes', i18n ) }
				value={ customAttributes }
				onChange={ setCustomAttributes }
			/>
			{ !! error && <p className="stk-custom-attributes-control__has-error">{ error }</p> }
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
				<p className="components-base-control__help">
					{ __( 'Add custom HTML attributes to your Stackable blocks.', i18n ) }
					&nbsp;
					<a href="https://docs.wpstackable.com" target="_docs">{ __( 'Learn more about Custom Attributes', i18n ) }</a>
				</p>
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
