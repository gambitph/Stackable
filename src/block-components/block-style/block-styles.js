/**
 * External dependencies
 */
import {
	getBlockStyle, useBlockAttributesContext, useBlockSetAttributesContext,
} from '~stackable/hooks'

/**
 * WordPress dependencies
 */
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
	const { styles } = props
	const attributes = useBlockAttributesContext()
	const setAttributes = useBlockSetAttributesContext()
	const className = attributes?.className || ''
	const activeStyle = getBlockStyle( styles, className )

	const onSelect = style => {
		const styleClassName = replaceActiveStyle(
			className,
			activeStyle,
			style
		)

		// Selecting a new style can update other attributes too.
		const updatedAttributes = ! style.onSelect ? {} : style.onSelect( attributes )

		setAttributes( {
			...updatedAttributes,
			className: styleClassName,
		} )
	}

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
