/**
 * External dependencies
 */
import { Style as StyleComponent } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { Fragment, useMemo } from '@wordpress/element'

const getButtonPaddingStyles = ( options = {} ) => {
	const {
		selector,
		buttonPaddingTop,
		buttonPaddingBottom,
		buttonPaddingRight,
		buttonPaddingLeft,
		buttonPaddingUnit = 'px',
		buttonPaddingTopTablet,
		buttonPaddingBottomTablet,
		buttonPaddingRightTablet,
		buttonPaddingLeftTablet,
		buttonPaddingUnitTablet = 'px',
		buttonPaddingTopMobile,
		buttonPaddingBottomMobile,
		buttonPaddingRightMobile,
		buttonPaddingLeftMobile,
		buttonPaddingUnitMobile = 'px',
	} = options

	const paddingStyle = {
		[ selector ]: {
			paddingTop: buttonPaddingTop !== '' ? buttonPaddingTop + buttonPaddingUnit : undefined,
			paddingBottom: buttonPaddingBottom !== '' ? buttonPaddingBottom + buttonPaddingUnit : undefined,
			paddingRight: buttonPaddingRight !== '' ? buttonPaddingRight + buttonPaddingUnit : undefined,
			paddingLeft: buttonPaddingLeft !== '' ? buttonPaddingLeft + buttonPaddingUnit : undefined,
		},
		tablet: {
			[ selector ]: {
				paddingTop: buttonPaddingTopTablet !== '' ? buttonPaddingTopTablet + buttonPaddingUnitTablet : undefined,
				paddingBottom: buttonPaddingBottomTablet !== '' ? buttonPaddingBottomTablet + buttonPaddingUnitTablet : undefined,
				paddingRight: buttonPaddingRightTablet !== '' ? buttonPaddingRightTablet + buttonPaddingUnitTablet : undefined,
				paddingLeft: buttonPaddingLeftTablet !== '' ? buttonPaddingLeftTablet + buttonPaddingUnitTablet : undefined,
			},
		},
		mobile: {
			[ selector ]: {
				paddingTop: buttonPaddingTopMobile !== '' ? buttonPaddingTopMobile + buttonPaddingUnitMobile : undefined,
				paddingBottom: buttonPaddingBottomMobile !== '' ? buttonPaddingBottomMobile + buttonPaddingUnitMobile : undefined,
				paddingRight: buttonPaddingRightMobile !== '' ? buttonPaddingRightMobile + buttonPaddingUnitMobile : undefined,
				paddingLeft: buttonPaddingLeftMobile !== '' ? buttonPaddingLeftMobile + buttonPaddingUnitMobile : undefined,
			},
		},
	}

	return paddingStyle
}

const getButtonNormalStyles = ( options = {} ) => {
	const {
		selector,
		buttonNoBackgroundColor,
		buttonBackgroundColorType,
		buttonBackgroundColor,
		buttonBackgroundColor2,
		buttonBackgroundGradientDirection,
	} = options

	if ( buttonNoBackgroundColor ) {
		return {
			[ selector ]: {
				background: 'transparent',
			},
		}
	}

	const normalButtonStyle = {
		[ selector ]: {
			...( buttonBackgroundColorType === 'gradient'
				? {
					background: `linear-gradient(${ buttonBackgroundGradientDirection !== '' ? buttonBackgroundGradientDirection + 'deg' : '90deg' }, ${ buttonBackgroundColor || buttonBackgroundColor2 }, ${ buttonBackgroundColor2 || buttonBackgroundColor })`,
				}
				: {
					background: buttonBackgroundColor !== '' ? buttonBackgroundColor : undefined,
				}
			),
		},
	}

	return normalButtonStyle
}

