import {
	ColorPaletteControl, DesignPanelBody, PanelBackgroundSettings, ProControl,
} from '@stackable/components'
import {
	InspectorControls, PanelColorSettings, RichText,
} from '@wordpress/editor'
import { RangeControl, SelectControl, ToggleControl } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import classnames from 'classnames'
import { Fragment } from '@wordpress/element'
import { getFontFamily } from './font'
import ImageDesignBasic from './images/basic.png'
import ImageDesignPlain from './images/plain.png'
import { showProNotice } from 'stackable'

const edit = props => {
	const {
		setAttributes, className, attributes,
	} = props
	const {
		columns,
		backgroundColor,
		backgroundImageID,
		backgroundImageURL,
		backgroundOpacity,
		fixedBackground,
		textColor,
		countColor,
		countSize,
		contentWidth,
		design = 'plain',
		align,
		borderRadius = 12,
		shadow = 3,
		countFont,
		countFontWeight,
	} = attributes

	const mainClasses = classnames( [
		className,
		'ugb-countup',
		'ugb-countup--v3', // For backward compatibility.
		`ugb-countup--columns-${ columns }`,
		'ugb--background-opacity-' + ( 1 * Math.round( backgroundOpacity / 1 ) ),
	], applyFilters( 'stackable.count-up.mainclasses', {
		// 'ugb-has-background': backgroundColor || backgroundImageURL,
		'ugb--has-background-image': backgroundImageURL,
		[ `ugb--content-width` ]: align === 'full' && contentWidth,
		[ `ugb-countup--design-${ design }` ]: design !== 'plain',
		[ `ugb--shadow-${ shadow }` ]: design === 'basic' && shadow !== 3,
	}, design, props ) )

	const mainStyle = applyFilters( 'stackable.count-up.mainstyle', {
		backgroundColor: design === 'basic' && backgroundColor ? backgroundColor : undefined,
		backgroundImage: design === 'basic' && backgroundImageURL ? `url(${ backgroundImageURL })` : undefined,
		backgroundAttachment: fixedBackground ? 'fixed' : undefined,
		'--ugb-background-color': design === 'basic' && backgroundImageURL ? backgroundColor : undefined,
		borderRadius: design === 'basic' && borderRadius !== 12 ? borderRadius : undefined,
	}, design, props )

	const countStyle = {
		color: countColor ? countColor : undefined,
		fontSize: countSize ? countSize + 'px' : undefined,
		// fontFamily: countFont && countFont !== 'theme' ? getFontFamily( countFont ) : undefined,
		fontWeight: countFontWeight ? countFontWeight : undefined,
	}
	if ( countFont && countFont !== 'theme' ) {
		countStyle.fontFamily = getFontFamily( countFont )
	}

	return (
		<Fragment>
			<div className={ mainClasses } style={ mainStyle }>
				<div className="ugb-content-wrapper">
					{ [ 1, 2, 3, 4 ].map( i => {
						const title = attributes[ `title${ i }` ]
						const description = attributes[ `description${ i }` ]
						const countText = attributes[ `countText${ i }` ]

						const titleComp = <RichText
							tagName="h4"
							className="ugb-countup__title"
							value={ title }
							placeholder={ __( 'Title' ) }
							onChange={ value => setAttributes( { [ `title${ i }` ]: value } ) }
							style={ { color: textColor ? textColor : undefined } }
							keepPlaceholderOnFocus
						/>
						const countComp = <RichText
							tagName="div"
							className="ugb-countup__counter"
							placeholder="1,234"
							data-duration="1000"
							data-delay="16"
							value={ countText }
							onChange={ value => setAttributes( { [ `countText${ i }` ]: value } ) }
							style={ countStyle }
							keepPlaceholderOnFocus
						/>
						const descriptionComp = <RichText
							tagName="p"
							className="ugb-countup__description"
							placeholder={ __( 'Description' ) }
							value={ description }
							onChange={ value => setAttributes( { [ `description${ i }` ]: value } ) }
							style={ { color: textColor ? textColor : undefined } }
							keepPlaceholderOnFocus
						/>
						const comps = {
							i,
							titleComp,
							countComp,
							descriptionComp,
						}
						return applyFilters( 'stackable.count-up.edit.output', (
							<div className="ugb-countup__item" key={ i }>
								{ titleComp }
								{ countComp }
								{ descriptionComp }
							</div>
						), comps, i, props )
					} ) }
				</div>
			</div>
			<InspectorControls>
				<DesignPanelBody
					selected={ design }
					options={ applyFilters( 'stackable.count-up.edit.designs', [
						{
							label: __( 'Basic' ), value: 'basic', image: ImageDesignBasic,
						},
						{
							label: __( 'Plain' ), value: 'plain', image: ImageDesignPlain,
						},
					] ) }
					onChange={ design => setAttributes( { design } ) }
				>
					{ applyFilters( 'stackable.count-up.edit.background-color', false, design, props ) &&
						<ColorPaletteControl
							label={ __( 'Background Color' ) }
							value={ backgroundColor }
							onChange={ backgroundColor => setAttributes( { backgroundColor } ) }
						/>
					}
					{ applyFilters( 'stackable.count-up.edit.border-radius', design !== 'plain', design, props ) &&
						<RangeControl
							label={ __( 'Border Radius' ) }
							value={ borderRadius }
							onChange={ borderRadius => setAttributes( { borderRadius } ) }
							min={ 0 }
							max={ 50 }
						/>
					}
					{ applyFilters( 'stackable.count-up.edit.shadow', design !== 'plain', design, props ) &&
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
					{ showProNotice && <ProControl size="small" /> }
				</DesignPanelBody>
				<PanelColorSettings
					title={ __( 'Color Settings' ) }
					colorSettings={ [
						{
							value: textColor,
							onChange: textColor => setAttributes( { textColor } ),
							label: __( 'Heading & Description Color' ),
						},
						{
							value: countColor,
							onChange: countColor => setAttributes( { countColor } ),
							label: __( 'Counter Color' ),
						},
					] }
				>
					<RangeControl
						label={ __( 'Columns' ) }
						value={ columns }
						onChange={ columns => setAttributes( { columns } ) }
						min={ 1 }
						max={ 4 }
					/>
					<RangeControl
						label={ __( 'Counter Text Size' ) }
						max="100"
						min="10"
						value={ countSize }
						onChange={ countSize => setAttributes( { countSize } ) }
					/>
					<SelectControl
						label={ __( 'Counter Font' ) }
						options={ [
							{ label: __( 'Theme default' ), value: 'theme' },
							{ label: __( 'Sans-Serif' ), value: 'sans-serif' },
							{ label: __( 'Serif' ), value: 'serif' },
							{ label: __( 'Monospace' ), value: 'monospace' },
						] }
						value={ countFont }
						onChange={ countFont => setAttributes( { countFont } ) }
					/>
					<SelectControl
						label={ __( 'Counter Font Weight' ) }
						options={ [
							{ label: __( 'Light' ), value: '100' },
							{ label: __( 'Regular' ), value: '400' },
							{ label: __( 'Bold' ), value: '600' },
							{ label: __( 'Bolder' ), value: '800' },
						] }
						value={ countFontWeight }
						onChange={ countFontWeight => setAttributes( { countFontWeight } ) }
					/>
				</PanelColorSettings>
				{ applyFilters( 'stackable.count-up.edit.background', design !== 'plain', design ) &&
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
			</InspectorControls>
		</Fragment>
	)
}

export default edit
