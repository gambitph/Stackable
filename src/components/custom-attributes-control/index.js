/**
 * External dependencies
 */
import { i18n } from 'stackable'
import { escape } from 'lodash'

/**
 * WordPress dependencies
 */
import {
	Fragment, useState, useEffect, render, unmountComponentAtNode, useRef,
} from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import { TextControl } from '@wordpress/components'

const CustomAttributesControl = props => {
	const inputRef = useRef()
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
		// Only trigger when not focused.
		if ( inputRef.current !== document.activeElement ) {
			setCustomAttributes(
				Array.isArray( props.value ) ?
					props.value.map( attribute => {
						const [ key, _value ] = attribute
						const value = `"${ escape( _value ) }"`
						return [ key, value ].join( '=' )
					} ).join( ' ' ) :
					''
			)
		}
	}, [ JSON.stringify( props.value ) ] )

	return (
		<TextControl
			ref={ inputRef }
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
			onChange={ newCustomAttributes => {
				setCustomAttributes( newCustomAttributes )
				const el = document.createElement( 'div' )
				el.innerHTML = `<div ${ newCustomAttributes } />`
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
							document.createElement( 'div' ).setAttribute( attrNodeMap[ i ].name, attrNodeMap[ i ].value )

							attributes.push( [ attrNodeMap[ i ].name, attrNodeMap[ i ].value ] )
						} catch {}
					}
				}

				props.onChange( attributes )
			} }
			help={ <Fragment>
				{ __( 'You can type in custom HTML attributes for this block in the field above.', i18n ) } &nbsp;
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
