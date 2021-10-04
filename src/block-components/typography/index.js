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
import { RichText, useBlockEditContext } from '@wordpress/block-editor'
import {
	useEffect, useState, useRef, useContext,
} from '@wordpress/element'
import { useSelect } from '@wordpress/data'
import { useMergeRefs } from '@wordpress/compose'
import { QueryLoopContext } from '~stackable/higher-order/with-query-loop-context'

export const Typography = props => {
	const {
		className,
		attrNameTemplate,
		tagName,
		defaultTag,
		value: _value,
		onChange: _onChange,
		focusOnSelected = false,
		children,
		ref,
		editable,
		defaultValue,
		identifier,
		...propsToPass
	} = props

	const [ debouncedText, setDebouncedText ] = useState( '' )
	const richTextRef = useRef( null )
	const { clientId } = useBlockEditContext()
	const { selectedClientId, currentPostId } = useSelect( select => ( {
		selectedClientId: select( 'core/block-editor' ).getSelectedBlockClientId(),
		currentPostId: select( 'core/editor' ).getCurrentPostId() || -1,
	} ) )
	const mergedRef = useMergeRefs( [ ref, richTextRef ] )

	// Focus on the richtext when clicking on the block.
	useEffect( () => {
		if ( focusOnSelected ) {
			if ( clientId === selectedClientId ) {
				const el = richTextRef.current
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
			onChange( debouncedText )
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

