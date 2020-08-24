/**
 * Internal dependencies
 */
import ImageDesignBasic from './images/basic.png'
import ImageDesignPlain from './images/plain.png'
import { QUOTE_ICONS } from './quotes'
import { showOptions } from './util'
import createStyles from './style'

/**
 * External dependencies
 */
import {
	DesignPanelBody,
	ProControlButton,
	BlockContainer,
	ContentAlignControl,
	BackgroundControlsHelper,
	PanelAdvancedSettings,
	ResponsiveControl,
	AdvancedRangeControl,
	ColorPaletteControl,
	TypographyControlHelper,
	AlignButtonsControl,
	DivBackground,
	AdvancedToolbarControl,
} from '~stackable/components'
import {
	createResponsiveAttributeNames,
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

/**
 * WordPress dependencies
 */
import { addFilter, applyFilters } from '@wordpress/hooks'
import { __ } from '@wordpress/i18n'
import { RichText } from '@wordpress/block-editor'
import { PanelBody } from '@wordpress/components'
import { Fragment } from '@wordpress/element'
import { i18n, showProNotice } from 'stackable'
import { compose } from '@wordpress/compose'
import classnames from 'classnames'

addFilter( 'stackable.blockquote.edit.inspector.layout.before', 'stackable/blockquote', ( output, props ) => {
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
				options={ applyFilters( 'stackable.blockquote.edit.layouts', [
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

addFilter( 'stackable.blockquote.edit.inspector.style.before', 'stackable/blockquote', ( output, props ) => {
	const { setAttributes } = props
	const {
		borderRadius = '',
		shadow = '',
		showQuote = true,
		quoteIcon = 'round-thin',
		quoteColor = '',
		quoteOpacity = '',
		textColor = '',
	} = props.attributes

	const show = showOptions( props )

	return (
		<Fragment>
			{ output }
			<PanelBody title={ __( 'General', i18n ) }>
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

			{ show.containerBackground &&
				<PanelAdvancedSettings
					title={ __( 'Container Background', i18n ) }
					id="column-background"
					initialOpen={ false }
					className="ugb--help-tip-column-background-on-off"
				>
					<BackgroundControlsHelper
						attrNameTemplate="container%s"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					/>
				</PanelAdvancedSettings>
			}

			<PanelAdvancedSettings
				title={ __( 'Quotation Mark', i18n ) }
				id="quotation"
				checked={ showQuote }
				onChange={ showQuote => setAttributes( { showQuote } ) }
				toggleOnSetAttributes={ [
					'quoteIcon',
					'quoteColor',
					...createResponsiveAttributeNames( 'quote%sSize' ),
					...createResponsiveAttributeNames( 'quote%sX' ),
					...createResponsiveAttributeNames( 'quote%sY' ),
				] }
				toggleAttributeName="showQuote"
			>
				<AdvancedToolbarControl
					label={ __( 'Icon', i18n ) }
					multiline={ true }
					className="ugb-blockquote__inspector__icon"
					controls={ Object.values( QUOTE_ICONS ) }
					value={ quoteIcon }
					onChange={ value => setAttributes( { quoteIcon: value } ) }
				/>
				<ColorPaletteControl
					value={ quoteColor }
					onChange={ quoteColor => setAttributes( { quoteColor } ) }
					label={ __( 'Color', i18n ) }
				/>
				<ResponsiveControl
					attrNameTemplate="quote%sSize"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AdvancedRangeControl
						label={ __( 'Size', i18n ) }
						min={ 0 }
						max={ 400 }
						allowReset={ true }
						placeholder="70"
					/>
				</ResponsiveControl>
				<AdvancedRangeControl
					label={ __( 'Opacity', i18n ) }
					value={ quoteOpacity }
					onChange={ quoteOpacity => setAttributes( { quoteOpacity } ) }
					min={ 0 }
					max={ 1 }
					step={ 0.1 }
					allowReset={ true }
					placeholder="1"
				/>
				<ResponsiveControl
					attrNameTemplate="quote%sX"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AdvancedRangeControl
						label={ __( 'Horizontal Position', i18n ) }
						min={ -400 }
						max={ 400 }
						allowReset={ true }
						placeholder="0"
					/>
				</ResponsiveControl>
				<ResponsiveControl
					attrNameTemplate="quote%sY"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AdvancedRangeControl
						label={ __( 'Vertical Position', i18n ) }
						min={ -400 }
						max={ 400 }
						allowReset={ true }
						placeholder="0"
					/>
				</ResponsiveControl>
			</PanelAdvancedSettings>

			<PanelAdvancedSettings
				title={ __( 'Text', i18n ) }
				id="text"
				hasToggle={ false }
			>
				<TypographyControlHelper
					attrNameTemplate="text%s"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				/>
				<ColorPaletteControl
					value={ textColor }
					onChange={ textColor => setAttributes( { textColor } ) }
					label={ __( 'Text Color', i18n ) }
				/>
				<ResponsiveControl
					attrNameTemplate="Text%sAlign"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AlignButtonsControl
						label={ __( 'Align', i18n ) }
						className="ugb--help-tip-alignment-description"
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
		blockTag = '',
		design = 'plain',
		shadow = '',
		text = '',
		showQuote = true,
		quoteIcon = 'round-thin',
		quoteSize = 70,
	} = props.attributes

	const show = showOptions( props )

	const mainClasses = classnames( [
		className,
		'ugb-blockquote--v3',
		`ugb-blockquote--design-${ design }`,
	], applyFilters( 'stackable.blockquote.mainclasses', {
		'ugb-blockquote--small-quote': quoteSize < 60,
	}, design, props ) )

	const itemClasses = classnames( [
		'ugb-blockquote__item',
	], {
		[ `ugb--shadow-${ shadow }` ]: show.containerBackground && shadow !== '',
	} )

	return (
		<BlockContainer.Edit blockTag={ blockTag || 'blockquote' } className={ mainClasses } blockProps={ props } render={ () => (
			<Fragment>
				<DivBackground
					className={ itemClasses }
					backgroundAttrName="container%s"
					blockProps={ props }
					showBackground={ show.containerBackground }
				>
					{ showQuote && QUOTE_ICONS[ quoteIcon ].iconFunc( {}, {
						className: 'ugb-blockquote__quote',
						width: quoteSize,
						height: quoteSize,
					} ) }
					<div className="ugb-blockquote__content">
						<RichText
							className="ugb-blockquote__text"
							value={ text }
							onChange={ text => setAttributes( { text } ) }
							placeholder={ descriptionPlaceholder( 'long' ) }
							keepPlaceholderOnFocus
						/>
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
	withContentAlignReseter( [ 'Text%sAlign' ] ),
	withBlockStyles( createStyles, { editorMode: true } ),
	withClickOpenInspector( [
		[ '.ugb-blockquote__item', 'column-background' ],
		[ '.ugb-blockquote__quote', 'quotation' ],
		[ '.ugb-blockquote__text', 'text' ],
	] ),
)( edit )
