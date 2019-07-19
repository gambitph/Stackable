import { addFilter, applyFilters } from '@wordpress/hooks'
import {
	AdvancedRangeControl,
	AlignButtonsControl,
	BackgroundControlsHelper,
	BlockContainer,
	ButtonControlsAdvancedHelper,
	ButtonControlsHelper,
	ButtonEdit,
	ColorPaletteControl,
	ContentAlignControl,
	DesignPanelBody,
	HeadingButtonsControl,
	PanelAdvancedSettings,
	PanelSpacingBody,
	ProControlButton,
	ResponsiveControl,
	TypographyControlHelper,
} from '@stackable/components'
import {
	createButtonAttributeNames,
	createResponsiveAttributeNames,
	createTypographyAttributeNames,
	createVideoBackground,
	descriptionPlaceholder,
	hasBackgroundOverlay,
} from '@stackable/util'
import { i18n, showProNotice } from 'stackable'
import {
	PanelBody, RangeControl,
} from '@wordpress/components'
import {
	withBlockStyles,
	withContentAlignReseter,
	withGoogleFont,
	withSetAttributeHook,
	withTabbedInspector,
	withUniqueClass,
} from '@stackable/higher-order'
import { __ } from '@wordpress/i18n'
import classnames from 'classnames'
import { compose } from '@wordpress/compose'
import createStyles from './style'
import { Fragment } from '@wordpress/element'
import ImageDesignBasic from './images/basic.png'
import ImageDesignPlain from './images/plain.png'
import { RichText } from '@wordpress/block-editor'
import { showOptions } from './'

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
				options={ applyFilters( 'stackable.cta.edit.designs', [
					{
						label: __( 'Basic', i18n ), value: 'basic', image: ImageDesignBasic,
					},
					{
						label: __( 'Plain', i18n ), value: 'plain', image: ImageDesignPlain,
					},
				] ) }
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
		borderRadius = 12,
		shadow = 3,
		showTitle = true,
		showDescription = true,
		showButton = true,
		titleTag = '',
	} = props.attributes

	const show = showOptions( props )

	return (
		<Fragment>
			{ output }
			<PanelBody title={ __( 'General', i18n ) }>
				{ show.borderRadius &&
					<RangeControl
						label={ __( 'Border Radius', i18n ) }
						value={ borderRadius }
						onChange={ ( borderRadius = 12 ) => setAttributes( { borderRadius } ) }
						min={ 0 }
						max={ 50 }
						allowReset={ true }
					/>
				}
				{ show.columnBackground &&
					<RangeControl
						label={ __( 'Shadow / Outline', i18n ) }
						value={ shadow }
						onChange={ ( shadow = 3 ) => setAttributes( { shadow } ) }
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

			<PanelSpacingBody initialOpen={ false } blockProps={ props }>
				{ showTitle && show.titleSpacing && (
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
				{ showDescription && show.descriptionSpacing && (
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
						/>
					</ResponsiveControl>
				) }
			</PanelSpacingBody>

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
					value={ titleTag || 'h3' }
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
				title={ __( 'Description', i18n ) }
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
					<AlignButtonsControl label={ __( 'Align', i18n ) } />
				</ResponsiveControl>
			</PanelAdvancedSettings>

			<PanelAdvancedSettings
				title={ __( 'Button', i18n ) }
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
				<ResponsiveControl
					attrNameTemplate="Button%sAlign"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AlignButtonsControl label={ __( 'Align', i18n ) } />
				</ResponsiveControl>
			</PanelAdvancedSettings>
		</Fragment>
	)
} )

addFilter( 'stackable.cta.edit.inspector.advanced.before', 'stackable/cta', ( output, props ) => {
	const { setAttributes } = props
	return (
		<Fragment>
			{ output }
			<PanelBody title={ __( 'Button', i18n ) } initialOpen={ false }>
				<ButtonControlsAdvancedHelper
					attrNameTemplate="button%s"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				/>
			</PanelBody>
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
		shadow = 3,

		// Title.
		showTitle = true,
		title = '',
		titleTag = 'h3',

		// Description.
		showDescription = true,
		description = '',

		// Button.
		showButton = true,
		buttonSize = 'normal',
		buttonText = '',
		buttonShadow = 0,
		buttonHoverEffect = '',
		buttonIcon = '',
		buttonIconPosition = '',
		buttonDesign = 'basic',
		buttonHoverGhostToNormal = false,
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
		[ `ugb--shadow-${ shadow }` ]: design !== 'plain' && shadow !== 3,
		'ugb--has-background-overlay': hasBackgroundOverlay( 'column%s', props.attributes ),
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
		<ButtonEdit
			size={ buttonSize !== '' ? buttonSize : 'normal' }
			text={ buttonText }
			icon={ buttonIcon }
			design={ buttonDesign !== '' ? buttonDesign : 'basic' }
			shadow={ buttonShadow }
			hoverEffect={ buttonHoverEffect }
			ghostToNormalEffect={ buttonHoverGhostToNormal }
			iconPosition={ buttonIconPosition }
			onChange={ buttonText => setAttributes( { buttonText } ) }
		/>

	const comps = {
		title: titleComp,
		description: descriptionComp,
		button: buttonComp,
	}

	return (
		<BlockContainer.Edit className={ mainClasses } blockProps={ props } render={ () => (
			<Fragment>
				<div className={ itemClasses }>
					{ createVideoBackground( 'column%s', props ) }
					{ applyFilters( 'stackable.cta.edit.output', (
						<Fragment>
							{ titleComp }
							{ descriptionComp }
							{ buttonComp }
						</Fragment>
					), comps, props ) }
				</div>
			</Fragment>
		) } />
	)
}

export default compose(
	withUniqueClass,
	withSetAttributeHook,
	withGoogleFont,
	withTabbedInspector(),
	withContentAlignReseter( [ 'Title%sAlign', 'Description%sAlign', 'Button%sAlign' ] ),
	withBlockStyles( createStyles, { editorMode: true } ),
)( edit )
