import {
	InspectorControls, PanelColorSettings, RichText,
} from '@wordpress/editor'
import { __ } from '@wordpress/i18n'
import classnames from 'classnames'
import { descriptionPlaceholder } from '@stackable/util'
import { Fragment } from '@wordpress/element'

const edit = props => {
	const {
		isSelected, setAttributes, className,
	} = props

	const {
		color, text, quoteColor,
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-pullquote',
	] )

	return (
		<Fragment>
			<blockquote
				className={ mainClasses }
				style={ { '--quote-color': quoteColor } }>
				<RichText
					tagName="p"
					className="ugb-pullquote-text"
					value={ text }
					onChange={ nextValue => setAttributes( { text: nextValue } ) }
					formattingControls={ [ 'bold', 'italic', 'strikethrough', 'link' ] }
					isSelected={ isSelected }
					style={ {
						color: color,
					} }
					placeholder={ descriptionPlaceholder( 'long' ) }
					keepPlaceholderOnFocus
				/>
			</blockquote>
			<InspectorControls>
				<PanelColorSettings
					title={ __( 'Color Settings' ) }
					colorSettings={ [
						{
							value: color,
							onChange: colorValue => setAttributes( { color: colorValue } ),
							label: __( 'Text Color' ),
						},
						{
							value: quoteColor,
							onChange: colorValue => setAttributes( { quoteColor: colorValue } ),
							label: __( 'Quote Color' ),
						},
					] }
				>
				</PanelColorSettings>
			</InspectorControls>
		</Fragment>
	)
}

export default edit
