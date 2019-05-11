import { addFilter, applyFilters } from '@wordpress/hooks'
import {
	BlockContainer, ColorPaletteControl, DesignPanelBody, PanelDesignLibrary, PanelDesignUserLibrary, ProControlButton,
} from '@stackable/components'
import { descriptionPlaceholder, range } from '@stackable/util'
import { PanelBody, RangeControl } from '@wordpress/components'
import { PanelColorSettings, RichText } from '@wordpress/editor'
import { withBlockStyles, withTabbedInspector, withUniqueClass } from '@stackable/higher-order'
import { __ } from '@wordpress/i18n'
import classnames from 'classnames'
import { compose } from '@wordpress/compose'
import createStyles from './style'
import { Fragment } from '@wordpress/element'
import ImageDesignBasic from './images/basic.png'
import ImageDesignPlain from './images/plain.png'
import { showProNotice } from 'stackable'

addFilter( 'stackable.number-box.edit.inspector.layout.before', 'stackable/number-box', ( output, props ) => {
	const { setAttributes } = props
	const {
		design = 'basic',
	} = props.attributes

	return (
		<Fragment>
			{ output }
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
				{ showProNotice && <ProControlButton /> }
			</DesignPanelBody>
			<PanelDesignLibrary block={ props.name } />
			<PanelDesignUserLibrary
				initialOpen={ false }
				block={ props.name }
				ignoredAttributes={ [] }
			/>
		</Fragment>
	)
} )

addFilter( 'stackable.number-box.edit.inspector.style.before', 'stackable/number-box', ( output, props ) => {
	const { setAttributes } = props
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

	const show = applyFilters( 'stackable.number-box.edit.show', {
		backgroundColor: design !== 'plain',
		borderRadius: design !== 'plain',
		shadow: design !== 'plain',
		numberColor: true,
		numberBGColor: true,
	}, design, props )

	return (
		<Fragment>
			{ output }
			<PanelBody title={ __( 'General Settings' ) }>
				<RangeControl
					label={ __( 'Columns' ) }
					value={ columns }
					onChange={ columns => setAttributes( { columns } ) }
					min={ 1 }
					max={ 3 }
				/>
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
		</Fragment>
	)
} )

const edit = props => {
	const {
		className,
		setAttributes,
		attributes,
	} = props

	const {
		columns,
		// numberColor,
		// titleColor,
		// descriptionColor,
		// numberBGColor,
		design = 'basic',
		// borderRadius = 12,
		shadow = 3,
		// backgroundColor,
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-number-box',
		'ugb-number-box--v2',
		`ugb-number-box--columns-${ columns }`,
	], applyFilters( 'stackable.number-box.mainclasses', {
		[ `ugb-number-box--design-${ design }` ]: design !== 'basic',
	}, design, props ) )

	return (
		<BlockContainer.Edit className={ mainClasses } blockProps={ props } render={ () => (
			<Fragment>
				{ range( 1, columns + 1 ).map( i => {
					const num = attributes[ `num${ i }` ]
					const title = attributes[ `title${ i }` ]
					const description = attributes[ `description${ i }` ]

					const boxClasses = classnames( [
						'ugb-number-box__item',
						`ugb-number-box__item${ i }`,
					], applyFilters( 'stackable.number-box.boxclasses', {
						[ `ugb--shadow-${ shadow }` ]: design !== 'plain' && shadow !== 3,
					}, design, props ) )

					return (
						<div className={ boxClasses } key={ i }>
							<RichText
								tagName="div"
								className="ugb-number-box__number"
								value={ num }
								onChange={ value => setAttributes( { [ `num${ i }` ]: value } ) }
								placeholder={ `0${ i }` }
								keepPlaceholderOnFocus
							/>
							<div className="ugb-number-box__content">
								<RichText
									tagName="h4"
									value={ title }
									className="ugb-number-box__title"
									onChange={ value => setAttributes( { [ `title${ i }` ]: value } ) }
									placeholder={ __( 'Title' ) }
									keepPlaceholderOnFocus
								/>
								<RichText
									tagName="p"
									value={ description }
									className="ugb-number-box__description"
									onChange={ value => setAttributes( { [ `description${ i }` ]: value } ) }
									placeholder={ descriptionPlaceholder() }
									keepPlaceholderOnFocus
								/>
							</div>
						</div>
					)
				} ) }
			</Fragment>
		) } />
	)
}

export default compose(
	withUniqueClass,
	withTabbedInspector,
	withBlockStyles( createStyles ),
)( edit )
