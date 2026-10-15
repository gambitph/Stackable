/**
 * Internal dependencies
 */
import { Edit } from './edit'
import { addAttributes } from './attributes'
import { addStyles } from './style'
export { getTypographyClasses } from './get-typography-classes'

/**
 * External dependencies
 */
import {
	useBlockAttributesContext, useBlockSetAttributesContext, useFontLoader,
} from '~stackable/hooks'
import {
	getAttributeName, getAttrName, getAttrNameFunction,
} from '~stackable/util'
import { getPropsWithDefaults } from '../../util/props'
import { useDynamicContent } from '~stackable/components/dynamic-content-control'

/**
 * WordPress dependencies
 */
import { RichText } from '@wordpress/block-editor'
import {
	useEffect,
	useState,
	forwardRef,
	memo,
} from '@wordpress/element'

export {
	deprecateTypographyGradientColor, deprecateTypographyShadowColor, deprecateTypographyFontSize,
} from './deprecated'

export const Typography = memo( forwardRef( ( incomingProps, ref ) => {
	const props = getPropsWithDefaults( incomingProps, TYPOGRAPHY_DEFAULT_PROPS )
	const {
		className,
		attrNameTemplate,
		tagName,
		defaultTag,
		value: _value,
		onChange: _onChange,
		children,
		editable,
		identifier,
		defaultValue,
		withoutInteractiveFormatting = false,
		allowedFormats = null,
		enableDebounce = false, // Set true to batch setAttributes (e.g. very large pages).
		...propsToPass
	} = props

	const getAttrName = getAttrNameFunction( attrNameTemplate )
	const setAttributes = useBlockSetAttributesContext()

	const {
		textTag,
		text,
		fontFamily,
	} = useBlockAttributesContext( attributes => {
		const getAttrName = getAttrNameFunction( attrNameTemplate )
		return {
			textTag: attributes[ getAttrName( 'textTag' ) ],
			text: attributes[ getAttrName( 'text' ) ],
			fontFamily: attributes[ getAttrName( 'fontFamily' ) ],
		}
	} )

	const TagName = ( tagName === null ? textTag : tagName ) || defaultTag || 'p'
	const value = _value === null ? text : _value
	const onChange = _onChange === null ? value => setAttributes( { [ getAttrName( 'text' ) ]: value } ) : _onChange

	const [ debouncedText, setDebouncedText ] = useState( value )

	// Load any Google Fonts used.
	useFontLoader( fontFamily )

	// If value was changed externally.
	useEffect( () => {
		if ( value !== debouncedText ) {
			setDebouncedText( value )
		}
	}, [ value ] )

	useEffect( () => {
		let timeout
		if ( value !== debouncedText && enableDebounce ) {
			timeout = setTimeout( () => {
				onChange( debouncedText || defaultValue )
			}, 300 )
		}

		return () => clearTimeout( timeout )
	}, [ debouncedText, onChange ] ) // Don't include `value` in the dependency list because it will cause a double triggering of the `onChange`.

	const dynamicContentText = useDynamicContent( debouncedText )

	if ( ! editable ) {
		return <TagName className={ className }>{ dynamicContentText }</TagName>
	}

	return (
		<RichText
			identifier={ identifier }
			className={ className }
			tagName={ TagName }
			value={ dynamicContentText }
			onChange={ newValue => {
				setDebouncedText( newValue )
				if ( ! enableDebounce ) {
					onChange( newValue )
				}
			} }
			ref={ ref }
			withoutInteractiveFormatting={ withoutInteractiveFormatting }
			allowedFormats={ allowedFormats }
			{ ...propsToPass }
		>
			{ children }
		</RichText>
	)
} ) )

const TYPOGRAPHY_DEFAULT_PROPS = {
	attrNameTemplate: '%s',
	tagName: null,
	defaultTag: 'p',
	value: null,
	onChange: null,
	editable: true,
	identifier: 'text',
}

Typography.Content = incomingProps => {
	const props = getPropsWithDefaults( incomingProps, TYPOGRAPHY_CONTENT_DEFAULT_PROPS )
	const {
		className,
		attrNameTemplate,
		attributes,
		tagName,
		defaultTag,
		value,
		children,
		...rest
	} = props

	const getAttribute = _attrName => {
		const attrName = getAttrName( attrNameTemplate, _attrName )
		return attributes[ getAttributeName( attrName ) ]
	}

	return (
		<RichText.Content
			className={ className }
			tagName={ ( tagName === null ? getAttribute( 'textTag' ) : tagName ) || defaultTag }
			value={ value === null ? getAttribute( 'text' ) : value }
			{ ...rest }
		>
			{ children }
		</RichText.Content>
	)
}

const TYPOGRAPHY_CONTENT_DEFAULT_PROPS = {
	attrNameTemplate: '%s',
	attributes: {},
	tagName: null,
	defaultTag: 'p',
	value: null,
}

Typography.InspectorControls = Edit

Typography.addAttributes = addAttributes

Typography.addStyles = addStyles

