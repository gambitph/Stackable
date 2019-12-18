/**
 * External dependencies
 */
import {
	AdvancedRangeControl,
	AlignButtonsControl,
	BackgroundControlsHelper,
	BlockContainer,
	ButtonControlsHelper,
	ButtonEditHelper,
	ColorPaletteControl,
	ContentAlignControl,
	ControlSeparator,
	DesignPanelBody,
	HeadingButtonsControl,
	PanelAdvancedSettings,
	PanelSpacingBody,
	ProControlButton,
	ResponsiveControl,
	TypographyControlHelper,
	DivBackground,
} from '~stackable/components'
import {
	createButtonAttributeNames,
	createResponsiveAttributeNames,
	createTypographyAttributeNames,
	descriptionPlaceholder,
} from '~stackable/util'
import {
	withBlockStyles,
	withContentAlignReseter,
	withGoogleFont,
	withSetAttributeHook,
	withTabbedInspector,
	withUniqueClass,
	withClickOpenInspector,
} from '~stackable/higher-order'
import classnames from 'classnames'
import { i18n, showProNotice } from 'stackable'

/**
 * Internal dependencies
 */
import createStyles from './style'
import ImageDesignBasic from './images/basic.png'
import ImageDesignPlain from './images/plain.png'
import { showOptions } from './util'

/**
 * WordPress dependencies
 */
