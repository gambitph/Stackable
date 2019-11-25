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
} from '~stackable/higher-order'

/**
 * WordPress dependencies
 */
import {
	BaseControl,
	PanelBody,
	Toolbar,
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { RichText } from '@wordpress/block-editor'
import { addFilter, applyFilters } from '@wordpress/hooks'
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
					/>
				}
				<ContentAlignControl
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				/>
			</PanelBody>

			{ show.containerBackground &&
				<PanelBody
					title={ __( 'Container Background', i18n ) }
					initialOpen={ false }
				>
					<BackgroundControlsHelper
						attrNameTemplate="container%s"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					/>
				</PanelBody>
			}

			<PanelAdvancedSettings
				title={ __( 'Quotation Mark', i18n ) }
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
				<BaseControl
					label={ __( 'Icon', i18n ) }
					id="ugb-icon-control"
				>
					<Toolbar
						className="ugb-blockquote__inspector__icon"
						icon={ QUOTE_ICONS[ quoteIcon ].icon }
						controls={
							Object.keys( QUOTE_ICONS ).map( key => {
								const value = QUOTE_ICONS[ key ].value
								return {
									...QUOTE_ICONS[ key ],
									onClick: () => setAttributes( { quoteIcon: value } ),
									isActive: quoteIcon === value,
								}
							} )
						}
					/>
				</BaseControl>
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
					<AlignButtonsControl label={ __( 'Align', i18n ) } />
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
)( edit )
