/**
 * External dependencies
 */
import { i18n, isContentOnlyMode } from 'stackable'
import { Button } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { ToolbarGroup } from '@wordpress/components'
import { BlockControls } from '@wordpress/block-editor'
import { __ } from '@wordpress/i18n'
import { select, dispatch } from '@wordpress/data'
import { addFilter } from '@wordpress/hooks'
import { createHigherOrderComponent } from '@wordpress/compose'

const LayoutPickerButton = props => {
	const { disabled, clientId } = props

	return (
		<BlockControls>
			<ToolbarGroup className="stk-layout-picker">
				<Button
					className="components-toolbar__control stk-toolbar-button"
					icon="layout"
					label={ __( 'Reset layout', i18n ) }
					disabled={ disabled }
					onClick={ () => {
						dispatch( 'core/block-editor' ).updateBlockAttributes( clientId, { uniqueId: undefined } )
					} }
				/>
			</ToolbarGroup>
		</BlockControls>
	)
}

LayoutPickerButton.defaultProps = {
	disabled: false,
}

if ( ! isContentOnlyMode ) {
	const withLayoutPicker = createHigherOrderComponent( BlockEdit => {
		return props => {
			const isStackableBlock = props.name.startsWith( 'stackable/' )

			if ( ! isStackableBlock ) {
				return <BlockEdit { ...props } />
			}

			const { getBlockVariations, getBlockSupport } = select( 'core/blocks' )
			const hasLayoutReset = getBlockSupport( props.name, 'stkLayoutReset' ) !== false
			const hasVariations = getBlockVariations( props.name ).length > 0
			const disabled = ! props.attributes.uniqueId

			return (
				<>
					<BlockEdit { ...props } />
					{ hasVariations && hasLayoutReset && (
						<LayoutPickerButton disabled={ disabled } clientId={ props.clientId } />
					) }
				</>
			)
		}
	}, 'withLayoutPicker' )

	addFilter(
		'editor.BlockEdit',
		'stackable/layout-picekr',
		withLayoutPicker
	)
}
