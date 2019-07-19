/**
 * A Panel for selecting designs
 */

import { addFilter, removeFilter } from '@wordpress/hooks'
import { Component, Fragment } from '@wordpress/element'
import { FormToggle, PanelBody } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import classnames from 'classnames'
import { i18n } from 'stackable'

let instanceId = 1

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
		this.instanceId = instanceId++
	}

	checkIfAttributeShouldToggleOn( attributes, blockProps ) {
		if ( ! this.props.hasToggle || ! this.props.toggleAttributeName || ! this.props.toggleOnSetAttributes.length ) {
			return attributes
		}

		// Don't do anything if turned on already.
		if ( blockProps.attributes[ this.props.toggleAttributeName ] ) {
			return attributes
		}

		// Check if an attribute we're watching for was modified with a value.
		let checkToggle = false
		this.props.toggleOnSetAttributes.some( attrName => {
			if ( Object.keys( attributes ).includes( attrName ) ) {
				if ( attributes[ attrName ] !== '' ) {
					checkToggle = true
					return true
				}
			}
			return false
		} )

		// Toggle on the "show" attribute along with the other attributes being set.
		if ( checkToggle ) {
			this.setState( { checked: true } )
			return {
				...attributes,
				[ this.props.toggleAttributeName ]: true,
			}
		}

		return attributes
	}

	componentDidMount() {
		addFilter( 'stackable.setAttributes', `stackable/panel-advanced-settings-${ this.instanceId }`, this.checkIfAttributeShouldToggleOn.bind( this ), 9 )
	}

	componentWillUnmount() {
		removeFilter( 'stackable.setAttributes', `stackable/panel-advanced-settings-${ this.instanceId }` )
	}

	onToggle() {
		this.setState( { opened: ! this.state.opened } )
	}

	onAdvancedToggle() {
		this.setState( { showAdvanced: ! this.state.showAdvanced } )
	}

	render() {
		const mainClasses = classnames( [
			this.props.className,
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
	className: '',
	title: __( 'Settings', i18n ),
	checked: false,
	onChange: null,
	initialOpen: false,
	hasToggle: true,
	initialAdvanced: false,
	advancedChildren: null,
	toggleOnSetAttributes: [],
	toggleAttributeName: '',
}

export default PanelAdvancedSettings
