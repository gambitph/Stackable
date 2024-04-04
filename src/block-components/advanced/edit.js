/**
 * External dependencies
 */
import { i18n } from 'stackable'
import {
	AdvancedRangeControl,
	AdvancedSelectControl,
	AdvancedTextControl,
	FourRangeControl,
	InspectorAdvancedControls,
	PanelAdvancedSettings,
} from '~stackable/components'
import { useBlockAttributesContext, useBlockSetAttributesContext } from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { dispatch } from '@wordpress/data'
import { Fragment } from '@wordpress/element'
import {
	__, _x, sprintf,
} from '@wordpress/i18n'
import { kebabCase } from 'lodash'

const HTML_TAG_OPTIONS = [
	{ value: '', label: __( 'Default', i18n ) },
	{ value: 'address', label: _x( 'Address', 'HTML Tag', i18n ) },
	{ value: 'article', label: _x( 'Article', 'HTML Tag', i18n ) },
	{ value: 'aside', label: _x( 'Aside', 'HTML Tag', i18n ) },
	{ value: 'blockquote', label: _x( 'Blockquote', 'HTML Tag', i18n ) },
	{ value: 'div', label: _x( 'Div', 'HTML Tag', i18n ) },
	{ value: 'details', label: _x( 'Details', 'HTML Tag', i18n ) },
	{ value: 'footer', label: _x( 'Footer', 'HTML Tag', i18n ) },
	{ value: 'header', label: _x( 'Header', 'HTML Tag', i18n ) },
	{ value: 'hgroup', label: _x( 'Hgroup', 'HTML Tag', i18n ) },
	{ value: 'main', label: _x( 'Main', 'HTML Tag', i18n ) },
	{ value: 'nav', label: _x( 'Nav', 'HTML Tag', i18n ) },
	{ value: 'section', label: _x( 'Section', 'HTML Tag', i18n ) },
	{ value: 'summary', label: _x( 'Summary', 'HTML Tag', i18n ) },
]

export const Edit = props => {
	const { allowCustomAnchor = false } = props
	const setAttributes = useBlockSetAttributesContext()
	const attributes = useBlockAttributesContext( attributes => {
		return {
			anchor: attributes.anchor,
			position: attributes.position,
			positionTablet: attributes.positionTablet,
			positionMobile: attributes.positionMobile,
		}
	} )

	return (
		<Fragment>
			<InspectorAdvancedControls>
				<PanelAdvancedSettings
					title={ __( 'General', i18n ) }
					id="general"
				>
					{ allowCustomAnchor && (
						<AdvancedTextControl
							attribute="anchor"
							label={ __( 'Anchor', i18n ) }
							placeholder={ __( 'Anchor', i18n ) }
							help={ __( 'Note: Assign unique anchor names to each block so you\'ll be able to link directly and open each one.', i18n ) }
							onBlur={ () => {
								const cleanAnchor = kebabCase( attributes.anchor )
								dispatch( 'core/block-editor' ).__unstableMarkNextChangeAsNotPersistent()
								setAttributes( { anchor: cleanAnchor } )
							} }
						/>
					) }
					<AdvancedSelectControl
						label={ sprintf( _x( '%s HTML Tag', 'component', i18n ), __( 'Block', i18n ) ) }
						attribute="htmlTag"
						options={ HTML_TAG_OPTIONS }
					/>
					<AdvancedSelectControl
						label={ __( 'Overflow', i18n ) }
						attribute="overflow"
						responsive="all"
						options={ [
							{ value: '', label: __( 'Default', i18n ) },
							{ value: 'auto', label: __( 'Auto', i18n ) },
							{ value: 'hidden', label: __( 'Hidden', i18n ) },
							{ value: 'scroll', label: __( 'Scroll', i18n ) },
							{ value: 'visible', label: __( 'Visible', i18n ) },
						] }
					/>
					<AdvancedSelectControl
						label={ __( 'Clear', i18n ) }
						attribute="clear"
						options={ [
							{ value: '', label: __( 'Default', i18n ) },
							{ value: 'left', label: __( 'Left', i18n ) },
							{ value: 'right', label: __( 'Right', i18n ) },
							{ value: 'both', label: __( 'Both', i18n ) },
							{ value: 'none', label: __( 'None', i18n ) },
						] }
					/>
				</PanelAdvancedSettings>

				<PanelAdvancedSettings
					title={ __( 'Position', i18n ) }
					id="position"
				>
					<AdvancedRangeControl
						label={ __( 'Opacity', i18n ) }
						attribute="opacity"
						responsive="all"
						hover="all"
						min={ 0.0 }
						max={ 1.0 }
						step={ 0.1 }
						allowReset={ true }
						placeholder="1"
						helpTooltip={ {
							video: 'advanced-opacity',
							description: __( 'Adjusts the transparency of the entire block', i18n ),
						} }
					/>
					<AdvancedRangeControl
						label={ __( 'Z-Index', i18n ) }
						attribute="zIndex"
						responsive="all"
						sliderMin={ -10 }
						sliderMax={ 10 }
						allowReset={ true }
						placeholder="1"
						helpTooltip={ {
							video: 'advanced-zindex',
							description: __( 'Sets the stack order of different blocks to make one appear in front of another. A block with a higher z-index will show up on top of another block with a lower z-index.', i18n ),

						} }
					/>
					<AdvancedSelectControl
						label={ __( 'Position', i18n ) }
						attribute="position"
						responsive="all"
						help={
							[ attributes.position, attributes.positionTablet, attributes.positionMobile ].includes( 'sticky' )
								? __( 'Sticky position may not work across all themes', i18n )
								: ''
						}
						options={ [
							{ value: '', label: __( 'Default', i18n ) },
							{ value: 'static', label: __( 'Static', i18n ) },
							{ value: 'relative', label: __( 'Relative', i18n ) },
							{ value: 'absolute', label: __( 'Absolute', i18n ) },
							{ value: 'sticky', label: __( 'Sticky', i18n ) },
						] }
					/>

					<FourRangeControl
						label={ __( 'Position', i18n ) }
						attribute="positionNum"
						responsive="all"
						units={ [ 'px', '%' ] }
						hover="all"
						defaultLocked={ false }
						hasLock={ false }
						sliderMin={ -100 }
						sliderMax={ 100 }
					/>
				</PanelAdvancedSettings>
			</InspectorAdvancedControls>
		</Fragment>
	)
}
