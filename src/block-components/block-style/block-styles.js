/**
 * External dependencies
 */
import classnames from 'classnames'
import { getBlockStyle } from '~stackable/hooks'
import { cloneDeep } from 'lodash'
import {
	isPro, showProNotice, i18n,
} from 'stackable'
import { ProControl } from '~stackable/components'

/**
 * WordPress dependencies
 */
import {
	useMemo, useCallback,
} from '@wordpress/element'
import {
	select, useSelect, useDispatch,
} from '@wordpress/data'
import TokenList from '@wordpress/token-list'
import { ENTER, SPACE } from '@wordpress/keycodes'
import { cloneBlock } from '@wordpress/blocks'
import { __ } from '@wordpress/i18n'

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

/**
 * @typedef {Object} BlockStyleMigrateObject
 *
 * @property {Record<string, any>} attributes - the cached attributes of the selected block.
 * @property {Array<string, any>} innerBlocks - array of considered `innerBlocks` of the next block style transformation
 * @property {any} options - extra arguments.
 */

/**
 * Block Migration Cache.
 *
 * This cache stores all block styles migration objects.
 * The property name is the clientId of the block.
 *
 * @type {Record<string, BlockStyleMigrateObject>}
 */

window.__STK_BLOCK_MIGRATIONS_CACHE = {}

const BlockStyles = props => {
	const { clientId, styles } = props

	const {
		className, blockName,
	} = useSelect( select => {
		const block = select( 'core/block-editor' ).getBlock( clientId )
		return {
			className: block?.attributes?.className || '',
			blockName: block?.name,
		}
	}, [ clientId ] )

	const activeStyle = useMemo( () => {
		return getBlockStyle( styles, className )
	}, [ styles, className ] )

	const {
		updateBlockAttributes, replaceBlock,
	} = useDispatch( 'core/block-editor' )

	const onSelect = useCallback( style => {
		const styleClassName = replaceActiveStyle(
			className,
			activeStyle,
			style
		)

		// Selecting a new style can update other attributes too.
		const block = select( 'core/block-editor' ).getBlock( clientId )
		/**
		 * @type {BlockStyleMigrateObject}
		 */
		let migration = {
			attributes: block.attributes, innerBlocks: block.innerBlocks, options: {},
		}

		let cached = false

		/**
		 * Access the migration cache if
		 * the block has not yet modified.
		 */
		if ( window.__STK_BLOCK_MIGRATIONS_CACHE[ clientId ] ) {
			migration = window.__STK_BLOCK_MIGRATIONS_CACHE[ clientId ]
			cached = true
		}

		const oldStyleMigration = styles.find( ( { name } ) => name === activeStyle?.name )?.migrate
		if ( oldStyleMigration ) {
			migration = oldStyleMigration( migration.attributes, migration.innerBlocks, migration.options )
		}

		const updatedAttributes = ! style.onSelect ? {} : style.onSelect( migration.attributes, migration.innerBlocks, migration.options )
		const isReturnTypeABlock = updatedAttributes.clientId && updatedAttributes.attributes

		if ( isReturnTypeABlock ) {
			updatedAttributes.attributes.className = styleClassName
			const newBlock = cloneBlock( updatedAttributes )
			replaceBlock( clientId, newBlock )

			/**
			 * Calling the `replaceBlock` function will change
			 * the clientId of the block. Let's delete the current cache and
			 * store it with the new clientId.
			 */
			const oldCache = cloneDeep( window.__STK_BLOCK_MIGRATIONS_CACHE[ clientId ] )
			if ( window.__STK_BLOCK_MIGRATIONS_CACHE[ clientId ] ) {
				delete window.__STK_BLOCK_MIGRATIONS_CACHE[ clientId ]
			}

			window.__STK_BLOCK_MIGRATIONS_CACHE[ newBlock.clientId ] = cached ? oldCache : cloneDeep( migration )
			return
		}

		updateBlockAttributes( clientId, {
			...updatedAttributes,
			className: styleClassName,
		} )
	}, [ clientId, activeStyle, className, styles ] )

	const hasPremium = styles.some( style => style.isPremium )

	return (
		<>
			<div className="block-editor-block-styles stk-block-styles">
				{ styles.map( style => {
					return (
						<BlockStyleItem
							className={ className }
							isActive={ activeStyle === style }
							key={ style.name }
							onSelect={ onSelect }
							style={ style }
							blockName={ blockName }
						/>
					)
				} ) }
			</div>
			{ ! isPro && showProNotice && hasPremium && (
				<ProControl
					title={ __( 'Upgrade to Premium to get more block styles', i18n ) }
					description={ __( 'Unlock more styles for this block. This feature is only available on Stackable Premium', i18n ) }
				/>
			) }
		</>
	)
}

const BlockStyleItem = props => {
	const {
		style,
		isActive,
		onSelect: _onSelect,
		blockName,
	} = props

	const onSelect = value => {
		if ( ! isActive ) {
			_onSelect( value )
		}
	}

	const Image = style.icon

	return (
		<div
			className={ classnames( 'block-editor-block-styles__item', {
				'is-active': isActive,
				disabled: ( ! isPro && style.isPremium ),
			} ) }
			onClick={ () => onSelect( style ) }
			onKeyDown={ event => {
				if ( ENTER === event.keyCode || SPACE === event.keyCode ) {
					event.preventDefault()
					onSelect( style )
				}
			} }
			role="button"
			tabIndex="0"
			aria-label={ style.label || style.name }
		>
			<div
				className="block-editor-block-styles__item-preview stk-block-styles-preview"
				data-block={ blockName }
				data-style={ style.name }
			>
				{ Image && <Image className="block-editor-block-styles__icon" /> }
			</div>
			<div className="block-editor-block-styles__item-label">
				{ style.label || style.name }
			</div>
		</div>
	)
}

export default BlockStyles

