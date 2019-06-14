import {
	AlignmentToolbar, BlockControls, InnerBlocks, InspectorControls, PanelColorSettings,
} from '@wordpress/block-editor'
import {
	HorizontalAlignmentToolbar, PanelBackgroundSettings, ProControl, VerticalAlignmentToolbar,
} from '@stackable/components'
import {
	PanelBody, RangeControl, SelectControl, ToggleControl,
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import classnames from 'classnames'
import { descriptionPlaceholder } from '@stackable/util'
import { Fragment } from '@wordpress/element'
import { showProNotice } from 'stackable'

const TEMPLATE = [
	[ 'core/heading', { content: __( 'Title for This Block' ) } ],
	[ 'core/paragraph', { content: descriptionPlaceholder( 'long' ) } ],
]

const edit = props => {
	const {
		className,
		setAttributes,
	} = props

	const {
		contentAlign,
		textColor,
		backgroundColorType = '',
		backgroundColor,
		backgroundColor2,
		backgroundColorDirection = 0,
		backgroundType = '',
		backgroundImageID,
		backgroundImageURL,
		backgroundOpacity,
		fixedBackground,
		height,
		contentLocation,
		verticalAlign,
		contentWidth,
		align,
		borderRadius = 12,
		shadow = 3,
		design = '',
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-container',
		'ugb--background-opacity-' + ( 1 * Math.round( backgroundOpacity / 1 ) ),
	], applyFilters( 'stackable.container.mainclasses', {
		[ `ugb-container--content-${ contentAlign }` ]: contentAlign,
		'ugb--has-background': ( backgroundColor && backgroundColor !== 'transparent' ) || backgroundImageURL,
		'ugb--has-background-image': backgroundImageURL,
		[ `ugb-container--height-${ height }` ]: height,
		[ `ugb-container--align-horizontal-${ contentLocation }` ]: contentLocation,
		[ `ugb--content-width` ]: contentWidth,
		[ `ugb--shadow-${ shadow }` ]: shadow !== 3,
		[ `ugb--has-background-gradient` ]: backgroundColorType === 'gradient',
		[ `ugb--has-background-video` ]: backgroundType === 'video',
	}, design, props ) )

	const mainStyle = {
		'--ugb-text-color': textColor ? textColor : undefined,
		backgroundColor: backgroundColor ? backgroundColor : undefined,
		backgroundImage: backgroundImageURL ? `url(${ backgroundImageURL })` : undefined,
		backgroundAttachment: fixedBackground ? 'fixed' : undefined,
		'--ugb-background-color': backgroundImageURL || backgroundColorType === 'gradient' ? backgroundColor : undefined,
		'--ugb-background-color2': backgroundColorType === 'gradient' && backgroundColor2 ? backgroundColor2 : undefined,
		'--ugb-background-direction': backgroundColorType === 'gradient' ? `${ backgroundColorDirection }deg` : undefined,
		'justify-content': ( height === 'full' || height === 'half' ) && verticalAlign ? verticalAlign : undefined,
		borderRadius: borderRadius !== 12 ? borderRadius : undefined,
	}

	return (
		<Fragment>
			<BlockControls>
				<AlignmentToolbar
					value={ contentAlign }
					onChange={ contentAlign => setAttributes( { contentAlign } ) }
				/>
				<HorizontalAlignmentToolbar
					value={ contentLocation }
					onChange={ contentLocation => setAttributes( { contentLocation } ) }
				/>
				{ ( height === 'full' || height === 'half' ) &&
					<VerticalAlignmentToolbar
						value={ verticalAlign }
						onChange={ verticalAlign => setAttributes( { verticalAlign } ) }
					/>
				}
			</BlockControls>
			<InspectorControls>
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
					<SelectControl
						label={ __( 'Height' ) }
						options={ [
							{ label: __( 'Short' ), value: 'short' },
							{ label: __( 'Normal' ), value: 'normal' },
							{ label: __( 'Tall' ), value: 'tall' },
							{ label: __( 'Half-screen height' ), value: 'half' },
							{ label: __( 'Full-screen height' ), value: 'full' },
						] }
						value={ height }
						onChange={ height => {
							setAttributes( { height } )
						} }
					/>
					{ align === 'full' &&
						<ToggleControl
							label={ __( 'Restrict to Content Width' ) }
							checked={ contentWidth }
							onChange={ contentWidth => setAttributes( { contentWidth } ) }
						/>
					}
					{ align !== 'full' &&
						<RangeControl
							label={ __( 'Border Radius' ) }
							value={ borderRadius }
							onChange={ borderRadius => setAttributes( { borderRadius } ) }
							min={ 0 }
							max={ 50 }
						/>
					}
					<RangeControl
						label={ __( 'Shadow / Outline' ) }
						value={ shadow }
						onChange={ shadow => setAttributes( { shadow } ) }
						min={ 0 }
						max={ 9 }
					/>
				</PanelColorSettings>
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
					onChangeBackgroundColor={ backgroundColor => setAttributes( { backgroundColor: typeof backgroundColor === 'undefined' ? 'transparent' : backgroundColor } ) }
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
				{ applyFilters( 'stackable.container.edit.inspector.after', null, design, props ) }
			</InspectorControls>
			<div className={ mainClasses } style={ mainStyle }>
				{ backgroundType === 'video' && (
					<video
						className="ugb-video-background"
						autoPlay
						muted
						loop
						src={ backgroundImageURL }
					/>
				) }
				{ applyFilters( 'stackable.container.edit.output.before', null, design, props ) }
				<div className="ugb-container__wrapper">
					<div className="ugb-container__content-wrapper">
						<InnerBlocks template={ TEMPLATE } />
					</div>
				</div>
				{ applyFilters( 'stackable.container.edit.output.after', null, design, props ) }
			</div>
		</Fragment>
	)
}

export default edit
