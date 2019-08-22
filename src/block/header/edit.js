/**
 * External dependencies
 */
import {
	AdvancedRangeControl,
	AlignButtonsControl,
	BackgroundControlsHelper,
	BlockContainer,
	ButtonControlsHelper,
	ButtonEdit,
	ButtonEditHelper,
	ColorPaletteControl,
	ContentAlignControl,
	ControlSeparator,
	DesignPanelBody,
	HeadingButtonsControl,
	PanelAdvancedSettings,
	PanelBackgroundSettings,
	PanelButtonSettings,
	PanelSpacingBody,
	ProControl,
	ProControlButton,
	ResponsiveControl,
	TypographyControlHelper,
	URLInputControl,
} from '~stackable/components'
import {
	createButtonAttributeNames,
	createResponsiveAttributeNames,
	createTypographyAttributeNames,
	createVideoBackground,
	descriptionPlaceholder,
	hasBackgroundOverlay,
} from '~stackable/util'
import {
	withBlockStyles,
	withContentAlignReseter,
	withGoogleFont,
	withSetAttributeHook,
	withTabbedInspector,
	withUniqueClass,
} from '~stackable/higher-order'

/**
 * Internal dependencies
 */
import createStyles from './style'
import ImageDesignBasic from './images/basic.png'
import ImageDesignPlain from './images/plain.png'
import { showOptions } from '.'

/**
 * WordPress dependencies
 */
