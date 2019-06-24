import {
	ColorPaletteControl, DesignPanelBody, ProControl, ProControlButton,
} from '@stackable/components'
import { descriptionPlaceholder, range } from '@stackable/util'
import {
	InspectorControls, PanelColorSettings, RichText,
} from '@wordpress/block-editor'
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
	], applyFilters( 'stackable.number-box.mainclasses', {
		[ `ugb-number-box--design-${ design }` ]: design !== 'basic',
	}, design, props ) )

	const show = applyFilters( 'stackable.number-box.edit.show', {
		backgroundColor: design !== 'plain',
		borderRadius: design !== 'plain',
		shadow: design !== 'plain',
		numberColor: true,
		numberBGColor: true,
	}, design, props )

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
					{ show.backgroundColor &&
						<ColorPaletteControl
							label={ __( 'Background Color' ) }
							value={ backgroundColor }
							onChange={ backgroundColor => setAttributes( { backgroundColor } ) }
						/>
					}
					{ show.borderRadius &&
						<RangeControl
							label={ __( 'Border Radius' ) }
							value={ borderRadius }
							onChange={ borderRadius => setAttributes( { borderRadius } ) }
							min={ 0 }
							max={ 50 }
						/>
					}
					{ show.shadow &&
						<RangeControl
							label={ __( 'Shadow / Outline' ) }
							value={ shadow }
							onChange={ shadow => setAttributes( { shadow } ) }
							min={ 0 }
							max={ 9 }
						/>
					}
					{ showProNotice && <ProControlButton /> }
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
						...( ! show.numberColor ? [] : [
							{
								value: numberColor,
								onChange: colorValue => setAttributes( { numberColor: colorValue } ),
								label: __( 'Number Color' ),
							},
						] ),
						...( ! show.numberBGColor ? [] : [
							{
								value: numberBGColor,
								onChange: colorValue => setAttributes( { numberBGColor: colorValue } ),
								label: __( 'Number Background Color' ),
							},
						] ),
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
				{ applyFilters( 'stackable.number-box.edit.inspector.after', null, design, props ) }
			</InspectorControls>
			<div className={ mainClasses }>
				{ applyFilters( 'stackable.number-box.edit.output.before', null, design, props ) }
				{ range( 1, columns + 1 ).map( i => {
					const num = attributes[ `num${ i }` ]
					const title = attributes[ `title${ i }` ]
					const description = attributes[ `description${ i }` ]

					const boxClasses = classnames( [
						'ugb-number-box__item',
					], applyFilters( 'stackable.number-box.boxclasses', {
						[ `ugb--shadow-${ shadow }` ]: design !== 'plain' && shadow !== 3,
					}, design, props ) )

					const styles = applyFilters( 'stackable.number-box.styles', {
						box: {
							borderRadius: design !== 'plain' && borderRadius !== 12 ? borderRadius : undefined,
							backgroundColor: design !== 'plain' && backgroundColor ? backgroundColor : undefined,
						},
						number: {
							backgroundColor: numberBGColor,
							color: numberColor ? numberColor :
							       ! numberBGColor ? undefined :
							       isDarkColor( numberBGColor ) ? '#ffffff' : '#222222',
						},
						title: {
							color: titleColor ? titleColor :
							       design === 'plain' ? undefined :
							       ! backgroundColor ? undefined :
							       isDarkColor( backgroundColor ) ? '#ffffff' : '#222222',
						},
						description: {
							color: descriptionColor ? descriptionColor :
							       design === 'plain' ? undefined :
							       ! backgroundColor ? undefined :
							       isDarkColor( backgroundColor ) ? '#ffffff' : '#222222',
						},
					}, design, props )

					return (
						<div className={ boxClasses } style={ styles.box } key={ i }>
							<RichText
								tagName="div"
								className="ugb-number-box__number"
								value={ num }
								onChange={ value => setAttributes( { [ `num${ i }` ]: value } ) }
								style={ styles.number }
								placeholder={ `0${ i }` }
								keepPlaceholderOnFocus
							/>
							<div className="ugb-number-box__content">
								<RichText
									tagName="h4"
									value={ title }
									className="ugb-number-box__title"
									onChange={ value => setAttributes( { [ `title${ i }` ]: value } ) }
									style={ styles.title }
									placeholder={ __( 'Title' ) }
									keepPlaceholderOnFocus
								/>
								<RichText
									tagName="p"
									value={ description }
									className="ugb-number-box__description"
									onChange={ value => setAttributes( { [ `description${ i }` ]: value } ) }
									style={ styles.description }
									placeholder={ descriptionPlaceholder() }
									keepPlaceholderOnFocus
								/>
							</div>
						</div>
					)
				} ) }
				{ applyFilters( 'stackable.number-box.edit.output.after', null, design, props ) }
			</div>
		</Fragment>
	)
}

export default edit
