/**
 * Internal dependencies
 */
import { Edit } from './edit'
import { addAttributes } from './attributes'
import { Style } from './style'
export { getTypographyClasses } from './get-typography-classes'

/**
 * External dependencies
 */
import { useAttributeEditHandlers, useFontLoader } from '~stackable/hooks'
import { getAttributeName, getAttrName } from '~stackable/util'
import { useDynamicContent } from '~stackable/components/dynamic-content-control'

/**
 * WordPress dependencies
 */
import { RichText } from '@wordpress/block-editor'
import {
	useEffect, useState, useRef, forwardRef, useMemo
} from '@wordpress/element'
import { useMergeRefs as _useMergeRefs } from '@wordpress/compose'

// WP 5.6 Compatibility
const useMergeRefs = _useMergeRefs || ( () => {} )

export const Typography = forwardRef( ( props, ref ) => {
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
		...propsToPass
	} = props

	const {
		getAttribute, updateAttribute,
	} = useAttributeEditHandlers( attrNameTemplate )
	const TagName = ( tagName === null ? getAttribute( 'textTag' ) : tagName ) || defaultTag || 'p'
	const value = _value === null ? getAttribute( 'text' ) : _value
	const onChange = useMemo( () => {
		return _onChange === null ? value => updateAttribute( 'text', value ) : _onChange
	}, [ _onChange, updateAttribute ] )

	const [ debouncedText, setDebouncedText ] = useState( value )
	const richTextRef = useRef( null )
	const mergedRef = useMergeRefs( [ ref, richTextRef ] )

	// Load any Google Fonts used.
	useFontLoader( getAttribute( 'fontFamily' ) )

	// If value was changed externally.
	useEffect( () => {
		if ( value !== debouncedText ) {
			setDebouncedText( value )
		}
	}, [ value ] )

	useEffect( () => {
		let timeout
		if ( value !== debouncedText ) {
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
			onChange={ setDebouncedText }
			ref={ mergedRef }
			{ ...propsToPass }
		>
			{ children }
		</RichText>
	)
} )

Typography.defaultProps = {
	attrNameTemplate: '%s',
	tagName: null,
	defaultTag: 'p',
	value: null,
	onChange: null,
	editable: true,
	identifier: 'text',
}

Typography.Content = props => {
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

Typography.Content.defaultProps = {
	attrNameTemplate: '%s',
	attributes: {},
	tagName: null,
	defaultTag: 'p',
	value: null,
}

Typography.InspectorControls = Edit

Typography.addAttributes = addAttributes

Typography.Style = Style

