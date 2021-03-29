/**
 * External dependencies
 */
import { i18n } from 'stackable'
import {
	AdvancedToolbarControl,
	AlignButtonsControl,
	InspectorSectionControls,
	PanelAdvancedSettings,
	ResponsiveControl2,
} from '~stackable/components'
import { useBlockAttributes } from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import {
	AlignmentToolbar, BlockControls, useBlockEditContext,
} from '@wordpress/block-editor'
import { useDispatch } from '@wordpress/data'
import { Fragment } from '@wordpress/element'
import { __ } from '@wordpress/i18n'

export const Edit = props => {
	const { clientId } = useBlockEditContext()

	const { updateBlockAttributes } = useDispatch( 'core/block-editor' )
	const attributes = useBlockAttributes( clientId )

	return (
		<Fragment>
			<BlockControls>
				<AlignmentToolbar
					value={ attributes.contentAlign }
					onChange={ contentAlign => updateBlockAttributes( clientId, { contentAlign } ) }
				/>
			</BlockControls>
			<InspectorSectionControls>
				<PanelAdvancedSettings
					title={ __( 'Alignment', i18n ) }
					id="alignment"
				>
					<ResponsiveControl2
						desktopProps={ {
							value: attributes.contentAlign,
							onChange: contentAlign => updateBlockAttributes( clientId, { contentAlign } ),
						} }
						tabletProps={ {
							value: attributes.contentAlignTablet,
							onChange: contentAlignTablet => updateBlockAttributes( clientId, { contentAlignTablet } ),
						} }
						mobileProps={ {
							value: attributes.contentAlignMobile,
							onChange: contentAlignMobile => updateBlockAttributes( clientId, { contentAlignMobile } ),
						} }
					>
						<AlignButtonsControl
							label={ __( 'Content Alignment', i18n ) }
						/>
					</ResponsiveControl2>
					{ props.hasColumnAlignment &&
						<ResponsiveControl2
							desktopProps={ {
								value: attributes.columnAlign,
								onChange: columnAlign => updateBlockAttributes( clientId, { columnAlign } ),
							} }
							tabletProps={ {
								value: attributes.columnAlignTablet,
								onChange: columnAlignTablet => updateBlockAttributes( clientId, { columnAlignTablet } ),
							} }
							mobileProps={ {
								value: attributes.columnAlignMobile,
								onChange: columnAlignMobile => updateBlockAttributes( clientId, { columnAlignMobile } ),
							} }
						>
							<AdvancedToolbarControl
								label={ __( 'Column Alignment', i18n ) }
								controls="flex-vertical-with-stretch"
								className="ugb--help-tip-advanced-block-vertical-align"
							/>
						</ResponsiveControl2>
					}
					{ props.hasRowAlignment &&
						<ResponsiveControl2
							desktopProps={ {
								value: attributes.rowAlign,
								onChange: rowAlign => updateBlockAttributes( clientId, { rowAlign } ),
							} }
							tabletProps={ {
								value: attributes.rowAlignTablet,
								onChange: rowAlignTablet => updateBlockAttributes( clientId, { rowAlignTablet } ),
							} }
							mobileProps={ {
								value: attributes.rowAlignMobile,
								onChange: rowAlignMobile => updateBlockAttributes( clientId, { rowAlignMobile } ),
							} }
						>
							<AdvancedToolbarControl
								label={ __( 'Column Alignment', i18n ) }
								controls="flex-vertical-with-stretch"
								className="ugb--help-tip-advanced-block-vertical-align"
							/>
						</ResponsiveControl2>
					}
					{ props.hasColumnAlignment &&
						<AdvancedToolbarControl
							label={ __( 'Inner Block Alignment', i18n ) }
							controls={ [
								{
									value: 'horizontal',
									title: __( 'Horizontal', i18n ),
								},
								{
									value: 'vertical',
									title: __( 'Vertical', i18n ),
								},
							] }
							value={ attributes.innerBlockOrientation }
							onChange={ innerBlockOrientation => updateBlockAttributes( clientId, { innerBlockOrientation } ) }
						/>
					}
					{ props.hasColumnAlignment &&
						<ResponsiveControl2
							desktopProps={ {
								value: attributes.innerBlockVerticalAlign,
								onChange: innerBlockVerticalAlign => updateBlockAttributes( clientId, { innerBlockVerticalAlign } ),
							} }
							tabletProps={ {
								value: attributes.innerBlockVerticalAlignTablet,
								onChange: innerBlockVerticalAlignTablet => updateBlockAttributes( clientId, { innerBlockVerticalAlignTablet } ),
							} }
							mobileProps={ {
								value: attributes.innerBlockVerticalAlignMobile,
								onChange: innerBlockVerticalAlignMobile => updateBlockAttributes( clientId, { innerBlockVerticalAlignMobile } ),
							} }
						>
							<AdvancedToolbarControl
								label={ __( 'Inner Block Vertical Alignment', i18n ) }
								controls="flex-vertical"
								className="ugb--help-tip-advanced-block-vertical-align"
							/>
						</ResponsiveControl2>
					}
				</PanelAdvancedSettings>
			</InspectorSectionControls>
		</Fragment>
	)
}

Edit.defaultProps = {
	hasRowAlignment: false,
	hasColumnAlignment: false,
}
