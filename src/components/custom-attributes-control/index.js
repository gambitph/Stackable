/**
 * External dependencies
 */
import { i18n } from 'stackable'
import { escape } from 'lodash'

/**
 * WordPress dependencies
 */
import {
	Fragment, useState, useEffect, render, unmountComponentAtNode,
} from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import { TextControl } from '@wordpress/components'

const CustomAttributesControl = props => {
	const [ customAttributes, setCustomAttributes ] = useState(
		Array.isArray( props.value ) ?
			props.value.map( attribute => {
				const [ key, _value ] = attribute
				const value = `"${ escape( _value ) }"`
				return [ key, value ].join( '=' )
			} ).join( ' ' ) :
			''
	)

	useEffect( () => {
		const timeout = setTimeout( () => {
			const el = document.createElement( 'div' )
			el.innerHTML = `<div ${ customAttributes } />`
			// Get all the "fixed" attributes:
			const attrNodeMap = el.children[ 0 ]?.attributes || []
			const attributes = []
			for ( let i = attrNodeMap.length - 1; i >= 0; i-- ) {
				if ( ! props.invalidHtmlAttributes.includes( attrNodeMap[ i ].name ) ) {
					try {
						// Checks if the attribute key and value can be a valid react prop
						// Throws an error if not valid.
						const dummyNode = document.createElement( 'div' )
						render( <div { ...{ [ attrNodeMap[ i ].name ]: attrNodeMap[ i ].value } } />, dummyNode )
						unmountComponentAtNode( dummyNode )

						attributes.push( [ attrNodeMap[ i ].name, attrNodeMap[ i ].value ] )
					} catch {}
				}
			}

			props.onChange( attributes )
		}, 300 )

		return () => clearTimeout( timeout )
	}, [ customAttributes ] )

	return (
		<TextControl
			data-testid="custom-attributes"
			label={ __( 'Custom Attributes', i18n ) }
			value={ customAttributes }
			onBlur={ () => {
				// Sanitize the input on blur.
				setCustomAttributes(
					Array.isArray( props.value ) ?
						props.value.map( attribute => {
							const [ key, _value ] = attribute
							const value = `"${ escape( _value ) }"`
							return [ key, value ].join( '=' )
						} ).join( ' ' ) :
						''
				)
			} }
			onChange={ setCustomAttributes }
			help={ <Fragment>
				{ __( 'You can type in custom HTML attributes for this block in the field above.', i18n ) }
				<a href="https://docs.wpstackable.com/article/461-how-to-use-custom-attributes?utm_source=inspector&utm_campaign=learnmore&utm_medium=gutenberg" target="_docs">{ __( 'Learn more about Custom Attributes', i18n ) }</a>
			</Fragment>
			}
		/>
	)
}

CustomAttributesControl.defaultProps = {
	label: '',
	value: [],
	invalidHtmlAttributes: [],
	onChange: () => {},
}

export default CustomAttributesControl
