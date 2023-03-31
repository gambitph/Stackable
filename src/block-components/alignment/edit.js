/**
 * External dependencies
 */
import { i18n } from 'stackable'
import {
	AdvancedToolbarControl,
	AlignButtonsControl,
	InspectorBlockControls,
	PanelAdvancedSettings,
} from '~stackable/components'
import { useBlockAttributesContext, useBlockSetAttributesContext } from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { AlignmentToolbar, BlockControls } from '@wordpress/block-editor'
import { Fragment } from '@wordpress/element'
import { __ } from '@wordpress/i18n'

export const Edit = props => {
	const contentAlign = useBlockAttributesContext( attributes => attributes.contentAlign )
	const setAttributes = useBlockSetAttributesContext()

	return (
		<Fragment>
			<BlockControls>
				<AlignmentToolbar
					value={ contentAlign }
					onChange={ contentAlign => setAttributes( { contentAlign } ) }
				/>
			</BlockControls>
			<InspectorBlockControls>
				<PanelAdvancedSettings
					title={ __( 'Alignment', i18n ) }
					id="alignment"
				>
					<AlignButtonsControl
						label={ __( 'Content Alignment', i18n ) }
						attribute="contentAlign"
						responsive="all"
					/>
					{ props.hasColumnAlignment &&
						<AdvancedToolbarControl
							label={ __( 'Column Alignment', i18n ) }
							attribute="columnAlign"
							responsive="all"
							controls="flex-vertical-with-stretch"
							className="ugb--help-tip-advanced-block-vertical-align"
						/>
					}
					{ props.hasRowAlignment &&
						<AdvancedToolbarControl
							label={ __( 'Column Alignment', i18n ) }
							attribute="rowAlign"
							responsive="all"
							controls="flex-vertical-with-stretch"
							className="ugb--help-tip-advanced-block-vertical-align"
						/>
					}
					{ ( props.hasColumnAlignment || props.hasBlockAlignment ) &&
						<AdvancedToolbarControl
							label={ __( 'Inner Block Alignment', i18n ) }
							controls={ [
								{
									value: 'horizontal',
									title: __( 'Horizontal', i18n ),
								},
								{
									value: '',
									title: __( 'Vertical', i18n ),
								},
							] }
							attribute="innerBlockOrientation"
						/>
					}
				</PanelAdvancedSettings>
			</InspectorBlockControls>
		</Fragment>
	)
}

Edit.defaultProps = {
	hasRowAlignment: false,
	hasColumnAlignment: false,
	hasBlockAlignment: false,
}
