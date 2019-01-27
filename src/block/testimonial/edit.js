import { DesignPanelBody, ImageUploadPlaceholder, ProControl } from '@stackable/components'
import {
	InspectorControls, PanelColorSettings, RichText,
} from '@wordpress/editor'
import { PanelBody, RangeControl } from '@wordpress/components'
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
		setAttributes,
		attributes,
	} = props

	const {
		columns,
		titleColor,
		posColor,
		bodyTextColor,
		design = 'basic',
		borderRadius = 12,
		shadow = 3,
	} = attributes

	const mainClasses = classnames( [
		className,
		'ugb-testimonial',
		'ugb-testimonial--v2',
		`ugb-testimonial--columns-${ columns }`,
		`ugb-testimonial--design-${ design }`,
	] )

	const itemClasses = classnames( [
		'ugb-testimonial__item',
	], {
		[ `ugb--shadow-${ shadow }` ]: design !== 'plain' && shadow !== 3,
	} )

	const itemStyle = {
		borderRadius: design !== 'plain' && borderRadius !== 12 ? borderRadius : undefined,
	}

	return (
		<Fragment>
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
						...applyFilters( 'stackable.testimonial.edit.designs', [] ),
					] }
					onChange={ design => {
						setAttributes( { design } )
					} }
				>
					{ applyFilters( 'stackable.testimonial.edit.designs.before', null, props ) }
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
					{ applyFilters( 'stackable.testimonial.edit.designs.after', null, props ) }
					{ showProNotice && <ProControl size="small" /> }
				</DesignPanelBody>
				<PanelBody title={ __( 'General Settings' ) }>
					<RangeControl
						label={ __( 'Columns' ) }
						value={ columns }
						onChange={ columns => setAttributes( { columns } ) }
						min={ 1 }
						max={ 3 }
					/>
				</PanelBody>
				<PanelColorSettings
					initialOpen={ true }
					title={ __( 'Color Settings' ) }
					colorSettings={ [
						{
							value: bodyTextColor,
							onChange: colorValue => setAttributes( { bodyTextColor: colorValue } ),
							label: __( 'Body Text Color' ),
						},
						{
							value: titleColor,
							onChange: colorValue => setAttributes( { titleColor: colorValue } ),
							label: __( 'Title Color' ),
						},
						{
							value: posColor,
							onChange: colorValue => setAttributes( { posColor: colorValue } ),
							label: __( 'Position Color' ),
						},
					] }
				>
				</PanelColorSettings>
			</InspectorControls>
			<div className={ mainClasses }>
				{ [ 1, 2, 3 ].map( i => {
					const mediaURL = attributes[ `mediaURL${ i }` ]
					const mediaID = attributes[ `mediaID${ i }` ]
					const name = attributes[ `name${ i }` ]
					const position = attributes[ `position${ i }` ]
					const testimonial = attributes[ `testimonial${ i }` ]
					return (
						<div className={ itemClasses } style={ itemStyle } key={ i }>
							<div className="ugb-testimonial__body-wrapper">
								<RichText
									tagName="p"
									className="ugb-testimonial__body"
									value={ testimonial }
									onChange={ testimonial => setAttributes( { [ `testimonial${ i }` ]: testimonial } ) }
									style={ {
										color: bodyTextColor,
									} }
									placeholder={ descriptionPlaceholder( 'medium' ) }
									keepPlaceholderOnFocus
								/>
							</div>
							<div className="ugb-testimonial__person">
								<ImageUploadPlaceholder
									className="ugb-testimonial__image"
									imageID={ mediaID }
									imageURL={ mediaURL }
									onRemove={ () => {
										setAttributes( { [ `mediaURL${ i }` ]: '', [ `mediaID${ i }` ]: '' } )
									} }
									onChange={ ( { url, id } ) => {
										setAttributes( { [ `mediaURL${ i }` ]: url, [ `mediaID${ i }` ]: id } )
									} }
									hasRemove={ false }
								/>
								<RichText
									tagName="h4"
									className="ugb-testimonial__name"
									value={ name }
									onChange={ name => setAttributes( { [ `name${ i }` ]: name } ) }
									style={ {
										color: titleColor,
									} }
									placeholder={ __( 'Name' ) }
									keepPlaceholderOnFocus
								/>
								<RichText
									tagName="p"
									value={ position }
									className="ugb-testimonial__position"
									onChange={ position => setAttributes( { [ `position${ i }` ]: position } ) }
									style={ {
										color: posColor,
									} }
									placeholder={ __( 'Position' ) }
									keepPlaceholderOnFocus
								/>
							</div>
						</div>
					)
				} ) }
			</div>
		</Fragment>
	)
}

export default edit
