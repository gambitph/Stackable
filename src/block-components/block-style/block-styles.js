/**
 * External dependencies
 */
import { getBlockStyle } from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { useMemo, useCallback } from '@wordpress/element'
import {
	select, useSelect, useDispatch,
} from '@wordpress/data'
import TokenList from '@wordpress/token-list'
import { StyleControl } from '~stackable/components'

/**
 * Replaces the active style in the block's className.
 *
 * @param {string}  className   Class name.
 * @param {Object?} activeStyle The replaced style.
 * @param {Object}  newStyle    The replacing style.
 *
 * @return {string} The updated className.
 */
export function replaceActiveStyle( className, activeStyle, newStyle ) {
	const list = new TokenList( className )

	if ( activeStyle ) {
		list.remove( 'is-style-' + activeStyle.name )
	}

	if ( newStyle.name !== 'default' ) {
		list.add( 'is-style-' + newStyle.name )
	}

	return list.value
}

const BlockStyles = props => {
	const { clientId, styles } = props

	const { className } = useSelect( select => {
		const block = select( 'core/block-editor' ).getBlock( clientId )
		return {
			className: block?.attributes?.className || '',
		}
	}, [ clientId ] )

	const activeStyle = useMemo( () => {
		return getBlockStyle( styles, className )
	}, [ styles, className ] )

	const { updateBlockAttributes } = useDispatch( 'core/block-editor' )

	const onSelect = useCallback( style => {
		const styleClassName = replaceActiveStyle(
			className,
			activeStyle,
			style
		)

		// Selecting a new style can update other attributes too.
		const block = select( 'core/block-editor' ).getBlock( clientId )
		const updatedAttributes = ! style.onSelect ? {} : style.onSelect( block.attributes )

		updateBlockAttributes( clientId, {
			...updatedAttributes,
			className: styleClassName,
		} )
	}, [ clientId, activeStyle, className ] )

	return (
		<StyleControl
			options={ styles }
			onSelect={ onSelect }
			value={ activeStyle.name }
			activeProperty="name"
		/>
	)
}

export default BlockStyles
