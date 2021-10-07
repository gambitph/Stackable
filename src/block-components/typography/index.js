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
import { useAttributeEditHandlers } from '~stackable/hooks'
import { getAttributeName, getAttrName } from '~stackable/util'
import { useDynamicContent } from '~stackable/components/dynamic-content-control'

/**
 * WordPress dependencies
 */
import { RichText } from '@wordpress/block-editor'
import {
	useEffect, useState, useRef,
} from '@wordpress/element'
import { useMergeRefs } from '@wordpress/compose'

export const Typography = props => {
	const {
		className,
		attrNameTemplate,
		tagName,
		defaultTag,
		value: _value,
		onChange: _onChange,
		children,
		ref,
		editable,
		identifier,
		defaultValue,
		...propsToPass
	} = props

	const [ debouncedText, setDebouncedText ] = useState( defaultValue )
	const richTextRef = useRef( null )
	const mergedRef = useMergeRefs( [ ref, richTextRef ] )

	const {
		getAttribute, updateAttribute,
	} = useAttributeEditHandlers( attrNameTemplate )
	const onChange = _onChange === null ? value => updateAttribute( 'text', value ) : _onChange
	const value = _value === null ? getAttribute( 'text' ) : _value
	const TagName = ( tagName === null ? getAttribute( 'textTag' ) : tagName ) || defaultTag || 'p'

	useEffect( () => {
		if ( value !== debouncedText ) {
			setDebouncedText( value )
		}
	}, [ value ] )

	useEffect( () => {
		const timeout = setTimeout( () => {
			onChange( debouncedText || defaultValue )
		}, 300 )

		return () => clearTimeout( timeout )
	}, [ debouncedText ] )

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
}

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

