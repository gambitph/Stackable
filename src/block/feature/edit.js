import {
	AlignmentToolbar, BlockControls, InspectorControls, PanelColorSettings, RichText,
} from '@wordpress/editor'
import {
	ButtonEdit, DesignPanelBody, ImageUploadPlaceholder, PanelBackgroundSettings, PanelButtonSettings, ProControl, URLInputControl,
} from '@stackable/components'
import {
	RangeControl, ToggleControl,
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import classnames from 'classnames'
import { descriptionPlaceholder } from '@stackable/util'
import { Fragment } from '@wordpress/element'
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
		backgroundColor,
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
	], {
		[ `ugb-feature--content-${ contentAlign }` ]: contentAlign,
		'ugb-feature--invert': invert,
		'ugb--has-background': design !== 'plain' && ( backgroundColor || backgroundImageURL ),
		'ugb--has-background-image': design !== 'plain' && backgroundImageURL,
		[ `ugb--content-width` ]: align === 'full' && contentWidth,
		[ `ugb--shadow-${ shadow }` ]: design !== 'plain' && shadow !== 3,
	} )

	const mainStyle = {
		'--image-size': imageSize ? `${ imageSize }px` : undefined,
		backgroundColor: design !== 'plain' && backgroundColor ? backgroundColor : undefined,
		backgroundImage: design !== 'plain' && backgroundImageURL ? `url(${ backgroundImageURL })` : undefined,
		backgroundAttachment: design !== 'plain' && fixedBackground ? 'fixed' : undefined,
		'--ugb-background-color': design !== 'plain' && backgroundImageURL ? backgroundColor : undefined,
		borderRadius: design !== 'plain' && borderRadius !== 12 ? borderRadius : undefined,
	}

	const imageClasses = classnames( [
		'ugb-feature__image',
	], {
		[ `ugb--shadow-${ shadow }` ]: design === 'plain',
	} )

	const imageStyle = {
		borderRadius: design === 'plain' ? borderRadius : undefined,
	}

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
							label: __( 'Basic' ), value: 'basic', image: 'src/block/feature/images/basic.png',
						},
						{
							label: __( 'Plain' ), value: 'plain', image: 'src/block/feature/images/plain.png',
						},
					] ) }
					onChange={ design => setAttributes( { design } ) }
				>
					{ applyFilters( 'stackable.feature.edit.designs.before', null, props ) }
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
					{ applyFilters( 'stackable.feature.edit.designs.after', null, props ) }
					{ showProNotice && <ProControl size="small" /> }
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
						max={ 600 }
					/>
				</PanelColorSettings>
				{ design !== 'plain' &&
					<PanelBackgroundSettings
						backgroundColor={ backgroundColor }
						backgroundImageID={ backgroundImageID }
						backgroundImageURL={ backgroundImageURL }
						backgroundOpacity={ backgroundOpacity }
						fixedBackground={ fixedBackground }
						onChangeBackgroundColor={ backgroundColor => setAttributes( { backgroundColor } ) }
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
			</InspectorControls>
			<div className={ mainClasses } style={ mainStyle }>
				<div className="ugb-content-wrapper">
					<div className="ugb-feature__content">
						<RichText
							tagName="h2"
							className="ugb-feature__title"
							value={ title }
							onChange={ title => setAttributes( { title } ) }
							style={ { color: textColor } }
							placeholder={ __( 'Title for This Block' ) }
							keepPlaceholderOnFocus
						/>
						<RichText
							tagName="p"
							className="ugb-feature__description"
							value={ description }
							onChange={ description => setAttributes( { description } ) }
							style={ { color: textColor } }
							placeholder={ descriptionPlaceholder( 'medium' ) }
							keepPlaceholderOnFocus
						/>
						<ButtonEdit
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
					</div>
					<div className="ugb-feature__image-side">
						<ImageUploadPlaceholder
							imageID={ imageID }
							imageURL={ imageUrl }
							className={ imageClasses }
							style={ imageStyle }
							onRemove={ () => {
								setAttributes( { imageUrl: '', imageID: '' } )
							} }
							onChange={ ( { url, id } ) => {
								setAttributes( { imageUrl: url, imageID: id } )
							} }
							render={ <img src={ imageUrl } alt={ __( 'feature' ) } /> }
						/>
					</div>
				</div>
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
