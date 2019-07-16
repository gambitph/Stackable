import {
	ColorPaletteControl,
	DesignPanelBody,
	ImageUploadPlaceholder,
	ProControl,
	ProControlButton,
} from '@stackable/components'
import { i18n, showProNotice } from 'stackable'
import {
	InspectorControls, PanelColorSettings, RichText,
} from '@wordpress/block-editor'
import { PanelBody, RangeControl, ToggleControl } from '@wordpress/components'
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
		backgroundColor = '',
		serif = false,
	} = attributes

	const mainClasses = classnames( [
		className,
		'ugb-testimonial',
		'ugb-testimonial--v2',
		`ugb-testimonial--columns-${ columns }`,
		`ugb-testimonial--design-${ design }`,
	], applyFilters( 'stackable.testimonial.mainclasses', {
		'ugb-testimonial--serif': serif,
	}, design, props ) )

	const itemClasses = classnames( [
		'ugb-testimonial__item',
	], applyFilters( 'stackable.testimonial.itemclasses', {
		[ `ugb--shadow-${ shadow }` ]: design !== 'plain' && shadow !== 3,
	}, design, props ) )

	const styles = applyFilters( 'stackable.testimonial.styles', {
		item: {
			borderRadius: design !== 'plain' && borderRadius !== 12 ? borderRadius : undefined,
			backgroundColor: design !== 'plain' && backgroundColor ? backgroundColor : undefined,
		},
		bodyWrapper: {},
		body: {
			color: bodyTextColor ? bodyTextColor : undefined,
		},
	}, design, props )

	const show = applyFilters( 'stackable.testimonial.show', {
		backgroundColor: design === 'basic',
	}, design, props )

	return (
		<Fragment>
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
						...applyFilters( 'stackable.testimonial.edit.designs', [] ),
					] }
					onChange={ design => {
						setAttributes( { design } )
					} }
				>
					{ show.backgroundColor &&
						<ColorPaletteControl
							label={ __( 'Background Color', i18n ) }
							value={ backgroundColor }
							onChange={ backgroundColor => setAttributes( { backgroundColor } ) }
						/>
					}
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
					{ showProNotice && <ProControlButton /> }
				</DesignPanelBody>
				<PanelBody title={ __( 'General Settings', i18n ) }>
					<RangeControl
						label={ __( 'Columns', i18n ) }
						value={ columns }
						onChange={ columns => setAttributes( { columns } ) }
						min={ 1 }
						max={ 3 }
					/>
					<ToggleControl
						label={ __( 'Serif Font', i18n ) }
						checked={ serif }
						onChange={ serif => setAttributes( { serif } ) }
					/>
				</PanelBody>
				<PanelColorSettings
					initialOpen={ true }
					title={ __( 'Color Settings', i18n ) }
					colorSettings={ [
						{
							value: bodyTextColor,
							onChange: colorValue => setAttributes( { bodyTextColor: colorValue } ),
							label: __( 'Body Text Color', i18n ),
						},
						{
							value: titleColor,
							onChange: colorValue => setAttributes( { titleColor: colorValue } ),
							label: __( 'Title Color', i18n ),
						},
						{
							value: posColor,
							onChange: colorValue => setAttributes( { posColor: colorValue } ),
							label: __( 'Position Color', i18n ),
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
				{ applyFilters( 'stackable.testimonial.edit.inspector.after', null, design, props ) }
			</InspectorControls>
			<div className={ mainClasses }>
				{ applyFilters( 'stackable.testimonial.edit.output.before', null, design, props ) }
				{ [ 1, 2, 3 ].map( i => {
					const mediaURL = attributes[ `mediaURL${ i }` ]
					const mediaID = attributes[ `mediaID${ i }` ]
					const name = attributes[ `name${ i }` ]
					const position = attributes[ `position${ i }` ]
					const testimonial = attributes[ `testimonial${ i }` ]

					const bodyClasses = classnames( [
						'ugb-testimonial__body-wrapper',
					], applyFilters( 'stackable.testimonial.bodyclasses', {}, design, props ) )

					return (
						<div className={ itemClasses } style={ styles.item } key={ i }>
							<div className={ bodyClasses } style={ styles.bodyWrapper }>
								<RichText
									tagName="p"
									className="ugb-testimonial__body"
									value={ testimonial }
									onChange={ testimonial => setAttributes( { [ `testimonial${ i }` ]: testimonial } ) }
									style={ styles.body }
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
								/>
								<RichText
									tagName="h4"
									className="ugb-testimonial__name"
									value={ name }
									onChange={ name => setAttributes( { [ `name${ i }` ]: name } ) }
									style={ {
										color: titleColor,
									} }
									placeholder={ __( 'Name', i18n ) }
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
									placeholder={ __( 'Position', i18n ) }
									keepPlaceholderOnFocus
								/>
							</div>
						</div>
					)
				} ) }
				{ applyFilters( 'stackable.testimonial.edit.output.after', null, design, props ) }
			</div>
		</Fragment>
	)
}

export default edit
