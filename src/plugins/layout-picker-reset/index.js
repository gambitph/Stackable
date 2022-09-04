/**
 * External dependencies
 */
import { i18n, isContentOnlyMode } from 'stackable'
import { Button } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { ToolbarGroup } from '@wordpress/components'
import { BlockControls, useBlockEditContext } from '@wordpress/block-editor'
import { __ } from '@wordpress/i18n'
import { useSelect, useDispatch } from '@wordpress/data'
import { addFilter } from '@wordpress/hooks'
import { createHigherOrderComponent } from '@wordpress/compose'

const LayoutPickerButton = props => {
	const { disabled } = props
	const { clientId } = useBlockEditContext()
	const { updateBlockAttributes } = useDispatch( 'core/block-editor' )

	return (
		<BlockControls>
			<ToolbarGroup className="stk-layout-picker">
				<Button
					className="components-toolbar__control stk-toolbar-button"
					icon="layout"
					label={ __( 'Reset layout', i18n ) }
					disabled={ disabled }
					onClick={ () => updateBlockAttributes( clientId, { uniqueId: undefined } ) }
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
			const { getBlockVariations, getBlockSupport } = useSelect( 'core/blocks' )
			const isStackableBlock = props.name.startsWith( 'stackable/' )

			if ( ! isStackableBlock ) {
				return <BlockEdit { ...props } />
			}

			const hasLayoutReset = getBlockSupport( props.name, 'stkLayoutReset' ) !== false
			const hasVariations = getBlockVariations( props.name ).length > 0
			const disabled = ! props.attributes.uniqueId

			return (
				<>
					<BlockEdit { ...props } />
					{ hasVariations && hasLayoutReset && (
						<LayoutPickerButton disabled={ disabled } />
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
