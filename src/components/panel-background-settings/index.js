import { RangeControl, ToggleControl } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { Fragment } from '@wordpress/element'
import ImageControl from '../image-control'
import { PanelColorSettings } from '@stackable/components'

function PanelBackgroundSettings( props ) {
	const {
		backgroundColor,
		backgroundImageID,
		backgroundImageURL,
		backgroundOpacity,
		fixedBackground,
		onChangeBackgroundColor, // = () => {},
		onChangeBackgroundImage, // = ( { url, id } ) => {},
		onRemoveBackgroundImage, // = () => {},
		onChangeBackgroundOpacity, // = () => {},
		onChangeFixedBackground,
	} = props

	const colorSettings = []
	if ( onChangeBackgroundColor ) {
		colorSettings.push( {
			value: backgroundColor,
			onChange: onChangeBackgroundColor,
			label: __( 'Background Color' ),
		} )
	}

	return (
		<Fragment>
			<PanelColorSettings
				initialOpen={ false }
				title={ __( 'Background Settings' ) }
				className="editor-panel-color-settings"
				colorSettings={ colorSettings }
				{ ...props }
			>
				{ onChangeBackgroundImage && (
					<ImageControl
						label={ __( 'Background Image' ) }
						onRemove={ onRemoveBackgroundImage }
						onChange={ onChangeBackgroundImage }
						imageID={ backgroundImageID }
						imageURL={ backgroundImageURL }
					/>
				) }
				{ onChangeBackgroundOpacity && (
					<RangeControl
						label={ __( 'Background Image Tint Strength' ) }
						value={ backgroundOpacity }
						onChange={ onChangeBackgroundOpacity }
						min={ 0 }
						max={ 10 }
						step={ 1 }
					/>
				) }
				{ onChangeFixedBackground && (
					<ToggleControl
						label={ __( 'Fixed Background' ) }
						checked={ fixedBackground }
						onChange={ onChangeFixedBackground }
					/>
				) }
			</PanelColorSettings>
		</Fragment>
	)
}

export default PanelBackgroundSettings
