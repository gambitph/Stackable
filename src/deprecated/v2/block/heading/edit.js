/**
 * Internal dependencies
 */
import createStyles from './style'
import { showOptions } from './util'

/**
 * External dependencies
 */
import {
	BlockContainer,
	AdvancedRangeControl,
	PanelAdvancedSettings,
	TypographyControlHelper,
	HeadingButtonsControl,
	ColorPaletteControl,
	AlignButtonsControl,
	PanelSpacingBody,
} from '~stackable/components'
import { ContentAlignControl, ResponsiveControl } from '../../components'
import {
	withUniqueClass,
	withSetAttributeHook,
	withGoogleFont,
	withTabbedInspector,
	withContentAlignReseter,
	withBlockStyles,
	withClickOpenInspector,
} from '../../higher-order'
import {
	descriptionPlaceholder, createTypographyAttributeNames, createResponsiveAttributeNames,
} from '~stackable/util'
import classnames from 'classnames'

/**
 * WordPress dependencies
 */
import { i18n } from 'stackable'
import { __ } from '@wordpress/i18n'
import { addFilter, applyFilters } from '@wordpress/hooks'
import { Fragment } from '@wordpress/element'
import { compose } from '@wordpress/compose'
import { RichText } from '@wordpress/block-editor'

addFilter( 'stackable.heading.edit.inspector.style.before', 'stackable/heading', ( output, props ) => {
	const { setAttributes } = props
	const {
		titleTag = '',
		titleColor = '',
		showSubtitle = true,
		subtitleColor = '',
		showTopLine = false,
		topLineColor = '',
		topLineHeight = '',
		topLineWidth = '',
		topLineWidthUnit = 'px',
		showBottomLine = false,
		bottomLineColor = '',
		bottomLineHeight = '',
		bottomLineWidth = '',
		bottomLineWidthUnit = 'px',
	} = props.attributes

	const show = showOptions( props )

	return (
		<Fragment>
			{ output }
			<PanelAdvancedSettings
				title={ __( 'General', i18n ) }
				initialOpen={ true }
			>
				<ContentAlignControl
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				/>
			</PanelAdvancedSettings>

			<PanelAdvancedSettings
				title={ __( 'Title', i18n ) }
				id="title"
				hasToggle={ false }
				onChange={ showTitle => setAttributes( { showTitle } ) }
			>
				<HeadingButtonsControl
					value={ titleTag || 'h2' }
					defaultValue="h2"
					onChange={ titleTag => setAttributes( { titleTag } ) }
				/>
				<TypographyControlHelper
					attrNameTemplate="title%s"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
					htmlTag={ titleTag || 'h2' }
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
					<AlignButtonsControl
						label={ __( 'Align', i18n ) }
						className="ugb--help-tip-alignment-title"
					/>
				</ResponsiveControl>
			</PanelAdvancedSettings>

			<PanelAdvancedSettings
				title={ __( 'Subtitle', i18n ) }
				id="subtitle"
				checked={ showSubtitle }
				onChange={ showSubtitle => setAttributes( { showSubtitle } ) }
				toggleOnSetAttributes={ [
					...createTypographyAttributeNames( 'subtitle%s' ),
					'subtitleColor',
					...createResponsiveAttributeNames( 'subtitle%sAlign' ),
				] }
				toggleAttributeName="showSubtitle"
			>
				<TypographyControlHelper
					attrNameTemplate="subtitle%s"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				/>
				<ColorPaletteControl
					value={ subtitleColor }
					onChange={ subtitleColor => setAttributes( { subtitleColor } ) }
					label={ __( 'Subtitle Color', i18n ) }
				/>
				<ResponsiveControl
					attrNameTemplate="subtitle%sAlign"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AlignButtonsControl
						label={ __( 'Align', i18n ) }
						className="ugb--help-tip-alignment-description"
					/>
				</ResponsiveControl>
			</PanelAdvancedSettings>

			<PanelAdvancedSettings
				title={ __( 'Top Line', i18n ) }
				id="topline"
				checked={ showTopLine }
				onChange={ showTopLine => setAttributes( { showTopLine } ) }
				toggleOnSetAttributes={ [
					'topLineColor',
					'topLineHeight',
					'topLineWidth',
					...createResponsiveAttributeNames( 'topLine%sAlign' ),
				] }
				toggleAttributeName="showTopLine"
			>
				<ColorPaletteControl
					value={ topLineColor }
					onChange={ topLineColor => setAttributes( { topLineColor } ) }
					label={ __( 'Line Color', i18n ) }
				/>
				<AdvancedRangeControl
					label={ __( 'Width', i18n ) }
					units={ [ 'px', '%' ] }
					min={ [ 1, 1 ] }
					max={ [ 1000, 100 ] }
					step={ [ 1, 1 ] }
					allowReset={ true }
					value={ topLineWidth }
					unit={ topLineWidthUnit }
					onChange={ topLineWidth => setAttributes( { topLineWidth } ) }
					onChangeUnit={ topLineWidthUnit => setAttributes( { topLineWidthUnit } ) }
					placeholder="100"
				/>
				<AdvancedRangeControl
					label={ __( 'Height', i18n ) }
					min={ 1 }
					max={ 50 }
					allowReset={ true }
					value={ topLineHeight }
					onChange={ topLineHeight => setAttributes( { topLineHeight } ) }
					placeholder="4"
				/>
				<ResponsiveControl
					attrNameTemplate="topLine%sAlign"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AlignButtonsControl
						label={ __( 'Align', i18n ) }
						className="ugb--help-tip-alignment-description"
					/>
				</ResponsiveControl>
			</PanelAdvancedSettings>

			<PanelAdvancedSettings
				title={ __( 'Bottom Line', i18n ) }
				id="bottomline"
				checked={ showBottomLine }
				onChange={ showBottomLine => setAttributes( { showBottomLine } ) }
				toggleOnSetAttributes={ [
					'bottomLineColor',
					'bottomLineHeight',
					'bottomLineWidth',
					...createResponsiveAttributeNames( 'bottomLine%sAlign' ),
				] }
				toggleAttributeName="showBottomLine"
			>
				<ColorPaletteControl
					value={ bottomLineColor }
					onChange={ bottomLineColor => setAttributes( { bottomLineColor } ) }
					label={ __( 'Line Color', i18n ) }
				/>
				<AdvancedRangeControl
					label={ __( 'Width', i18n ) }
					units={ [ 'px', '%' ] }
					min={ [ 1, 1 ] }
					max={ [ 1000, 100 ] }
					step={ [ 1, 1 ] }
					allowReset={ true }
					value={ bottomLineWidth }
					unit={ bottomLineWidthUnit }
					onChange={ bottomLineWidth => setAttributes( { bottomLineWidth } ) }
					onChangeUnit={ bottomLineWidthUnit => setAttributes( { bottomLineWidthUnit } ) }
					placeholder="100"
				/>
				<AdvancedRangeControl
					label={ __( 'Height', i18n ) }
					min={ 1 }
					max={ 50 }
					allowReset={ true }
					value={ bottomLineHeight }
					onChange={ bottomLineHeight => setAttributes( { bottomLineHeight } ) }
					placeholder="4"
				/>
				<ResponsiveControl
					attrNameTemplate="bottomLine%sAlign"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AlignButtonsControl
						label={ __( 'Align', i18n ) }
						className="ugb--help-tip-alignment-description"
					/>
				</ResponsiveControl>
			</PanelAdvancedSettings>

			<PanelSpacingBody initialOpen={ false } blockProps={ props }>
				{ show.topLineSpacing && (
					<ResponsiveControl
						attrNameTemplate="topLine%sBottomMargin"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					>
						<AdvancedRangeControl
							label={ __( 'Top Line', i18n ) }
							min={ -50 }
							max={ 100 }
							placeholder="16"
							allowReset={ true }
							className="ugb--help-tip-spacing"
						/>
					</ResponsiveControl>
				) }
				<ResponsiveControl
					attrNameTemplate="title%sBottomMargin"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AdvancedRangeControl
						label={ __( 'Title', i18n ) }
						min={ -50 }
						max={ 100 }
						placeholder="8"
						allowReset={ true }
						className="ugb--help-tip-spacing-title"
					/>
				</ResponsiveControl>
				{ show.subtitleSpacing && (
					<ResponsiveControl
						attrNameTemplate="subtitle%sBottomMargin"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					>
						<AdvancedRangeControl
							label={ __( 'Subtitle', i18n ) }
							min={ -50 }
							max={ 100 }
							placeholder="16"
							allowReset={ true }
							className="ugb--help-tip-spacing-title"
						/>
					</ResponsiveControl>
				) }
				{ show.bottomLineSpacing && (
					<ResponsiveControl
						attrNameTemplate="bottomLine%sBottomMargin"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					>
						<AdvancedRangeControl
							label={ __( 'Bottom Line', i18n ) }
							min={ 0 }
							max={ 100 }
							placeholder="0"
							allowReset={ true }
							className="ugb--help-tip-spacing"
						/>
					</ResponsiveControl>
				) }
			</PanelSpacingBody>
		</Fragment>
	)
} )

