import {
	BlockAlignmentToolbar, BlockControls, InspectorControls, PanelColorSettings, RichText, URLInput,
} from '@wordpress/editor'
import {
	Dashicon, IconButton, PanelBody, RangeControl, SelectControl,
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import classnames from 'classnames'
import { Fragment } from '@wordpress/element'

const edit = props => {
	const {
		isSelected,
		setAttributes,
		className,
	} = props

	const {
		url,
		text,
		color,
		size,
		align,
		cornerButtonRadius,
		borderThickness,
	} = props.attributes

	const buttonSizes = [
		{ value: 'small', label: __( 'Small' ) },
		{ value: 'normal', label: __( 'Normal ' ) },
		{ value: 'medium', label: __( 'Medium' ) },
		{ value: 'large', label: __( 'Large' ) },
	]

	const mainClasses = classnames( [
		className,
		`ugb-button`,
		`ugb-ghost-button`,
		`ugb-button-${ align }`,
		`ugb-button-${ size }`,
	] )

	return (
		<Fragment>
			<BlockControls>
				<BlockAlignmentToolbar
					value={ align }
					onChange={ align => {
						setAttributes( { align } )
					} }
					controls={ [ 'left', 'center', 'right', 'full' ] }
				/>
			</BlockControls>
			<InspectorControls>
				<PanelBody>
					<SelectControl
						label={ __( 'Size' ) }
						value={ size }
						options={ buttonSizes.map( ( { value, label } ) => ( {
							value: value,
							label: label,
						} ) ) }
						onChange={ newSize => {
							setAttributes( { size: newSize } )
						} }
					/>
					<RangeControl
						label={ __( 'Corner Radius' ) }
						value={ cornerButtonRadius }
						min="1"
						max="50"
						onChange={ cornerRad => setAttributes( { cornerButtonRadius: cornerRad } ) }
					/>
					<RangeControl
						label={ __( 'Border Thickness' ) }
						value={ borderThickness }
						min="1"
						max="10"
						onChange={ borderThick => setAttributes( { borderThickness: borderThick } ) }
					/>
				</PanelBody>
				<PanelColorSettings
					title={ __( 'Color Settings' ) }
					colorSettings={ [
						{
							value: color,
							onChange: colorValue => setAttributes( { color: colorValue } ),
							label: __( 'Button Color' ),
						},
					] }
				>
				</PanelColorSettings>
			</InspectorControls>
			<span
				className={ mainClasses }
				style={ {
					borderColor: color,
					borderRadius: cornerButtonRadius + 'px',
					borderWidth: borderThickness + 'px',
				} } >
				<RichText
					tagName="span"
					placeholder={ __( 'Button text' ) }
					value={ text }
					onChange={ text => setAttributes( { text: text } ) }
					formattingControls={ [ 'bold', 'italic', 'strikethrough' ] }
					className={ `ugb-button-inner` }
					style={ { color } }
					keepPlaceholderOnFocus
				/>
			</span>
			{ isSelected && (
				<form
					key="form-link"
					onSubmit={ event => event.preventDefault() }
					className={ `blocks-button__inline-link` }>
					<Dashicon icon="admin-links" />
					<URLInput
						value={ url }
						onChange={ value => setAttributes( { url: value } ) }
					/>
					<IconButton
						icon="editor-break"
						label={ __( 'Apply' ) }
						type="submit"
					/>
				</form>
			) }
		</Fragment>
	)
}

export default edit
