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
import { useSelect } from '@wordpress/data'
import { addFilter } from '@wordpress/hooks'
import { createHigherOrderComponent } from '@wordpress/compose'
import { useBlockSetAttributesContext } from '~stackable/hooks'

const LayoutPickerButton = props => {
	const { disabled } = props
	const setAttributes = useBlockSetAttributesContext()

	return (
		<BlockControls>
			<ToolbarGroup className="stk-layout-picker">
				<Button
					className="components-toolbar__control stk-toolbar-button"
					icon="layout"
					label={ __( 'Reset layout', i18n ) }
					disabled={ disabled }
					onClick={ () => setAttributes( { uniqueId: undefined } ) }
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
