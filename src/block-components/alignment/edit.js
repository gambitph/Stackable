/**
 * External dependencies
 */
import { i18n } from 'stackable'
import {
	AdvancedToolbarControl,
	AlignButtonsControl,
	ControlSeparator,
	InspectorLayoutControls,
	AdvancedRangeControl,
} from '~stackable/components'
import { useBlockAttributesContext, useBlockSetAttributesContext } from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { AlignmentToolbar, BlockControls } from '@wordpress/block-editor'
import { Fragment } from '@wordpress/element'
import { sprintf, __ } from '@wordpress/i18n'

export const Edit = props => {
	const {
		contentAlign,
		columnJustify,
		innerBlockOrientation,
		innerBlockWrap,
	} = useBlockAttributesContext( attributes => {
		return {
			contentAlign: attributes.contentAlign,
			columnJustify: attributes.columnJustify,
			innerBlockOrientation: attributes.innerBlockOrientation,
			innerBlockWrap: attributes.innerBlockWrap,
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
				{ props.hasColumnJustify &&
					<AdvancedToolbarControl
						label={ sprintf( __( '%s Justify', i18n ), __( 'Column', i18n ) ) }
						attribute="columnJustify"
						responsive="all"
						controls="flex-horizontal"
						className="ugb--help-tip-advanced-block-horizontal-align"
						disableTablet={ ! columnJustify }
						disableMobile={ ! columnJustify }
					/>
				}
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
				{ ( props.hasColumnAlignment || props.hasBlockAlignment ) && <ControlSeparator /> }
				{ ( props.hasColumnAlignment || props.hasBlockAlignment ) &&
					<AdvancedToolbarControl
						label={ sprintf( __( '%s Direction', i18n ), __( 'Inner Block', i18n ) ) }
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
						onChange={ value => {
							const newAttributes = {
								innerBlockOrientation: value,
							}
							if ( value === '' ) { // Vertical.
								newAttributes.innerBlockJustify = ''
							} else { // Horizontal
								newAttributes.innerBlockAlign = ''
							}
							setAttributes( newAttributes )
						} }
					/>
				}
				{ ( props.hasColumnAlignment || props.hasBlockAlignment ) &&
					<AdvancedToolbarControl
						label={ sprintf( __( '%s Justify', i18n ), __( 'Inner Block', i18n ) ) }
						attribute="innerBlockJustify"
						responsive="all"
						controls={ innerBlockOrientation ? 'flex-horizontal' : 'horizontal' }
					/>
				}
				{ ( props.hasColumnAlignment || props.hasBlockAlignment ) &&
					<AdvancedToolbarControl
						label={ sprintf( __( '%s Alignment', i18n ), __( 'Inner Block', i18n ) ) }
						attribute="innerBlockAlign"
						responsive="all"
						controls={ innerBlockOrientation ? 'vertical' : 'flex-justify-vertical' }
					/>
				}
				{ innerBlockOrientation &&
					<AdvancedToolbarControl
						label={ __( 'Inner Block Wrapping', i18n ) }
						controls={ [
							{
								value: '',
								title: __( 'No Wrap', i18n ),
							},
							{
								value: 'wrap',
								title: __( 'Wrap', i18n ),
							},
						] }
						attribute="innerBlockWrap"
					/>
				}
				{ innerBlockOrientation &&
					<AdvancedRangeControl
						label={ __( 'Column Gap', i18n ) }
						responsive="all"
						min={ 0 }
						sliderMax={ 100 }
						placeholder="24"
						attribute="innerBlockColumnGap"
					/>
				}
				{ ( innerBlockOrientation && innerBlockWrap === 'wrap' ) &&
					<AdvancedRangeControl
						label={ __( 'Row Gap', i18n ) }
						responsive="all"
						min={ 0 }
						sliderMax={ 100 }
						placeholder="0"
						attribute="innerBlockRowGap"
					/>
				}
			</InspectorLayoutControls>
		</Fragment>
	)
}

Edit.defaultProps = {
	hasColumnJustify: false,
	hasRowAlignment: false,
	hasColumnAlignment: false,
	hasBlockAlignment: false,
}
