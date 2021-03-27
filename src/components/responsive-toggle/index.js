/**
 * Internal dependencies
 */
import SVGDesktop from './images/desktop.svg'
import SVGMobile from './images/mobile.svg'
import SVGTablet from './images/tablet.svg'

/**
 * External dependencies
 */
import { useDeviceType } from '~stackable/hooks'
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import {
	useState, useCallback,
} from '@wordpress/element'
import { Button, Popover } from '@wordpress/components'
import { dispatch } from '@wordpress/data'
import { withInstanceId } from '@wordpress/compose'

const responsiveIcons = {
	desktop: <SVGDesktop />,
	tablet: <SVGTablet />,
	mobile: <SVGMobile />,
}

const labels = {
	desktop: __( 'Desktop', i18n ),
	tablet: __( 'Tablet', i18n ),
	mobile: __( 'Mobile', i18n ),
}

const DEVICE_TYPES = {
	desktop: 'Desktop',
	tablet: 'Tablet',
	mobile: 'Mobile',
}

const ResponsiveToggle = props => {
	const [ isMouseOver, setIsMouseOver ] = useState( false )
	const deviceType = useDeviceType()

	const changeScreen = useCallback( screen => {
		const {
			__experimentalSetPreviewDeviceType: setPreviewDeviceType,
		} = dispatch( 'core/edit-post' )

		setPreviewDeviceType( DEVICE_TYPES[ screen ] )
	}, [] )

	return (
		<div className="ugb-base-control-multi-label__responsive">
			{ props.screens.length > 1 &&
				props.screens.map( ( screen, i ) => {
					if ( i > 0 && deviceType === 'Desktop' && ! isMouseOver ) {
						return null
					}
					return (
						<div
							key={ i }
						>
							<Button
								className={ deviceType.toLowerCase() === screen ? 'is-active' : '' }
								onClick={ () => changeScreen( screen ) }
								icon={ responsiveIcons[ screen ] }
								showTooltip={ false }
								label={ labels[ screen ] }
								data-screen={ screen }
								onMouseEnter={ () => {
									setIsMouseOver( screen )
									// _isMouseOver = screen
								} }
								onMouseLeave={ () => {
									setIsMouseOver( false )
									// _isMouseOver = false
								 } }
							/>
							{ isMouseOver === screen &&
								<Popover
									focusOnMount={ false }
									position="bottom center"
									className="components-tooltip"
									aria-hidden="true"
								>
									{ labels[ screen ] }
								</Popover>
							}
						</div>
					)
				} )
			}
		</div>
	)
}

ResponsiveToggle.defaultProps = {
	screens: [ 'desktop' ],
}

export default withInstanceId( ResponsiveToggle )