const getButtonHoverStyles = ( options = {} ) => {
	const {
		selector,
		buttonHoverNoBackgroundColor,
		buttonBackgroundColor,
		buttonBackgroundColor2,
		buttonBackgroundGradientDirection,
		buttonHoverBackgroundColor,
		buttonHoverBackgroundColor2,
		buttonHoverBackgroundGradientDirection,
		buttonHoverBackgroundColorType,
	} = options

	if ( buttonHoverNoBackgroundColor ) {
		return {
			[ selector + ':hover' ]: {
				background: 'transparent',
			},
		}
	}

	const hoverButtonStyle = {
		...( buttonHoverBackgroundColorType === 'gradient'
			? {
				[ selector + ':hover' ]: {
					background: `linear-gradient(${ ( buttonHoverBackgroundGradientDirection || buttonBackgroundGradientDirection || '90' ) + 'deg' }, ${ buttonHoverBackgroundColor || buttonBackgroundColor || buttonBackgroundColor2 }, ${ buttonHoverBackgroundColor2 || buttonBackgroundColor2 || buttonBackgroundColor })`,
				},
			}
			: {
				[ selector + ':hover' ]: {
					background: buttonHoverBackgroundColor !== '' ? buttonHoverBackgroundColor : undefined,
				},
			} ),
	}

	return hoverButtonStyle
}

