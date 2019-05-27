import { addFilter, applyFilters } from '@wordpress/hooks'
import {
	AdvancedRangeControl,
	AlignButtonsControl,
	BackgroundControlsHelper,
	BlockContainer,
	ColorPaletteControl,
	DesignPanelBody,
	HeadingButtonsControl,
	PanelAdvancedSettings,
	PanelDesignLibrary,
	PanelDesignUserLibrary,
	ProControlButton,
	ResponsiveControl,
	TypographyControlHelper,
} from '@stackable/components'
import { AlignmentToolbar, BlockControls, RichText } from '@wordpress/editor'
import { descriptionPlaceholder, hasBackgroundOverlay, range } from '@stackable/util'
import { PanelBody, RangeControl, SelectControl } from '@wordpress/components'
import { withBlockStyles, withGoogleFont, withTabbedInspector, withUniqueClass } from '@stackable/higher-order'
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
		showNumber = true,
		showTitle = true,
		showDescription = true,
		titleTag = '',
	} = props.attributes

	const show = applyFilters( 'stackable.number-box.edit.show', {
		backgroundColor: design !== 'plain',
		borderRadius: design !== 'plain',
		shadow: design !== 'plain',
		numberColor: true,
		numberBGColor: true,
		numberStyle: true,
		columnBackground: design !== 'plain',
	}, design, props )

	return (
		<Fragment>
			{ output }
			<PanelBody title={ __( 'General' ) }>
				<RangeControl
					label={ __( 'Columns' ) }
					value={ columns }
					onChange={ columns => setAttributes( { columns } ) }
					min={ 1 }
					max={ 3 }
				/>
				{ show.borderRadius &&
					<RangeControl
						label={ __( 'Border Radius' ) }
						value={ borderRadius }
						onChange={ ( borderRadius = 12 ) => setAttributes( { borderRadius } ) }
						min={ 0 }
						max={ 50 }
						allowReset={ true }
					/>
				}
				{ show.shadow &&
					<RangeControl
						label={ __( 'Shadow / Outline' ) }
						value={ shadow }
						onChange={ ( shadow = 3 ) => setAttributes( { shadow } ) }
						min={ 0 }
						max={ 9 }
						allowReset={ true }
					/>
				}
				<ResponsiveControl
					attrNameTemplate="%sContentAlign"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AlignButtonsControl label={ __( 'Align' ) } />
				</ResponsiveControl>
			</PanelBody>

			{ show.columnBackground &&
				<PanelBody
					title={ __( 'Column Background' ) }
					initialOpen={ false }
				>
					<BackgroundControlsHelper
						attrNameTemplate="column%s"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					/>
				</PanelBody>
			}
			<PanelAdvancedSettings
				title={ __( 'Number' ) }
				checked={ showNumber }
				onChange={ showNumber => setAttributes( { showNumber } ) }
			>
				<TypographyControlHelper
					attrNameTemplate="number%s"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
					fontSizeProps={ {
						max: design === 'basic' || design === 'plain' ? [ 100, 7 ] : [ 500, 15 ],
					} }
					onChangeLineHeight={ false }
				/>
				{ show.numberStyle && (
					<SelectControl
						label={ __( 'Number Style' ) }
						options={ [
							{ label: __( 'None' ), value: '' },
							{ label: __( 'Circle' ), value: 'circle' },
							{ label: __( 'Square' ), value: 'square' },
						] }
					/>
				) }
				{ show.numberBGColor && (
					<ColorPaletteControl
						value={ numberBGColor }
						onChange={ numberBGColor => setAttributes( { numberBGColor } ) }
						label={ __( 'Number Background Color' ) }
					/>
				) }
				{ show.numberColor && (
					<ColorPaletteControl
						value={ numberColor }
						onChange={ numberColor => setAttributes( { numberColor } ) }
						label={ __( 'Number Color' ) }
					/>
				) }
				{ show.numberBGColor && (
					<ResponsiveControl
						attrNameTemplate="number%sPadding"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					>
						<AdvancedRangeControl
							label={ __( 'Padding' ) }
							min={ 0 }
							max={ 5 }
							step={ 0.1 }
							allowReset={ true }
						/>
					</ResponsiveControl>
				) }
			</PanelAdvancedSettings>

			<PanelAdvancedSettings
				title={ __( 'Title' ) }
				checked={ showTitle }
				onChange={ showTitle => setAttributes( { showTitle } ) }
			>
				<TypographyControlHelper
					attrNameTemplate="title%s"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				/>
				<HeadingButtonsControl
					label={ __( 'Title HTML Tag' ) }
					value={ titleTag || 'h4' }
					onChange={ titleTag => setAttributes( { titleTag } ) }
				/>
				<ColorPaletteControl
					value={ titleColor }
					onChange={ titleColor => setAttributes( { titleColor } ) }
					label={ __( 'Title Color' ) }
				/>
			</PanelAdvancedSettings>

			<PanelAdvancedSettings
				title={ __( 'Description' ) }
				checked={ showDescription }
				onChange={ showDescription => setAttributes( { showDescription } ) }
			>
				<TypographyControlHelper
					attrNameTemplate="description%s"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				/>
				<ColorPaletteControl
					value={ descriptionColor }
					onChange={ descriptionColor => setAttributes( { descriptionColor } ) }
					label={ __( 'Description Color' ) }
				/>
			</PanelAdvancedSettings>

			<PanelBody title={ __( 'Spacing' ) } initialOpen={ false }>
				{ showNumber && (
					<ResponsiveControl
						attrNameTemplate="number%sBottomMargin"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					>
						<AdvancedRangeControl
							label={ __( 'Number' ) }
							min={ -50 }
							max={ 100 }
							allowReset={ true }
						/>
					</ResponsiveControl>
				) }
				{ showTitle && (
					<ResponsiveControl
						attrNameTemplate="title%sBottomMargin"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					>
						<AdvancedRangeControl
							label={ __( 'Title' ) }
							min={ -50 }
							max={ 100 }
							allowReset={ true }
						/>
					</ResponsiveControl>
				) }
			</PanelBody>
		</Fragment>
	)
} )

