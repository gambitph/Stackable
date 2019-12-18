/**
 * Internal dependencies
 */
import createStyles from './style'

/**
 * External dependencies
 */
import {
	BlockContainer,
	ContentAlignControl,
	TypographyControlHelper,
	ColorPaletteControl,
	ResponsiveControl,
	AlignButtonsControl,
	PanelAdvancedSettings,
	HeadingButtonsControl,
	PanelSpacingBody,
	AdvancedRangeControl,
} from '~stackable/components'
import {
	createResponsiveAttributeNames,
	createTypographyAttributeNames,
	descriptionPlaceholder,
} from '~stackable/util'
import { i18n } from 'stackable'
import {
	withUniqueClass,
	withSetAttributeHook,
	withGoogleFont,
	withTabbedInspector,
	withContentAlignReseter,
	withBlockStyles,
	withClickOpenInspector,
} from '~stackable/higher-order'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { addFilter, applyFilters } from '@wordpress/hooks'
import classnames from 'classnames'
import { PanelBody } from '@wordpress/components'
import { Fragment } from '@wordpress/element'
import { compose } from '@wordpress/compose'
import { RichText } from '@wordpress/block-editor'

addFilter( 'stackable.expand.edit.inspector.style.before', 'stackable/expand', ( output, props ) => {
	const { setAttributes } = props
	const {
		showTitle = true,
		titleTag = 'h4',
		titleColor = '',
		textColor = '',
		linkColor = '',
	} = props.attributes

	// const show = showOptions( props )

	return (
		<Fragment>
			{ output }
			<PanelBody title={ __( 'General', i18n ) }>
				<ContentAlignControl
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				/>
			</PanelBody>

			<PanelAdvancedSettings
				title={ __( 'Title', i18n ) }
				id="title"
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
					<AlignButtonsControl
						label={ __( 'Align', i18n ) }
						className="ugb--help-tip-alignment-title"
					/>
				</ResponsiveControl>
			</PanelAdvancedSettings>

			<PanelAdvancedSettings
				title={ __( 'Text', i18n ) }
				id="text"
				initialOpen={ false }
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
						className="ugb--help-tip-alignment-description"
					/>
				</ResponsiveControl>
			</PanelAdvancedSettings>

			<PanelAdvancedSettings
				title={ __( 'Link', i18n ) }
				id="link"
				initialOpen={ false }
			>
				<TypographyControlHelper
					attrNameTemplate="link%s"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				/>
				<ColorPaletteControl
					value={ linkColor }
					onChange={ linkColor => setAttributes( { linkColor } ) }
					label={ __( 'Link Color', i18n ) }
				/>
				<ResponsiveControl
					attrNameTemplate="Link%sAlign"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AlignButtonsControl
						label={ __( 'Align', i18n ) }
						className="ugb--help-tip-alignment-button"
					/>
				</ResponsiveControl>
			</PanelAdvancedSettings>

			<PanelSpacingBody initialOpen={ false } blockProps={ props }>
				{ showTitle &&
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
							className="ugb--help-tip-spacing-title"
						/>
					</ResponsiveControl>
				}
				<ResponsiveControl
					attrNameTemplate="text%sBottomMargin"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AdvancedRangeControl
						label={ __( 'Text', i18n ) }
						min={ -50 }
						max={ 100 }
						allowReset={ true }
						className="ugb--help-tip-spacing-description"
					/>
				</ResponsiveControl>
				<ResponsiveControl
					attrNameTemplate="link%sBottomMargin"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AdvancedRangeControl
						label={ __( 'Link', i18n ) }
						min={ -50 }
						max={ 100 }
						allowReset={ true }
						className="ugb--help-tip-spacing-button"
					/>
				</ResponsiveControl>
			</PanelSpacingBody>
		</Fragment>
	)
} )

const edit = props => {
	const {
		setAttributes,
		className,
		isSelected,
	} = props

	const {
		showTitle = true,
		titleTag = 'h4',
		title = '',
		text = '',
		moreText = '',
		moreLabel,
		lessLabel,
		design = '',
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-expand--v2',
	], applyFilters( 'stackable.expand.mainclasses', {}, design, props ) )

	return (
		<BlockContainer.Edit className={ mainClasses } blockProps={ props } render={ () => (
			<Fragment>
				{ showTitle &&
					<RichText
						tagName={ titleTag || 'h2' }
						className="ugb-expand__title"
						value={ title }
						onChange={ title => setAttributes( { title } ) }
						placeholder={ __( 'Title for This Block', i18n ) }
						keepPlaceholderOnFocus
					/>
				}
				{ /* eslint-disable-next-line jsx-a11y/label-has-for */ }
				{ isSelected && <label className="ugb-expand__label">{ __( 'Less text', i18n ) }</label> }
				<RichText
					multiline="p"
					className="ugb-expand__less-text"
					value={ text }
					onChange={ text => setAttributes( { text } ) }
					placeholder={ __( 'Some short text that can be expanded to show more details.', i18n ) }
					keepPlaceholderOnFocus
				/>
				<div className="ugb-expand__toggle-wrapper">
					<a>{ /* eslint-disable-line */ /* Workaround to get around RichText not allowing inlines. */ }
						<RichText
							tagName="div"
							className="ugb-expand__more-toggle-text"
							value={ moreLabel }
							onChange={ text => setAttributes( { moreLabel: text } ) }
							placeholder={ __( 'Show more', i18n ) }
							keepPlaceholderOnFocus
						/>
					</a>
				</div>
				{ /* eslint-disable-next-line jsx-a11y/label-has-for */ }
				{ isSelected && <label className="ugb-expand__label">{ __( 'More text', i18n ) }</label> }
				{
					isSelected &&
					<RichText
						multiline="p"
						className="ugb-expand__more-text"
						value={ moreText }
						onChange={ text => setAttributes( { moreText: text } ) }
						placeholder={ `${ __( 'Some short text that can be expanded to show more details.', i18n ) } ${ descriptionPlaceholder( 'medium' ) }` }
						keepPlaceholderOnFocus
					/>
				}
				{ isSelected &&
					<div className="ugb-expand__toggle-wrapper">
						<a>{ /* eslint-disable-line */ /* Workaround to get around RichText not allowing inlines. */ }
							<RichText
								tagName="div"
								className="ugb-expand__less-toggle-text"
								value={ lessLabel }
								onChange={ text => setAttributes( { lessLabel: text } ) }
								placeholder={ __( 'Show less', i18n ) }
								keepPlaceholderOnFocus
							/>
						</a>
					</div>
				}
			</Fragment>
		) } />
	)
}

export default compose(
	withUniqueClass,
	withSetAttributeHook,
	withGoogleFont,
	withTabbedInspector( [ 'style', 'advanced' ] ),
	withContentAlignReseter( [ 'Title%sAlign', 'Text%sAlign', 'Link%sAlign' ] ),
	withBlockStyles( createStyles, { editorMode: true } ),
	withClickOpenInspector( [
		[ '.ugb-expand__title', 'title' ],
		[ '.ugb-expand__less-text, .ugb-expand__more-text', 'text' ],
		[ '.ugb-expand__more-toggle-text, .ugb-expand__less-toggle-text', 'link' ],
	] ),
)( edit )
