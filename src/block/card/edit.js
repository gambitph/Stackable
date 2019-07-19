import {
	AlignmentToolbar, BlockControls, InspectorControls, PanelColorSettings, RichText,
} from '@wordpress/block-editor'
import {
	ButtonEdit, ColorPaletteControl, DesignPanelBody, ImageUploadPlaceholder, PanelButtonSettings, ProControl, ProControlButton, URLInputControl,
} from '@stackable/components'
import { i18n, showProNotice } from 'stackable'
import { PanelBody, RangeControl } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import classnames from 'classnames'
import { descriptionPlaceholder } from '@stackable/util'
import { Fragment } from '@wordpress/element'
import ImageDesignBasic from './images/basic.png'
import ImageDesignPlain from './images/plain.png'

const edit = props => {
	const {
		isSelected,
		className,
		setAttributes,
	} = props

	const {
		heading,
		tagline,
		des,
		mediaID,
		mediaURL,
		headingColor,
		taglineColor,
		desColor,
		buttonURL,
		buttonNewTab,
		buttonText,
		buttonColor,
		buttonTextColor,
		size,
		cornerButtonRadius,
		contentAlign,
		buttonDesign,
		buttonIcon,
		design = 'basic',
		backgroundColor,
		borderRadius = 12,
		shadow = 3,
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-card',
	], applyFilters( 'stackable.card.mainclasses', {
		[ `ugb-card--design-${ design }` ]: design !== 'basic',
		[ `ugb--shadow-${ shadow }` ]: design !== 'plain' && shadow !== 3,
	}, design, props ) )

	const mainStyles = {
		borderRadius: design !== 'plain' && borderRadius !== 12 ? borderRadius : undefined,
		backgroundColor: design !== 'plain' ? backgroundColor : undefined,
	}

	const imageClasses = classnames( [
		'ugb-card__image-container',
	], {
		[ `ugb--shadow-${ shadow }` ]: design === 'plain',
	} )

	const imageStyles = {
		borderRadius: design === 'plain' ? borderRadius : undefined,
	}

	return (
		<Fragment>
			<BlockControls>
				<AlignmentToolbar
					value={ contentAlign }
					onChange={ newAlign => setAttributes( { contentAlign: newAlign } ) }
				/>
			</BlockControls>
			<InspectorControls>
				<DesignPanelBody
					selected={ design }
					options={ applyFilters( 'stackable.card.edit.designs', [
						{
							label: __( 'Basic', i18n ), value: 'basic', image: ImageDesignBasic,
						},
						{
							label: __( 'Plain', i18n ), value: 'plain', image: ImageDesignPlain,
						},
					] ) }
					onChange={ design => setAttributes( { design } ) }
				>
					{ applyFilters( 'stackable.card.edit.designs.before', null, props ) }
					{ ! [ 'plain', 'full' ].includes( design ) &&
						<ColorPaletteControl
							label={ __( 'Background Color', i18n ) }
							value={ backgroundColor }
							onChange={ backgroundColor => setAttributes( { backgroundColor } ) }
						/>
					}
					<RangeControl
						label={ __( 'Border Radius', i18n ) }
						value={ borderRadius }
						onChange={ borderRadius => setAttributes( { borderRadius } ) }
						min={ 0 }
						max={ 50 }
					/>
					<RangeControl
						label={ __( 'Shadow / Outline', i18n ) }
						value={ shadow }
						onChange={ shadow => setAttributes( { shadow } ) }
						min={ 0 }
						max={ 9 }
					/>
					{ applyFilters( 'stackable.card.edit.designs.after', null, props ) }
					{ showProNotice && <ProControlButton /> }
				</DesignPanelBody>
				<PanelColorSettings
					title={ __( 'Text Colors', i18n ) }
					colorSettings={ [
						{
							value: headingColor,
							onChange: colorValue => setAttributes( { headingColor: colorValue } ),
							label: __( 'Heading Color', i18n ),
						},
						{
							value: taglineColor,
							onChange: colorValue => setAttributes( { taglineColor: colorValue } ),
							label: __( 'Tagline Color', i18n ),
						},
						{
							value: desColor,
							onChange: colorValue => setAttributes( { desColor: colorValue } ),
							label: __( 'Description Color', i18n ),
						},
					] }
				>
				</PanelColorSettings>
				<PanelButtonSettings
					initialOpen={ false }
					buttonColor={ buttonColor }
					buttonTextColor={ buttonTextColor }
					buttonSize={ size }
					buttonBorderRadius={ cornerButtonRadius }
					buttonDesign={ buttonDesign }
					buttonIcon={ buttonIcon }
					onChangeButtonColor={ value => setAttributes( { buttonColor: value } ) }
					onChangeButtonTextColor={ value => setAttributes( { buttonTextColor: value } ) }
					onChangeButtonSize={ value => setAttributes( { size: value } ) }
					onChangeButtonBorderRadius={ value => setAttributes( { cornerButtonRadius: value } ) }
					onChangeButtonDesign={ buttonDesign => setAttributes( { buttonDesign } ) }
					onChangeButtonIcon={ buttonIcon => setAttributes( { buttonIcon } ) }
				/>
				{ showProNotice &&
					<PanelBody
						initialOpen={ false }
						title={ __( 'Custom CSS', i18n ) }
					>
						<ProControl
							title={ __( 'Say Hello to Custom CSS 👋', i18n ) }
							description={ __( 'Further tweak this block by adding guided custom CSS rules. This feature is only available on Stackable Premium', i18n ) }
						/>
					</PanelBody>
				}
				{ applyFilters( 'stackable.card.edit.inspector.after', null, design, props ) }
			</InspectorControls>
			<div className={ mainClasses } style={ mainStyles }>
				{ applyFilters( 'stackable.card.edit.output.before', null, design, props ) }
				<ImageUploadPlaceholder
					className={ imageClasses }
					style={ imageStyles }
					imageID={ mediaID }
					imageURL={ mediaURL }
					onRemove={ () => setAttributes( { mediaURL: '', mediaID: '' } ) }
					onChange={ ( { url, id } ) => setAttributes( { mediaURL: url, mediaID: id } ) }
				/>
				<RichText
					tagName="h4"
					value={ heading }
					className="ugb-card__title"
					onChange={ text => setAttributes( { heading: text } ) }
					style={ {
						color: headingColor,
						textAlign: contentAlign,
					} }
					placeholder={ __( 'Title for This Block', i18n ) }
					keepPlaceholderOnFocus
				/>
				<RichText
					tagName="p"
					value={ tagline }
					className="ugb-card__tagline"
					onChange={ text => setAttributes( { tagline: text } ) }
					style={ {
						color: taglineColor,
						textAlign: contentAlign,
					} }
					placeholder={ __( 'Subtitle for this block', i18n ) }
					keepPlaceholderOnFocus
				/>
				<RichText
					tagName="p"
					value={ des }
					className="ugb-card__description"
					onChange={ text => setAttributes( { des: text } ) }
					style={ {
						color: desColor,
						textAlign: contentAlign,
					} }
					placeholder={ descriptionPlaceholder( 'long' ) }
					keepPlaceholderOnFocus
				/>
				<ButtonEdit
					size={ size }
					align={ contentAlign }
					color={ buttonTextColor }
					backgroundColor={ buttonColor }
					text={ buttonText }
					borderRadius={ cornerButtonRadius }
					design={ buttonDesign }
					icon={ buttonIcon }
					onChange={ text => setAttributes( { buttonText: text } ) }
				/>
				{ applyFilters( 'stackable.card.edit.output.after', null, design, props ) }
			</div>
			{ isSelected && (
				<URLInputControl
					value={ buttonURL }
					newTab={ buttonNewTab }
					onChange={ buttonURL => setAttributes( { buttonURL } ) }
					onChangeNewTab={ buttonNewTab => setAttributes( { buttonNewTab } ) }
				/>
			) }
		</Fragment>
	)
}

export default edit
