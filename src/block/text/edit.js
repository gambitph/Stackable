/**
 * Internal dependencies
 */
import createStyles from './style'
import ImageDesignPlain from './images/plain.png'
import ImageDesignSideTitle1 from './images/side-title-1.png'
import ImageDesignSideTitle2 from './images/side-title-2.png'
import { showOptions } from './util'

/**
 * External dependencies
 */
import {
	BlockContainer,
	DesignPanelBody,
	ContentAlignControl,
	AdvancedRangeControl,
	PanelAdvancedSettings,
	TypographyControlHelper,
	HeadingButtonsControl,
	ColorPaletteControl,
	ResponsiveControl,
	AlignButtonsControl,
	PanelSpacingBody,
	AdvancedToolbarControl,
	ColumnPaddingControl,
} from '~stackable/components'
import {
	withUniqueClass,
	withSetAttributeHook,
	withGoogleFont,
	withTabbedInspector,
	withContentAlignReseter,
	withBlockStyles,
	withClickOpenInspector,
} from '~stackable/higher-order'
import {
	descriptionPlaceholder,
	createTypographyAttributeNames,
	createResponsiveAttributeNames,
} from '~stackable/util'
import classnames from 'classnames'
import { range } from 'lodash'

/**
 * WordPress dependencies
 */
import { i18n } from 'stackable'
import {
	ToggleControl,
} from '@wordpress/components'
import {
	__, sprintf, _x,
} from '@wordpress/i18n'
import { addFilter, applyFilters } from '@wordpress/hooks'
import { Fragment } from '@wordpress/element'
import { compose } from '@wordpress/compose'
import { RichText } from '@wordpress/block-editor'

addFilter( 'stackable.text.edit.inspector.layout.before', 'stackable/text', ( output, props ) => {
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
				options={ applyFilters( 'stackable.text.edit.layouts', [
					{
						label: __( 'Plain', i18n ), value: 'plain', image: ImageDesignPlain,
					},
					{
						label: sprintf( _x( '%s %d', 'Nth Title', i18n ), __( 'Side Title', i18n ), 1 ), value: 'side-title-1', image: ImageDesignSideTitle1,
					},
					{
						label: sprintf( _x( '%s %d', 'Nth Title', i18n ), __( 'Side Title', i18n ), 2 ), value: 'side-title-2', image: ImageDesignSideTitle2,
					},
				] ) }
				onChange={ design => setAttributes( { design } ) }
			/>
		</Fragment>
	)
} )

addFilter( 'stackable.text.edit.inspector.style.before', 'stackable/text', ( output, props ) => {
	const { setAttributes } = props
	const {
		design = 'plain',
		columns = 1,
		reverseTitle = false,
		subtitleOnTop = false,
		showColumnRule = false,
		columnRuleColor = '',
		columnRuleWidth = '',
		columnRuleHeight = '',
		showTitle = false,
		titleTag = '',
		titleColor = '',
		titleVerticalAlign = '',
		showSubtitle = false,
		subtitleColor = '',
		textColor = '',
	} = props.attributes

	const show = showOptions( props )

	return (
		<Fragment>
			{ output }
			<PanelAdvancedSettings
				title={ __( 'General', i18n ) }
				initialOpen={ true }
			>
				<AdvancedRangeControl
					label={ __( 'Columns', i18n ) }
					min={ 1 }
					max={ 4 }
					value={ columns }
					onChange={ columns => setAttributes( { columns } ) }
					placeholder="1"
					className="ugb--help-tip-general-columns"
				/>
				{ show.reverseTitle &&
					<ToggleControl
						label={ __( 'Reverse Title', i18n ) }
						checked={ reverseTitle }
						onChange={ reverseTitle => setAttributes( { reverseTitle } ) }
					/>
				}
				<ContentAlignControl
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				/>
			</PanelAdvancedSettings>

			<PanelSpacingBody initialOpen={ false } blockProps={ props }>
				<ColumnPaddingControl
					label={ __( 'Paddings', i18n ) }
					setAttributes={ setAttributes }
					attributes={ props.attributes }
				/>
				{ show.titleSpacing && (
					<ResponsiveControl
						attrNameTemplate="title%sBottomMargin"
						setAttributes={ setAttributes }
						blockAttributes={ props.attributes }
					>
						<AdvancedRangeControl
							label={ __( 'Title', i18n ) }
							min={ -50 }
							max={ 100 }
							placeholder="16"
							allowReset={ true }
							className="ugb--help-tip-spacing-title"
						/>
					</ResponsiveControl>
				) }
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
				<ResponsiveControl
					attrNameTemplate="text%sBottomMargin"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AdvancedRangeControl
						label={ __( 'Text', i18n ) }
						min={ 0 }
						max={ 100 }
						allowReset={ true }
						className="ugb--help-tip-spacing"
					/>
				</ResponsiveControl>
			</PanelSpacingBody>

			{ show.columns &&
				<PanelAdvancedSettings
					title={ __( 'Column Rule', i18n ) }
					checked={ showColumnRule }
					onChange={ showColumnRule => setAttributes( { showColumnRule } ) }
					toggleOnSetAttributes={ [
					] }
					toggleAttributeName="showColumnRule"
				>
					<ColorPaletteControl
						value={ columnRuleColor }
						onChange={ columnRuleColor => setAttributes( { columnRuleColor } ) }
						label={ __( 'Color', i18n ) }
					/>
					<AdvancedRangeControl
						label={ __( 'Width', i18n ) }
						min={ 1 }
						max={ 4 }
						allowReset={ true }
						value={ columnRuleWidth }
						onChange={ columnRuleWidth => setAttributes( { columnRuleWidth } ) }
						placeholder="1"
					/>
					<AdvancedRangeControl
						label={ __( 'Height', i18n ) }
						min={ 1 }
						max={ 100 }
						allowReset={ true }
						value={ columnRuleHeight }
						onChange={ columnRuleHeight => setAttributes( { columnRuleHeight } ) }
						placeholder="100"
					/>
				</PanelAdvancedSettings>
			}

			<PanelAdvancedSettings
				title={ __( 'Text', i18n ) }
				id="text"
				hasToggle={ false }
			>
				<TypographyControlHelper
					attrNameTemplate="text%s"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				/>
				<ColorPaletteControl
					value={ textColor }
					onChange={ textColor => setAttributes( { textColor } ) }
					label={ __( 'Text Color', i18n ) }
				/>
				<ResponsiveControl
					attrNameTemplate="Text%sAlign"
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
				title={ __( 'Title', i18n ) }
				id="title"
				hasToggle={ design === 'plain' }
				checked={ showTitle }
				onChange={ showTitle => setAttributes( { showTitle } ) }
				toggleOnSetAttributes={ [
					...createTypographyAttributeNames( 'title%s' ),
					'titleColor',
					'titleTag',
					...createResponsiveAttributeNames( 'title%sAlign' ),
				] }
				toggleAttributeName="showTitle"
			>
				<HeadingButtonsControl
					value={ titleTag || 'h2' }
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
				<AdvancedToolbarControl
					label={ __( 'Vertical Align', i18n ) }
					controls="flex-vertical"
					value={ titleVerticalAlign }
					onChange={ titleVerticalAlign => setAttributes( { titleVerticalAlign } ) }
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
					'subtitleTag',
					...createResponsiveAttributeNames( 'subtitle%sAlign' ),
				] }
				toggleAttributeName="showSubtitle"
			>
				<ToggleControl
					label={ __( 'Subtitle on Top', i18n ) }
					checked={ subtitleOnTop }
					onChange={ subtitleOnTop => setAttributes( { subtitleOnTop } ) }
				/>
				<TypographyControlHelper
					attrNameTemplate="subtitle%s"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
					placeholder={ size => size * 0.85 } // 0.85em
				/>
				<ColorPaletteControl
					value={ subtitleColor }
					onChange={ subtitleColor => setAttributes( { subtitleColor } ) }
					label={ __( 'Subtitle Color', i18n ) }
				/>
				<ResponsiveControl
					attrNameTemplate="Subtitle%sAlign"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AlignButtonsControl
						label={ __( 'Align', i18n ) }
						className="ugb--help-tip-alignment-title"
					/>
				</ResponsiveControl>
			</PanelAdvancedSettings>

		</Fragment>
	)
} )

