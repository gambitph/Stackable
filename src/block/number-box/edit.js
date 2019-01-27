import { ColorPaletteControl, DesignPanelBody, ProControl } from '@stackable/components'
import { descriptionPlaceholder, range } from '@stackable/util'
import {
	InspectorControls, PanelColorSettings, RichText,
} from '@wordpress/editor'
import { PanelBody, RangeControl } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import classnames from 'classnames'
import { Fragment } from '@wordpress/element'
import ImageDesignBasic from './images/basic.png'
import ImageDesignPlain from './images/plain.png'
import isDarkColor from 'is-dark-color'
import { showProNotice } from 'stackable'

const edit = props => {
	const {
		className,
		setAttributes,
		attributes,
	} = props

	const {
		columns,
		numberColor,
		titleColor,
		descriptionColor,
		numberBGColor,
		design = 'basic',
		borderRadius = 12,
		shadow = 3,
		backgroundColor,
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-number-box',
		'ugb-number-box--v2',
		`ugb-number-box--columns-${ columns }`,
	], {
		[ `ugb-number-box--design-${ design }` ]: design !== 'basic',
	} )

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
						...applyFilters( 'stackable.number-box.edit.designs', [] ),
					] }
					onChange={ design => {
						setAttributes( { design } )
					} }
				>
					{ applyFilters( 'stackable.number-box.edit.designs.before', null, props ) }
					{ design !== 'plain' &&
						<ColorPaletteControl
							label={ __( 'Background Color' ) }
							value={ backgroundColor }
							onChange={ backgroundColor => setAttributes( { backgroundColor } ) }
						/>
					}
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
					{ applyFilters( 'stackable.number-box.edit.designs.after', null, props ) }
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
					title={ __( 'Color Settings' ) }
					colorSettings={ [
						{
							value: numberColor,
							onChange: colorValue => setAttributes( { numberColor: colorValue } ),
							label: __( 'Number Color' ),
						},
						{
							value: numberBGColor,
							onChange: colorValue => setAttributes( { numberBGColor: colorValue } ),
							label: __( 'Number Background Color' ),
						},
						{
							value: titleColor,
							onChange: colorValue => setAttributes( { titleColor: colorValue } ),
							label: __( 'Title Color' ),
						},
						{
							value: descriptionColor,
							onChange: colorValue => setAttributes( { descriptionColor: colorValue } ),
							label: __( 'Description Color' ),
						},
					] }
				>
				</PanelColorSettings>
			</InspectorControls>
			<div className={ mainClasses }>
				{ range( 1, columns + 1 ).map( i => {
					const num = attributes[ `num${ i }` ]
					const title = attributes[ `title${ i }` ]
					const description = attributes[ `description${ i }` ]

					const boxClasses = classnames( [
						'ugb-number-box__item',
					], {
						[ `ugb--shadow-${ shadow }` ]: design !== 'plain' && shadow !== 3,
					} )

					const boxStyle = {
						borderRadius: design !== 'plain' && borderRadius !== 12 ? borderRadius : undefined,
						backgroundColor: design !== 'plain' && backgroundColor ? backgroundColor : undefined,
					}

					return (
						<div className={ boxClasses } style={ boxStyle } key={ i }>
							<RichText
								tagName="div"
								className="ugb-number-box__number"
								value={ num }
								onChange={ value => setAttributes( { [ `num${ i }` ]: value } ) }
								style={ {
									backgroundColor: numberBGColor,
									color: numberColor ? numberColor :
										   ! numberBGColor ? undefined :
										   isDarkColor( numberBGColor ) ? '#ffffff' : '#222222',
								} }
								placeholder={ `0${ i }` }
								keepPlaceholderOnFocus
							/>
							<div className="ugb-number-box__content">
								<RichText
									tagName="h4"
									value={ title }
									className="ugb-number-box__title"
									onChange={ value => setAttributes( { [ `title${ i }` ]: value } ) }
									style={ {
										color: titleColor ? titleColor :
											   design === 'plain' ? undefined :
											   ! backgroundColor ? undefined :
										       isDarkColor( backgroundColor ) ? '#ffffff' : '#222222',
									} }
									placeholder={ __( 'Title' ) }
									keepPlaceholderOnFocus
								/>
								<RichText
									tagName="p"
									value={ description }
									className="ugb-number-box__description"
									onChange={ value => setAttributes( { [ `description${ i }` ]: value } ) }
									style={ {
										color: descriptionColor ? descriptionColor :
											   design === 'plain' ? undefined :
											   ! backgroundColor ? undefined :
										       isDarkColor( backgroundColor ) ? '#ffffff' : '#222222',
									} }
									placeholder={ descriptionPlaceholder() }
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
