/**
 * Internal dependencies
 */
import {
	BaseControl, Button, PanelAdvancedSettings,
} from '~stackable/components'

/**
 * External dependencies
 */
import { adminUrl, i18n } from 'stackable'
import classnames from 'classnames'

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n'
import {
	select, useSelect, dispatch,
} from '@wordpress/data'
import { addFilter } from '@wordpress/hooks'
import { useMemo, useState } from '@wordpress/element'

addFilter( 'stackable.global-settings.inspector', 'stackable/default-blocks', output => {
	// Updating this will force the block list to rerender and update whether
	// blocks have default styles or not.
	const [ forceUpdate, setForceUpdate ] = useState( 0 )
	const [ isOpen, setIsOpen ] = useState( false )

	const blocks = useMemo( () => {
		const { getBlockSupport } = select( 'core/blocks' )
		return select( 'core/blocks' ).getBlockTypes()
			.filter( ( { name } ) => name.startsWith( 'stackable/' ) )
			.filter( ( { name } ) => getBlockSupport( name, 'stkSaveBlockStyle' ) !== false )
			.sort( ( a, b ) => a.title.localeCompare( b.title ) )
	}, [] )

	const { getBlockStyle } = useSelect( 'stackable/block-styles' )

	// This is needed to force the block list to rerender if a block style has changed.
	useSelect( select => {
		return isOpen ? select( 'stackable/block-styles' ).getAllBlockStyles() : []
	}, [ isOpen ] )

	return (
		<>
			{ output }
			<PanelAdvancedSettings
				title={ __( 'Block Defaults', i18n ) }
				onToggle={ isOpen => setIsOpen( isOpen ) }
			>
				<p className="components-base-control__help">
					{ __( 'Manage how Stackable blocks look when they\'re inserted.', i18n ) }
					&nbsp;
					<a href="https://docs.wpstackable.com/article/480-how-to-use-block-defaults?utm_source=wp-global-settings&utm_campaign=learnmore&utm_medium=gutenberg" target="_docs">
						{ __( 'Learn more about Block Defaults', i18n ) }
					</a>
				</p>
				{ blocks.map( ( block, i ) => {
					const searchParams = new URLSearchParams()
					searchParams.set( 'stk_edit_block', block.name )
					searchParams.set( 'stk_edit_block_style', 'default' )
					searchParams.set( 'stk_edit_block_title', block.title )

					const hasStyle = getBlockStyle( block.name, 'default' )
					const className = classnames(
						'ugb-button-icon-control',
						'stk-block-default-control',
						{
							'stk-block-default-control--is-active': hasStyle,
						}
					)

					return (
						<BaseControl
							key={ i }
							label={ block.title }
							className={ className }
							allowReset={ true }
							showReset={ hasStyle }
							onReset={ () => {
								dispatch( 'stackable/block-styles' ).deleteBlockDefaultStyle( block.name, sprintf( __( 'Default %s Block Deleted!', i18n ), block.title ) )
									.then( () => {
										setForceUpdate( forceUpdate + 1 )
									} )
							} }
						>
							<div className="ugb-button-icon-control__wrapper">
								<Button
									className="ugb-button-icon-control__edit"
									label={ __( 'Edit', i18n ) }
									href={ `${ adminUrl }?${ searchParams.toString() }` }
									target="_style-editor"
									isSecondary
									icon="edit"
								/>
							</div>
						</BaseControl>
					)
				} ) }
			</PanelAdvancedSettings>
		</>
	)
} )
