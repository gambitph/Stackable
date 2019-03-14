import {
	AlignmentToolbar, BlockControls, InspectorControls, PanelColorSettings, RichText,
} from '@wordpress/editor'
import {
	ButtonEdit, DesignPanelBody, PanelBackgroundSettings, PanelButtonSettings, ProControl, URLInputControl,
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
		backgroundColor,
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
	}, design, props ) )

	const styles = applyFilters( 'stackable.header.styles', {
		main: {
			'--ugb-background-color': design !== 'plain' && backgroundImageURL ? backgroundColor : undefined,
			backgroundAttachment: design !== 'plain' && fixedBackground ? 'fixed' : undefined,
			backgroundColor: design !== 'plain' && backgroundColor ? backgroundColor : undefined,
			backgroundImage: design !== 'plain' && backgroundImageURL ? `url(${ backgroundImageURL })` : undefined,
			borderRadius: design !== 'plain' && borderRadius !== 12 ? borderRadius : undefined,
			textAlign: contentAlign ? contentAlign : undefined,
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
							image: ImageDesignBasic, label: __( 'Basic' ), value: 'basic',
						},
						{
							image: ImageDesignPlain, label: __( 'Plain' ), value: 'plain',
						},
						...applyFilters( 'stackable.header.edit.designs', [] ),
					] }
					onChange={ design => {
						setAttributes( { design } )
					} }
				>
					{ applyFilters( 'stackable.header.edit.designs.before', null, design, props ) }
					<ToggleControl
						label={ __( 'Full Height' ) }
						checked={ fullHeight }
						onChange={ fullHeight => setAttributes( { fullHeight } ) }
					/>
					{ design !== 'plain' &&
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
					{ applyFilters( 'stackable.header.edit.designs.after', null, props ) }
					{ showProNotice && <ProControl size="small" /> }
				</DesignPanelBody>
				<PanelColorSettings
					initialOpen={ true }
					title={ __( 'Color Settings' ) }
					colorSettings={ [
						{
							label: __( 'Title Color' ),
							onChange: colorValue => setAttributes( { titleColor: colorValue } ),
							value: titleColor,
						},
						{
							label: __( 'Subtitle Color' ),
							onChange: colorValue => setAttributes( { subtitleColor: colorValue } ),
							value: subtitleColor,
						},
					] }
				>
				</PanelColorSettings>
				{ design !== 'plain' &&
					<PanelBackgroundSettings
						initialOpen={ true }
						backgroundColor={ backgroundColor }
						backgroundImageID={ backgroundImageID }
						backgroundImageURL={ backgroundImageURL }
						backgroundOpacity={ backgroundOpacity }
						fixedBackground={ fixedBackground }
						onChangeBackgroundColor={ backgroundColor => setAttributes( { backgroundColor } ) }
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
						title={ __( 'Custom CSS' ) }
					>
						<ProControl
							title={ __( 'Say Hello to Custom CSS 👋' ) }
							description={ __( 'Further tweak this block by adding guided custom CSS rules. This feature is only available on Stackable Premium' ) }
						/>
					</PanelBody>
				}
				{ applyFilters( 'stackable.header.edit.inspector.after', null, design, props ) }
			</InspectorControls>
			{ applyFilters( 'stackable.header.edit.output.before', null, design, props ) }
			<div className={ mainClasses } style={ styles.main }>
				{ ( () => {
					const titleComp = <RichText
						tagName="h2"
						className="ugb-header__title"
						placeholder={ __( 'Title for This Block' ) }
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
