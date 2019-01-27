import { DesignControl, IconControl, PanelColorSettings } from '@stackable/components'
import { RangeControl, SelectControl } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import { Fragment } from '@wordpress/element'
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
				label: __( 'Button Color' ),
			} )
		}
	}
	if ( onChangeButtonTextColor ) {
		if ( buttonDesign !== 'ghost' && buttonDesign !== 'plain' && buttonDesign !== 'link' ) {
			colorSettings.push( {
				value: buttonTextColor,
				onChange: onChangeButtonTextColor,
				label: __( 'Text Color' ),
			} )
		}
	}

	return (
		<Fragment>
			<PanelColorSettings
				initialOpen={ false }
				title={ __( 'Button Settings' ) }
				colorSettings={ colorSettings }
				className={ onChangeButtonDesign ? 'ugb-has-designs' : null }
				{ ...props }
			>
				{ onChangeButtonDesign &&
				<DesignControl
					label={ __( 'Design' ) }
					selected={ buttonDesign }
					options={ [
						{
							label: __( 'Basic' ), value: 'basic', image: ImageDesignBasic,
						},
						{
							label: __( 'Ghost' ), value: 'ghost', image: ImageDesignGhost,
						},
						{
							label: __( 'Plain' ), value: 'plain', image: ImageDesignPlain,
						},
						{
							label: __( 'Link' ), value: 'link', image: ImageDesignLink,
						},
						...applyFilters( 'stackable.button.edit.designs', [] ),
					] }
					onChange={ onChangeButtonDesign }
				/>
				}
				{ onChangeButtonSize && buttonDesign !== 'link' &&
				<SelectControl
					label={ __( 'Size' ) }
					value={ buttonSize }
					options={ [
						{ value: 'tiny', label: __( 'Tiny' ) },
						{ value: 'small', label: __( 'Small' ) },
						{ value: 'normal', label: __( 'Normal' ) },
						{ value: 'medium', label: __( 'Medium' ) },
						{ value: 'large', label: __( 'Large' ) },
					] }
					onChange={ onChangeButtonSize }
				/>
				}
				{ onChangeButtonBorderRadius && buttonDesign !== 'link' && buttonDesign !== 'plain' &&
				<RangeControl
					label={ __( 'Border Radius' ) }
					value={ buttonBorderRadius }
					min="1"
					max="50"
					onChange={ onChangeButtonBorderRadius }
				/>
				}
				{ onChangeButtonIcon && buttonDesign !== 'link' &&
				<IconControl
					label={ __( 'Icon' ) }
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
