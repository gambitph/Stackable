/**
 * Internal dependencies
 */
import ImageDesignBasic from './images/basic.png'
import ImageDesignPlain from './images/plain.png'
import ImageDesignColored from './images/colored.png'
import ImageDesignColoredHover from './images/colored-hover.png'
import ImageDesignLineColored from './images/line-colored.png'
import ImageDesignLineColoredHover from './images/line-colored-hover.png'
import { showOptions } from './util'
import createStyles from './style'
import SVGArrowIcon from './images/arrow.svg'

/**
 * External dependencies
 */
import {
	AdvancedToggleControl,
	ColorPaletteControl,
	DesignPanelBody,
	ProControlButton,
	ContentAlignControl,
	BackgroundControlsHelper,
	BlockContainer,
	AlignButtonsControl,
	PanelAdvancedSettings,
	ResponsiveControl,
	TypographyControlHelper,
	AdvancedRangeControl,
	HeadingButtonsControl,
	FourRangeControl,
	PanelSpacingBody,
	DivBackground,
	ButtonIconPopoverControl,
	BorderControlsHelper,
} from '~stackable/components'
import {
	withBlockStyles,
	withContentAlignReseter,
	withGoogleFont,
	withSetAttributeHook,
	withTabbedInspector,
	withUniqueClass,
	withClickOpenInspector,
} from '~stackable/higher-order'
import { descriptionPlaceholder } from '~stackable/util'
import { i18n, showProNotice } from 'stackable'
import classnames from 'classnames'

/**
 * WordPress dependencies
 */
import {
	RichText, InnerBlocks,
} from '@wordpress/block-editor'
import { __ } from '@wordpress/i18n'
import { addFilter, applyFilters } from '@wordpress/hooks'
import { compose, withState } from '@wordpress/compose'
import { Fragment } from '@wordpress/element'
import { withSelect } from '@wordpress/data'

addFilter( 'stackable.accordion.edit.layouts', 'default', layouts => {
	const newLayouts = [
		{
			label: __( 'Basic', i18n ), value: 'basic', image: ImageDesignBasic,
		},
		{
			label: __( 'Plain', i18n ), value: 'plain', image: ImageDesignPlain,
		},
		{
			label: __( 'Lined to Colored', i18n ), value: 'line-colored', image: ImageDesignLineColored, hoverImage: ImageDesignLineColoredHover, premium: true,
		},
		{
			label: __( 'Colored', i18n ), value: 'colored', image: ImageDesignColored, hoverImage: ImageDesignColoredHover, premium: true,
		},
	]

	return [
		...layouts,
		...newLayouts,
	]
} )

addFilter( 'stackable.accordion.edit.inspector.layout.before', 'stackable/accordion', ( output, props ) => {
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
				options={ applyFilters( 'stackable.accordion.edit.layouts', [] ) }
				onChange={ design => setAttributes( { design } ) }
			>
				{ showProNotice && <ProControlButton /> }
			</DesignPanelBody>
		</Fragment>
	)
} )

