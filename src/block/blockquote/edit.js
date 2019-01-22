import {
	BaseControl, RangeControl, ToggleControl, Toolbar,
} from '@wordpress/components'
import { DesignPanelBody, PanelBackgroundSettings, ProControl } from '@stackable/components'
import {
	InspectorControls, PanelColorSettings, RichText,
} from '@wordpress/editor'
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import classnames from 'classnames'
import { descriptionPlaceholder } from '@stackable/util'
import { Fragment } from '@wordpress/element'
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
		backgroundColor,
		backgroundImageID,
		backgroundImageURL,
		backgroundOpacity,
		fixedBackground,
		quotationMark,
		quotationSize,
		contentWidth,
		align,
		design = 'plain',
		borderRadius = 12,
		shadow = 3,
	} = props.attributes

	const designHasBackground = [ 'basic', 'top-icon' ].includes( design )

	const mainClasses = classnames( [
		className,
		'ugb-blockquote',
		'ugb-blockquote--v2',
		'ugb--background-opacity-' + ( 1 * Math.round( backgroundOpacity / 1 ) ),
		`ugb-blockquote--design-${ design }`,
	], {
		'ugb--has-background': designHasBackground && ( backgroundColor || backgroundImageURL ),
		'ugb--has-background-image': designHasBackground && backgroundImageURL,
		[ `ugb--shadow-${ shadow }` ]: designHasBackground && shadow !== 3,
		[ `ugb-content-width` ]: align === 'full' && contentWidth,
		...applyFilters( 'stackable.blockquote.mainclasses', {}, props ),
	} )

	const mainStyle = {
		'--quote-color': quoteColor ? quoteColor : undefined,
		backgroundColor: designHasBackground && backgroundColor ? backgroundColor : undefined,
		backgroundImage: designHasBackground && backgroundImageURL ? `url(${ backgroundImageURL })` : undefined,
		backgroundAttachment: designHasBackground && fixedBackground ? 'fixed' : undefined,
		'--ugb-background-color': designHasBackground && backgroundImageURL ? backgroundColor : undefined,
		borderRadius: designHasBackground && borderRadius !== 12 ? borderRadius : undefined,
		...applyFilters( 'stackable.blockquote.mainstyle', {}, props ),
	}

	return (
		<Fragment>
			<blockquote
				className={ mainClasses }
				style={ mainStyle }>
				<div className="ugb-content-wrapper">
					{ QUOTE_ICONS[ quotationMark ].iconFunc( {
						fill: quoteColor,
						width: quotationSize,
						height: quotationSize,
					} ) }
					{ applyFilters( 'stackable.blockquote.text',
						<RichText
							className="ugb-blockquote__text"
							value={ text }
							onChange={ nextValue => setAttributes( { text: nextValue } ) }
							isSelected={ isSelected }
							placeholder={ descriptionPlaceholder( 'long' ) }
							keepPlaceholderOnFocus
							style={ {
								color: color,
							} }
						/>,
						props
					) }
				</div>
			</blockquote>
			<InspectorControls>
				<DesignPanelBody
					selected={ design }
					options={ applyFilters( 'stackable.blockquote.edit.designs', [
						{
							label: __( 'Basic' ), value: 'basic', image: 'src/block/blockquote/images/basic.png',
						},
						{
							label: __( 'Plain' ), value: 'plain', image: 'src/block/blockquote/images/plain.png',
						},
					] ) }
					onChange={ design => setAttributes( { design } ) }
				>
					{ applyFilters( 'stackable.blockquote.edit.designs.before', null, props ) }
					{ designHasBackground &&
						<RangeControl
							label={ __( 'Border Radius' ) }
							value={ borderRadius }
							onChange={ borderRadius => setAttributes( { borderRadius } ) }
							min={ 0 }
							max={ 50 }
						/>
					}
					{ designHasBackground &&
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
					{ showProNotice && <ProControl size="small" /> }
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
				{ designHasBackground &&
					<PanelBackgroundSettings
						backgroundColor={ backgroundColor }
						backgroundImageID={ backgroundImageID }
						backgroundImageURL={ backgroundImageURL }
						backgroundOpacity={ backgroundOpacity }
						fixedBackground={ fixedBackground }
						onChangeBackgroundColor={ value => setAttributes( { backgroundColor: value } ) }
						onChangeBackgroundImage={ ( { url, id } ) => setAttributes( { backgroundImageURL: url, backgroundImageID: id } ) }
						onRemoveBackgroundImage={ () => {
							setAttributes( { backgroundImageURL: '', backgroundImageID: 0 } )
						} }
						onChangeBackgroundOpacity={ value => setAttributes( { backgroundOpacity: value } ) }
						onChangeFixedBackground={ value => setAttributes( { fixedBackground: !! value } ) }
					/>
				}
			</InspectorControls>
		</Fragment>
	)
}

export default edit