const edit = props => {
	const {
		className,
		setAttributes,
	} = props

	const {
		columns = 1,
		design = 'plain',
		reverseTitle = false,
		title = '',
		showTitle = false,
		titleTag = '',
		showSubtitle = false,
		subtitle = '',
		showColumnRule = false,
		subtitleOnTop = false,
	} = props.attributes

	const show = showOptions( props )

	const mainClasses = classnames( [
		className,
		`ugb-text--design-${ design }`,
		`ugb-text--columns-${ columns }`,
	], applyFilters( 'stackable.text.mainclasses', {
		'ugb-text--reverse-title': show.reverseTitle && reverseTitle,
		'ugb-text--has-rule': showColumnRule,
		'ugb-text--subtitle-top': subtitleOnTop,
	}, props ) )

	return (
		<BlockContainer.Edit className={ mainClasses } blockProps={ props } render={ () => (
			<Fragment>
				{ ( showTitle || showSubtitle ) &&
					<div className="ugb-text__title-wrapper">
						{ showTitle &&
							<RichText
								tagName={ titleTag || 'h2' }
								className="ugb-text__title"
								value={ title }
								onChange={ title => setAttributes( { title } ) }
								placeholder={ __( 'Block Title', i18n ) }
								keepPlaceholderOnFocus
							/>
						}
						{ showSubtitle &&
							<RichText
								tagName="p"
								className="ugb-text__subtitle"
								value={ subtitle }
								onChange={ subtitle => setAttributes( { subtitle } ) }
								placeholder={ __( 'Subtitle', i18n ) }
								keepPlaceholderOnFocus
							/>
						}
					</div>
				}
				<div className="ugb-text__text-wrapper">
					{ range( columns || 1 ).map( i => {
						const index = i + 1
						return (
							<Fragment key={ i }>
								<div className="ugb-text__text">
									<RichText
										tagName="p"
										className={ `ugb-text__text-${ index }` }
										value={ props.attributes[ `text${ index }` ] }
										onChange={ text => setAttributes( { [ `text${ index }` ]: text } ) }
										placeholder={ descriptionPlaceholder( 'medium' ) }
										keepPlaceholderOnFocus
									/>
								</div>
								{ showColumnRule && i !== columns - 1 &&
									<div className={ `ugb-text__rule ugb-text__rule-${ index }` } role="presentation" />
								}
							</Fragment>
						)
					} ) }
				</div>
			</Fragment>
		) } />
	)
}

export default compose(
	withUniqueClass,
	withSetAttributeHook,
	withGoogleFont,
	withTabbedInspector(),
	withContentAlignReseter( [ 'Title%sAlign', 'Subtitle%sAlign', 'Text%sAlign' ] ),
	withBlockStyles( createStyles, { editorMode: true } ),
	withClickOpenInspector( [
		[ '.ugb-text__title', 'title' ],
		[ '.ugb-text__subtitle', 'subtitle' ],
		[ '.ugb-text__text', 'text' ],
	] ),
)( edit )
