/**
 * External dependencies
 */
import { i18n } from 'stackable'
import { escape as _escape } from 'lodash'

/**
 * Internal dependencies
 */
import { createRoot } from '~stackable/util'

/**
 * WordPress dependencies
 */
import {
	useState,
	unmountComponentAtNode,
	useRef,
} from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import AdvancedTextControl from '../advanced-text-control'

const sanitizeString = str => {
	return _escape( // Escape html symbols <, /, > (Lodash)
		unescape( str ) // Unescape HTML entities since we store the values escaped.
	)
}

const createAttributeString = attrArray => {
	return Array.isArray( attrArray )
		? attrArray.map( attribute => {
			const [ key, _value ] = attribute
			const value = `"${ sanitizeString( _value ) }"`
			return [ key, value ].join( '=' )
		} ).join( ' ' )
		: ''
}

const CustomAttributesControl = props => {
	const inputRef = useRef()
	const [ hasError, setHasError ] = useState( false )

	const [ customAttributes, setCustomAttributes ] = useState( createAttributeString( props.value ) )

	const onChange = newCustomAttributes => {
		setCustomAttributes( newCustomAttributes )
		const el = document.createElement( 'div' )
		el.innerHTML = `<div ${ newCustomAttributes } />`

		// Get all the "fixed" attributes:
		const attrNodeMap = el.children[ 0 ]?.attributes || []
		const attributes = []

		let hasError = false

		if ( el.innerHTML === '' && newCustomAttributes.trim() !== '' ) {
			hasError = true
		}

		for ( let i = 0; i < attrNodeMap.length; i++ ) {
			if ( props.invalidHtmlAttributes.includes( attrNodeMap[ i ].name ) ) {
				continue
			}
			// Checks if the attribute key and value can be a valid react prop
			// Throws an error if not valid.
			try {
				const dummyNode = document.createElement( 'div' )
				createRoot( dummyNode ).render( <div { ...{ [ attrNodeMap[ i ].name ]: attrNodeMap[ i ].value } } /> )
				unmountComponentAtNode( dummyNode )
				document.createElement( 'div' ).setAttribute( attrNodeMap[ i ].name, attrNodeMap[ i ].value )

				attributes.push( [ attrNodeMap[ i ].name, escape( attrNodeMap[ i ].value ) ] )
			} catch {
				hasError = true
			}
		}

		setHasError( hasError )
		props.onChange( attributes )
	}

	const onBlur = () => {
		// Sanitize the input on blur.
		if ( Array.isArray( props.value ) && props.value.length > 0 ) {
			setCustomAttributes( createAttributeString( props.value ) )
		}
	}
	const help = ( props.help || hasError ) && <>
		{ props.help }
		{ hasError && <span className="ugb-custom-attributes-control__error">{ __( 'There is an error in your custom attribute', i18n ) }</span> }
	</>

	return (
		<AdvancedTextControl
			ref={ inputRef }
			data-testid="custom-attributes"
			className="ugb-custom-attributes-control"
			label={ props.label }
			value={ customAttributes }
			onBlur={ onBlur }
			onChange={ onChange }
			help={ help }
		/>
	)
}

CustomAttributesControl.defaultProps = {
	label: '',
	help: null,
	value: [],
	invalidHtmlAttributes: [],
	onChange: () => {},
}

export default CustomAttributesControl
