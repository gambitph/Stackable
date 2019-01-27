import {
	ButtonEdit, DesignPanelBody, ImageUploadPlaceholder, PanelButtonSettings, ProControl, URLInputControl,
} from '@stackable/components'
import {
	InspectorControls, RichText,
} from '@wordpress/editor'
import {
	PanelBody, RangeControl,
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
		isSelected,
		className,
		setAttributes,
	} = props

	const { attributes } = props

	const {
		columns,
		imageSize,
		design,
		buttonColor,
		buttonTextColor,
		buttonSize,
		buttonBorderRadius,
		buttonDesign = 'link',
		buttonIcon,
		borderRadius = 12,
		shadow = 3,
	} = attributes

	const mainClasses = classnames( [
		className,
		'ugb-feature-grid',
		`ugb-feature-grid--columns-${ columns }`,
	], {
		[ `ugb-feature-grid--design-${ design }` ]: design && design !== 'basic',
	} )

	const itemClasses = classnames( [
		'ugb-feature-grid__item',
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
							label: __( 'Basic' ), value: 'basic', image: ImageDesignBasic,
						},
						{
							label: __( 'Plain' ), value: 'plain', image: ImageDesignPlain,
						},
						...applyFilters( 'stackable.feature-grid.edit.designs', [] ),
					] }
					onChange={ design => {
						setAttributes( { design } )
					} }
				>
					{ applyFilters( 'stackable.feature-grid.edit.designs.before', null, props ) }
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
					{ applyFilters( 'stackable.feature-grid.edit.designs.after', null, props ) }
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
					<RangeControl
						label={ __( 'Image Size %' ) }
						value={ imageSize }
						onChange={ imageSize => setAttributes( { imageSize } ) }
						min={ 0 }
						max={ 100 }
					/>
				</PanelBody>
				<PanelButtonSettings
					initialOpen={ false }
					buttonColor={ buttonColor }
					buttonTextColor={ buttonTextColor }
					buttonSize={ buttonSize }
					buttonBorderRadius={ buttonBorderRadius }
					buttonDesign={ buttonDesign }
					buttonIcon={ buttonIcon }
					onChangeButtonColor={ value => setAttributes( { buttonColor: value } ) }
					onChangeButtonTextColor={ value => setAttributes( { buttonTextColor: value } ) }
					onChangeButtonSize={ value => {
						setAttributes( { buttonSize: value } )
					} }
					onChangeButtonBorderRadius={ value => setAttributes( { buttonBorderRadius: value } ) }
					onChangeButtonDesign={ buttonDesign => setAttributes( { buttonDesign } ) }
					onChangeButtonIcon={ buttonIcon => setAttributes( { buttonIcon } ) }
				/>
			</InspectorControls>
			<div className={ mainClasses }>
				{ [ 1, 2, 3 ].map( i => {
					const imageUrl = attributes[ `imageUrl${ i }` ]
					const imageID = attributes[ `imageID${ i }` ]
					const title = attributes[ `title${ i }` ]
					const description = attributes[ `description${ i }` ]
					const linkUrl = attributes[ `linkUrl${ i }` ]
					const newTab = attributes[ `newTab${ i }` ]
					const linkText = attributes[ `linkText${ i }` ]
					return (
						<div key={ i }>
							<div className={ itemClasses } style={ itemStyle }>
								<div className="ugb-feature-grid__image">
									<ImageUploadPlaceholder
										imageID={ imageID }
										imageURL={ imageUrl }
										onRemove={ () => {
											setAttributes( { [ `imageUrl${ i }` ]: '', [ `imageID${ i }` ]: '' } )
										} }
										onChange={ ( { url, id } ) => {
											setAttributes( { [ `imageUrl${ i }` ]: url, [ `imageID${ i }` ]: id } )
										} }
										render={ <img src={ imageUrl } alt={ title } /> }
										style={ {
											width: imageID ? `${ imageSize }%` : undefined,
										} }
									/>
								</div>
								<div className="ugb-feature-grid__content">
									<RichText
										tagName="h5"
										className="ugb-feature-grid__title"
										value={ title }
										onChange={ title => setAttributes( { [ `title${ i }` ]: title } ) }
										placeholder={ __( 'Title' ) }
										keepPlaceholderOnFocus
									/>
									<RichText
										tagName="p"
										className="ugb-feature-grid__description"
										value={ description }
										onChange={ description => setAttributes( { [ `description${ i }` ]: description } ) }
										placeholder={ descriptionPlaceholder( 'short' ) }
										keepPlaceholderOnFocus
									/>
									<ButtonEdit
										size={ buttonSize }
										// align={ contentAlign }
										color={ buttonTextColor }
										backgroundColor={ buttonColor }
										text={ linkText }
										borderRadius={ buttonBorderRadius }
										design={ buttonDesign }
										icon={ buttonIcon }
										onChange={ linkText => setAttributes( { [ `linkText${ i }` ]: linkText } ) }
									/>
								</div>
							</div>
							{
								isSelected && (
									<URLInputControl
										value={ linkUrl }
										newTab={ newTab }
										onChange={ url => setAttributes( { [ `linkUrl${ i }` ]: url } ) }
										onChangeNewTab={ newTab => setAttributes( { [ `newTab${ i }` ]: newTab } ) }
									/>
								)
							}
						</div>
					)
				} ) }
			</div>
		</Fragment>
	)
}

export default edit
