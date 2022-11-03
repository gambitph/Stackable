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
import { useBlockAttributesContext, useBlockSetAttributesContext } from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { select } from '@wordpress/data'
import { useBlockEditContext } from '@wordpress/block-editor'

export const Controls = props => {
	const {
		hasColumnCount,
	} = props

	const { clientId } = useBlockEditContext()
	const attributes = useBlockAttributesContext( attributes => {
		return {
			align: attributes.align,
			columnFit: attributes.columnFit,
		}
	} )
	const setAttributes = useBlockSetAttributesContext()

	return (
		<>
			{ hasColumnCount && <ColumnsControl /> }

			<AdvancedToolbarControl
				label={ __( 'Content Width', i18n ) }
				attribute="innerBlockContentAlign"
				default={ attributes.align ? `align${ attributes.align }` : '' }
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
						checked={ attributes.columnFit }
						onChange={ value => {
							const attributesToSave = { columnFit: value ? true : '' }

							// When columnFit is changed, remove all column widths.
							if ( value ) {
								const { getBlock } = select( 'core/block-editor' )
								getBlock( clientId ).innerBlocks.forEach( block => {
									if ( block.name === 'stackable/column' ) {
										// eslint-disable-next-line stackable/no-update-block-attributes
										attributesToSave[ getAttributeName( 'columnWidth', 'desktop' ) ] = ''
										attributesToSave[ getAttributeName( 'columnWidth', 'tablet' ) ] = ''
										attributesToSave[ getAttributeName( 'columnWidth', 'mobile' ) ] = ''
									}
								} )
							}

							setAttributes( attributesToSave )
						} }
					/>
					{ attributes.columnFit &&
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
					<AdvancedRangeControl
						label={ __( 'Row Gap', i18n ) }
						attribute="rowGap"
						responsive="all"
						min={ 0 }
						sliderMax={ 100 }
						placeholder="0"
					/>
				</>
			) }

		</>
	)
}

Controls.defaultProps = {
	hasColumnCount: false,
}

export const Edit = props => {
	return (
		<InspectorStyleControls>
			<PanelAdvancedSettings
				title={ __( 'General', i18n ) }
				id="general"
				initialOpen={ true }
			>
				<Controls { ...props } />
			</PanelAdvancedSettings>
		</InspectorStyleControls>
	)
}

Edit.defaultProps = {
	hasColumnCount: false,
}

Edit.Controls = Controls
