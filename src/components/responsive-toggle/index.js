import { addAction, doAction, removeAction } from '@wordpress/hooks'
import {
	getSelectedScreen, isScreenPickerOpen, setIsScreenPickerOpen, setSelectedScreen,
} from '@stackable/util'
import { __ } from '@wordpress/i18n'
import { Component } from '@wordpress/element'
import { IconButton } from '@wordpress/components'
import SVGDesktop from './images/desktop.svg'
import SVGMobile from './images/mobile.svg'
import SVGTablet from './images/tablet.svg'
import { withInstanceId } from '@wordpress/compose'

const responsiveIcons = {
	desktop: <SVGDesktop />,
	tablet: <SVGTablet />,
	mobile: <SVGMobile />,
}

const labels = {
	desktop: __( 'Desktop' ),
	tablet: __( 'Tablet' ),
	mobile: __( 'Mobile' ),
}

class ResponsiveToggle extends Component {
	constructor() {
		super( ...arguments )
		this.state = {
			screen: getSelectedScreen(),
			isScreenPickerOpen: isScreenPickerOpen(),
		}
	}

	onChangeUnit( value ) {
		this.props.onChangeUnit( value )
		this.setState( { unit: value } )
	}

	onChangeScreen( value ) {
		const firstScreenOption = this.props.screens[ 0 ]
		if ( ! this.state.isScreenPickerOpen && this.state.screen === firstScreenOption && value === firstScreenOption ) {
			this.setState( { isScreenPickerOpen: true } )
			if ( typeof instanceIdOwner === 'undefined' ) {
				setIsScreenPickerOpen( true )
				doAction( 'stackable.responsive-toggle.screen.open' )
			}
		} else if ( this.state.isScreenPickerOpen && value === firstScreenOption ) {
			this.setState( { isScreenPickerOpen: false } )
			if ( typeof instanceIdOwner === 'undefined' ) {
				setIsScreenPickerOpen( false )
				doAction( 'stackable.responsive-toggle.screen.close' )
			}
		}

		this.props.onChangeScreen( value )
		this.setState( { screen: value } )
		setSelectedScreen( value )
		doAction( 'stackable.responsive-toggle.screen.change', value )
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
						if ( i > 0 && ! this.state.isScreenPickerOpen ) {
							return null
						}
						return (
							<IconButton
								key={ i }
								className={ this.state.screen === screen ? 'is-active' : '' }
								onClick={ () => this.onChangeScreen( screen ) }
								icon={ responsiveIcons[ screen ] }
								label={ labels[ screen ] }
							/>
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