import { addFilter, applyFilters } from '@wordpress/hooks'
import {
	PanelBody, ToggleControl,
} from '@wordpress/components'
import {
	__, _x, sprintf,
} from '@wordpress/i18n'
import { compose } from '@wordpress/compose'
import { RichText } from '@wordpress/block-editor'
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
					...applyFilters( 'stackable.header.edit.layouts', [] ),
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
		borderRadius = '',
		shadow = '',
		showTitle = true,
		showSubtitle = true,
		titleTag = '',
		titleColor = '',
		subtitleColor = '',
		invert = false,
		restrictContentWidth = false,
		fullHeight = false,
		showButton = true,
		showButton2 = false,
		overlayColor = '',
		overlayOpacity = '',
	} = props.attributes

	const show = showOptions( props )

	return (
		<Fragment>
			{ output }
			<PanelBody title={ __( 'General', i18n ) }>
				{ ! [ 'basic', 'plain', 'center-overlay' ].includes( design ) &&
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
					className="ugb--help-tip-full-height"
				/>
				{ show.restrictContent &&
					<ToggleControl
						label={ __( 'Restrict to Content Width', i18n ) }
						checked={ restrictContentWidth }
						onChange={ restrictContentWidth => setAttributes( { restrictContentWidth } ) }
						className="ugb--help-tip-general-restrict-content"
					/>
				}
				{ show.borderRadius &&
					<AdvancedRangeControl
						label={ __( 'Border Radius', i18n ) }
						value={ borderRadius }
						onChange={ borderRadius => setAttributes( { borderRadius } ) }
						min={ 0 }
						max={ 50 }
						allowReset={ true }
						placeholder="12"
						className="ugb--help-tip-general-border-radius"
					/>
				}
				{ show.columnBackground &&
					<AdvancedRangeControl
						label={ __( 'Shadow / Outline', i18n ) }
						value={ shadow }
						onChange={ shadow => setAttributes( { shadow } ) }
						min={ 0 }
						max={ 9 }
						allowReset={ true }
						placeholder="3"
						className="ugb--help-tip-general-shadow"
					/>
				}
				<ContentAlignControl
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				/>
			</PanelBody>

			{ show.columnBackground &&
				<PanelAdvancedSettings
					title={ __( 'Column Background', i18n ) }
					initialOpen={ false }
					id="column-background"
					className="ugb--help-tip-column-background-on-off"
				>
					<BackgroundControlsHelper
						attrNameTemplate="column%s"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					/>
				</PanelAdvancedSettings>
			}

			{ show.overlayBackground &&
				<PanelAdvancedSettings
					title={ __( 'Overlay Background', i18n ) }
					id="overlay-background"
					initialOpen={ false }
				>
					<ColorPaletteControl
						label={ __( 'Background Color', i18n ) }
						value={ overlayColor }
						onChange={ overlayColor => setAttributes( { overlayColor } ) }
					/>
					<AdvancedRangeControl
						label={ __( 'Background Color Opacity', i18n ) }
						value={ overlayOpacity }
						onChange={ overlayOpacity => setAttributes( { overlayOpacity } ) }
						min={ 0 }
						max={ 1 }
						step={ 0.1 }
						allowReset={ true }
						placeholder="1"
						className="ugb--help-tip-background-color-opacity"
					/>
				</PanelAdvancedSettings>
			}

			<PanelAdvancedSettings
				title={ __( 'Title', i18n ) }
				id="title"
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
					<AlignButtonsControl
						label={ __( 'Align', i18n ) }
						className="ugb--help-tip-alignment-title"
					/>
				</ResponsiveControl>
			</PanelAdvancedSettings>

			<PanelAdvancedSettings
				title={ __( 'Subtitle', i18n ) }
				id="subtitle"
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
					<AlignButtonsControl
						label={ __( 'Align', i18n ) }
						className="ugb--help-tip-alignment-title"
					/>
				</ResponsiveControl>
			</PanelAdvancedSettings>

			<PanelAdvancedSettings
				title={ sprintf( _x( '%s #%d', 'Panel title', i18n ), __( 'Button', i18n ), 1 ) }
				id="button1"
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
				<ControlSeparator />
				<ResponsiveControl
					attrNameTemplate="button%sAlign"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AlignButtonsControl
						label={ __( 'Align', i18n ) }
						help={ __( 'This affects other buttons in this block', i18n ) }
						className="ugb--help-tip-alignment-button"
					/>
				</ResponsiveControl>
			</PanelAdvancedSettings>

			<PanelAdvancedSettings
				title={ sprintf( _x( '%s #%d', 'Panel title', i18n ), __( 'Button', i18n ), 2 ) }
				id="button2"
				checked={ showButton2 }
				onChange={ showButton2 => setAttributes( { showButton2 } ) }
				toggleOnSetAttributes={ [
					...createButtonAttributeNames( 'button2%s' ),
				] }
				toggleAttributeName="showButton2"
			>
				<ButtonControlsHelper
					attrNameTemplate="button2%s"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				/>
				<ResponsiveControl
					attrNameTemplate="button%sAlign"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AlignButtonsControl
						label={ __( 'Align', i18n ) }
						help={ __( 'This affects other buttons in this block', i18n ) }
						className="ugb--help-tip-alignment-button"
					/>
				</ResponsiveControl>
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
							className="ugb--help-tip-spacing-title"
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
							className="ugb--help-tip-spacing-title"
						/>
					</ResponsiveControl>
				) }
				{ show.buttonSpacing && (
					<ResponsiveControl
						attrNameTemplate="button%sBottomMargin"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					>
						<AdvancedRangeControl
							label={ __( 'Button', i18n ) }
							min={ -50 }
							max={ 100 }
							allowReset={ true }
							className="ugb--help-tip-spacing-button"
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
							className="ugb--help-tip-spacing-button-gap"
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
		title,
		subtitle,
		design = 'basic',
		shadow = '',
		restrictContentWidth = false,
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
		'ugb-header--invert': invert,
	}, design, props ) )

	const itemClasses = classnames( [
		'ugb-header__item',
	], applyFilters( 'stackable.header.boxclasses', {
		'ugb--full-height': fullHeight,
		[ `ugb--shadow-${ shadow }` ]: show.columnBackground && shadow !== '',
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
					const buttonComp = <ButtonEditHelper
						className="ugb-button1"
						attrNameTemplate="button%s"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					/>
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
						<DivBackground
							className={ itemClasses }
							backgroundAttrName="column%s"
							blockProps={ props }
							showBackground={ show.columnBackground }
						>
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
						</DivBackground>
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
	withContentAlignReseter( [ 'Title%sAlign', 'Subtitle%sAlign', 'Button%sAlign' ] ),
	withBlockStyles( createStyles, { editorMode: true } ),
	withClickOpenInspector( [
		[ '.ugb-content-wrapper', 'overlay-background' ],
		[ '.ugb-header__item', 'column-background' ],
		[ '.ugb-header__title', 'title' ],
		[ '.ugb-header__subtitle', 'subtitle' ],
		[ '.ugb-button1', 'button1' ],
		[ '.ugb-button2', 'button2' ],
	] ),
)( edit )
