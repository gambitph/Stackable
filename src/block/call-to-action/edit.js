import {
	ButtonEdit, DesignPanelBody, PanelBackgroundSettings, PanelButtonSettings, ProControl, ProControlButton, URLInputControl,
} from '@stackable/components'
import {
	InspectorControls, PanelColorSettings, RichText,
} from '@wordpress/block-editor'
import {
	PanelBody, RangeControl, ToggleControl,
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import classnames from 'classnames'
import { descriptionPlaceholder } from '@stackable/util'
import { Fragment } from '@wordpress/element'
import ImageDesignBasic from './images/basic.png'
import ImageDesignPlain from './images/plain.png'
import { showProNotice } from 'stackable'

const edit = props => {
	const {
		isSelected,
		className,
		setAttributes,
	} = props

	const {
		url,
		buttonText,
		buttonDesign,
		buttonIcon,
		ctaTitle,
		bodyText,
		color,
		textColor,
		size,
		borderButtonRadius,
		bodyTextColor,
		titleColor,
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
		contentWidth,
		newTab,
	} = props.attributes

	const designHasBackground = design !== 'plain'

	const mainClasses = classnames( [
		className,
		'ugb-cta',
		'ugb--background-opacity-' + ( 1 * Math.round( backgroundOpacity / 1 ) ),
	], applyFilters( 'stackable.cta.mainclasses', {
		[ `ugb-cta--design-${ design }` ]: design !== 'basic',
		[ `ugb--shadow-${ shadow }` ]: design !== 'plain' && shadow !== 3,
		'ugb--has-background': backgroundColor || backgroundImageURL,
		'ugb--has-background-image': backgroundImageURL,
		[ `ugb-content-width` ]: align === 'full' && contentWidth,
		[ `ugb--has-background-gradient` ]: designHasBackground && backgroundColorType === 'gradient',
		[ `ugb--has-background-video` ]: designHasBackground && backgroundType === 'video',
	}, design, props ) )

	const backgroundStyle = ! designHasBackground ? {} : {
		backgroundColor: backgroundColor ? backgroundColor : undefined,
		backgroundImage: backgroundImageURL ? `url(${ backgroundImageURL })` : undefined,
		'--ugb-background-color': backgroundImageURL || backgroundColorType === 'gradient' ? backgroundColor : undefined,
		'--ugb-background-color2': backgroundColorType === 'gradient' && backgroundColor2 ? backgroundColor2 : undefined,
		'--ugb-background-direction': backgroundColorType === 'gradient' ? `${ backgroundColorDirection }deg` : undefined,
		borderRadius: borderRadius !== 12 ? borderRadius : undefined,
	}

	const mainStyle = {
		backgroundAttachment: fixedBackground ? 'fixed' : undefined,
		...backgroundStyle,
	}

	return (
		<Fragment>
			<InspectorControls>
				<DesignPanelBody
					selected={ design }
					options={ applyFilters( 'stackable.cta.edit.designs', [
						{
							label: __( 'Basic' ), value: 'basic', image: ImageDesignBasic,
						},
						{
							label: __( 'Plain' ), value: 'plain', image: ImageDesignPlain,
						},
					] ) }
					onChange={ design => setAttributes( { design } ) }
				>
					{ applyFilters( 'stackable.cta.edit.designs.after', null, props ) }
					{ design !== 'plain' && align !== 'full' &&
						<RangeControl
							label={ __( 'Border Radius' ) }
							value={ borderRadius }
							onChange={ borderRadius => setAttributes( { borderRadius } ) }
							min={ 0 }
							max={ 50 }
						/>
					}
					{ design !== 'plain' &&
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
					{ showProNotice && <ProControlButton /> }
				</DesignPanelBody>
				<PanelColorSettings
					initialOpen={ true }
					title={ __( 'Color Settings' ) }
					colorSettings={ [
						{
							value: titleColor,
							onChange: colorValue => setAttributes( { titleColor: colorValue } ),
							label: __( 'Title Color' ),
						},
						{
							value: bodyTextColor,
							onChange: colorValue => setAttributes( { bodyTextColor: colorValue } ),
							label: __( 'Body Text Color' ),
						},
					] }
				>
				</PanelColorSettings>
				{ design !== 'plain' &&
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
						onChangeBackgroundColor={ backgroundColor => setAttributes( { backgroundColor } ) }
						onChangeBackgroundColor2={ backgroundColor2 => setAttributes( { backgroundColor2 } ) }
						onChangeBackgroundColorDirection={ backgroundColorDirection => setAttributes( { backgroundColorDirection } ) }
						onChangeBackgroundType={ backgroundType => setAttributes( { backgroundType } ) }
						onChangeBackgroundImage={ ( { url, id } ) => setAttributes( { backgroundImageURL: url, backgroundImageID: id } ) }
						onRemoveBackgroundImage={ () => {
							setAttributes( { backgroundImageURL: '', backgroundImageID: 0 } )
						} }
						onChangeBackgroundOpacity={ backgroundOpacity => setAttributes( { backgroundOpacity } ) }
						onChangeFixedBackground={ value => setAttributes( { fixedBackground: !! value } ) }
					/>
				}
				<PanelButtonSettings
					initialOpen={ false }
					buttonColor={ color }
					buttonTextColor={ textColor }
					buttonSize={ size }
					buttonBorderRadius={ borderButtonRadius }
					buttonDesign={ buttonDesign }
					buttonIcon={ buttonIcon }
					onChangeButtonColor={ value => setAttributes( { color: value } ) }
					onChangeButtonTextColor={ value => setAttributes( { textColor: value } ) }
					onChangeButtonSize={ value => {
						setAttributes( { size: value } )
					} }
					onChangeButtonBorderRadius={ value => setAttributes( { borderButtonRadius: value } ) }
					onChangeButtonDesign={ buttonDesign => setAttributes( { buttonDesign } ) }
					onChangeButtonIcon={ buttonIcon => setAttributes( { buttonIcon } ) }
				/>
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
				{ applyFilters( 'stackable.cta.edit.inspector.after', null, design, props ) }
			</InspectorControls>
			<div className={ mainClasses } style={ mainStyle }>
				{ designHasBackground && backgroundType === 'video' && (
					<video
						className="ugb-video-background"
						autoPlay
						muted
						loop
						src={ backgroundImageURL }
					/>
				) }
				{ applyFilters( 'stackable.cta.edit.output.before', null, design, props ) }
				<div className="ugb-content-wrapper">
					<RichText
						className="ugb-cta__title"
						tagName="h3"
						placeholder={ __( 'Title for This Block' ) }
						value={ ctaTitle }
						onChange={ text => setAttributes( { ctaTitle: text } ) }
						keepPlaceholderOnFocus
						style={ {
							color: titleColor,
						} }
					/>
					<RichText
						tagName="p"
						value={ bodyText }
						className="ugb-cta__description"
						onChange={ text => setAttributes( { bodyText: text } ) }
						placeholder={ descriptionPlaceholder() }
						keepPlaceholderOnFocus
						style={ {
							color: bodyTextColor,
						} }
					/>
					<ButtonEdit
						size={ size }
						color={ textColor }
						backgroundColor={ color }
						text={ buttonText }
						borderRadius={ borderButtonRadius }
						design={ buttonDesign }
						icon={ buttonIcon }
						onChange={ text => setAttributes( { buttonText: text } ) }
					/>
				</div>
				{ applyFilters( 'stackable.cta.edit.output.after', null, design, props ) }
			</div>
			{ isSelected && (
				<URLInputControl
					value={ url }
					newTab={ newTab }
					onChange={ url => setAttributes( { url } ) }
					onChangeNewTab={ newTab => setAttributes( { newTab } ) }
				/>
			) }
		</Fragment>
	)
}

export default edit
