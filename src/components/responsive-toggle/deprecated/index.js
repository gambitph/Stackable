import {
	setSelectedScreen,
} from '~stackable/util'

/**
 * WordPress dependencies
 */
import {
	addAction, doAction, removeAction,
} from '@wordpress/hooks'
import { Component } from '@wordpress/element'

class PreviewModeSubscriber extends Component {
	componentDidMount() {
		const { instanceId, previewDeviceType } = this.props
		if ( ! previewDeviceType ) {
			// Add action hooks for WP <= 5.4.
			addAction( 'stackable.responsive-toggle.screen.change', `stackable/responsive-toggle-${ instanceId }`, this.onOtherScreenChange.bind( this ) )
			addAction( 'stackable.responsive-toggle.screen.open', `stackable/responsive-toggle-${ instanceId }`, this.onOtherScreenOpen.bind( this ) )
			addAction( 'stackable.responsive-toggle.screen.close', `stackable/responsive-toggle-${ instanceId }`, this.onOtherScreenClose.bind( this ) )
		}
	}

	componentWillUnmount() {
		const { instanceId, previewDeviceType } = this.props
		if ( ! previewDeviceType ) {
			// Add action hooks for WP <= 5.4.
			removeAction( 'stackable.responsive-toggle.screen.change', `stackable/responsive-toggle-${ instanceId }` )
			removeAction( 'stackable.responsive-toggle.screen.open', `stackable/responsive-toggle-${ instanceId }` )
			removeAction( 'stackable.responsive-toggle.screen.close', `stackable/responsive-toggle-${ instanceId }` )
		}
	}

	onChangeScreenAfter( value ) {
		const { previewDeviceType, setPreviewDeviceType } = this.props
		if ( ! previewDeviceType && ! setPreviewDeviceType ) {
			setSelectedScreen( value )
			doAction( 'stackable.responsive-toggle.screen.change', value )
		}
	}
}

export default PreviewModeSubscriber
