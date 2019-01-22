import {
	AlignmentToolbar, BlockControls, InspectorControls, PanelColorSettings, RichText,
} from '@wordpress/editor'
import {
	DesignPanelBody, ImageUploadPlaceholder, ProControl, URLInputControl, VerticalAlignmentToolbar,
} from '@stackable/components'
import {
	PanelBody, RangeControl,
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import classnames from 'classnames'
import { Fragment } from '@wordpress/element'
import { showProNotice } from 'stackable'

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
	} = attributes

	const mainClasses = classnames( [
		className,
		'ugb-image-box',
		'ugb-image-box--v3',
		`ugb-image-box--columns-${ columns }`,
	] )

	const mainStyles = {
		textAlign: horizontalAlign ? horizontalAlign : undefined,
		'--overlay-color': overlayColor,
	}

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
					{ applyFilters( 'stackable.image-box.edit.designs.before', null, props ) }
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
					{ applyFilters( 'stackable.image-box.edit.designs.after', null, props ) }
					{ showProNotice && <ProControl size="small" /> }
				</DesignPanelBody>
				<PanelBody title={ __( 'General Settings' ) }>
					<RangeControl
						label={ __( 'Columns' ) }
						value={ columns }
						onChange={ columns => setAttributes( { columns } ) }
						min={ 1 }
						max={ 4 }
					/>
					<RangeControl
						label={ __( 'Height' ) }
						value={ height }
						min="135"
						max="700"
						onChange={ height => setAttributes( { height: height } ) }
					/>
					{ ( align !== 'wide' && align !== 'full' && columns === 1 ) && (
						<RangeControl
							label={ __( 'Width' ) }
							value={ width }
							min="400"
							max="999"
							help={ __( 'Only available for single column & if centered' ) }
							onChange={ width => setAttributes( { width: width } ) }
						/>
					) }
				</PanelBody>
				<PanelColorSettings
					title={ __( 'Color Settings' ) }
					initialOpen={ true }
					colorSettings={ [
						{
							value: overlayColor,
							onChange: colorValue => setAttributes( { overlayColor: colorValue } ),
							label: __( 'Overlay Color' ),
						},
						{
							value: titleColor,
							onChange: colorValue => setAttributes( { titleColor: colorValue } ),
							label: __( 'Title Color' ),
						},
						{
							value: subtitleColor,
							onChange: colorValue => setAttributes( { subtitleColor: colorValue } ),
							label: __( 'Subtitle Color' ),
						},
					] }
				>
				</PanelColorSettings>
			</InspectorControls>
			<div className={ mainClasses } style={ mainStyles }>
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
					], {
						[ `ugb--shadow-${ shadow }` ]: shadow !== 3,
					} )

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
											placeholder={ __( 'Title' ) }
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
											placeholder={ __( 'Description' ) }
											keepPlaceholderOnFocus
										/>
									) }
								</div>
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
			</div>
		</Fragment>
	)
}

export default edit
