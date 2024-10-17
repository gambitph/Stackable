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
	Fragment,
	useState,
	unmountComponentAtNode,
	useRef,
} from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import { ExternalLink } from '@wordpress/components'
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

	return (
		<AdvancedTextControl
			ref={ inputRef }
			data-testid="custom-attributes"
			className="ugb-custom-attributes-control"
			label={ __( 'Custom Attributes', i18n ) }
			value={ customAttributes }
			onBlur={ onBlur }
			onChange={ onChange }
			help={ (
				<Fragment>
					{ __( 'You can type in custom HTML attributes for this block in the field above.', i18n ) }
					&nbsp;
					{ __( 'Example:', i18n ) }
					<br />
					<code>{
						// eslint-disable-next-line react/jsx-curly-brace-presence
						`data-id="my-title"`
					}</code>
					<br />
					<ExternalLink
						href="https://docs.wpstackable.com/article/461-how-to-use-custom-attributes?utm_source=inspector&utm_campaign=learnmore&utm_medium=gutenberg"
						target="_docs"
					>
						{ __( 'Learn more about Custom Attributes', i18n ) }
					</ExternalLink>
					{ hasError && <span className="ugb-custom-attributes-control__error">{ __( 'There is an error in your custom attribute', i18n ) }</span> }
				</Fragment>
			) }
			isDynamic={ true }
			isFormatType={ false }
			rawValue={ customAttributes }
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
