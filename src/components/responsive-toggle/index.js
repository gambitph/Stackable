/**
 * External dependencies
 */
import {
	getSelectedScreen, isScreenPickerOpen, setSelectedScreen,
} from '~stackable/util'

/**
 * Internal dependencies
 */
import SVGDesktop from './images/desktop.svg'
import SVGMobile from './images/mobile.svg'
import SVGTablet from './images/tablet.svg'
import Button from '../button'

/**
 * WordPress dependencies
 */
import {
	addAction, doAction, removeAction,
} from '@wordpress/hooks'
import { __ } from '@wordpress/i18n'
import { Component } from '@wordpress/element'
import { i18n } from 'stackable'
import { Popover } from '@wordpress/components'
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

class ResponsiveToggle extends Component {
	constructor() {
		super( ...arguments )
		this.state = {
			screen: getSelectedScreen(),
			isScreenPickerOpen: isScreenPickerOpen(),
			isMouseOver: false,
		}
	}

	onChangeScreen( value ) {
		this.props.onChangeScreen( value )
		this.setState( { screen: value } )
		setSelectedScreen( value )
		doAction( 'stackable.responsive-toggle.screen.change', value )
		this.setState( { isMouseOver: value } )
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

	componentDidMount() {
		const { instanceId } = this.props
		addAction( 'stackable.responsive-toggle.screen.change', `stackable/responsive-toggle-${ instanceId }`, this.onOtherScreenChange.bind( this ) )
		addAction( 'stackable.responsive-toggle.screen.open', `stackable/responsive-toggle-${ instanceId }`, this.onOtherScreenOpen.bind( this ) )
		addAction( 'stackable.responsive-toggle.screen.close', `stackable/responsive-toggle-${ instanceId }`, this.onOtherScreenClose.bind( this ) )
	}

	componentWillUnmount() {
		const { instanceId } = this.props
		removeAction( 'stackable.responsive-toggle.screen.change', `stackable/responsive-toggle-${ instanceId }` )
		removeAction( 'stackable.responsive-toggle.screen.open', `stackable/responsive-toggle-${ instanceId }` )
		removeAction( 'stackable.responsive-toggle.screen.close', `stackable/responsive-toggle-${ instanceId }` )
	}

	render() {
		return (
			<div className="ugb-base-control-multi-label__responsive">
				{ this.props.screens.length > 1 &&
					this.props.screens.map( ( screen, i ) => {
						if ( i > 0 && ! this.state.isScreenPickerOpen && ! this.state.isMouseOver ) {
							return null
						}
						return (
							<div
								key={ i }
							>
								<Button
									className={ this.state.screen === screen ? 'is-active' : '' }
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

export default withInstanceId( ResponsiveToggle )
