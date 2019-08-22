/**
 * External dependencies
 */
import { ProControl } from '~stackable/components'
import classnames from 'classnames'

/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element'

class ProControlButton extends Component {
	constructor() {
		super( ...arguments )
		this.state = {
			isOpen: this.props.initialOpen ? this.props.initialOpen : false,
		}
		this.onClick = this.onClick.bind( this )
	}

	onClick() {
		this.setState( { isOpen: ! this.state.isOpen } )
	}

	render() {
		const wrapperClasses = classnames( [
			'ugb-pro-control-button__wrapper',
		], {
			'ugb-pro-control-button--hidden': ! this.state.isOpen,
		} )

		return (
			<div>
				<button className="ugb-pro-control-more-dots" onClick={ this.onClick }>
					<div className="ugb-pro-control-more-dots__dot"></div>
					<div className="ugb-pro-control-more-dots__dot"></div>
					<div className="ugb-pro-control-more-dots__dot"></div>
				</button>
				<div className={ wrapperClasses } >
					<ProControl
						title={ this.props.title }
						description={ this.props.description }
						button={ this.props.button }
					/>
				</div>
			</div>
		)
	}
}

export default ProControlButton
