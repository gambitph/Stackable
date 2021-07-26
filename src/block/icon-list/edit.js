/**
 * Internal dependencies
 */
import { IconListStyles } from './style'

/***
 * External dependencies
 */
import classnames from 'classnames'
import { i18n, version as VERSION } from 'stackable'
import {
	InspectorTabs, InspectorStyleControls, PanelAdvancedSettings, AdvancedRangeControl, IconControl, ColorPaletteControl,
} from '~stackable/components'
import {
	useBlockHoverClass,
} from '~stackable/hooks'
import {
	Typography,
	BlockDiv,
	Advanced,
	CustomCSS,
	Responsive,
	CustomAttributes,
	EffectsAnimations,
} from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import {
	Fragment,
} from '@wordpress/element'
import {
	BlockControls,
	RichTextShortcut,
} from '@wordpress/block-editor'
import {
	ToolbarButton,
} from '@wordpress/components'
/* eslint-disable @wordpress/no-unsafe-wp-apis */
import {
	__unstableCanIndentListItems as canIndentListItems,
	__unstableCanOutdentListItems as canOutdentListItems,
	__unstableIndentListItems as indentListItems,
	__unstableOutdentListItems as outdentListItems,
	__unstableChangeListType as changeListType,
	__unstableIsListRootSelected as isListRootSelected,
	__unstableIsActiveListType as isActiveListType,
} from '@wordpress/rich-text'
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import {
	formatListBullets,
	formatListBulletsRTL,
	formatListNumbered,
	formatListNumberedRTL,
	formatIndent,
	formatIndentRTL,
	formatOutdent,
	formatOutdentRTL,
} from '@wordpress/icons'
import {
	__, _x, isRTL,
} from '@wordpress/i18n'

const Edit = props => {
	const {
		attributes,
		setAttributes,
		className,
		isSelected,
	} = props

	const { ordered } = attributes
	const tagName = ordered ? 'ol' : 'ul'

	const blockHoverClass = useBlockHoverClass()

	const blockClassNames = classnames( [
		className,
		'stk-icon-list',
		blockHoverClass,
	] )

	const controls = ( {
		value, onChange, onFocus,
	} ) => (
		<Fragment>
			{ isSelected && (
				<Fragment>
					<RichTextShortcut
						type="primary"
						character="["
						onUse={ () => {
							onChange( outdentListItems( value ) )
						} }
					/>
					<RichTextShortcut
						type="primary"
						character="]"
						onUse={ () => {
							onChange(
								indentListItems( value, { type: tagName } )
							)
						} }
					/>
					<RichTextShortcut
						type="primary"
						character="m"
						onUse={ () => {
							onChange(
								indentListItems( value, { type: tagName } )
							)
						} }
					/>
					<RichTextShortcut
						type="primaryShift"
						character="m"
						onUse={ () => {
							onChange( outdentListItems( value ) )
						} }
					/>
				</Fragment>
			) }

			<BlockControls group="block">
				<ToolbarButton
					icon={ isRTL() ? formatListBulletsRTL : formatListBullets }
					title={ __( 'Unordered' ) }
					describedBy={ __( 'Convert to unordered list' ) }
					isActive={ isActiveListType( value, 'ul', tagName ) }
					onClick={ () => {
						onChange( changeListType( value, { type: 'ul' } ) )
						onFocus()

						if ( isListRootSelected( value ) ) {
							setAttributes( { ordered: false } )
						}
					} }
				/>
				<ToolbarButton
					icon={
						isRTL() ? formatListNumberedRTL : formatListNumbered
					}
					title={ __( 'Ordered' ) }
					describedBy={ __( 'Convert to ordered list' ) }
					isActive={ isActiveListType( value, 'ol', tagName ) }
					onClick={ () => {
						onChange( changeListType( value, { type: 'ol' } ) )
						onFocus()

						if ( isListRootSelected( value ) ) {
							setAttributes( { ordered: true } )
						}
					} }
				/>
				<ToolbarButton
					icon={ isRTL() ? formatOutdentRTL : formatOutdent }
					title={ __( 'Outdent' ) }
					describedBy={ __( 'Outdent list item' ) }
					shortcut={ _x( 'Backspace', 'keyboard key' ) }
					isDisabled={ ! canOutdentListItems( value ) }
					onClick={ () => {
						onChange( outdentListItems( value ) )
						onFocus()
					} }
				/>
				<ToolbarButton
					icon={ isRTL() ? formatIndentRTL : formatIndent }
					title={ __( 'Indent' ) }
					describedBy={ __( 'Indent list item' ) }
					shortcut={ _x( 'Space', 'keyboard key' ) }
					isDisabled={ ! canIndentListItems( value ) }
					onClick={ () => {
						onChange( indentListItems( value, { type: tagName } ) )
						onFocus()
					} }
				/>
			</BlockControls>
		</Fragment>
	)

	return (
		<Fragment>
			<InspectorTabs />

			<BlockDiv.InspectorControls />

			<Typography.InspectorControls
				isMultiline={ true }
				initialOpen={ true }
				hasTextTag={ false }
			/>

			<InspectorStyleControls>
				<PanelAdvancedSettings
					title={ __( 'Icon', i18n ) }
					initialOpen={ false }
					id="icon"
				>
					<IconControl
						label={ __( 'Icon', i18n ) }
						value={ attributes.icon }
						onChange={ icon => {
							// Reset custom individual icons.
							setAttributes( { icon, icons: [] } )
						} }
					/>
					<ColorPaletteControl
						label={ __( 'Icon Color', i18n ) }
						attribute="iconColor"
						hover="all"
					/>

					<AdvancedRangeControl
						label={ __( 'Icon Size', i18n ) }
						attribute="iconSize"
						min={ 0 }
						max={ 100 }
						step={ 1 }
						allowReset={ true }
						hover="all"
					/>

					<AdvancedRangeControl
						label={ __( 'Icon Opacity', i18n ) }
						attribute="iconOpacity"
						min={ 0 }
						max={ 1 }
						step={ 0.1 }
						allowReset={ true }
						placeholder="1.0"
						hover="all"
					/>

					<AdvancedRangeControl
						label={ __( 'Icon Rotation', i18n ) }
						attribute="iconRotation"
						min={ 0 }
						max={ 360 }
						allowReset={ true }
						placeholder="0"
						hover="all"
					/>
				</PanelAdvancedSettings>
			</InspectorStyleControls>

			<Advanced.InspectorControls />
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-icon-list" />
			<Responsive.InspectorControls />

			<IconListStyles version={ VERSION } />
			<CustomCSS mainBlockClass="stk-icon-list" />

			<BlockDiv className={ blockClassNames }>
				<Typography
					__unstableMultilineTag={ tagName }
					tagName={ tagName }
					multiline="li"
				>
					{ controls }
				</Typography>
			</BlockDiv>

		</Fragment>
	)
}

export default Edit
