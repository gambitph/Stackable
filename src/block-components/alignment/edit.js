/**
 * External dependencies
 */
import { i18n } from 'stackable'
import {
	AdvancedToolbarControl,
	AlignButtonsControl,
	InspectorLayoutControls,
} from '~stackable/components'
import { useBlockAttributesContext, useBlockSetAttributesContext } from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { AlignmentToolbar, BlockControls } from '@wordpress/block-editor'
import { Fragment } from '@wordpress/element'
import { sprintf, __ } from '@wordpress/i18n'

export const Edit = props => {
	const { contentAlign, columnJustify } = useBlockAttributesContext( attributes => {
		return {
			contentAlign: attributes.contentAlign,
			columnJustify: attributes.columnJustify,
		}
	} )
	const setAttributes = useBlockSetAttributesContext()

	const {
		labelContentAlign = sprintf( __( '%s Alignment', i18n ), __( 'Content', i18n ) ),
	} = props

	return (
		<Fragment>
			<BlockControls>
				<AlignmentToolbar
					value={ contentAlign }
					onChange={ contentAlign => setAttributes( { contentAlign } ) }
				/>
			</BlockControls>
			<InspectorLayoutControls>
				<AlignButtonsControl
					label={ labelContentAlign }
					attribute="contentAlign"
					responsive="all"
				/>
				<AdvancedToolbarControl
					label={ sprintf( __( '%s Justify', i18n ), __( 'Column', i18n ) ) }
					attribute="columnJustify"
					responsive="all"
					controls="flex-horizontal"
					className="ugb--help-tip-advanced-block-horizontal-align"
					disableTablet={ ! columnJustify }
					disableMobile={ ! columnJustify }
				/>
				{ props.hasColumnAlignment &&
					<AdvancedToolbarControl
						label={ sprintf( __( '%s Alignment', i18n ), __( 'Column', i18n ) ) }
						attribute="columnAlign"
						responsive="all"
						controls="flex-vertical"
						className="ugb--help-tip-advanced-block-vertical-align"
					/>
				}
				{ props.hasRowAlignment &&
					<AdvancedToolbarControl
						label={ sprintf( __( '%s Alignment', i18n ), __( 'Column', i18n ) ) }
						attribute="rowAlign"
						responsive="all"
						controls="flex-vertical"
						className="ugb--help-tip-advanced-block-vertical-align"
					/>
				}
				{ ( props.hasColumnAlignment || props.hasBlockAlignment ) &&
					<AdvancedToolbarControl
						label={ sprintf( __( '%s Alignment', i18n ), __( 'Inner Block', i18n ) ) }
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
			</InspectorLayoutControls>
		</Fragment>
	)
}

Edit.defaultProps = {
	hasRowAlignment: false,
	hasColumnAlignment: false,
	hasBlockAlignment: false,
}