import { addFilter, applyFilters } from '@wordpress/hooks'
import {
	AlignmentToolbar, BlockControls, InspectorControls, PanelColorSettings, RichText,
} from '@wordpress/block-editor'
import { i18n, showProNotice } from 'stackable'
import {
	PanelBody, RangeControl, ToggleControl,
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import classnames from 'classnames'
import { compose } from '@wordpress/compose'
import { Fragment } from '@wordpress/element'

addFilter( 'stackable.header.edit.inspector.layout.before', 'stackable/header', ( output, props ) => {
	const { setAttributes } = props
	const {
		design = 'basic',
	} = props.attributes

	return (
		<Fragment>
			{ output }
			<DesignPanelBody
				initialOpen={ true }
				selected={ design }
				options={ [
					{
						image: ImageDesignBasic, label: __( 'Basic', i18n ), value: 'basic',
					},
					{
						image: ImageDesignPlain, label: __( 'Plain', i18n ), value: 'plain',
					},
					...applyFilters( 'stackable.header.edit.designs', [] ),
				] }
				onChange={ design => {
					setAttributes( { design } )
				} }
			>
				{ showProNotice && <ProControlButton /> }
			</DesignPanelBody>
		</Fragment>
	)
} )

addFilter( 'stackable.header.edit.inspector.style.before', 'stackable/header', ( output, props ) => {
	const { setAttributes } = props
	const {
		design = 'basic',
		columns,
		borderRadius = 12,
		shadow = 3,
		showNumber = true,
		showTitle = true,
		showSubtitle = true,
		showIcon = false,
		numberColor = '',
		titleTag = '',
		titleColor = '',
		subtitleColor = '',
		iconColor = '',
		invert = false,
		// shadow = 3,
		align = '',
		restrictContentWidth = false,
		fullHeight = false,
		showButton = true,
		showButton2 = false,
	} = props.attributes

	const show = showOptions( props )

	return (
		<Fragment>
			{ output }
			<PanelBody title={ __( 'General', i18n ) }>
				{ ! [ 'basic', 'plain' ].includes( design ) &&
					<ToggleControl
						label={ __( 'Reverse Horizontally', i18n ) }
						checked={ invert }
						onChange={ invert => setAttributes( { invert } ) }
					/>
				}
				<ToggleControl
					label={ __( 'Full Height', i18n ) }
					checked={ fullHeight }
					onChange={ fullHeight => setAttributes( { fullHeight } ) }
				/>
				{ show.restrictContent &&
					<ToggleControl
						label={ __( 'Restrict to Content Width', i18n ) }
						checked={ restrictContentWidth }
						onChange={ restrictContentWidth => setAttributes( { restrictContentWidth } ) }
					/>
				}
				{ show.borderRadius &&
					<RangeControl
						label={ __( 'Border Radius', i18n ) }
						value={ borderRadius }
						onChange={ borderRadius => setAttributes( { borderRadius } ) }
						min={ 0 }
						max={ 50 }
						allowReset={ true }
					/>
				}
				{ show.columnBackground &&
					<RangeControl
						label={ __( 'Shadow / Outline', i18n ) }
						value={ shadow }
						onChange={ shadow => setAttributes( { shadow } ) }
						min={ 0 }
						max={ 9 }
						allowReset={ true }
					/>
				}
				<ContentAlignControl
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				/>
			</PanelBody>

			{ show.columnBackground &&
				<PanelBody
					title={ __( 'Column Background', i18n ) }
					initialOpen={ false }
				>
					<BackgroundControlsHelper
						attrNameTemplate="column%s"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					/>
				</PanelBody>
			}

			<PanelAdvancedSettings
				title={ __( 'Title', i18n ) }
				checked={ showTitle }
				onChange={ showTitle => setAttributes( { showTitle } ) }
				toggleOnSetAttributes={ [
					...createTypographyAttributeNames( 'title%s' ),
					'titleTag',
					'titleColor',
					...createResponsiveAttributeNames( 'Title%sAlign' ),
				] }
				toggleAttributeName="showTitle"
			>
				<TypographyControlHelper
					attrNameTemplate="title%s"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				/>
				<HeadingButtonsControl
					label={ __( 'Title HTML Tag', i18n ) }
					value={ titleTag || 'h2' }
					onChange={ titleTag => setAttributes( { titleTag } ) }
				/>
				<ColorPaletteControl
					value={ titleColor }
					onChange={ titleColor => setAttributes( { titleColor } ) }
					label={ __( 'Title Color', i18n ) }
				/>
				<ResponsiveControl
					attrNameTemplate="Title%sAlign"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AlignButtonsControl label={ __( 'Align', i18n ) } />
				</ResponsiveControl>
			</PanelAdvancedSettings>

			<PanelAdvancedSettings
				title={ __( 'Subtitle', i18n ) }
				checked={ showSubtitle }
				onChange={ showSubtitle => setAttributes( { showSubtitle } ) }
				toggleOnSetAttributes={ [
					...createTypographyAttributeNames( 'subtitle%s' ),
					'subtitleColor',
					...createResponsiveAttributeNames( 'subtitle%sAlign' ),
				] }
				toggleAttributeName="showSubtitle"
			>
				<TypographyControlHelper
					attrNameTemplate="subtitle%s"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				/>
				<ColorPaletteControl
					value={ subtitleColor }
					onChange={ subtitleColor => setAttributes( { subtitleColor } ) }
					label={ __( 'Subtitle Color', i18n ) }
				/>
				<ResponsiveControl
					attrNameTemplate="subtitle%sAlign"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AlignButtonsControl label={ __( 'Align', i18n ) } />
				</ResponsiveControl>
			</PanelAdvancedSettings>

			<PanelAdvancedSettings
				title={ __( 'Button #1', i18n ) }
				checked={ showButton }
				onChange={ showButton => setAttributes( { showButton } ) }
				toggleOnSetAttributes={ [
					...createButtonAttributeNames( 'button%s' ),
					...createResponsiveAttributeNames( 'button%sAlign' ),
				] }
				toggleAttributeName="showButton"
			>
				<ButtonControlsHelper
					attrNameTemplate="button%s"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				/>
			</PanelAdvancedSettings>

			<PanelAdvancedSettings
				title={ __( 'Button #2', i18n ) }
				checked={ showButton2 }
				onChange={ showButton2 => setAttributes( { showButton2 } ) }
				toggleOnSetAttributes={ [
					...createButtonAttributeNames( 'button2%s' ),
					...createResponsiveAttributeNames( 'button2%sAlign' ),
				] }
				toggleAttributeName="showButton2"
			>
				<ButtonControlsHelper
					attrNameTemplate="button2%s"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				/>
			</PanelAdvancedSettings>

			<PanelSpacingBody initialOpen={ false } blockProps={ props }>
				{ show.titleSpacing && (
					<ResponsiveControl
						attrNameTemplate="title%sBottomMargin"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					>
						<AdvancedRangeControl
							label={ __( 'Title', i18n ) }
							min={ -50 }
							max={ 100 }
							allowReset={ true }
						/>
					</ResponsiveControl>
				) }
				{ show.subtitleSpacing && (
					<ResponsiveControl
						attrNameTemplate="subtitle%sBottomMargin"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					>
						<AdvancedRangeControl
							label={ __( 'Subtitle', i18n ) }
							min={ -50 }
							max={ 100 }
							allowReset={ true }
						/>
					</ResponsiveControl>
				) }
				{ show.buttonGap && (
					<ResponsiveControl
						attrNameTemplate="buttonGap%s"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					>
						<AdvancedRangeControl
							label={ __( 'Button Gap', i18n ) }
							min={ 0 }
							max={ 100 }
							allowReset={ true }
						/>
					</ResponsiveControl>
				) }
			</PanelSpacingBody>
		</Fragment>
	)
} )

const edit = props => {
	const {
		className,
		setAttributes,
	} = props

	const {
		buttonText,
		buttonURL,
		buttonColor,
		buttonTextColor,
		buttonDesign,
		buttonIcon,
		cornerButtonRadius,
		size,
		title,
		titleColor,
		subtitle,
		subtitleColor,
		contentAlign = 'center',
		backgroundColorType = '',
		backgroundColor,
		backgroundColor2,
		backgroundColorDirection = 0,
		backgroundType = '',
		backgroundImageID,
		backgroundImageURL,
		backgroundOpacity,
		fixedBackground,
		design = 'basic',
		borderRadius = 12,
		shadow = 3,
		align,
		restrictContentWidth = false,
		buttonNewTab,
		invert = false,
		fullHeight = false,
		showTitle = true,
		showSubtitle = true,
		showButton = true,
		showButton2 = false,
		titleTag = '',
	} = props.attributes

	const show = showOptions( props )

	const mainClasses = classnames( [
		className,
		'ugb-header',
		'ugb-header--v3',
		[ `ugb-header--design-${ design }` ],
	], applyFilters( 'stackable.header.mainclasses', {
		'ugb--restrict-content-width': show.restrictContent && restrictContentWidth,
	}, design, props ) )

	const itemClasses = classnames( [
		'ugb-header__item',
	], applyFilters( 'stackable.header.boxclasses', {
		'ugb--full-height': fullHeight,
		[ `ugb--shadow-${ shadow }` ]: show.columnBackground,
		'ugb--has-background-overlay': hasBackgroundOverlay( 'column%s', props.attributes ),
	}, props ) )

	return (
		<BlockContainer.Edit className={ mainClasses } blockProps={ props } render={ () => (
			<Fragment>
				{ ( () => {
					const titleComp = <RichText
						tagName={ titleTag || 'h2' }
						className="ugb-header__title"
						placeholder={ __( 'Title for This Block' ) }
						keepPlaceholderOnFocus
						value={ title }
						onChange={ value => setAttributes( { title: value } ) }
					/>
					const subtitleComp = <RichText
						tagName="p"
						className="ugb-header__subtitle"
						placeholder={ descriptionPlaceholder() }
						keepPlaceholderOnFocus
						value={ subtitle }
						onChange={ value => setAttributes( { subtitle: value } ) }
					/>
					// const buttonComp = <ButtonEdit
					// 	className="ugb-button1"
					// 	size={ size }
					// 	align={ contentAlign }
					// 	color={ buttonTextColor }
					// 	backgroundColor={ buttonColor }
					// 	text={ buttonText }
					// 	borderRadius={ cornerButtonRadius }
					// 	design={ buttonDesign }
					// 	icon={ buttonIcon }
					// 	onChange={ text => setAttributes( { buttonText: text } ) }
					// />
					const buttonComp = <ButtonEditHelper
						className="ugb-button1"
						attrNameTemplate="button%s"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					/>
					// const button2Comp = <ButtonEdit
					// 	className="ugb-button2"
					// 	size={ size }
					// 	align={ contentAlign }
					// 	color={ buttonTextColor }
					// 	backgroundColor={ buttonColor }
					// 	text={ buttonText }
					// 	borderRadius={ cornerButtonRadius }
					// 	design={ buttonDesign }
					// 	icon={ buttonIcon }
					// 	onChange={ text => setAttributes( { buttonText: text } ) }
					// />
					const button2Comp = <ButtonEditHelper
						className="ugb-button2"
						attrNameTemplate="button2%s"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					/>
					const comps = {
						titleComp,
						subtitleComp,
						buttonComp,
						button2Comp,
					}

					return (
						<div className={ itemClasses }>
							{ show.columnBackground && createVideoBackground( 'column%s', props ) }
							<div className="ugb-content-wrapper">
								{ applyFilters( 'stackable.header.edit.output', (
									<Fragment>
										{ showTitle && titleComp }
										{ showSubtitle && subtitleComp }
										{ ( showButton || showButton2 ) &&
											<div className="ugb-header__buttons">
												{ showButton && buttonComp }
												{ showButton2 && button2Comp }
											</div>
										}
									</Fragment>
								), design, props, comps ) }
							</div>
						</div>
					)
				} )() }
			</Fragment>
		) } />
	)
}

export default compose(
	withUniqueClass,
	withSetAttributeHook,
	withGoogleFont,
	withTabbedInspector(),
	withContentAlignReseter(),
	// withContentAlignReseter( [ 'Icon%sAlign', 'Number%sAlign', 'Title%sAlign', 'Description%sAlign' ] ),
	withBlockStyles( createStyles, { editorMode: true } ),
)( edit )
