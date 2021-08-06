/**
 * Internal dependencies
 */
import { Edit } from './edit'
import { addAttributes } from './attributes'
import { Style } from './style'
export { getTypographyClasses } from './get-typography-classes'
import { useContextValue, getContextValue } from '../context/hooks'

/**
 * External dependencies
 */
import { useAttributeEditHandlers } from '~stackable/hooks'
import { getAttributeName, getAttrName } from '~stackable/util'

/**
 * WordPress dependencies
 */
import { RichText } from '@wordpress/block-editor'
import { useEffect, useState } from '@wordpress/element'

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
		context,
		...rest
	} = props

	const [ debouncedText, setDebouncedText ] = useState( '' )

	const {
		getAttribute, updateAttribute,
	} = useAttributeEditHandlers( attrNameTemplate )
	const onChange = _onChange === null ? value => updateAttribute( 'text', value ) : _onChange
	const value = _value === null ? getAttribute( 'text' ) : _value
	const TagName = ( tagName === null ? getAttribute( 'textTag' ) : tagName ) || defaultTag

	useEffect( () => {
		if ( value !== debouncedText ) {
			setDebouncedText( value )
		}
	}, [ value ] )

	useEffect( () => {
		const timeout = setTimeout( () => {
			onChange( debouncedText )
		}, 300 )

		return () => clearTimeout( timeout )
	}, [ debouncedText ] )

	const { contextValue, usesContext } = useContextValue( value, context )
	if ( usesContext ) {
		return <TagName className={ className }>{ contextValue }</TagName>
	}

	return (
		<RichText
			className={ className }
			tagName={ TagName }
			value={ debouncedText }
			onChange={ setDebouncedText }
			ref={ ref }
			{ ...rest }
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
}

Typography.Content = props => {
	const {
		className,
		attrNameTemplate,
		attributes,
		tagName,
		defaultTag,
		value: _value,
		children,
		...rest
	} = props

	const getAttribute = _attrName => {
		const attrName = getAttrName( attrNameTemplate, _attrName )
		return attributes[ getAttributeName( attrName ) ]
	}

	const value = getContextValue( attributes, _value === null ? getAttribute( 'text' ) : _value )

	return (
		<RichText.Content
			className={ className }
			tagName={ ( tagName === null ? getAttribute( 'textTag' ) : tagName ) || defaultTag }
			value={ value }
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

