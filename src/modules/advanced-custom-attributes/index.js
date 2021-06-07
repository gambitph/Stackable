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
 * External dependencies
 */
import { PanelAdvancedSettings } from '~stackable/components'
import { i18n } from 'stackable'
import {
	compact, isString, omit,
} from 'lodash'

const INVALID_ATTRIBUTES = [
	'id',
	'class',
	'className',
]

const createAddSaveProps = ( extraProps, blockProps ) => {
	const customAttributes = {}
	if ( isString( blockProps.attributes.customAttributes ) && blockProps.attributes.customAttributes !== '' ) {
		compact( blockProps.attributes.customAttributes.split( ' ' ) ).forEach( attribute => {
			try {
				const [ key, _value ] = attribute.split( '=' )
				const value = JSON.parse( _value )
				Object.assign( customAttributes, { [ key ]: value } )
			} catch {}
		} )
	}

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
			const valid = customAttributesSplit.length === 0 ?
				true :
				customAttributesSplit.every( attribute => {
					const attributePair = attribute.split( '=' )
					if ( attributePair.length !== 2 ) {
						setError( 'Error: Not a valid attribute. Input must be of pattern key1="value1" key2="value2".' )
						return false
					}

					const [ key, _value ] = attributePair

					// Filter invalid html attribute names
					try {
						const value = JSON.parse( _value )
						if ( ! isString( value ) ) {
							throw new Error( `Error: The attribute value of ${ key } is not valid. Must be of type string but received ${ typeof value }` )
						}

						document.createElement( 'div' ).setAttribute( key, value )
						return true
					} catch ( e ) {
						setError( e.toString().trim() )
						return false
					}
				} )

			if ( valid ) {
				props.onChange( customAttributes )
				setError( '' )
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
