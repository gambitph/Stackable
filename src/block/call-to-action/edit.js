/**
 * External dependencies
 */
import {
	AdvancedRangeControl,
	AlignButtonsControl,
	BackgroundControlsHelper,
	BlockContainer,
	ButtonControlsHelper,
	ColorPaletteControl,
	ContentAlignControl,
	ColumnPaddingControl,
	ControlSeparator,
	DesignPanelBody,
	HeadingButtonsControl,
	PanelAdvancedSettings,
	PanelSpacingBody,
	ProControlButton,
	ResponsiveControl,
	TypographyControlHelper,
	ButtonEditHelper,
	DivBackground,
	ButtonIconPopoverControl,
	BorderControlsHelper,
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
	withDesignLayoutSelector,
} from '~stackable/higher-order'
import { i18n, showProNotice } from 'stackable'
import classnames from 'classnames'

/**
 * Internal dependencies
 */
import createStyles from './style'
import ImageDesignBasic from './images/basic.png'
import ImageDesignPlain from './images/plain.png'
import ImageDesignHorizontal from './images/horizontal.png'
import ImageDesignHorizontal2 from './images/horizontal-2.png'
import ImageDesignHorizontal3 from './images/horizontal-3.png'
import ImageDesignSplitCentered from './images/split-centered.png'
import { showOptions } from './util'

/**
 * WordPress dependencies
 */
import { addFilter, applyFilters } from '@wordpress/hooks'
import {
	__, sprintf, _x,
} from '@wordpress/i18n'
import { compose } from '@wordpress/compose'
import { Fragment } from '@wordpress/element'
import { RichText } from '@wordpress/block-editor'

addFilter( 'stackable.cta.edit.layouts', 'default', layouts => {
	const newLayouts = [
		{
			label: __( 'Basic', i18n ), value: 'basic', image: ImageDesignBasic,
		},
		{
			label: __( 'Plain', i18n ), value: 'plain', image: ImageDesignPlain,
		},
		{
			label: __( 'Horizontal', i18n ), value: 'horizontal', image: ImageDesignHorizontal, premium: true,
		},
		{
			label: sprintf( _x( '%s %d', 'Nth Title', i18n ), __( 'Horizontal', i18n ), 2 ), value: 'horizontal-2', image: ImageDesignHorizontal2, premium: true,
		},
		{
			label: sprintf( _x( '%s %d', 'Nth Title', i18n ), __( 'Horizontal', i18n ), 3 ), value: 'horizontal-3', image: ImageDesignHorizontal3, premium: true,
		},
		{
			label: __( 'Split Centered', i18n ), value: 'split-centered', image: ImageDesignSplitCentered, premium: true,
		},
	]

	return [
		...layouts,
		...newLayouts,
	]
} )

addFilter( 'stackable.cta.edit.inspector.layout.before', 'stackable/cta', ( output, props ) => {
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
				options={ applyFilters( 'stackable.cta.edit.layouts', [] ) }
				onChange={ design => setAttributes( { design } ) }
			>
				{ showProNotice && <ProControlButton /> }
			</DesignPanelBody>
		</Fragment>
	)
} )

