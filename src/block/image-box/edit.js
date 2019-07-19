import {
	AlignmentToolbar, BlockControls, InspectorControls, PanelColorSettings, RichText,
} from '@wordpress/block-editor'
import {
	DesignPanelBody, ImageUploadPlaceholder, ProControl, ProControlButton, URLInputControl, VerticalAlignmentToolbar,
} from '@stackable/components'
import { i18n, showProNotice } from 'stackable'
import {
	PanelBody, RangeControl, SelectControl,
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import classnames from 'classnames'
import { Fragment } from '@wordpress/element'
import SVGArrow from './images/arrow.svg'

const edit = props => {
	const {
		className,
		setAttributes,
		isSelected,
		attributes,
	} = props

	const {
		titleColor,
		subtitleColor,
		overlayColor,
		height,
		width,
		verticalAlign,
		horizontalAlign,
		align,
		columns,
		design = 'basic',
		borderRadius = 12,
		shadow = 3,
		imageHoverEffect = '',
		overlayOpacity = 7,
		arrow = '',
	} = attributes

	const mainClasses = classnames( [
		className,
		'ugb-image-box',
		'ugb-image-box--v3',
		`ugb-image-box--columns-${ columns }`,
	], applyFilters( 'stackable.image-box.mainclasses', {
		[ `ugb-image-box--design-${ design }` ]: design !== 'basic',
		[ `ugb-image-box--effect-${ imageHoverEffect }` ]: imageHoverEffect,
		[ `ugb-image-box--overlay-${ overlayOpacity }` ]: overlayOpacity !== 7,
		'ugb-image-box--arrow': arrow,
	}, design, props ) )

	const mainStyles = {
		textAlign: horizontalAlign ? horizontalAlign : undefined,
		'--overlay-color': overlayColor,
	}

	const show = applyFilters( 'stackable.image-box.edit.show', {
		verticalAlignmentToolbar: true,
	}, design, props )

	return (
		<Fragment>
			<BlockControls>
				<AlignmentToolbar
					value={ horizontalAlign }
					onChange={ horizontalAlign => setAttributes( { horizontalAlign } ) }
				/>
				<VerticalAlignmentToolbar
					value={ verticalAlign }
					onChange={ verticalAlign => setAttributes( { verticalAlign } ) }
					isDisabled={ ! show.verticalAlignmentToolbar }
				/>
			</BlockControls>
			<InspectorControls>
				<DesignPanelBody
					initialOpen={ true }
					selected={ design }
					options={ [
						...applyFilters( 'stackable.image-box.edit.designs', [] ),
					] }
					onChange={ design => {
						setAttributes( { design } )
					} }
				>
					<RangeControl
						label={ __( 'Border Radius', i18n ) }
						value={ borderRadius }
						onChange={ borderRadius => setAttributes( { borderRadius } ) }
						min={ 0 }
						max={ 50 }
					/>
					<RangeControl
						label={ __( 'Shadow / Outline', i18n ) }
						value={ shadow }
						onChange={ shadow => setAttributes( { shadow } ) }
						min={ 0 }
						max={ 9 }
					/>
					{ showProNotice && <ProControlButton /> }
				</DesignPanelBody>
				<PanelBody title={ __( 'General Settings', i18n ) }>
					<RangeControl
						label={ __( 'Columns', i18n ) }
						value={ columns }
						onChange={ columns => setAttributes( { columns } ) }
						min={ 1 }
						max={ 4 }
					/>
					<SelectControl
						label={ __( 'Image Hover Effect', i18n ) }
						options={ applyFilters( 'stackable.image-box.edit.image-hover-effects', [
							{ label: __( 'None', i18n ), value: '' },
							{ label: __( 'Zoom In', i18n ), value: 'zoom-in' },
							{ label: __( 'Zoom Out', i18n ), value: 'zoom-out' },
						] ) }
						value={ imageHoverEffect }
						onChange={ imageHoverEffect => setAttributes( { imageHoverEffect } ) }
					/>
					<RangeControl
						label={ __( 'Hover Overlay Opacity', i18n ) }
						value={ overlayOpacity }
						onChange={ overlayOpacity => setAttributes( { overlayOpacity } ) }
						min={ 0 }
						max={ 10 }
					/>
					<RangeControl
						label={ __( 'Height', i18n ) }
						value={ height }
						min="135"
						max="700"
						onChange={ height => setAttributes( { height: height } ) }
					/>
					{ ( align !== 'wide' && align !== 'full' && columns === 1 ) && (
						<RangeControl
							label={ __( 'Width', i18n ) }
							value={ width }
							min="400"
							max="999"
							help={ __( 'Only available for single column & if centered', i18n ) }
							onChange={ width => setAttributes( { width: width } ) }
						/>
					) }
					<SelectControl
						label={ __( 'Arrow', i18n ) }
						help={ __( 'The arrow will only appear if the image has a link.', i18n ) }
						options={ [
							{ label: __( 'None', i18n ), value: '' },
							{ label: __( 'Center', i18n ), value: 'center' },
							{ label: __( 'Left', i18n ), value: 'left' },
							{ label: __( 'Right', i18n ), value: 'right' },
						] }
						value={ arrow }
						onChange={ arrow => setAttributes( { arrow } ) }
					/>
				</PanelBody>
				<PanelColorSettings
					title={ __( 'Color Settings', i18n ) }
					initialOpen={ true }
					colorSettings={ [
						{
							value: overlayColor,
							onChange: colorValue => setAttributes( { overlayColor: colorValue } ),
							label: __( 'Overlay Color', i18n ),
						},
						{
							value: titleColor,
							onChange: colorValue => setAttributes( { titleColor: colorValue } ),
							label: ! arrow ? __( 'Title Color', i18n ) : __( 'Title & Arrow Color', i18n ),
						},
						{
							value: subtitleColor,
							onChange: colorValue => setAttributes( { subtitleColor: colorValue } ),
							label: __( 'Subtitle Color', i18n ),
						},
					] }
				>
				</PanelColorSettings>
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
				{ applyFilters( 'stackable.image-box.edit.inspector.after', null, design, props ) }
			</InspectorControls>
			<div className={ mainClasses } style={ mainStyles }>
				{ applyFilters( 'stackable.image-box.edit.output.before', null, design, props ) }
				{ [ 1, 2, 3, 4 ].map( i => {
					const imageURL = attributes[ `imageURL${ i }` ]
					const imageID = attributes[ `imageID${ i }` ]
					const title = attributes[ `title${ i }` ]
					const description = attributes[ `description${ i }` ]
					const link = attributes[ `link${ i }` ]
					const newTab = attributes[ `newTab${ i }` ]

					const boxStyles = {
						backgroundImage: imageURL ? `url(${ imageURL })` : undefined,
						maxWidth: align !== 'wide' && align !== 'full' && columns === 1 ? width : undefined,
						height: height,
						textAlign: horizontalAlign,
						justifyContent: verticalAlign,
						borderRadius: borderRadius,
					}

					const boxClasses = classnames( [
						'ugb-image-box__item',
					], applyFilters( 'stackable.image-box.itemclasses', {
						[ `ugb--shadow-${ shadow }` ]: shadow !== 3,
					}, design, i, props ) )

					const arrowClasses = classnames( [
						'ugb-image-box__arrow',
						`ugb-image-box__arrow--align-${ arrow }`,
					] )

					return (
						<div className="ugb-image-box__editor-wrapper" key={ i }>
							<div className={ boxClasses } style={ boxStyles }>
								<ImageUploadPlaceholder
									imageID={ imageID }
									imageURL={ imageURL }
									onRemove={ () => {
										setAttributes( { [ `imageURL${ i }` ]: '', [ `imageID${ i }` ]: '' } )
									} }
									onChange={ ( { url, id } ) => {
										setAttributes( { [ `imageURL${ i }` ]: url, [ `imageID${ i }` ]: id } )
									} }
									render={ null }
								/>
								{ imageURL && (
									<a // eslint-disable-line
										href={ link }
										className="ugb-image-box__overlay"
									/>
								) }
								<div className="ugb-image-box__content">
									{ imageURL && (
										<RichText
											tagName="h4"
											className="ugb-image-box__title"
											value={ title }
											onChange={ title => setAttributes( { [ `title${ i }` ]: title } ) }
											style={ {
												color: titleColor,
											} }
											placeholder={ __( 'Title', i18n ) }
											keepPlaceholderOnFocus
										/>
									) }
									{ imageURL && (
										<RichText
											tagName="p"
											className="ugb-image-box__description"
											value={ description }
											onChange={ description => setAttributes( { [ `description${ i }` ]: description } ) }
											style={ {
												color: subtitleColor,
											} }
											placeholder={ __( 'Description', i18n ) }
											keepPlaceholderOnFocus
										/>
									) }
								</div>
								{ arrow && (
									<div className={ arrowClasses }>
										<SVGArrow style={ { fill: titleColor ? titleColor : undefined } } />
									</div>
								) }
							</div>
							{ isSelected && (
								<URLInputControl
									value={ link }
									newTab={ newTab }
									onChange={ link => {
										setAttributes( { [ `link${ i }` ]: link } )
									} }
									onChangeNewTab={ newTab => {
										setAttributes( { [ `newTab${ i }` ]: newTab } )
									} }
								/>
							) }
						</div>
					)
				} ) }
				{ applyFilters( 'stackable.image-box.edit.output.after', null, design, props ) }
			</div>
		</Fragment>
	)
}

export default edit
