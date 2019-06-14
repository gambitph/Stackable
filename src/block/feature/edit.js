import {
	AlignmentToolbar, BlockControls, InspectorControls, PanelColorSettings, RichText,
} from '@wordpress/block-editor'
import {
	ButtonEdit, DesignPanelBody, ImageUploadPlaceholder, PanelBackgroundSettings, PanelButtonSettings, ProControl, ProControlButton, URLInputControl,
} from '@stackable/components'
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
		invert,
		contentAlign,
		textColor,
		imageSize,
		imageID,
		imageUrl,
		title,
		description,
		buttonURL,
		buttonNewTab,
		buttonText,
		buttonColor,
		buttonTextColor,
		buttonSize,
		buttonBorderRadius,
		buttonDesign,
		buttonIcon,
		backgroundColorType = '',
		backgroundColor,
		backgroundColor2,
		backgroundColorDirection = 0,
		backgroundType = '',
		backgroundImageID,
		backgroundImageURL,
		backgroundOpacity,
		fixedBackground,
		contentWidth,
		align,
		design = 'plain',
		borderRadius = 12,
		shadow = 3,
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-feature',
		'ugb--background-opacity-' + ( 1 * Math.round( backgroundOpacity / 1 ) ),
		`ugb-feature--design-${ design }`,
	], applyFilters( 'stackable.feature.mainclasses', {
		[ `ugb-feature--content-${ contentAlign }` ]: contentAlign,
		'ugb-feature--invert': invert,
		'ugb--has-background': design !== 'plain' && ( backgroundColor || backgroundImageURL ),
		'ugb--has-background-image': design !== 'plain' && backgroundImageURL,
		[ `ugb--content-width` ]: align === 'full' && contentWidth,
		[ `ugb--shadow-${ shadow }` ]: design !== 'plain' && shadow !== 3,
		[ `ugb--has-background-gradient` ]: design !== 'plain' && backgroundColorType === 'gradient',
		[ `ugb--has-background-video` ]: design !== 'plain' && backgroundType === 'video',
	}, design, props ) )

	const imageClasses = classnames( [
		'ugb-feature__image',
	], applyFilters( 'stackable.feature.imageclasses', {
		[ `ugb--shadow-${ shadow }` ]: design === 'plain',
	}, design, props ) )

	const backgroundStyles = design === 'plain' ? {} : {
		backgroundColor: backgroundColor ? backgroundColor : undefined,
		backgroundImage: backgroundImageURL ? `url(${ backgroundImageURL })` : undefined,
		backgroundAttachment: fixedBackground ? 'fixed' : undefined,
		'--ugb-background-color': backgroundImageURL || backgroundColorType === 'gradient' ? backgroundColor : undefined,
		'--ugb-background-color2': backgroundColorType === 'gradient' && backgroundColor2 ? backgroundColor2 : undefined,
		'--ugb-background-direction': backgroundColorType === 'gradient' ? `${ backgroundColorDirection }deg` : undefined,
		borderRadius: borderRadius !== 12 ? borderRadius : undefined,
	}

	const styles = applyFilters( 'stackable.feature.styles', {
		main: {
			'--image-size': imageSize ? `${ imageSize }px` : undefined,
			...backgroundStyles,
		},
		image: {
			borderRadius: design === 'plain' ? borderRadius : undefined,
		},
	}, design, props )

	const show = applyFilters( 'stackable.feature.edit.show', {
		background: design !== 'plain',
	}, design, props )

	return (
		<Fragment>
			<BlockControls>
				<AlignmentToolbar
					value={ contentAlign }
					onChange={ contentAlign => setAttributes( { contentAlign } ) }
				/>
			</BlockControls>
			<InspectorControls>
				<DesignPanelBody
					selected={ design }
					options={ applyFilters( 'stackable.feature.edit.designs', [
						{
							label: __( 'Basic' ), value: 'basic', image: ImageDesignBasic,
						},
						{
							label: __( 'Plain' ), value: 'plain', image: ImageDesignPlain,
						},
					] ) }
					onChange={ design => setAttributes( { design } ) }
				>
					<RangeControl
						label={ __( 'Border Radius' ) }
						value={ borderRadius }
						onChange={ borderRadius => setAttributes( { borderRadius } ) }
						min={ 0 }
						max={ 50 }
					/>
					<RangeControl
						label={ __( 'Shadow / Outline' ) }
						value={ shadow }
						onChange={ shadow => setAttributes( { shadow } ) }
						min={ 0 }
						max={ 9 }
					/>
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
					title={ __( 'General Settings' ) }
					colorSettings={ [
						{
							value: textColor,
							onChange: textColor => setAttributes( { textColor } ),
							label: __( 'Text Color' ),
						},
					] }
				>
					<ToggleControl
						label={ __( 'Reverse Horizontally' ) }
						checked={ invert }
						onChange={ () => setAttributes( { invert: ! invert } ) }
					/>
					<RangeControl
						label={ __( 'Image Size' ) }
						value={ imageSize }
						onChange={ imageSize => setAttributes( { imageSize } ) }
						help={ __( 'The theme\'s content width may have an effect here.' ) }
						min={ 100 }
						max={ 800 }
					/>
				</PanelColorSettings>
				{ applyFilters( 'stackable.feature.edit.inspector', null, design, props ) }
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
					buttonColor={ buttonColor }
					buttonTextColor={ buttonTextColor }
					buttonSize={ buttonSize }
					buttonBorderRadius={ buttonBorderRadius }
					buttonDesign={ buttonDesign }
					buttonIcon={ buttonIcon }
					onChangeButtonColor={ value => setAttributes( { buttonColor: value } ) }
					onChangeButtonTextColor={ value => setAttributes( { buttonTextColor: value } ) }
					onChangeButtonSize={ value => {
						setAttributes( { buttonSize: value } )
					} }
					onChangeButtonBorderRadius={ value => setAttributes( { buttonBorderRadius: value } ) }
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
				{ applyFilters( 'stackable.feature.edit.inspector.after', null, design, props ) }
			</InspectorControls>
			<div className={ mainClasses } style={ styles.main }>
				{ design === 'basic' && backgroundType === 'video' && (
					<video
						className="ugb-video-background"
						autoPlay
						muted
						loop
						src={ backgroundImageURL }
					/>
				) }
				{ applyFilters( 'stackable.feature.edit.output.before', null, design, props ) }
				{ ( () => {
					const titleComp = <RichText
						tagName="h2"
						className="ugb-feature__title"
						value={ title }
						onChange={ title => setAttributes( { title } ) }
						style={ { color: textColor } }
						placeholder={ __( 'Title for This Block' ) }
						keepPlaceholderOnFocus
					/>
					const descriptionComp = <RichText
						tagName="p"
						className="ugb-feature__description"
						value={ description }
						onChange={ description => setAttributes( { description } ) }
						style={ { color: textColor } }
						placeholder={ descriptionPlaceholder( 'medium' ) }
						keepPlaceholderOnFocus
					/>
					const buttonComp = <ButtonEdit
						size={ buttonSize }
						align={ contentAlign }
						color={ buttonTextColor }
						backgroundColor={ buttonColor }
						text={ buttonText }
						borderRadius={ buttonBorderRadius }
						design={ buttonDesign }
						icon={ buttonIcon }
						onChange={ buttonText => setAttributes( { buttonText } ) }
					/>
					const imageBGComp = <ImageUploadPlaceholder
						imageID={ imageID }
						imageURL={ imageUrl }
						className={ imageClasses }
						style={ styles.image }
						onRemove={ () => {
							setAttributes( { imageUrl: '', imageID: '', imageAlt: '' } )
						} }
						onChange={ ( { url, id, alt } ) => {
							setAttributes( { imageUrl: url, imageID: id, imageAlt: alt } )
						} }
					/>
					const imageComp = <ImageUploadPlaceholder
						imageID={ imageID }
						imageURL={ imageUrl }
						className={ imageClasses }
						style={ styles.image }
						onRemove={ () => {
							setAttributes( { imageUrl: '', imageID: '', imageAlt: '' } )
						} }
						onChange={ ( { url, id, alt } ) => {
							setAttributes( { imageUrl: url, imageID: id, imageAlt: alt } )
						} }
						render={ <img src={ imageUrl } alt={ __( 'feature' ) } /> }
					/>
					const comps = {
						titleComp,
						descriptionComp,
						buttonComp,
						imageBGComp,
						imageComp,
					}
					return applyFilters( 'stackable.feature.edit.output', (
						<div className="ugb-content-wrapper">
							<div className="ugb-feature__content">
								{ titleComp }
								{ descriptionComp }
								{ buttonComp }
							</div>
							<div className="ugb-feature__image-side">
								{ imageComp }
							</div>
						</div>
					), comps, props )
				} )() }
				{ applyFilters( 'stackable.feature.edit.output.after', null, design, props ) }
			</div>
			{ isSelected && (
				<URLInputControl
					value={ buttonURL }
					newTab={ buttonNewTab }
					onChange={ buttonURL => setAttributes( { buttonURL } ) }
					onChangeNewTab={ buttonNewTab => setAttributes( { buttonNewTab } ) }
				/>
			) }
		</Fragment>
	)
}

export default edit