addFilter( 'stackable.accordion.edit.inspector.style.before', 'stackable/accordion', ( output, props ) => {
	const { setAttributes } = props
	const {
		design = 'basic',
		titleColor,
		borderRadius = '',
		shadow = '',
		onlyOnePanelOpen = false,
		openStart = false,
		reverseArrow = false,
		titleTag = '',
		showArrow = true,
		arrowSize = '',
		arrowColor = '',
		showBorder = true,
		borderSize = '',
		borderColor = '',
		containerPaddingTop = '',
		containerPaddingRight = '',
		containerPaddingBottom = '',
		containerPaddingLeft = '',
		containerClosedBackgroundColor = '',
	} = props.attributes

	const show = showOptions( props )

	return (
		<Fragment>
			{ output }
			<PanelAdvancedSettings
				title={ __( 'General', i18n ) }
				initialOpen={ true }
			>
				<AdvancedToggleControl
					label={ __( 'Close adjacent on open', i18n ) }
					checked={ onlyOnePanelOpen }
					onChange={ onlyOnePanelOpen => setAttributes( { onlyOnePanelOpen } ) }
					className="ugb--help-tip-accordion-adjacent-open"
				/>
				<AdvancedToggleControl
					label={ __( 'Open at the start', i18n ) }
					checked={ openStart }
					onChange={ openStart => setAttributes( { openStart } ) }
				/>
				<AdvancedToggleControl
					label={ __( 'Reverse arrow', i18n ) }
					checked={ reverseArrow }
					onChange={ reverseArrow => setAttributes( { reverseArrow } ) }
				/>
				<ContentAlignControl
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				/>
			</PanelAdvancedSettings>

			{ ( show.headerBackground || show.containerBackground ) &&
				<PanelAdvancedSettings
					title={ __( 'Container', i18n ) }
					id="column-background"
					initialOpen={ false }
				>
					<ButtonIconPopoverControl
						label={ __( 'Background', i18n ) }
						popoverLabel={ __( 'Background', i18n ) }
						onReset={ () => {
							setAttributes( {
								containerBackgroundColorType: '',
								containerBackgroundColor: '',
								containerBackgroundColor2: '',
								containerBackgroundColorOpacity: '',
								containerBackgroundMediaID: '',
								containerBackgroundMediaUrl: '',
								containerBackgroundTintStrength: '',
								containerFixedBackground: '',
							} )
						} }
						allowReset={ props.attributes.containerBackgroundColor || props.attributes.containerBackgroundMediaUrl }
						hasColorPreview={ props.attributes.containerBackgroundColor }
						hasImagePreview={ props.attributes.containerBackgroundMediaUrl }
						colorPreview={ props.attributes.containerBackgroundColorType === 'gradient' ? [ props.attributes.containerBackgroundColor, props.attributes.containerBackgroundColor2 ] : props.attributes.containerBackgroundColor }
						imageUrlPreview={ props.attributes.containerBackgroundMediaUrl }
					>
						<BackgroundControlsHelper
							attrNameTemplate="container%s"
							setAttributes={ setAttributes }
							blockAttributes={ props.attributes }
						/>
					</ButtonIconPopoverControl>
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
					{ show.containerBorder &&
					<BorderControlsHelper
						attrNameTemplate="container%s"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					/>
					}
					{ ( show.headerBackground || show.containerBackground ) &&
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
					{ design === 'colored' &&
						<ColorPaletteControl
							value={ containerClosedBackgroundColor }
							onChange={ containerClosedBackgroundColor => setAttributes( { containerClosedBackgroundColor } ) }
							label={ __( 'Closed State Background Color', i18n ) }
							className="ugb--help-tip-accordion-closed-state-background-color"
						/>
					}
				</PanelAdvancedSettings>
			}

			<PanelSpacingBody
				initialOpen={ false }
				blockProps={ props }
			>
				{ ( show.headerBackground || show.containerBackground ) &&
					<FourRangeControl
						label={ __( 'Padding', i18n ) }
						top={ containerPaddingTop }
						right={ containerPaddingRight }
						bottom={ containerPaddingBottom }
						left={ containerPaddingLeft }
						onChange={ paddings => setAttributes( {
							containerPaddingTop: paddings.top,
							containerPaddingRight: paddings.right,
							containerPaddingBottom: paddings.bottom,
							containerPaddingLeft: paddings.left,
						} ) }
						max={ 200 }
						placeholder="18"
						className="ugb--help-tip-accordion-padding"
					/>
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
							placeholder="0"
							className="ugb--help-tip-accordion-title-spacing"
						/>
					</ResponsiveControl>
				}
			</PanelSpacingBody>

			<PanelAdvancedSettings
				title={ __( 'Title', i18n ) }
				id="title"
				hasToggle={ false }
			>
				<HeadingButtonsControl
					value={ titleTag || 'h4' }
					defaultValue="h4"
					onChange={ titleTag => setAttributes( { titleTag } ) }
				/>
				<TypographyControlHelper
					attrNameTemplate="title%s"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
					htmlTag={ titleTag || 'h4' }
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
				title={ __( 'Arrow', i18n ) }
				id="arrow"
				checked={ showArrow }
				onChange={ showArrow => setAttributes( { showArrow } ) }
				toggleOnSetAttributes={ [
					'arrowSize',
					'arrowColor',
				] }
				toggleAttributeName="showArrow"
			>
				<AdvancedRangeControl
					label={ __( 'Size', i18n ) }
					min={ 0 }
					max={ 100 }
					allowReset={ true }
					value={ arrowSize }
					onChange={ arrowSize => setAttributes( { arrowSize } ) }
					placeholder="20"
				/>
				<ColorPaletteControl
					value={ arrowColor }
					onChange={ arrowColor => setAttributes( { arrowColor } ) }
					label={ __( 'Color', i18n ) }
				/>
			</PanelAdvancedSettings>

			{ show.border &&
				<PanelAdvancedSettings
					title={ __( 'Border', i18n ) }
					checked={ showBorder }
					onChange={ showBorder => setAttributes( { showBorder } ) }
					toggleOnSetAttributes={ [
						'borderSize',
						'borderColor',
					] }
					toggleAttributeName="showBorder"
					className="ugb--help-tip-accordion-border"
				>
					<AdvancedRangeControl
						label={ __( 'Size', i18n ) }
						min={ 0 }
						max={ 10 }
						allowReset={ true }
						value={ borderSize }
						onChange={ borderSize => setAttributes( { borderSize } ) }
						placeholder="3"
						className="ugb--help-tip-accordion-border-size"
					/>
					<ColorPaletteControl
						value={ borderColor }
						onChange={ borderColor => setAttributes( { borderColor } ) }
						label={ __( 'Color', i18n ) }
					/>
				</PanelAdvancedSettings>
			}

		</Fragment>
	)
} )

const TEMPLATE = [ [ 'core/paragraph', { content: descriptionPlaceholder( 'long' ) } ] ]

const edit = props => {
	const {
		className,
		setAttributes,
	} = props

	const {
		design = 'basic',
		shadow = '',
		titleTag = '',
		title = '',
		openStart = false,
		showArrow = true,
	} = props.attributes

	const show = showOptions( props )

	const mainClasses = classnames( [
		className,
		'ugb-accordion--v2',
		`ugb-accordion--design-${ design }`,
	], applyFilters( 'stackable.accordion.mainclasses', {
		'ugb-accordion--open': props.isOpen === null ? openStart : props.isOpen,
	}, props ) )

	const itemClasses = classnames( [
		'ugb-accordion__item',
	], applyFilters( 'stackable.accordion.itemclasses', {}, props ) )

	const headingClasses = classnames( [
		'ugb-accordion__heading',
	], applyFilters( 'stackable.accordion.headingclasses', {
		[ `ugb--shadow-${ shadow }` ]: design === 'basic' && shadow !== '',
	}, design, props ) )

	return (
		<BlockContainer.Edit className={ mainClasses } blockProps={ props } render={ () => (
			<Fragment>
				<DivBackground
					className={ itemClasses }
					backgroundAttrName="container%s"
					blockProps={ props }
					showBackground={ show.containerBackground }
				>
					<DivBackground
						className={ headingClasses }
						backgroundAttrName="container%s"
						blockProps={ props }
						showBackground={ show.headerBackground }
						onClick={ () => {
							if ( props.openTimeout ) {
								clearTimeout( props.openTimeout )
							}
							const newOpenTimeout = setTimeout( () => {
								props.setState( { isOpen: ! props.isOpen } )
							}, 150 )
							props.setState( { openTimeout: newOpenTimeout } )
						} }
						onDoubleClick={ () => {
							if ( props.openTimeout ) {
								clearTimeout( props.openTimeout )
							}
						} }
						onKeyPress={ () => {
							if ( props.openTimeout ) {
								clearTimeout( props.openTimeout )
							}
							props.setState( { isOpen: ! openStart } )
						} }
						role="button"
						tabIndex="0"
					>
						<RichText
							tagName={ titleTag || 'h4' }
							className="ugb-accordion__title"
							value={ title }
							onChange={ title => setAttributes( { title } ) }
							placeholder={ __( 'Title for This Block', i18n ) }
							keepPlaceholderOnFocus
						/>
						{ showArrow &&
							<SVGArrowIcon className="ugb-accordion__arrow" width="20" height="20" />
						}
					</DivBackground>
					<div className="ugb-accordion__content">
						<div className="ugb-accordion__content-inner">
							<InnerBlocks
								template={ TEMPLATE }
								renderAppender={ () => ! props.hasInnerBlocks ? <InnerBlocks.ButtonBlockAppender /> : <InnerBlocks.DefaultBlockAppender /> }
							/>
						</div>
					</div>
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
	withContentAlignReseter(),
	withBlockStyles( createStyles, { editorMode: true } ),
	withClickOpenInspector( [
		[ '.ugb-accordion__title', 'title' ],
		[ '.ugb-accordion__arrow', 'arrow' ],
	] ),
	withSelect( ( select, { clientId } ) => {
		const {
			getBlock,
		} = select( 'core/block-editor' )

		const block = getBlock( clientId )

		return {
			hasInnerBlocks: !! ( block && block.innerBlocks.length ),
		}
	} ),
	withState( {
		openTimeout: null,
		isOpen: null,
	} )
)( edit )
