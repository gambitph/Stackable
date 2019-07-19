import {
	AlignmentToolbar, BlockControls, InspectorControls, PanelColorSettings, RichText,
} from '@wordpress/block-editor'
import {
	ButtonEdit, DesignPanelBody, PanelBackgroundSettings, PanelButtonSettings, ProControl, ProControlButton, URLInputControl,
} from '@stackable/components'
import { i18n, showProNotice } from 'stackable'
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

const edit = props => {
	const {
		className,
		isSelected,
		setAttributes,
	} = props

	const {
		buttonText,
		buttonURL,
		buttonColor,
		buttonTextColor,
		buttonDesign,
		buttonIcon,
		cornerButtonRadius,
		size,
		title,
		titleColor,
		subtitle,
		subtitleColor,
		contentAlign = 'center',
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
		contentWidth = false,
		buttonNewTab,
		invert = false,
		fullHeight = false,
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-header',
		'ugb-header--v2',
		'ugb--background-opacity-' + ( 1 * Math.round( backgroundOpacity / 1 ) ),
		[ `ugb-header--design-${ design }` ],
	], applyFilters( 'stackable.header.mainclasses', {
		'ugb--has-background': design !== 'plain' &&
		                       ( backgroundColor || backgroundImageURL ),
		'ugb--has-background-image': design !== 'plain' &&
		                             backgroundImageURL,
		[ `ugb--shadow-${ shadow }` ]: design !== 'plain' && shadow !== 3,
		[ `ugb--content-width` ]: align === 'full' && contentWidth,
		'ugb-header--invert': invert,
		'ugb-header--full-height': fullHeight,
		[ `ugb--has-background-gradient` ]: backgroundColorType === 'gradient',
		[ `ugb--has-background-video` ]: backgroundType === 'video',
	}, design, props ) )

	const mainBackgroundStyles = design === 'plain' ? {} : {
		'--ugb-background-color': backgroundImageURL || backgroundColorType === 'gradient' ? backgroundColor : undefined,
		'--ugb-background-color2': backgroundColorType === 'gradient' && backgroundColor2 ? backgroundColor2 : undefined,
		'--ugb-background-direction': backgroundColorType === 'gradient' ? `${ backgroundColorDirection }deg` : undefined,
		backgroundAttachment: fixedBackground ? 'fixed' : undefined,
		backgroundColor: backgroundColor ? backgroundColor : undefined,
		backgroundImage: backgroundImageURL ? `url(${ backgroundImageURL })` : undefined,
		borderRadius: borderRadius !== 12 ? borderRadius : undefined,
	}

	const styles = applyFilters( 'stackable.header.styles', {
		main: {
			textAlign: contentAlign ? contentAlign : undefined,
			...mainBackgroundStyles,
		},
		title: {
			color: titleColor ? titleColor :
				   design === 'plain' ? undefined :
				   '#ffffff',
			textAlign: contentAlign,
		},
		subtitle: {
			color: subtitleColor ? subtitleColor :
				   design === 'plain' ? undefined :
				   '#ffffff',
			textAlign: contentAlign,
		},
	}, design, props )

	return (
		<Fragment>
			<BlockControls>
				<AlignmentToolbar
					value={ contentAlign }
					onChange={ newAlign => setAttributes( { contentAlign: newAlign } ) }
				/>
			</BlockControls>
			<InspectorControls>
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
						...applyFilters( 'stackable.header.edit.designs', [] ),
					] }
					onChange={ design => {
						setAttributes( { design } )
					} }
				>
					{ applyFilters( 'stackable.header.edit.designs.before', null, design, props ) }
					<ToggleControl
						label={ __( 'Full Height', i18n ) }
						checked={ fullHeight }
						onChange={ fullHeight => setAttributes( { fullHeight } ) }
					/>
					{ design !== 'plain' &&
						<RangeControl
							label={ __( 'Border Radius', i18n ) }
							value={ borderRadius }
							onChange={ borderRadius => setAttributes( { borderRadius } ) }
							min={ 0 }
							max={ 50 }
						/>
					}
					{ design !== 'plain' &&
						<RangeControl
							label={ __( 'Shadow / Outline', i18n ) }
							value={ shadow }
							onChange={ shadow => setAttributes( { shadow } ) }
							min={ 0 }
							max={ 9 }
						/>
					}
					{ align === 'full' &&
						<ToggleControl
							label={ __( 'Restrict to Content Width', i18n ) }
							checked={ contentWidth }
							onChange={ contentWidth => setAttributes( { contentWidth } ) }
						/>
					}
					{ applyFilters( 'stackable.header.edit.designs.after', null, props ) }
					{ showProNotice && <ProControlButton /> }
				</DesignPanelBody>
				<PanelColorSettings
					initialOpen={ true }
					title={ __( 'Color Settings', i18n ) }
					colorSettings={ [
						{
							label: __( 'Title Color', i18n ),
							onChange: colorValue => setAttributes( { titleColor: colorValue } ),
							value: titleColor,
						},
						{
							label: __( 'Subtitle Color', i18n ),
							onChange: colorValue => setAttributes( { subtitleColor: colorValue } ),
							value: subtitleColor,
						},
					] }
				>
				</PanelColorSettings>
				{ design !== 'plain' &&
					<PanelBackgroundSettings
						initialOpen={ true }
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
						onChangeBackgroundImage={ ( { url, id } ) => setAttributes( { backgroundImageID: id, backgroundImageURL: url } ) }
						onRemoveBackgroundImage={ () => {
							setAttributes( { backgroundImageID: 0, backgroundImageURL: '' } )
						} }
						onChangeBackgroundOpacity={ backgroundOpacity => setAttributes( { backgroundOpacity } ) }
						onChangeFixedBackground={ value => setAttributes( { fixedBackground: !! value } ) }
					/>
				}
				<PanelButtonSettings
					initialOpen={ false }
					buttonColor={ buttonColor }
					buttonTextColor={ buttonTextColor }
					buttonSize={ size }
					buttonBorderRadius={ cornerButtonRadius }
					buttonDesign={ buttonDesign }
					buttonIcon={ buttonIcon }
					onChangeButtonColor={ value => setAttributes( { buttonColor: value } ) }
					onChangeButtonTextColor={ value => setAttributes( { buttonTextColor: value } ) }
					onChangeButtonSize={ value => {
						setAttributes( { size: value } )
					} }
					onChangeButtonBorderRadius={ value => setAttributes( { cornerButtonRadius: value } ) }
					onChangeButtonDesign={ buttonDesign => setAttributes( { buttonDesign } ) }
					onChangeButtonIcon={ buttonIcon => setAttributes( { buttonIcon } ) }
					{ ...applyFilters( 'stackable.header.edit.button.props', {}, design, props ) }
				/>
				{ showProNotice &&
					<PanelBody
						initialOpen={ false }
						title={ __( 'Custom CSS', i18n ) }
					>
						<ProControl
							title={ __( 'Say Hello to Custom CSS 👋', i18n ) }
							description={ __( 'Further tweak this block by adding guided custom CSS rules. This feature is only available on Stackable Premium', i18n ) }
						/>
					</PanelBody>
				}
				{ applyFilters( 'stackable.header.edit.inspector.after', null, design, props ) }
			</InspectorControls>
			<div className={ mainClasses } style={ styles.main }>
				{ design !== 'plain' && backgroundType === 'video' && (
					<video
						className="ugb-video-background"
						autoPlay
						muted
						loop
						src={ backgroundImageURL }
					/>
				) }
				{ applyFilters( 'stackable.header.edit.output.before', null, design, props ) }
				{ ( () => {
					const titleComp = <RichText
						tagName="h2"
						className="ugb-header__title"
						placeholder={ __( 'Title for This Block', i18n ) }
						keepPlaceholderOnFocus
						value={ title }
						onChange={ value => setAttributes( { title: value } ) }
						style={ styles.title }
					/>
					const subtitleComp = <RichText
						tagName="p"
						className="ugb-header__subtitle"
						placeholder={ descriptionPlaceholder() }
						keepPlaceholderOnFocus
						value={ subtitle }
						onChange={ value => setAttributes( { subtitle: value } ) }
						style={ styles.subtitle }
					/>
					const buttonComp = <ButtonEdit
						size={ size }
						align={ contentAlign }
						color={ buttonTextColor }
						backgroundColor={ buttonColor }
						text={ buttonText }
						borderRadius={ cornerButtonRadius }
						design={ buttonDesign }
						icon={ buttonIcon }
						onChange={ text => setAttributes( { buttonText: text } ) }
					/>
					const comps = {
						titleComp,
						subtitleComp,
						buttonComp,
					}
					return applyFilters( 'stackable.header.edit.output', (
						<div className="ugb-content-wrapper">
							{ titleComp }
							{ subtitleComp }
							{ buttonComp }
						</div>
					), design, props, comps )
				} )() }
				{ applyFilters( 'stackable.header.edit.output.after', null, design, props ) }
			</div>
			{ isSelected && (
				<div className="ugb-header__url-inputs">
					<URLInputControl
						value={ buttonURL }
						newTab={ buttonNewTab }
						onChange={ buttonURL => setAttributes( { buttonURL } ) }
						onChangeNewTab={ buttonNewTab => setAttributes( { buttonNewTab } ) }
					/>
					{ applyFilters( 'stackable.header.edit.url', null, design, props ) }
				</div>
			) }
		</Fragment>
	)
}

export default edit
