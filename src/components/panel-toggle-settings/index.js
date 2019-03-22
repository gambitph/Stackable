/**
 * A Panel for selecting designs
 */

import { __, sprintf } from '@wordpress/i18n'
import { Component } from '@wordpress/element'
import { ColorIndicator, PanelBody, FormToggle } from '@wordpress/components'
import { ColorPaletteControl } from '@stackable/components'

class PanelToggleSettings extends Component {
	constructor( props ) {
		super( ...arguments )
		this.state = {
			opened: props.initialOpen,
			checked: props.checked,
		}
		this.onToggle = this.onToggle.bind( this )
	}

	onToggle() {
		this.setState( { opened: ! this.state.opened } )
	}

	render() {
		return (
			<PanelBody
				className="ugb-toggle-panel-body"
				initialOpen={ this.props.initialOpen }
				onToggle={ this.onToggle }
				opened={ this.state.opened }
				// { ...this.props }
				title={
					<span className={ `editor-panel-toggle-settings__panel-title` }>
						<FormToggle
							className="ugb-toggle-panel-form-toggle"
							checked={ this.state.checked }
							onClick={ ev => {

								console.log('checked', ev, ev.stopPropagation())
								ev.preventDefault()
								ev.currentTarget.blur()
								const checked = this.state.checked
								if ( checked && this.state.opened ) {
									this.onToggle()
								} else if ( ! checked && ! this.state.opened ) {
									this.onToggle()
								}
								this.setState( { checked: ! checked } )
								if ( this.props.onChange ) {
									this.props.onChange( ! checked )
								}
							}}
							onChange={ ev => {
								// const checked = this.state.checked
								// if ( checked && this.state.opened ) {
								// 	this.onToggle()
								// } else if ( ! checked && ! this.state.opened ) {
								// 	this.onToggle()
								// }
								// this.setState( { checked: ! checked } )
								// if ( this.props.onChange ) {
								// 	this.props.onChange( ! checked )
								// }

							} }
							// id={ id }
							// checked={ checked }
							// onChange={ this.onChange }
							// aria-describedby={ title }
						/>
						{ this.props.title }
					</span>
				}
			>
				{ this.props.children }
			</PanelBody>
		)
	}
}

PanelToggleSettings.defaultProps = {
	title: __( 'Settings' ),
	checked: false,
	initialOpen: false,
}

export default PanelToggleSettings
