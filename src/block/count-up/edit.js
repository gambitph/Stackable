/**
 * External dependencies
 */
import {
	AdvancedRangeControl,
	AlignButtonsControl,
	BackgroundControlsHelper,
	BlockContainer,
	ColorPaletteControl,
	ContentAlignControl,
	DesignPanelBody,
	HeadingButtonsControl,
	IconControl,
	PanelAdvancedSettings,
	PanelSpacingBody,
	ProControlButton,
	ResponsiveControl,
	TypographyControlHelper,
	SvgIconPlaceholder,
	DivBackground,
} from '~stackable/components'
import {
	createResponsiveAttributeNames,
	createTypographyAttributeNames,
} from '~stackable/util'
import {
	withBlockStyles,
	withContentAlignReseter,
	withGoogleFont,
	withSetAttributeHook,
	withTabbedInspector,
	withUniqueClass,
} from '~stackable/higher-order'

/**
 * Internal dependencies
 */
import createStyles from './style'
import ImageDesignPlain from './images/plain.png'
import ImageDesignPlain2 from './images/plain-2.png'
import { showOptions } from './util'

/**
 * WordPress dependencies
 */
import {
	__, _x, sprintf,
} from '@wordpress/i18n'
import { addFilter, applyFilters } from '@wordpress/hooks'
import { i18n, showProNotice } from 'stackable'
import {
	PanelBody, RangeControl,
} from '@wordpress/components'
import classnames from 'classnames'
import { compose } from '@wordpress/compose'
import { Fragment } from '@wordpress/element'
import { range } from 'lodash'
import { RichText } from '@wordpress/block-editor'

addFilter( 'stackable.count-up.edit.inspector.layout.before', 'stackable/count-up', ( output, props ) => {
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
				options={ applyFilters( 'stackable.count-up.edit.layouts', [
					{
						label: __( 'Plain', i18n ), value: 'plain', image: ImageDesignPlain,
					},
					{
						label: sprintf( _x( '%s %d', 'Nth Title', i18n ), __( 'Plain', i18n ), 2 ), value: 'plain-2', image: ImageDesignPlain2,
					},
				] ) }
				onChange={ design => setAttributes( { design } ) }
			>
				{ showProNotice && <ProControlButton /> }
			</DesignPanelBody>
		</Fragment>
	)
} )