export const Style = props => {
	const {
		attributes,
		...propsToPass
	} = props

	const {
		buttonBackgroundColorType = '',
		buttonBackgroundColor = '',
		buttonBackgroundColor2 = '',
		buttonBackgroundGradientDirection = '',
		buttonHoverBackgroundColor = '',
		buttonHoverBackgroundColor2 = '',
		buttonHoverBackgroundGradientDirection = '',
		buttonHoverBackgroundColorType = '',
		buttonNoBackgroundColor = '',
		buttonHoverNoBackgroundColor = '',
		buttonPaddingTop = '',
		buttonPaddingBottom = '',
		buttonPaddingRight = '',
		buttonPaddingLeft = '',
		buttonPaddingUnit = 'px',
		buttonPaddingTopTablet = '',
		buttonPaddingBottomTablet = '',
		buttonPaddingRightTablet = '',
		buttonPaddingLeftTablet = '',
		buttonPaddingUnitTablet = 'px',
		buttonPaddingTopMobile = '',
		buttonPaddingBottomMobile = '',
		buttonPaddingRightMobile = '',
		buttonPaddingLeftMobile = '',
		buttonPaddingUnitMobile = 'px',
	} = attributes

	const {
		selector,
	} = propsToPass.options

	const buttonPaddingStyles = useMemo(
		() => getButtonPaddingStyles( {
			selector,
			buttonPaddingTop,
			buttonPaddingBottom,
			buttonPaddingRight,
			buttonPaddingLeft,
			buttonPaddingUnit,
			buttonPaddingTopTablet,
			buttonPaddingBottomTablet,
			buttonPaddingRightTablet,
			buttonPaddingLeftTablet,
			buttonPaddingUnitTablet,
			buttonPaddingTopMobile,
			buttonPaddingBottomMobile,
			buttonPaddingRightMobile,
			buttonPaddingLeftMobile,
			buttonPaddingUnitMobile,
		} ),
		[
			selector,
			buttonPaddingTop,
			buttonPaddingBottom,
			buttonPaddingRight,
			buttonPaddingLeft,
			buttonPaddingUnit,
			buttonPaddingTopTablet,
			buttonPaddingBottomTablet,
			buttonPaddingRightTablet,
			buttonPaddingLeftTablet,
			buttonPaddingUnitTablet,
			buttonPaddingTopMobile,
			buttonPaddingBottomMobile,
			buttonPaddingRightMobile,
			buttonPaddingLeftMobile,
			buttonPaddingUnitMobile,
		]
	)

	const buttonNormalColorStyles = useMemo(
		() => getButtonNormalStyles( {
			selector,
			buttonNoBackgroundColor,
			buttonBackgroundColorType,
			buttonBackgroundColor,
			buttonBackgroundColor2,
			buttonBackgroundGradientDirection,
		} ),
		[
			selector,
			buttonNoBackgroundColor,
			buttonBackgroundColorType,
			buttonBackgroundColor,
			buttonBackgroundColor2,
			buttonBackgroundGradientDirection,
		]
	)

	const buttonHoverColorStyles = useMemo(
		() => getButtonHoverStyles( {
			selector,
			buttonHoverNoBackgroundColor,
			buttonBackgroundColor,
			buttonBackgroundColor2,
			buttonBackgroundGradientDirection,
			buttonHoverBackgroundColor,
			buttonHoverBackgroundColor2,
			buttonHoverBackgroundGradientDirection,
			buttonHoverBackgroundColorType,
		} ),
		[
			selector,
			buttonHoverNoBackgroundColor,
			buttonBackgroundColor,
			buttonBackgroundColor2,
			buttonBackgroundGradientDirection,
			buttonHoverBackgroundColor,
			buttonHoverBackgroundColor2,
			buttonHoverBackgroundGradientDirection,
			buttonHoverBackgroundColorType,
		]
	)

	return (
		<Fragment>
			<StyleComponent
				styles={ buttonNormalColorStyles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
			<StyleComponent
				styles={ buttonHoverColorStyles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
			<StyleComponent
				styles={ buttonPaddingStyles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
		</Fragment>
	)
}

Style.Content = props => {
	const {
		attributes,
		...propsToPass
	} = props

	const {
		buttonBackgroundColorType = '',
		buttonBackgroundColor = '',
		buttonBackgroundColor2 = '',
		buttonBackgroundGradientDirection = '',
		buttonHoverBackgroundColor = '',
		buttonHoverBackgroundColor2 = '',
		buttonHoverBackgroundGradientDirection = '',
		buttonHoverBackgroundColorType = '',
		buttonNoBackgroundColor = '',
		buttonHoverNoBackgroundColor = '',
		buttonPaddingTop = '',
		buttonPaddingBottom = '',
		buttonPaddingRight = '',
		buttonPaddingLeft = '',
		buttonPaddingUnit = 'px',
		buttonPaddingTopTablet = '',
		buttonPaddingBottomTablet = '',
		buttonPaddingRightTablet = '',
		buttonPaddingLeftTablet = '',
		buttonPaddingUnitTablet = 'px',
		buttonPaddingTopMobile = '',
		buttonPaddingBottomMobile = '',
		buttonPaddingRightMobile = '',
		buttonPaddingLeftMobile = '',
		buttonPaddingUnitMobile = 'px',
	} = attributes

	const {
		selector,
	} = propsToPass.options

	const buttonPaddingStyles = getButtonPaddingStyles( {
		selector,
		buttonPaddingTop,
		buttonPaddingBottom,
		buttonPaddingRight,
		buttonPaddingLeft,
		buttonPaddingUnit,
		buttonPaddingTopTablet,
		buttonPaddingBottomTablet,
		buttonPaddingRightTablet,
		buttonPaddingLeftTablet,
		buttonPaddingUnitTablet,
		buttonPaddingTopMobile,
		buttonPaddingBottomMobile,
		buttonPaddingRightMobile,
		buttonPaddingLeftMobile,
		buttonPaddingUnitMobile,
	} )

	const buttonNormalColorStyles = getButtonNormalStyles( {
		selector,
		buttonNoBackgroundColor,
		buttonBackgroundColorType,
		buttonBackgroundColor,
		buttonBackgroundColor2,
		buttonBackgroundGradientDirection,
	} )

	const buttonHoverColorStyles = getButtonHoverStyles( {
		selector,
		buttonHoverNoBackgroundColor,
		buttonBackgroundColor,
		buttonBackgroundColor2,
		buttonBackgroundGradientDirection,
		buttonHoverBackgroundColor,
		buttonHoverBackgroundColor2,
		buttonHoverBackgroundGradientDirection,
		buttonHoverBackgroundColorType,
	} )

	return (
		<Fragment>
			<StyleComponent.Content
				styles={ buttonNormalColorStyles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
			<StyleComponent.Content
				styles={ buttonHoverColorStyles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
			<StyleComponent.Content
				styles={ buttonPaddingStyles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
		</Fragment>
	)
}
