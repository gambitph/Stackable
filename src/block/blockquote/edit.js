import {
	BaseControl, PanelBody, RangeControl, ToggleControl, Toolbar,
} from '@wordpress/components'
import {
	DesignPanelBody, PanelBackgroundSettings, ProControl, ProControlButton,
} from '@stackable/components'
import {
	InspectorControls, PanelColorSettings, RichText,
} from '@wordpress/block-editor'
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import classnames from 'classnames'
import { descriptionPlaceholder } from '@stackable/util'
import { Fragment } from '@wordpress/element'
import ImageDesignBasic from './images/basic.png'
import ImageDesignPlain from './images/plain.png'
import { QUOTE_ICONS } from './quotes'
import { showProNotice } from 'stackable'

const edit = props => {
	const {
		isSelected, setAttributes, className,
	} = props

	const {
		color,
		text,
		quoteColor,
		backgroundColorType = '',
		backgroundColor,
		backgroundColor2,
		backgroundColorDirection = 0,
		backgroundType = '',
		backgroundImageID,
		backgroundImageURL,
		backgroundOpacity,
		fixedBackground,
		quotationMark = 'round-thin',
		quotationSize = 70,
		contentWidth,
		align,
		design = 'plain',
		borderRadius = 12,
		shadow = 3,
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-blockquote',
		'ugb-blockquote--v2',
		'ugb--background-opacity-' + ( 1 * Math.round( backgroundOpacity / 1 ) ),
		`ugb-blockquote--design-${ design }`,
	], applyFilters( 'stackable.blockquote.mainclasses', {
		'ugb--has-background': design === 'basic' && ( backgroundColor || backgroundImageURL ),
		'ugb--has-background-image': design === 'basic' && backgroundImageURL,
		[ `ugb--shadow-${ shadow }` ]: design === 'basic' && shadow !== 3,
		[ `ugb-content-width` ]: align === 'full' && contentWidth,
		'ugb-blockquote--small-quote': quotationSize < 60,
		[ `ugb--has-background-gradient` ]: design === 'basic' && backgroundColorType === 'gradient',
		[ `ugb--has-background-video` ]: design === 'basic' && backgroundType === 'video',
	}, design, props ) )

	const basicStyles = design !== 'basic' ? {} : {
		backgroundColor: backgroundColor ? backgroundColor : undefined,
		backgroundImage: backgroundImageURL ? `url(${ backgroundImageURL })` : undefined,
		backgroundAttachment: fixedBackground ? 'fixed' : undefined,
		'--ugb-background-color': backgroundImageURL || backgroundColorType === 'gradient' ? backgroundColor : undefined,
		'--ugb-background-color2': backgroundColorType === 'gradient' && backgroundColor2 ? backgroundColor2 : undefined,
		'--ugb-background-direction': backgroundColorType === 'gradient' ? `${ backgroundColorDirection }deg` : undefined,
		borderRadius: borderRadius !== 12 ? borderRadius : undefined,
	}
	const styles = applyFilters( 'stackable.blockquote.styles', {
		main: {
			'--quote-color': quoteColor ? quoteColor : undefined,
			...basicStyles,
		},
		text: {
			color: color,
		},
	}, design, props )

	const show = applyFilters( 'stackable.blockquote.edit.show', {
		background: design === 'basic',
		borderRadius: design === 'basic',
		shadow: design === 'basic',
	}, design, props )

	return (
		<Fragment>
			<blockquote
				className={ mainClasses }
				style={ styles.main }>
				{ design === 'basic' && backgroundType === 'video' && (
					<video
						className="ugb-video-background"
						autoPlay
						muted
						loop
						src={ backgroundImageURL }
					/>
				) }
				{ applyFilters( 'stackable.blockquote.edit.output.before', null, design, props ) }
				<div className="ugb-content-wrapper">
					{ QUOTE_ICONS[ quotationMark ].iconFunc( {
						fill: quoteColor,
						width: quotationSize,
						height: quotationSize,
					} ) }
					{ applyFilters( 'stackable.blockquote.edit.output',
						<RichText
							className="ugb-blockquote__text"
							value={ text }
							onChange={ nextValue => setAttributes( { text: nextValue } ) }
							isSelected={ isSelected }
							placeholder={ descriptionPlaceholder( 'long' ) }
							keepPlaceholderOnFocus
							style={ styles.text }
						/>,
						design, props
					) }
				</div>
				{ applyFilters( 'stackable.blockquote.edit.output.after', null, design, props ) }
			</blockquote>
			<InspectorControls>
				<DesignPanelBody
					selected={ design }
					options={ applyFilters( 'stackable.blockquote.edit.designs', [
						{
							label: __( 'Basic' ), value: 'basic', image: ImageDesignBasic,
						},
						{
							label: __( 'Plain' ), value: 'plain', image: ImageDesignPlain,
						},
					] ) }
					onChange={ design => setAttributes( { design } ) }
				>
					{ applyFilters( 'stackable.blockquote.edit.designs.before', null, props ) }
					{ show.borderRadius &&
						<RangeControl
							label={ __( 'Border Radius' ) }
							value={ borderRadius }
							onChange={ borderRadius => setAttributes( { borderRadius } ) }
							min={ 0 }
							max={ 50 }
						/>
					}
					{ show.shadow &&
						<RangeControl
							label={ __( 'Shadow / Outline' ) }
							value={ shadow }
							onChange={ shadow => setAttributes( { shadow } ) }
							min={ 0 }
							max={ 9 }
						/>
					}
					{ align === 'full' &&
						<ToggleControl
							label={ __( 'Restrict to Content Width' ) }
							checked={ contentWidth }
							onChange={ contentWidth => setAttributes( { contentWidth } ) }
						/>
					}
					{ applyFilters( 'stackable.blockquote.edit.designs.after', null, props ) }
					{ showProNotice && <ProControlButton /> }
				</DesignPanelBody>
				<PanelColorSettings
					title={ __( 'General Settings' ) }
					colorSettings={ [
						{
							value: color,
							onChange: colorValue => setAttributes( { color: colorValue } ),
							label: __( 'Text Color' ),
						},
						{
							value: quoteColor,
							onChange: colorValue => setAttributes( { quoteColor: colorValue } ),
							label: __( 'Quote Color' ),
						},
					] }
				>
					<BaseControl label={ __( 'Icon' ) }>
						<Toolbar
							className="ugb-blockquote__inspector__icon"
							icon={ QUOTE_ICONS[ quotationMark ].icon }
							controls={
								Object.keys( QUOTE_ICONS ).map( key => {
									const value = QUOTE_ICONS[ key ].value
									return {
										...QUOTE_ICONS[ key ],
										onClick: () => setAttributes( { quotationMark: value } ),
										isActive: quotationMark === value,
									}
								} )
							}
						/>
					</BaseControl>
					<RangeControl
						label={ __( 'Quotation Mark Size' ) }
						value={ quotationSize }
						onChange={ quotationSize => setAttributes( { quotationSize } ) }
						min={ 0 }
						max={ 400 }
					/>
				</PanelColorSettings>
				{ show.background &&
					<PanelBackgroundSettings
						backgroundColorType={ backgroundColorType }
						backgroundColor={ backgroundColor }
						backgroundColor2={ backgroundColor2 }
						backgroundColorDirection={ backgroundColorDirection }
						backgroundType={ backgroundType }
						backgroundImageID={ backgroundImageID }
						backgroundImageURL={ backgroundImageURL }
						backgroundOpacity={ backgroundOpacity }
						fixedBackground={ fixedBackground }
						onChangeBackgroundColorType={ backgroundColorType => setAttributes( { backgroundColorType } ) }
						onChangeBackgroundColor={ value => setAttributes( { backgroundColor: value } ) }
						onChangeBackgroundColor2={ backgroundColor2 => setAttributes( { backgroundColor2 } ) }
						onChangeBackgroundColorDirection={ backgroundColorDirection => setAttributes( { backgroundColorDirection } ) }
						onChangeBackgroundType={ backgroundType => setAttributes( { backgroundType } ) }
						onChangeBackgroundImage={ ( { url, id } ) => setAttributes( { backgroundImageURL: url, backgroundImageID: id } ) }
						onRemoveBackgroundImage={ () => {
							setAttributes( { backgroundImageURL: '', backgroundImageID: 0 } )
						} }
						onChangeBackgroundOpacity={ value => setAttributes( { backgroundOpacity: value } ) }
						onChangeFixedBackground={ value => setAttributes( { fixedBackground: !! value } ) }
					/>
				}
				{ showProNotice &&
					<PanelBody
						initialOpen={ false }
						title={ __( 'Custom CSS' ) }
					>
						<ProControl
							title={ __( 'Say Hello to Custom CSS 👋' ) }
							description={ __( 'Further tweak this block by adding guided custom CSS rules. This feature is only available on Stackable Premium' ) }
						/>
					</PanelBody>
				}
				{ applyFilters( 'stackable.blockquote.edit.inspector.after', null, design, props ) }
			</InspectorControls>
		</Fragment>
	)
}

export default edit