const edit = props => {
	const {
		className,
		setAttributes,
	} = props

	const {
		titleTag = '',
		title = '',
		showSubtitle = '',
		subtitle = '',
		showTopLine = false,
		showBottomLine = false,
	} = props.attributes

	const mainClasses = classnames( [
		className,
	], applyFilters( 'stackable.heading.mainclasses', {
	}, props ) )

	return (
		<BlockContainer.Edit className={ mainClasses } blockProps={ props } render={ () => (
			<Fragment>
				{ showTopLine && <div className="ugb-heading__top-line" /> }
				<RichText
					tagName={ titleTag || 'h2' }
					className="ugb-heading__title"
					value={ title }
					onChange={ title => setAttributes( { title } ) }
					placeholder={ __( 'Title for This Block', i18n ) }
					keepPlaceholderOnFocus
				/>
				{ showSubtitle &&
					<RichText
						tagName="p"
						className="ugb-heading__subtitle"
						value={ subtitle }
						onChange={ subtitle => setAttributes( { subtitle } ) }
						placeholder={ descriptionPlaceholder( 'short' ) }
						keepPlaceholderOnFocus
					/>
				}
				{ showBottomLine && <div className="ugb-heading__bottom-line" /> }
			</Fragment>
		) } />
	)
}

export default compose(
	withUniqueClass,
	withSetAttributeHook,
	withGoogleFont,
	withTabbedInspector( [ 'style', 'advanced' ] ),
	withContentAlignReseter( [ 'Title%sAlign', 'Subtitle%sAlign', 'TopLine%sAlign', 'BottomLine%sAlign' ] ),
	withBlockStyles( createStyles, { editorMode: true } ),
	withClickOpenInspector( [
		[ '.ugb-heading__title', 'title' ],
		[ '.ugb-heading__subtitle', 'subtitle' ],
		[ '.ugb-heading__top-line', 'topline' ],
		[ '.ugb-heading__bottom-line', 'bottomline' ],
	] ),
)( edit )
