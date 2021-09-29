/**
 * Internal dependencies
 */
import { ColumnsControl } from './column-settings-button'

/**
 * External dependencies
 */
import { i18n } from 'stackable'
import {
	AdvancedRangeControl,
	AdvancedToggleControl,
	AdvancedToolbarControl,
	InspectorStyleControls,
	PanelAdvancedSettings,
} from '~stackable/components'
import { getAttributeName } from '~stackable/util'
import {
	useAttributeEditHandlers,
} from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { select } from '@wordpress/data'
import { useBlockEditContext } from '@wordpress/block-editor'

export const Edit = props => {
	const {
		hasColumnCount,
	} = props

	const { clientId } = useBlockEditContext()
	const {
		getAttribute, updateAttribute, updateAttributes,
	} = useAttributeEditHandlers()

	return (
		<InspectorStyleControls>
			<PanelAdvancedSettings
				title={ __( 'General', i18n ) }
				id="general"
				initialOpen={ true }
			>
				{ hasColumnCount && <ColumnsControl /> }

				<AdvancedToolbarControl
					label={ __( 'Content Alignment', i18n ) }
					attribute="contentAlign"
					controls={ [
						{
							value: '',
							title: __( 'Align Center', i18n ),
							icon: 'align-center',
						},
						{
							value: 'alignwide',
							title: __( 'Align Wide', i18n ),
							icon: 'align-wide',
						},
						{
							value: 'alignfull',
							title: __( 'Align Full', i18n ),
							icon: 'align-full-width',
						},
					] }
				/>
				{ hasColumnCount && (
					<>
						<AdvancedToggleControl
							label={ __( 'Fit all columns to content', i18n ) }
							checked={ getAttribute( 'columnFit' ) }
							onChange={ value => {
								updateAttribute( 'columnFit', value ? true : '' )

								// When columnFit is changed, remove all column widths.
								if ( value ) {
									const { getBlock } = select( 'core/block-editor' )

									getBlock( clientId ).innerBlocks.forEach( block => {
										if ( block.name === 'stackable/column' ) {
											updateAttributes( {
												[ getAttributeName( 'columnWidth', 'desktop' ) ]: '',
												[ getAttributeName( 'columnWidth', 'tablet' ) ]: '',
												[ getAttributeName( 'columnWidth', 'mobile' ) ]: '',
											} )
										}
									} )
								}
							} }
						/>
						{ getAttribute( 'columnFit' ) &&
							<AdvancedToolbarControl
								label={ __( 'Columns Alignment', i18n ) }
								attribute="columnFitAlign"
								responsive="all"
								controls="flex-horizontal"
							/>
						}
						<AdvancedRangeControl
							label={ __( 'Column Gap', i18n ) }
							attribute="columnGap"
							responsive="all"
							min={ 0 }
							sliderMax={ 100 }
							placeholder="0"
						/>
					</>
				) }
			</PanelAdvancedSettings>
		</InspectorStyleControls>
	)
}

Edit.defaultProps = {
	hasColumnCount: false,
}
