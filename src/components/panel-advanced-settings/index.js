/**
 * A Panel for selecting designs
 */

import { Component, Fragment } from '@wordpress/element'
import { FormToggle, PanelBody } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import classnames from 'classnames'
import { i18n } from 'stackable'

class PanelAdvancedSettings extends Component {
	constructor( props ) {
		super( ...arguments )
		this.state = {
			opened: props.initialOpen,
			checked: props.checked,
			showAdvanced: props.initialAdvanced,
		}
		this.onToggle = this.onToggle.bind( this )
		this.onAdvancedToggle = this.onAdvancedToggle.bind( this )
	}

	onToggle() {
		this.setState( { opened: ! this.state.opened } )
	}

	onAdvancedToggle() {
		this.setState( { showAdvanced: ! this.state.showAdvanced } )
	}

	render() {
		const mainClasses = classnames( [
			'ugb-toggle-panel-body',
		], {
			'ugb-toggle-panel-body--advanced': this.state.showAdvanced,
		} )

		return (
			<PanelBody
				className={ mainClasses }
				initialOpen={ this.props.initialOpen }
				onToggle={ this.onToggle }
				opened={ this.state.opened }
				title={
					<Fragment>
						{ this.props.hasToggle && (
							<span className={ `editor-panel-toggle-settings__panel-title` }>
								<FormToggle
									className="ugb-toggle-panel-form-toggle"
									checked={ this.state.checked }
									onClick={ ev => {
										ev.stopPropagation()
										ev.preventDefault()
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
									} }
									aria-describedby={ this.props.title }
								/>
								{ this.props.title }
							</span>
						) }
						{ ! this.props.hasToggle && this.props.title }
					</Fragment>
				}
			>
				{ this.props.children }
				{ this.state.showAdvanced && this.props.advancedChildren }
				{ this.props.advancedChildren && (
					<button
						className="ugb-panel-advanced-button"
						onClick={ this.onAdvancedToggle }
					>{ this.state.showAdvanced ? __( 'Simple', i18n ) : __( 'Advanced', i18n ) }</button>
				) }
			</PanelBody>
		)
	}
}

PanelAdvancedSettings.defaultProps = {
	title: __( 'Settings', i18n ),
	checked: false,
	initialOpen: false,
	hasToggle: true,
	initialAdvanced: false,
	advancedChildren: null,
}

export default PanelAdvancedSettings
