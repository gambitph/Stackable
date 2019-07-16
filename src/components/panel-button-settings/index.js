import { DesignControl, IconControl, PanelColorSettings } from '@stackable/components'
import { RangeControl, SelectControl } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import { Fragment } from '@wordpress/element'
import { i18n } from 'stackable'
import ImageDesignBasic from './images/basic.png'
import ImageDesignGhost from './images/ghost.png'
import ImageDesignLink from './images/link.png'
import ImageDesignPlain from './images/plain.png'

function PanelButtonSettings( props ) {
	const {
		buttonDesign,
		buttonColor,
		buttonTextColor,
		buttonSize,
		buttonBorderRadius,
		buttonIcon,
		onChangeButtonDesign,
		onChangeButtonColor, // = () => {},
		onChangeButtonTextColor, // = () => {},
		onChangeButtonSize, // = () => {},
		onChangeButtonBorderRadius, // = () => {},
		onChangeButtonIcon, // = () => {},
	} = props

	const colorSettings = []
	if ( onChangeButtonColor ) {
		if ( buttonDesign !== 'link' ) {
			colorSettings.push( {
				value: buttonColor,
				onChange: onChangeButtonColor,
				label: __( 'Button Color', i18n ),
			} )
		}
	}
	if ( onChangeButtonTextColor ) {
		if ( buttonDesign !== 'ghost' && buttonDesign !== 'plain' && buttonDesign !== 'link' ) {
			colorSettings.push( {
				value: buttonTextColor,
				onChange: onChangeButtonTextColor,
				label: __( 'Text Color', i18n ),
			} )
		}
	}

	return (
		<Fragment>
			<PanelColorSettings
				initialOpen={ false }
				title={ __( 'Button Settings', i18n ) }
				colorSettings={ colorSettings }
				className={ onChangeButtonDesign ? 'ugb-has-designs' : null }
				{ ...props }
			>
				{ onChangeButtonDesign &&
				<DesignControl
					label={ __( 'Design', i18n ) }
					selected={ buttonDesign }
					options={ [
						{
							label: __( 'Basic', i18n ), value: 'basic', image: ImageDesignBasic,
						},
						{
							label: __( 'Ghost', i18n ), value: 'ghost', image: ImageDesignGhost,
						},
						{
							label: __( 'Plain', i18n ), value: 'plain', image: ImageDesignPlain,
						},
						{
							label: __( 'Link', i18n ), value: 'link', image: ImageDesignLink,
						},
						...applyFilters( 'stackable.button.edit.designs', [] ),
					] }
					onChange={ onChangeButtonDesign }
				/>
				}
				{ onChangeButtonSize && buttonDesign !== 'link' &&
				<SelectControl
					label={ __( 'Size', i18n ) }
					value={ buttonSize }
					options={ [
						{ value: 'tiny', label: __( 'Tiny', i18n ) },
						{ value: 'small', label: __( 'Small', i18n ) },
						{ value: 'normal', label: __( 'Normal', i18n ) },
						{ value: 'medium', label: __( 'Medium', i18n ) },
						{ value: 'large', label: __( 'Large', i18n ) },
					] }
					onChange={ onChangeButtonSize }
				/>
				}
				{ onChangeButtonBorderRadius && buttonDesign !== 'link' && buttonDesign !== 'plain' &&
				<RangeControl
					label={ __( 'Border Radius', i18n ) }
					value={ buttonBorderRadius }
					min="1"
					max="50"
					onChange={ onChangeButtonBorderRadius }
				/>
				}
				{ onChangeButtonIcon && buttonDesign !== 'link' &&
				<IconControl
					label={ __( 'Icon', i18n ) }
					value={ buttonIcon }
					onChange={ onChangeButtonIcon }
				/>
				}
				{ props.children }
			</PanelColorSettings>
		</Fragment>
	)
}

export default PanelButtonSettings
