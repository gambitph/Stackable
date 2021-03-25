/**
 * External dependencies
 */
import {
	getSelectedScreen,
} from '~stackable/util'
import { i18n } from 'stackable'
import { lowerCase, startCase } from 'lodash'

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
import { __ } from '@wordpress/i18n'
import { Popover } from '@wordpress/components'
import {
	compose,
} from '@wordpress/compose'
import {
	withDispatch, withSelect,
} from '@wordpress/data'
import { Component } from '@wordpress/element'
import { doAction } from '@wordpress/hooks'

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
			isMouseOver: false,
		}
	}

	onChangeScreen( value ) {
		const {
			setPreviewDeviceType,
		} = this.props
		doAction( 'stackable.when-responsive-screen', value )
		if ( setPreviewDeviceType ) {
			setPreviewDeviceType( startCase( value ) )
		}
	}

	render() {
		const selectedScreen = this.props.previewDeviceType || getSelectedScreen()

		return (
			<div className="ugb-base-control-multi-label__responsive">
				{ this.props.screens.length > 1 &&
					this.props.screens.map( ( screen, i ) => {
						if ( i > 0 && selectedScreen === 'desktop' && ! this.state.isMouseOver ) {
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

if ( withDispatch( dispatch => ( { setPreviewDeviceType: dispatch( 'core/edit-post' )?.__experimentalSetPreviewDeviceType } ) ) ) {
	composeList.push( withDispatch( dispatch => ( { setPreviewDeviceType: dispatch( 'core/edit-post' )?.__experimentalSetPreviewDeviceType } ) ) )
}

if ( withSelect( select => ( { previewDeviceType: lowerCase( select( 'core/edit-post' )?.__experimentalGetPreviewDeviceType?.() ) } ) ) ) {
	composeList.push( withSelect( select => ( { previewDeviceType: lowerCase( select( 'core/edit-post' )?.__experimentalGetPreviewDeviceType?.() ) } ) ) )
}

export default compose( ...composeList )( ResponsiveToggle )
