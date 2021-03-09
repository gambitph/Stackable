/**
 * External dependencies
 */
import {
	getSelectedScreen, isScreenPickerOpen,
} from '~stackable/util'
import { i18n } from 'stackable'
import { lowerCase, startCase } from 'lodash'

/**
 * Internal dependencies
 */
import SVGDesktop from './images/desktop.svg'
import SVGMobile from './images/mobile.svg'
import SVGTablet from './images/tablet.svg'
import PreviewModeSubscriber from './deprecated'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { Button, Popover } from '@wordpress/components'
import { withInstanceId, compose } from '@wordpress/compose'
import {
	withSelect, withDispatch, select,
} from '@wordpress/data'

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

class ResponsiveToggle extends PreviewModeSubscriber {
	constructor() {
		super( ...arguments )
		this.state = {
			screen: getSelectedScreen(),
			isScreenPickerOpen: isScreenPickerOpen(),
			isMouseOver: false,
		}
	}

	onChangeScreen( value ) {
		const {
			onChangeScreen, setPreviewDeviceType,
		} = this.props
		onChangeScreen( value )
		this.setState( { screen: value } )
		this.setState( { isMouseOver: value } )
		if ( setPreviewDeviceType ) {
			setPreviewDeviceType( startCase( value ) )
		}
		this.onChangeScreenAfter && this.onChangeScreenAfter( value )
	}

	onOtherScreenChange( screen ) {
		this.props.onChangeScreen( screen )
		this.setState( { screen } )
	}

	onOtherScreenOpen() {
		this.setState( { isScreenPickerOpen: true } )
	}

	onOtherScreenClose() {
		this.setState( { isScreenPickerOpen: false } )
	}

	render() {
		const isScreenPickerOpen = this.props.previewDeviceType ?
			lowerCase( this.props.previewDeviceType ) !== 'desktop' :
			this.state.isScreenPickerOpen

		const selectedScreen = lowerCase( this.props.previewDeviceType ) || this.state.screen

		return (
			<div className="ugb-base-control-multi-label__responsive">
				{ this.props.screens.length > 1 &&
					this.props.screens.map( ( screen, i ) => {
						if ( i > 0 && ! isScreenPickerOpen && ! this.state.isMouseOver ) {
							return null
						}
						return (
							<div
								key={ i }
							>
								<Button
									className={ selectedScreen === screen ? 'is-active' : '' }
									onClick={ () => this.onChangeScreen( screen ) }
									icon={ responsiveIcons[ screen ] }
									showTooltip={ false }
									label={ labels[ screen ] }
									data-screen={ screen }
									onMouseEnter={ () => this.setState( { isMouseOver: screen } ) }
									onMouseLeave={ () => this.setState( { isMouseOver: false } ) }
								/>
								{ this.state.isMouseOver === screen &&
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
}

ResponsiveToggle.defaultProps = {
	screens: [ 'desktop' ],
	onChangeScreen: () => {},
}

const composeList = []

if ( select( 'core/edit-post' ).__experimentalGetPreviewDeviceType ) {
	composeList.push(
		withSelect( select => ( { previewDeviceType: select( 'core/edit-post' ).__experimentalGetPreviewDeviceType() } ) ),
		withDispatch( dispatch => ( { setPreviewDeviceType: dispatch( 'core/edit-post' ).__experimentalSetPreviewDeviceType } ) )
	)
}

export default compose( ...composeList )( withInstanceId( ResponsiveToggle ) )