addFilter( `stackable.number-box.edit.inspector.advanced.before`, `stackable/number-box/column-colors`, ( output, props ) => {
	const {
		columns = 2,
		design = 'basic',
	} = props.attributes

	const show = applyFilters( 'stackable.number-box.edit.show', {
		backgroundColor: design !== 'plain',
		borderRadius: design !== 'plain',
		shadow: design !== 'plain',
		numberColor: true,
		numberBGColor: true,
		numberStyle: true,
	}, design, props )

	return (
		<Fragment>
			{ output }
			<PanelBody
				initialOpen={ false }
				title={ __( 'Column #1' ) }
			>
				<p className="components-base-control__help">{ __( 'Override settings for this column.' ) }</p>
				{ show.numberBGColor && (
					<ColorPaletteControl
						label={ __( 'Number Background' ) }
					/>
				) }
				{ show.numberColor && (
					<ColorPaletteControl
						label={ __( 'Number Text' ) }
					/>
				) }
				<ColorPaletteControl
					label={ __( 'Title' ) }
				/>
				<ColorPaletteControl
					label={ __( 'Description' ) }
				/>
			</PanelBody>
			{ columns >= 2 && (
				<PanelBody
					initialOpen={ false }
					title={ __( 'Column #2' ) }
				>
					<p className="components-base-control__help">{ __( 'Override settings for this column.' ) }</p>
					{ show.numberBGColor && (
						<ColorPaletteControl
							label={ __( 'Number Background' ) }
						/>
					) }
					{ show.numberColor && (
						<ColorPaletteControl
							label={ __( 'Number Text' ) }
						/>
					) }
					<ColorPaletteControl
						label={ __( 'Title' ) }
					/>
					<ColorPaletteControl
						label={ __( 'Description' ) }
					/>
				</PanelBody>
			) }
			{ columns >= 3 && (
				<PanelBody
					initialOpen={ false }
					title={ __( 'Column #3' ) }
				>
					<p className="components-base-control__help">{ __( 'Override settings for this column.' ) }</p>
					{ show.numberBGColor && (
						<ColorPaletteControl
							label={ __( 'Number Background' ) }
						/>
					) }
					{ show.numberColor && (
						<ColorPaletteControl
							label={ __( 'Number Text' ) }
						/>
					) }
					<ColorPaletteControl
						label={ __( 'Title' ) }
					/>
					<ColorPaletteControl
						label={ __( 'Description' ) }
					/>
				</PanelBody>
			) }
		</Fragment>
	)
} )

addFilter( 'stackable.number-box.edit.inspector.before', 'stackable/number-box/align', ( output, props ) => {
	const { setAttributes } = props
	const {
		contentAlign = '',
	} = props.attributes
	return (
		<Fragment>
			{ output }
			<BlockControls>
				<AlignmentToolbar
					value={ contentAlign }
					onChange={ contentAlign => setAttributes( { contentAlign } ) }
				/>
			</BlockControls>
		</Fragment>
	)
}, 11 )

// TODO: collapse
addFilter( 'stackable.number-box.edit.advanced.responsive.before', 'stackable/number-box/collapse', ( output, props ) => {
	return (
		<Fragment>
			{ output }
			<SelectControl
				label={ __( 'Collapse to 1 Column On' ) }
				value={ 'mobile' }
				options={ [
					{ label: __( 'Do Not Collapse' ), value: 'none' },
					{ label: __( 'Tablet' ), value: 'tablet' },
					{ label: __( 'Mobile' ), value: 'mobile' },
				] }
			/>
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
		titleTag = '',
		// borderRadius = 12,
		shadow = 3,
		showNumber = true,
		showTitle = true,
		showDescription = true,
		// backgroundColor,
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-number-box',
		'ugb-number-box--v3',
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
						'ugb--has-background-overlay': hasBackgroundOverlay( 'column%s', props.attributes ),
					}, design, props ) )

					return (
						<div className={ boxClasses } key={ i }>
							{ showNumber && (
								<RichText
									tagName="div"
									className="ugb-number-box__number"
									value={ num }
									onChange={ value => setAttributes( { [ `num${ i }` ]: value } ) }
									placeholder={ `0${ i }` }
									keepPlaceholderOnFocus
								/>
							) }
							{ ( showTitle || showDescription ) && (
								<div className="ugb-number-box__content">
									{ showTitle && (
										<RichText
											tagName={ titleTag || 'h4' }
											value={ title }
											className="ugb-number-box__title"
											onChange={ value => setAttributes( { [ `title${ i }` ]: value } ) }
											placeholder={ __( 'Title' ) }
											keepPlaceholderOnFocus
										/>
									) }
									{ showDescription && (
										<RichText
											tagName="p"
											value={ description }
											className="ugb-number-box__description"
											onChange={ value => setAttributes( { [ `description${ i }` ]: value } ) }
											placeholder={ descriptionPlaceholder() }
											keepPlaceholderOnFocus
										/>
									) }
								</div>
							) }
						</div>
					)
				} ) }
			</Fragment>
		) } />
	)
}

export default compose(
	withUniqueClass,
	withGoogleFont,
	withTabbedInspector,
	withBlockStyles( createStyles, { editorMode: true } ),
)( edit )
