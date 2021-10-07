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
import { useSelect } from '@wordpress/data'
import { useMergeRefs as _useMergeRefs } from '@wordpress/compose'
import { QueryLoopContext } from '~stackable/higher-order/with-query-loop-context'

// WP 5.6 Compatibility
const useMergeRefs = _useMergeRefs || ( () => {} )

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

	// Focus on the richtext when clicking on the block.
	useEffect( () => {
		if ( focusOnSelected ) {
			if ( clientId === selectedClientId ) {
				const el = richTextRef.current || document.querySelector( '.wp-block.is-selected .rich-text' )
				if ( ! el ) {
					return
				}

				el?.focus()

				// Move the cursor to the end.
				const range = document.createRange()
				if ( range ) {
					range.selectNodeContents( el )
					range.collapse( false )
					const sel = window?.getSelection() // eslint-disable-line @wordpress/no-global-get-selection
					if ( sel ) {
						sel.removeAllRanges()
						sel.addRange( range )
					}
				}
			}
		}
	}, [ selectedClientId ] )

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

