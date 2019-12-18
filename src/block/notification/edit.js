/**
 * Internal dependencies
 */
import ImageDesignBasic from './images/basic.png'
import ImageDesignPlain from './images/plain.png'
import SVGCloseIcon from './images/close-icon.svg'
import createStyles from './style'
import { showOptions } from './util'

/**
 * External dependencies
 */
import {
	BlockContainer,
	DesignPanelBody,
	ProControlButton,
	ContentAlignControl,
	BackgroundControlsHelper,
	PanelAdvancedSettings,
	TypographyControlHelper,
	HeadingButtonsControl,
	ColorPaletteControl,
	ResponsiveControl,
	AlignButtonsControl,
	ButtonControlsHelper,
	ControlSeparator,
	IconControl,
	PanelSpacingBody,
	AdvancedRangeControl,
	FourRangeControl,
	SvgIconPlaceholder,
	ButtonEditHelper,
	DivBackground,
} from '~stackable/components'
import {
	descriptionPlaceholder,
	createTypographyAttributeNames,
	createResponsiveAttributeNames,
	createButtonAttributeNames,
} from '~stackable/util'
import { i18n, showProNotice } from 'stackable'
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

/**
 * WordPress dependencies
 */
import { RichText } from '@wordpress/block-editor'
import {
	PanelBody, SelectControl,
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { applyFilters, addFilter } from '@wordpress/hooks'
import { compose } from '@wordpress/compose'
import { Fragment } from '@wordpress/element'

const NOTIFICATION_TYPE = [
	{ value: 'success', label: __( 'Success', i18n ) },
	{ value: 'error', label: __( 'Error', i18n ) },
	{ value: 'warning', label: __( 'Warning', i18n ) },
	{ value: 'info', label: __( 'Information', i18n ) },
]

addFilter( 'stackable.notification.edit.inspector.layout.before', 'stackable/notification', ( output, props ) => {
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
					...applyFilters( 'stackable.notification.edit.layouts', [] ),
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

addFilter( 'stackable.notification.edit.inspector.style.before', 'stackable/notification', ( output, props ) => {
	const { setAttributes } = props
	const {
		titleColor,
		descriptionColor,
		design = 'basic',
		borderRadius = '',
		shadow = '',
		showTitle = true,
		showDescription = true,
		titleTag = '',
		notifType,
		dismissible = false,
		dismissibleIconColor = '',
		columnBorderColor = '',
		columnBorderThickness = '',
		showButton = true,
		showIcon = true,
		icon = '',
		iconColor = '',
		iconOpacity = '',
		iconRotation = '',
		iconTop = '',
		iconLeft = '',
	} = props.attributes

	const show = showOptions( props )

	return (
		<Fragment>
			{ output }
			<PanelBody title={ __( 'General', i18n ) }>
				<SelectControl
					label={ __( 'Notification Type', i18n ) }
					value={ notifType }
					options={ NOTIFICATION_TYPE.map( ( { value, label } ) => ( {
						value,
						label,
					} ) ) }
					onChange={ newSize => {
						setAttributes( { notifType: newSize } )
					} }
				/>
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
				{ show.shadow &&
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

			{ show.columnBorder &&
				<PanelAdvancedSettings
					title={ __( 'Border', i18n ) }
					hasToggle={ false }
				>
					<ColorPaletteControl
						value={ columnBorderColor }
						onChange={ columnBorderColor => setAttributes( { columnBorderColor } ) }
						label={ __( 'Border Color', i18n ) }
					/>
					<AdvancedRangeControl
						label={ __( 'Border Thickness', i18n ) }
						value={ columnBorderThickness }
						onChange={ columnBorderThickness => setAttributes( { columnBorderThickness } ) }
						min={ 0 }
						max={ 20 }
						allowReset={ true }
						placeholder={ design === 'bordered' ? 5 : 3 }
					/>
				</PanelAdvancedSettings>
			}

			{ show.columnBackground &&
				<PanelAdvancedSettings
					title={ __( 'Background', i18n ) }
					id="column-background"
					initialOpen={ false }
					className="ugb--help-tip-column-background-on-off"
				>
					<BackgroundControlsHelper
						attrNameTemplate="column%s"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					/>
				</PanelAdvancedSettings>
			}

			<PanelAdvancedSettings
				title={ __( 'Dismissible', i18n ) }
				id="dismissible"
				checked={ dismissible }
				onChange={ dismissible => setAttributes( { dismissible } ) }
				toggleOnSetAttributes={ [
					...createResponsiveAttributeNames( 'dismissibleIcon%sSize' ),
					'dismissibleIconColor',
				] }
				toggleAttributeName="dismissible"
				className="ugb--help-tip-notification-dismissible"
			>
				<ResponsiveControl
					attrNameTemplate="dismissibleIcon%sSize"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AdvancedRangeControl
						label={ __( 'Icon Size', i18n ) }
						min={ 5 }
						max={ 50 }
						allowReset={ true }
						placeholder="16"
					/>
				</ResponsiveControl>
				<ColorPaletteControl
					value={ dismissibleIconColor }
					onChange={ dismissibleIconColor => setAttributes( { dismissibleIconColor } ) }
					label={ __( 'Icon Color', i18n ) }
				/>
			</PanelAdvancedSettings>

			<PanelAdvancedSettings
				title={ __( 'Icon', i18n ) }
				id="icon"
				checked={ showIcon }
				onChange={ showIcon => setAttributes( { showIcon } ) }
				toggleOnSetAttributes={ [
					'icon',
					'iconColor',
					...createResponsiveAttributeNames( 'icon%sSize' ),
					'iconOpacity',
					'iconRotation',
					...createResponsiveAttributeNames( 'icon%sAlign' ),
				] }
				toggleAttributeName="showIcon"
			>
				<IconControl
					label={ __( 'Icon', i18n ) }
					value={ icon }
					onChange={ icon => setAttributes( { icon } ) }
				/>
				<ColorPaletteControl
					value={ iconColor }
					onChange={ iconColor => setAttributes( { iconColor } ) }
					label={ __( 'Icon Color', i18n ) }
				/>
				<ResponsiveControl
					attrNameTemplate="icon%sSize"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AdvancedRangeControl
						label={ __( 'Icon Size', i18n ) }
						min={ 5 }
						max={ design !== 'large-icon' ? 200 : 400 }
						step={ 1 }
						allowReset={ true }
						placeholder="30"
					/>
				</ResponsiveControl>
				<AdvancedRangeControl
					label={ __( 'Icon Opacity', i18n ) }
					value={ iconOpacity }
					onChange={ iconOpacity => setAttributes( { iconOpacity } ) }
					min={ 0 }
					max={ 1 }
					step={ 0.1 }
					allowReset={ true }
					placeholder="1"
				/>
				<AdvancedRangeControl
					label={ __( 'Icon Rotation', i18n ) }
					value={ iconRotation }
					onChange={ iconRotation => setAttributes( { iconRotation } ) }
					min={ 0 }
					max={ 360 }
					step={ 1 }
					allowReset={ true }
					placeholder={ design === 'large-icon' ? -20 : 0 }
				/>
				{ show.iconLocation &&
					<FourRangeControl
						label={ __( 'Icon Location', i18n ) }
						min={ -250 }
						max={ 250 }
						top={ iconTop }
						left={ iconLeft }
						onChange={ paddings => {
							setAttributes( {
								iconTop: ! paddings.top && paddings.top !== 0 ? '' : parseInt( paddings.top, 10 ),
								iconLeft: ! paddings.left && paddings.left !== 0 ? '' : parseInt( paddings.left, 10 ),
							} )
						} }
						enableRight={ false }
						enableBottom={ false }
					/>
				}
				{ show.iconAlign &&
					<ResponsiveControl
						attrNameTemplate="icon%sAlign"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					>
						<AlignButtonsControl
							label={ __( 'Align', i18n ) }
							className="ugb--help-tip-alignment-icon"
						/>
					</ResponsiveControl>
				}
			</PanelAdvancedSettings>

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
					value={ titleTag || 'h5' }
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
				/>
				<ControlSeparator />
				<ResponsiveControl
					attrNameTemplate="button%sAlign"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AlignButtonsControl
						label={ __( 'Align', i18n ) }
						className="ugb--help-tip-alignment-button"
					/>
				</ResponsiveControl>
			</PanelAdvancedSettings>

			{ ( show.iconSpacing || show.titleSpacing || show.descriptionSpacing || show.buttonSpacing ) &&
				<PanelSpacingBody
					initialOpen={ false }
					blockProps={ props }
				>
					{ show.iconSpacing &&
						<ResponsiveControl
							attrNameTemplate="icon%sBottomMargin"
							setAttributes={ setAttributes }
							blockAttributes={ props.attributes }
						>
							<AdvancedRangeControl
								label={ __( 'Icon', i18n ) }
								min={ -50 }
								max={ 100 }
								allowReset={ true }
								className="ugb--help-tip-spacing-icon"
							/>
						</ResponsiveControl>
					}
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
								allowReset={ true }
								className="ugb--help-tip-spacing-button"
							/>
						</ResponsiveControl>
					}
				</PanelSpacingBody>
			}
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
		notifType,
		dismissible,
		shadow = '',

		// Icon.
		showIcon = false,
		icon = 'fas-exclamation-triangle',

		// Title.
		showTitle = true,
		titleTag = 'h5',
		title = '',

		// Description.
		showDescription = true,
		description = '',

		// Button.
		showButton = true,
		buttonDesign = 'plain',
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-notification--v2',
		`ugb-notification--design-${ design }`,
		`ugb-notification--type-${ notifType }`,
	], applyFilters( 'stackable.notification.mainclasses', {
		'ugb-notification--dismissible': dismissible,
	}, props ) )

	const itemClasses = classnames( [
		'ugb-notification__item',
	], {
		[ `ugb--shadow-${ shadow }` ]: shadow !== '',
	} )

	const show = showOptions( props )

	return (
		<BlockContainer.Edit className={ mainClasses } blockProps={ props } render={ () => (
			<Fragment>
				<DivBackground
					className={ itemClasses }
					backgroundAttrName="column%s"
					blockProps={ props }
					showBackground={ show.columnBackground }
				>
					{ dismissible && (
						<span
							className="ugb-notification__close-button"
							role="button"
						>
							<SVGCloseIcon />
						</span>
					) }
					{ showIcon &&
						<SvgIconPlaceholder
							className="ugb-notification__icon"
							value={ icon }
							onChange={ icon => setAttributes( { icon } ) }
						/>
					}
					{ showTitle &&
						<RichText
							tagName={ titleTag || 'h5' }
							value={ title }
							className="ugb-notification__title"
							placeholder={ __( 'Title for This Block', i18n ) }
							onChange={ title => setAttributes( { title } ) }
							keepPlaceholderOnFocus
						/>
					}
					{ showDescription &&
						<RichText
							tagName="p"
							className="ugb-notification__description"
							value={ description }
							onChange={ description => setAttributes( { description } ) }
							placeholder={ descriptionPlaceholder( 'long' ) }
							keepPlaceholderOnFocus
						/>
					}
					{ showButton &&
						<ButtonEditHelper
							attrNameTemplate="button%s"
							setAttributes={ setAttributes }
							blockAttributes={ {
								...props.attributes,
								buttonDesign: buttonDesign !== '' ? buttonDesign : 'ghost',
							} }
						/>
					}
				</DivBackground>
			</Fragment>
		) } />
	)
}

export default compose(
	withUniqueClass,
	withSetAttributeHook,
	withGoogleFont,
	withTabbedInspector(),
	withContentAlignReseter( [ 'Icon%sAlign', 'Title%sAlign', 'Description%sAlign', 'Button%sAlign' ] ),
	withBlockStyles( createStyles, { editorMode: true } ),
	withClickOpenInspector( [
		[ '.ugb-notification__item', 'column-background' ],
		[ '.ugb-notification__close-button', 'dismissible' ],
		[ '.ugb-notification__icon', 'icon' ],
		[ '.ugb-notification__title', 'title' ],
		[ '.ugb-notification__description', 'description' ],
		[ '.ugb-button', 'button' ],
	] ),
)( edit )
