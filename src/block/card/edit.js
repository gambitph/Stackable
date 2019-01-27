import {
	AlignmentToolbar, BlockControls, InspectorControls, PanelColorSettings, RichText,
} from '@wordpress/editor'
import {
	ButtonEdit, ColorPaletteControl, DesignPanelBody, ImageUploadPlaceholder, PanelButtonSettings, ProControl, URLInputControl,
} from '@stackable/components'
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import classnames from 'classnames'
import { descriptionPlaceholder } from '@stackable/util'
import { Fragment } from '@wordpress/element'
import ImageDesignBasic from './images/basic.png'
import ImageDesignPlain from './images/plain.png'
import { RangeControl } from '@wordpress/components'
import { showProNotice } from 'stackable'

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
	], {
		[ `ugb-card--design-${ design }` ]: design !== 'basic',
		[ `ugb--shadow-${ shadow }` ]: design !== 'plain' && shadow !== 3,
	} )

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
							label: __( 'Basic' ), value: 'basic', image: ImageDesignBasic,
						},
						{
							label: __( 'Plain' ), value: 'plain', image: ImageDesignPlain,
						},
					] ) }
					onChange={ design => setAttributes( { design } ) }
				>
					{ applyFilters( 'stackable.card.edit.designs.before', null, props ) }
					{ ! [ 'plain', 'full' ].includes( design ) &&
						<ColorPaletteControl
							label={ __( 'Background Color' ) }
							value={ backgroundColor }
							onChange={ backgroundColor => setAttributes( { backgroundColor } ) }
						/>
					}
					<RangeControl
						label={ __( 'Border Radius' ) }
						value={ borderRadius }
						onChange={ borderRadius => setAttributes( { borderRadius } ) }
						min={ 0 }
						max={ 50 }
					/>
					<RangeControl
						label={ __( 'Shadow / Outline' ) }
						value={ shadow }
						onChange={ shadow => setAttributes( { shadow } ) }
						min={ 0 }
						max={ 9 }
					/>
					{ applyFilters( 'stackable.card.edit.designs.after', null, props ) }
					{ showProNotice && <ProControl size="small" /> }
				</DesignPanelBody>
				<PanelColorSettings
					title={ __( 'Text Colors' ) }
					colorSettings={ [
						{
							value: headingColor,
							onChange: colorValue => setAttributes( { headingColor: colorValue } ),
							label: __( 'Heading Color' ),
						},
						{
							value: taglineColor,
							onChange: colorValue => setAttributes( { taglineColor: colorValue } ),
							label: __( 'Tagline Color' ),
						},
						{
							value: desColor,
							onChange: colorValue => setAttributes( { desColor: colorValue } ),
							label: __( 'Description Color' ),
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
			</InspectorControls>
			<div className={ mainClasses } style={ mainStyles }>
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
					placeholder={ __( 'Title for This Block' ) }
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
					placeholder={ __( 'Subtitle for this block' ) }
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