addFilter( 'stackable.cta.edit.inspector.style.before', 'stackable/cta', ( output, props ) => {
	const { setAttributes } = props
	const {
		titleColor,
		descriptionColor,
		borderRadius = '',
		shadow = '',
		showTitle = true,
		showDescription = true,
		showButton = true,
		titleTag = '',
	} = props.attributes

	const show = showOptions( props )

	return (
		<Fragment>
			{ output }
			<PanelAdvancedSettings
				title={ __( 'General', i18n ) }
				initialOpen={ true }
			>
				<ContentAlignControl
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				/>
			</PanelAdvancedSettings>

			{ show.columnBackground &&
				<PanelAdvancedSettings
					title={ __( 'Container', i18n ) }
					initialOpen={ false }
					id="column-background"
					className="ugb--help-tip-column-background-on-off"
				>
					<ButtonIconPopoverControl
						label={ __( 'Background', i18n ) }
						popoverLabel={ __( 'Background', i18n ) }
						onReset={ () => {
							setAttributes( {
								columnBackgroundColorType: '',
								columnBackgroundColor: '',
								columnBackgroundColor2: '',
								columnBackgroundColorOpacity: '',
								columnBackgroundMediaID: '',
								columnBackgroundMediaUrl: '',
								columnBackgroundTintStrength: '',
								columnFixedBackground: '',
							} )
						} }
						allowReset={ props.attributes.columnBackgroundColor || props.attributes.columnBackgroundMediaUrl }
						hasColorPreview={ props.attributes.columnBackgroundColor }
						hasImagePreview={ props.attributes.columnBackgroundMediaUrl }
						colorPreview={ props.attributes.columnBackgroundColorType === 'gradient' ? [ props.attributes.columnBackgroundColor, props.attributes.columnBackgroundColor2 ] : props.attributes.columnBackgroundColor }
						imageUrlPreview={ props.attributes.columnBackgroundMediaUrl }
					>
						<BackgroundControlsHelper
							attrNameTemplate="column%s"
							setAttributes={ setAttributes }
							blockAttributes={ props.attributes }
						/>
					</ButtonIconPopoverControl>

					{ show.border &&
						<BorderControlsHelper
							attrNameTemplate="column%s"
							setAttributes={ setAttributes }
							blockAttributes={ props.attributes }
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
				</PanelAdvancedSettings>
			}

			<PanelSpacingBody
				initialOpen={ false }
				blockProps={ props }
			>
				<ColumnPaddingControl
					label={ __( 'Paddings', i18n ) }
					setAttributes={ setAttributes }
					attributes={ props.attributes }
				/>
				{ show.titleSpacing &&
					<ResponsiveControl
						attrNameTemplate="title%sBottomMargin"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					>
						<AdvancedRangeControl
							label={ __( 'Title', i18n ) }
							min={ -50 }
							max={ 100 }
							placeholder="16"
							allowReset={ true }
							className="ugb--help-tip-spacing-title"
						/>
					</ResponsiveControl>
				}
				{ show.descriptionSpacing &&
					<ResponsiveControl
						attrNameTemplate="description%sBottomMargin"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					>
						<AdvancedRangeControl
							label={ __( 'Description', i18n ) }
							min={ -50 }
							max={ 100 }
							placeholder="16"
							allowReset={ true }
							className="ugb--help-tip-spacing-description"
						/>
					</ResponsiveControl>
				}
				{ show.buttonSpacing &&
					<ResponsiveControl
						attrNameTemplate="button%sBottomMargin"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					>
						<AdvancedRangeControl
							label={ __( 'Button', i18n ) }
							min={ -50 }
							max={ 100 }
							placeholder="0"
							allowReset={ true }
							className="ugb--help-tip-spacing-button"
						/>
					</ResponsiveControl>
				}
			</PanelSpacingBody>

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
				<HeadingButtonsControl
					value={ titleTag || 'h3' }
					onChange={ titleTag => setAttributes( { titleTag } ) }
				/>
				<TypographyControlHelper
					attrNameTemplate="title%s"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
					className="ugb--help-tip-typography-family"
					htmlTag={ titleTag || 'h3' }
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
				title={ __( 'Description', i18n ) }
				id="description"
				checked={ showDescription }
				onChange={ showDescription => setAttributes( { showDescription } ) }
				toggleOnSetAttributes={ [
					...createTypographyAttributeNames( 'description%s' ),
					'descriptionColor',
					...createResponsiveAttributeNames( 'description%sAlign' ),
				] }
				toggleAttributeName="showDescription"
			>
				<TypographyControlHelper
					attrNameTemplate="description%s"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				/>
				<ColorPaletteControl
					value={ descriptionColor }
					onChange={ descriptionColor => setAttributes( { descriptionColor } ) }
					label={ __( 'Description Color', i18n ) }
				/>
				<ResponsiveControl
					attrNameTemplate="description%sAlign"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AlignButtonsControl
						label={ __( 'Align', i18n ) }
						className="ugb--help-tip-alignment-description"
					/>
				</ResponsiveControl>
			</PanelAdvancedSettings>

			<PanelAdvancedSettings
				title={ __( 'Button', i18n ) }
				id="button"
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
					placeholder="21"
				/>
				<ControlSeparator />
				<ResponsiveControl
					attrNameTemplate="Button%sAlign"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AlignButtonsControl
						label={ __( 'Align', i18n ) }
						className="ugb--help-tip-alignment-button"
					/>
				</ResponsiveControl>
			</PanelAdvancedSettings>

		</Fragment>
	)
} )

const edit = props => {
	const {
		className,
		setAttributes,
	} = props

	const {
		design = 'basic',
		shadow = '',

		// Title.
		showTitle = true,
		title = '',
		titleTag = 'h3',

		// Description.
		showDescription = true,
		description = '',

		// Button.
		showButton = true,
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-cta',
		'ugb-cta--v2',
	], applyFilters( 'stackable.cta.mainclasses', {
		[ `ugb-cta--design-${ design }` ]: design !== 'basic',
	}, design, props ) )

	const itemClasses = classnames( [
		'ugb-cta__item',
	], applyFilters( 'stackable.cta.boxclasses', {
		[ `ugb--shadow-${ shadow }` ]: design !== 'plain' && shadow !== '',
	}, design, props ) )

	const titleComp = showTitle &&
		<RichText
			tagName={ titleTag || 'h3' }
			value={ title }
			className="ugb-cta__title"
			placeholder={ __( 'Title for This Block', i18n ) }
			onChange={ title => setAttributes( { title } ) }
			keepPlaceholderOnFocus
		/>
	const descriptionComp = showDescription &&
		<RichText
			tagName="p"
			value={ description }
			className="ugb-cta__description"
			onChange={ description => setAttributes( { description } ) }
			placeholder={ descriptionPlaceholder() }
			keepPlaceholderOnFocus
		/>
	const buttonComp = showButton &&
		<ButtonEditHelper
			attrNameTemplate="button%s"
			setAttributes={ setAttributes }
			blockAttributes={ props.attributes }
		/>

	const comps = {
		title: titleComp,
		description: descriptionComp,
		button: buttonComp,
	}

	return (
		<BlockContainer.Edit className={ mainClasses } blockProps={ props } render={ () => (
			<Fragment>
				<DivBackground
					className={ itemClasses }
					backgroundAttrName="column%s"
					blockProps={ props }
				>
					{ applyFilters( 'stackable.cta.edit.output', (
						<Fragment>
							{ titleComp }
							{ descriptionComp }
							{ buttonComp }
						</Fragment>
					), comps, props ) }
				</DivBackground>
			</Fragment>
		) } />
	)
}

export default compose(
	withDesignLayoutSelector,
	withUniqueClass,
	withSetAttributeHook,
	withGoogleFont,
	withTabbedInspector(),
	withContentAlignReseter( [ 'Title%sAlign', 'Description%sAlign', 'Button%sAlign' ] ),
	withBlockStyles( createStyles, { editorMode: true } ),
	withClickOpenInspector( [
		[ '.ugb-cta__title', 'title' ],
		[ '.ugb-cta__description', 'description' ],
		[ '.ugb-button', 'button' ],
	] )
)( edit )
