import { __, sprintf } from '@wordpress/i18n'
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
	ProControlButton,
	ResponsiveControl,
	TypographyControlHelper,
} from '@stackable/components'
import { AlignmentToolbar, BlockControls, RichText } from '@wordpress/editor'
import { descriptionPlaceholder, getAttrName, hasBackgroundOverlay, range } from '@stackable/util'
import { PanelBody, RangeControl, SelectControl, TextControl } from '@wordpress/components'
import { withBlockStyles, withGoogleFont, withTabbedInspector, withUniqueClass } from '@stackable/higher-order'
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
		numberStyle = '',
		num1 = '',
		num2 = '',
		num3 = '',
		numberOpacity = '',
	} = props.attributes

	const show = applyFilters( 'stackable.number-box.edit.show', {
		spacingNumber: true,
		backgroundColor: design !== 'plain',
		borderRadius: design !== 'plain',
		shadow: design !== 'plain',
		numberColor: true,
		numberBGColor: ( design === 'basic' || design === 'plain' ) && numberStyle !== 'none',
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
					onChange={ ( attributeName, value, screen ) => {
						setAttributes( {
							[ attributeName ]: value,
							// Reset the other alignment options.
							[ getAttrName( 'Number%sAlign', screen ) ]: undefined,
							[ getAttrName( 'Title%sAlign', screen ) ]: undefined,
							[ getAttrName( 'Description%sAlign', screen ) ]: undefined,
						} )
					} }
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

			<PanelBody title={ __( 'Spacing' ) } initialOpen={ false }>
				{ show.spacingNumber && showNumber && (
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

			<PanelAdvancedSettings
				title={ __( 'Number' ) }
				checked={ showNumber }
				onChange={ showNumber => setAttributes( { showNumber } ) }
			>
				<TextControl
					label={ __( 'Number 1 Label' ) }
					value={ num1 }
					onChange={ num1 => setAttributes( { num1 } ) }
				/>
				<TextControl
					label={ __( 'Number 2 Label' ) }
					value={ num2 }
					onChange={ num2 => setAttributes( { num2 } ) }
				/>
				<TextControl
					label={ __( 'Number 3 Label' ) }
					value={ num3 }
					onChange={ num3 => setAttributes( { num3 } ) }
				/>
				<TypographyControlHelper
					attrNameTemplate="number%s"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
					fontSizeProps={ {
						max: design === 'basic' || design === 'plain' ? [ 150, 7 ] : [ 500, 15 ],
					} }
				/>
				{ show.numberStyle && (
					<SelectControl
						label={ __( 'Number Shape' ) }
						options={ [
							{ label: __( 'None' ), value: 'none' },
							{ label: __( 'Circle' ), value: '' },
							{ label: __( 'Square' ), value: 'square' },
						] }
						value={ numberStyle }
						onChange={ numberStyle => setAttributes( { numberStyle } ) }
					/>
				) }
				{ show.numberBGColor && (
					<ResponsiveControl
						attrNameTemplate="number%sPadding"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					>
						<AdvancedRangeControl
							label={ __( 'Shape Size' ) }
							min={ 0 }
							max={ 5 }
							step={ 0.1 }
							allowReset={ true }
						/>
					</ResponsiveControl>
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
				<AdvancedRangeControl
					label={ __( 'Opacity' ) }
					min={ 0.1 }
					max={ 1.0 }
					step={ 0.1 }
					value={ numberOpacity }
					onChange={ numberOpacity => setAttributes( { numberOpacity } ) }
				/>
				<ResponsiveControl
					attrNameTemplate="Number%sAlign"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AlignButtonsControl label={ __( 'Align' ) } />
				</ResponsiveControl>
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
				<ResponsiveControl
					attrNameTemplate="Title%sAlign"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AlignButtonsControl label={ __( 'Align' ) } />
				</ResponsiveControl>
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
				<ResponsiveControl
					attrNameTemplate="description%sAlign"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AlignButtonsControl label={ __( 'Align' ) } />
				</ResponsiveControl>
			</PanelAdvancedSettings>
		</Fragment>
	)
} )

addFilter( `stackable.number-box.edit.inspector.advanced.before`, `stackable/number-box/column-colors`, ( output, props ) => {
	const { setAttributes } = props
	const {
		columns = 2,
		design = 'basic',
		numberStyle = '',
	} = props.attributes

	const show = applyFilters( 'stackable.number-box.edit.show', {
		backgroundColor: design !== 'plain',
		borderRadius: design !== 'plain',
		shadow: design !== 'plain',
		numberColor: true,
		numberBGColor: ( design === 'basic' || design === 'plain' ) && numberStyle !== 'none',
		numberStyle: true,
		columnBackground: design !== 'plain',
	}, design, props )

	return (
		<Fragment>
			{ output }
			{ [ 1, 2, 3 ].map( ( num, i ) => {
				if ( columns < num ) {
					return null
				}

				const attrName = attrNameTemplate => sprintf( attrNameTemplate, num )

				return (
					<PanelBody
						key={ i }
						initialOpen={ false }
						title={ sprintf( __( 'Column #%s' ), num ) }
					>
						<p className="components-base-control__help">{ __( 'Override settings for this column.' ) }</p>
						{ show.backgroundColor && (
							<ColorPaletteControl
								label={ __( 'Column Background' ) }
								value={ props.attributes[ attrName( 'Column%sBackgroundColor' ) ] }
								onChange={ value => setAttributes( { [ attrName( 'Column%sBackgroundColor' ) ]: value } ) }
							/>
						) }
						{ show.numberBGColor && (
							<ColorPaletteControl
								label={ __( 'Number Background' ) }
								value={ props.attributes[ attrName( 'Column%sNumberBackgroundColor' ) ] }
								onChange={ value => setAttributes( { [ attrName( 'Column%sNumberBackgroundColor' ) ]: value } ) }
							/>
						) }
						{ show.numberColor && (
							<ColorPaletteControl
								label={ __( 'Number Text' ) }
								value={ props.attributes[ attrName( 'Column%sNumberColor' ) ] }
								onChange={ value => setAttributes( { [ attrName( 'Column%sNumberColor' ) ]: value } ) }
							/>
						) }
						<ColorPaletteControl
							label={ __( 'Title' ) }
							value={ props.attributes[ attrName( 'Column%sTitleColor' ) ] }
							onChange={ value => setAttributes( { [ attrName( 'Column%sTitleColor' ) ]: value } ) }
						/>
						<ColorPaletteControl
							label={ __( 'Description' ) }
							value={ props.attributes[ attrName( 'Column%sDescriptionColor' ) ] }
							onChange={ value => setAttributes( { [ attrName( 'Column%sDescriptionColor' ) ]: value } ) }
						/>
					</PanelBody>
				)
			} ) }
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
		numberStyle = '',
		// backgroundColor,
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-number-box',
		'ugb-number-box--v3',
		`ugb-number-box--columns-${ columns }`,
	], applyFilters( 'stackable.number-box.mainclasses', {
		[ `ugb-number-box--design-${ design }` ]: design !== 'basic',
		[ `ugb-number-box--number-style-${ numberStyle }` ]: numberStyle !== '' && ( design === 'basic' || design === 'plain' ),
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
