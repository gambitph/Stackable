import { DesignPanelBody, ImageUploadPlaceholder, ProControl } from '@stackable/components'
import {
	InspectorControls, PanelColorSettings, RichText,
} from '@wordpress/editor'
import {
	PanelBody, RangeControl, SelectControl,
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
		setAttributes,
		attributes,
	} = props

	const {
		columns,
		nameColor,
		posColor,
		desColor,
		shapes,
		design = 'basic',
		borderRadius = 12,
		shadow = 3,
	} = props.attributes

	const shape = [
		{ value: 'square', label: __( 'Square' ) },
		{ value: 'circle', label: __( 'Circle' ) },
	]

	const mainClasses = classnames( [
		className,
		'ugb-team-member',
		'ugb-team-member--v2',
		`ugb-team-member--columns-${ columns }`,
		`ugb-team-member--image-${ shapes }`,
		`ugb-team-member--design-${ design }`,
	] )

	const itemClasses = classnames( [
		'ugb-team-member__item',
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
						...applyFilters( 'stackable.team-member.edit.designs', [] ),
					] }
					onChange={ design => {
						setAttributes( { design } )
					} }
				>
					{ applyFilters( 'stackable.team-member.edit.designs.before', null, props ) }
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
					{ applyFilters( 'stackable.team-member.edit.designs.after', null, props ) }
					{ showProNotice && <ProControl size="small" /> }
				</DesignPanelBody>
				<PanelBody title={ __( 'General Settings' ) }>
					<SelectControl
						label={ __( 'Image Shape' ) }
						value={ shapes }
						options={ shape.map( ( { value, label } ) => ( {
							value: value,
							label: label,
						} ) ) }
						onChange={ newShape => {
							setAttributes( { shapes: newShape } )
						} }
					/>
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
							value: nameColor,
							onChange: colorValue => setAttributes( { nameColor: colorValue } ),
							label: __( 'Name Color' ),
						},
						{
							value: posColor,
							onChange: colorValue => setAttributes( { posColor: colorValue } ),
							label: __( 'Position Color' ),
						},
						{
							value: desColor,
							onChange: colorValue => setAttributes( { desColor: colorValue } ),
							label: __( 'Description Color' ),
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
					const description = attributes[ `description${ i }` ]
					return (
						<div className={ itemClasses } style={ itemStyle } key={ i }>
							<ImageUploadPlaceholder
								className="ugb-team-member__image"
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
							<div className="ugb-team-member__content">
								<RichText
									tagName="h4"
									className="ugb-team-member__name"
									value={ name }
									onChange={ name => setAttributes( { [ `name${ i }` ]: name } ) }
									style={ {
										color: nameColor,
									} }
									placeholder={ __( 'Name' ) }
									keepPlaceholderOnFocus
								/>
								<RichText
									tagName="p"
									value={ position }
									className="ugb-team-member__position"
									onChange={ position => setAttributes( { [ `position${ i }` ]: position } ) }
									style={ {
										color: posColor,
									} }
									placeholder={ __( 'Position' ) }
									keepPlaceholderOnFocus
								/>
								<RichText
									tagName="p"
									value={ description }
									className="ugb-team-member__description"
									onChange={ description => setAttributes( { [ `description${ i }` ]: description } ) }
									style={ {
										color: desColor,
									} }
									placeholder={ descriptionPlaceholder( 'medium' ) }
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