addFilter( 'stackable.count-up.edit.inspector.style.before', 'stackable/count-up', ( output, props ) => {
	const { setAttributes } = props
	const {
		columns,
		borderRadius = '',
		shadow = '',
		showNumber = true,
		showTitle = true,
		showDescription = true,
		showIcon = false,
		numberColor = '',
		titleTag = '',
		titleColor = '',
		descriptionColor = '',
		iconColor = '',
	} = props.attributes

	const show = showOptions( props )

	return (
		<Fragment>
			{ output }
			<PanelBody title={ __( 'General', i18n ) }>
				<RangeControl
					label={ __( 'Columns', i18n ) }
					value={ columns }
					onChange={ columns => setAttributes( { columns } ) }
					min={ 1 }
					max={ 4 }
				/>
				{ show.columnBackground &&
					<AdvancedRangeControl
						label={ __( 'Border Radius', i18n ) }
						value={ borderRadius }
						onChange={ borderRadius => setAttributes( { borderRadius } ) }
						min={ 0 }
						max={ 50 }
						allowReset={ true }
						placeholder="12"
					/>
				}
				{ show.columnBackground &&
					<AdvancedRangeControl
						label={ __( 'Shadow / Outline', i18n ) }
						value={ shadow }
						onChange={ shadow => setAttributes( { shadow } ) }
						min={ 0 }
						max={ 9 }
						allowReset={ true }
						placeholder="3"
					/>
				}
				<ContentAlignControl
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				/>
			</PanelBody>

			{ show.columnBackground &&
				<PanelBody
					title={ __( 'Column Background', i18n ) }
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
				title={ __( 'Icon', i18n ) }
				checked={ showIcon }
				onChange={ showIcon => setAttributes( { showIcon } ) }
				toggleOnSetAttributes={ [
					'icon1',
					'icon2',
					'icon3',
					'icon4',
					'iconColor',
					...createResponsiveAttributeNames( 'icon%sSize' ),
					...createResponsiveAttributeNames( 'icon%sAlign' ),
				] }
				toggleAttributeName="showIcon"
			>
				{ range( 1, columns + 1 ).map( i => {
					return (
						<IconControl
							key={ i }
							label={ sprintf( _x( '%s #%d', 'Panel title', i18n ), __( 'Icon', i18n ), i ) }
							value={ props.attributes[ `icon${ i }` ] }
							onChange={ value => setAttributes( { [ `icon${ i }` ]: value } ) }
						/>
					)
				} ) }
				<ColorPaletteControl
					value={ iconColor }
					onChange={ iconColor => setAttributes( { iconColor } ) }
					label={ __( 'Icon Color', i18n ) }
				/>
				<ResponsiveControl
					attrNameTemplate="icon%sSize"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AdvancedRangeControl
						label={ __( 'Icon Size', i18n ) }
						min={ 10 }
						max={ 200 }
						allowReset={ true }
						placeholder="50"
					/>
				</ResponsiveControl>
				<ResponsiveControl
					attrNameTemplate="Icon%sAlign"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AlignButtonsControl label={ __( 'Align', i18n ) } />
				</ResponsiveControl>
			</PanelAdvancedSettings>

			<PanelAdvancedSettings
				title={ __( 'Title', i18n ) }
				checked={ showTitle }
				onChange={ showTitle => setAttributes( { showTitle } ) }
				toggleOnSetAttributes={ [
					...createTypographyAttributeNames( 'title%s' ),
					'titleTag',
					'titleColor',
					...createResponsiveAttributeNames( 'Title%sAlign' ),
				] }
				toggleAttributeName="showTitle"
			>
				<TypographyControlHelper
					attrNameTemplate="title%s"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				/>
				<HeadingButtonsControl
					value={ titleTag || 'h4' }
					onChange={ titleTag => setAttributes( { titleTag } ) }
				/>
				<ColorPaletteControl
					value={ titleColor }
					onChange={ titleColor => setAttributes( { titleColor } ) }
					label={ __( 'Title Color', i18n ) }
				/>
				<ResponsiveControl
					attrNameTemplate="Title%sAlign"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AlignButtonsControl label={ __( 'Align', i18n ) } />
				</ResponsiveControl>
			</PanelAdvancedSettings>

			<PanelAdvancedSettings
				title={ __( 'Number', i18n ) }
				checked={ showNumber }
				onChange={ showNumber => setAttributes( { showNumber } ) }
				toggleOnSetAttributes={ [
					...createTypographyAttributeNames( 'number%s' ),
					'numberColor',
					...createResponsiveAttributeNames( 'Number%sAlign' ),
				] }
				toggleAttributeName="showNumber"
			>
				<TypographyControlHelper
					attrNameTemplate="number%s"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
					fontSizeProps={ {
						max: [ 150, 10 ],
					} }
				/>
				<ColorPaletteControl
					value={ numberColor }
					onChange={ numberColor => setAttributes( { numberColor } ) }
					label={ __( 'Number Color', i18n ) }
				/>
				<ResponsiveControl
					attrNameTemplate="Number%sAlign"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AlignButtonsControl label={ __( 'Align', i18n ) } />
				</ResponsiveControl>
			</PanelAdvancedSettings>

			<PanelAdvancedSettings
				title={ __( 'Description', i18n ) }
				checked={ showDescription }
				onChange={ showDescription => setAttributes( { showDescription } ) }
				toggleOnSetAttributes={ [
					...createTypographyAttributeNames( 'description%s' ),
					'descriptionColor',
					...createResponsiveAttributeNames( 'description%sAlign' ),
				] }
				toggleAttributeName="showDescription"
			>
				<TypographyControlHelper
					attrNameTemplate="description%s"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				/>
				<ColorPaletteControl
					value={ descriptionColor }
					onChange={ descriptionColor => setAttributes( { descriptionColor } ) }
					label={ __( 'Description Color', i18n ) }
				/>
				<ResponsiveControl
					attrNameTemplate="description%sAlign"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AlignButtonsControl label={ __( 'Align', i18n ) } />
				</ResponsiveControl>
			</PanelAdvancedSettings>

			<PanelSpacingBody initialOpen={ false } blockProps={ props }>
				{ showIcon && (
					<ResponsiveControl
						attrNameTemplate="icon%sBottomMargin"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					>
						<AdvancedRangeControl
							label={ __( 'Icon', i18n ) }
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
							label={ __( 'Title', i18n ) }
							min={ -50 }
							max={ 100 }
							allowReset={ true }
						/>
					</ResponsiveControl>
				) }
				{ showNumber && (
					<ResponsiveControl
						attrNameTemplate="number%sBottomMargin"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					>
						<AdvancedRangeControl
							label={ __( 'Number', i18n ) }
							min={ -50 }
							max={ 100 }
							allowReset={ true }
						/>
					</ResponsiveControl>
				) }
				{ showDescription && (
					<ResponsiveControl
						attrNameTemplate="description%sBottomMargin"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					>
						<AdvancedRangeControl
							label={ __( 'Description', i18n ) }
							min={ -50 }
							max={ 100 }
							allowReset={ true }
						/>
					</ResponsiveControl>
				) }
			</PanelSpacingBody>
		</Fragment>
	)
} )

const edit = props => {
	const {
		setAttributes, className, attributes,
	} = props
	const {
		columns,
		design = 'plain',
		titleTag = '',
		showIcon = false,
		showNumber = true,
		showTitle = true,
		showDescription = true,
	} = attributes

	const mainClasses = classnames( [
		className,
		'ugb-countup--v4', // For backward compatibility.
		`ugb-countup--columns-${ columns }`,
	], applyFilters( 'stackable.count-up.mainclasses', {
		[ `ugb-countup--design-${ design }` ]: design !== 'plain',
	}, design, props ) )

	const show = showOptions( props )

	return (
		<BlockContainer.Edit className={ mainClasses } blockProps={ props } render={ () => (
			<Fragment>
				{ range( 1, columns + 1 ).map( i => {
					const icon = attributes[ `icon${ i }` ]
					const title = attributes[ `title${ i }` ]
					const description = attributes[ `description${ i }` ]
					const countText = attributes[ `countText${ i }` ]

					const iconComp = showIcon && <div className="ugb-countup__icon">
						<SvgIconPlaceholder
							value={ icon }
							onChange={ value => setAttributes( { [ `icon${ i }` ]: value } ) }
						/>
					</div>
					const titleComp = showTitle && <RichText
						tagName={ titleTag || 'h4' }
						className="ugb-countup__title"
						value={ title }
						placeholder={ __( 'Title', i18n ) }
						onChange={ value => setAttributes( { [ `title${ i }` ]: value } ) }
						keepPlaceholderOnFocus
					/>
					const countComp = showNumber && <RichText
						tagName="div"
						className="ugb-countup__counter"
						placeholder="1,234"
						data-duration="1000"
						data-delay="16"
						value={ countText }
						onChange={ value => setAttributes( { [ `countText${ i }` ]: value } ) }
						keepPlaceholderOnFocus
					/>
					const descriptionComp = showDescription && <RichText
						tagName="p"
						className="ugb-countup__description"
						placeholder={ __( 'Description', i18n ) }
						value={ description }
						onChange={ value => setAttributes( { [ `description${ i }` ]: value } ) }
						keepPlaceholderOnFocus
					/>
					const comps = {
						i,
						iconComp,
						titleComp,
						countComp,
						descriptionComp,
					}

					const boxClasses = classnames( [
						'ugb-countup__item',
						`ugb-countup__item${ i }`,
					], applyFilters( 'stackable.count-up.boxclasses', {}, design, props ) )

					return (
						<DivBackground
							className={ boxClasses }
							backgroundAttrName="column%s"
							blockProps={ props }
							showBackground={ show.columnBackground }
							key={ i }
						>
							{ applyFilters( 'stackable.count-up.save.output', (
								<Fragment>
									{ iconComp }
									{ design === 'plain-2' && countComp }
									{ titleComp }
									{ design !== 'plain-2' && countComp }
									{ descriptionComp }
								</Fragment>
							), comps, i, props ) }
						</DivBackground>
					)
				} ) }
			</Fragment>
		) } />
	)
}

export default compose(
	withUniqueClass,
	withSetAttributeHook,
	withGoogleFont,
	withTabbedInspector(),
	withContentAlignReseter( [ 'Icon%sAlign', 'Number%sAlign', 'Title%sAlign', 'Description%sAlign' ] ),
	withBlockStyles( createStyles, { editorMode: true } ),
)( edit )
