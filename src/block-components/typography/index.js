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
import { forwardRef } from '@wordpress/element'

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
		...propsToPass
	} = props

	const {
		getAttribute, updateAttribute,
	} = useAttributeEditHandlers( attrNameTemplate )
	const TagName = ( tagName === null ? getAttribute( 'textTag' ) : tagName ) || defaultTag || 'p'
	const value = _value === null ? getAttribute( 'text' ) : _value
	const onChange = _onChange === null ? value => updateAttribute( 'text', value ) : _onChange

	// Load any Google Fonts used.
	useFontLoader( getAttribute( 'fontFamily' ) )

	const dynamicContentText = useDynamicContent( value )

	if ( ! editable ) {
		return <TagName className={ className }>{ dynamicContentText }</TagName>
	}

	return (
		<RichText
			identifier={ identifier }
			className={ className }
			tagName={ TagName }
			value={ dynamicContentText }
			onChange={ onChange }
			ref={ ref }
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

