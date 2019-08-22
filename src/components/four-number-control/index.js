/**
 * Internal dependencies
 */
import BaseControlMultiLabel from '../base-control-multi-label'

/**
 * WordPress dependencies
 */
import {
	BaseControl, Dashicon, IconButton,
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { Component } from '@wordpress/element'
import { i18n } from 'stackable'
import { pick } from 'lodash'
import { withInstanceId } from '@wordpress/compose'

class FourNumberControl extends Component {
	constructor() {
		super( ...arguments )

		// Locked state.
		const values = this.getEnabledValues()
		const isEqualValues = ! values.length ? true : values.every( value => value === values[ 0 ] )
		const isDefaults = values.every( value => value === '' )

		this.state = {
			locked: isDefaults ? this.props.defaultLocked : isEqualValues,
		}

		this.onToggleLock = this.onToggleLock.bind( this )
		this.onChangeTop = this.onChangeTop.bind( this )
		this.onChangeRight = this.onChangeRight.bind( this )
		this.onChangeBottom = this.onChangeBottom.bind( this )
		this.onChangeLeft = this.onChangeLeft.bind( this )
	}

	getEnabledValues() {
		return [
			...( this.props.enableTop ? [ this.props.top ] : [] ),
			...( this.props.enableRight ? [ this.props.right ] : [] ),
			...( this.props.enableBottom ? [ this.props.bottom ] : [] ),
			...( this.props.enableLeft ? [ this.props.left ] : [] ),
		]
	}

	getEnabledLocations() {
		return [
			...( this.props.enableTop ? [ 'top' ] : [] ),
			...( this.props.enableRight ? [ 'right' ] : [] ),
			...( this.props.enableBottom ? [ 'bottom' ] : [] ),
			...( this.props.enableLeft ? [ 'left' ] : [] ),
		]
	}

	filterOnlyEnabled( forSaving = {} ) {
		return pick( forSaving, this.getEnabledLocations() )
	}

	onToggleLock() {
		this.setState( { locked: ! this.state.locked } )
	}

	onChangeTop( event ) {
		const value = event.target.value
		const newValue = ! value && value !== 0 ? '' : value
		if ( ! this.state.locked ) {
			this.props.onChange( {
				...this.getEnabledValues(),
				top: newValue,
			} )
		} else {
			this.props.onChange( this.filterOnlyEnabled( {
				top: newValue,
				right: newValue,
				bottom: newValue,
				left: newValue,
			} ) )
		}
	}

	onChangeRight( event ) {
		const value = event.target.value
		const newValue = ! value && value !== 0 ? '' : value
		if ( ! this.state.locked ) {
			this.props.onChange( {
				...this.getEnabledValues(),
				right: newValue,
			} )
		} else {
			this.props.onChange( this.filterOnlyEnabled( {
				top: newValue,
				right: newValue,
				bottom: newValue,
				left: newValue,
			} ) )
		}
	}

	onChangeBottom( event ) {
		const value = event.target.value
		const newValue = ! value && value !== 0 ? '' : value
		if ( ! this.state.locked ) {
			this.props.onChange( {
				...this.getEnabledValues(),
				bottom: newValue,
			} )
		} else {
			this.props.onChange( this.filterOnlyEnabled( {
				top: newValue,
				right: newValue,
				bottom: newValue,
				left: newValue,
			} ) )
		}
	}

	onChangeLeft( event ) {
		const value = event.target.value
		const newValue = ! value && value !== 0 ? '' : value
		if ( ! this.state.locked ) {
			this.props.onChange( {
				...this.getEnabledValues(),
				left: newValue,
			} )
		} else {
			this.props.onChange( this.filterOnlyEnabled( {
				top: newValue,
				right: newValue,
				bottom: newValue,
				left: newValue,
			} ) )
		}
	}

	render() {
		const { instanceId } = this.props
		const id = `ugb-four-number-control-${ instanceId }__item-`

		return (
			<BaseControl
				help={ this.props.help }
				className={ classnames( 'ugb-four-number-control', this.props.className ) }
			>
				<BaseControlMultiLabel
					label={ this.props.label }
					units={ this.props.units }
					unit={ this.props.unit }
					onChangeUnit={ this.props.onChangeUnit }
					screens={ this.props.screens }
				/>
				<div className="ugb-four-number-control__wrapper">
					<label className="ugb-four-number-control__label" htmlFor={ `${ id }-top` }>
						<input
							id={ `${ id }-top` }
							type="number"
							onChange={ this.onChangeTop }
							aria-label={ __( 'Top', i18n ) }
							value={ this.props.top }
							placeholder={ this.props.enableTop ? '' : __( 'auto', i18n ) }
							disabled={ ! this.props.enableTop }
						/>
						<span>{ __( 'Top', i18n ) }</span>
					</label>
					<label className="ugb-four-number-control__label" htmlFor={ `${ id }-right` }>
						<input
							id={ `${ id }-right` }
							type="number"
							onChange={ this.onChangeRight }
							aria-label={ this.props.label }
							value={ this.props.right }
							placeholder={ this.props.enableRight ? '' : __( 'auto', i18n ) }
							disabled={ ! this.props.enableRight }
						/>
						<span>{ __( 'Right', i18n ) }</span>
					</label>
					<label className="ugb-four-number-control__label" htmlFor={ `${ id }-bottom` }>
						<input
							id={ `${ id }-bottom` }
							type="number"
							onChange={ this.onChangeBottom }
							aria-label={ this.props.label }
							value={ this.props.bottom }
							placeholder={ this.props.enableBottom ? '' : __( 'auto', i18n ) }
							disabled={ ! this.props.enableBottom }
						/>
						<span>{ __( 'Bottom', i18n ) }</span>
					</label>
					<label className="ugb-four-number-control__label" htmlFor={ `${ id }-left` }>
						<input
							id={ `${ id }-left` }
							type="number"
							onChange={ this.onChangeLeft }
							aria-label={ this.props.label }
							value={ this.props.left }
							placeholder={ this.props.enableLeft ? '' : __( 'auto', i18n ) }
							disabled={ ! this.props.enableLeft }
						/>
						<span>{ __( 'Left', i18n ) }</span>
					</label>
					<IconButton
						className={ this.state.locked ? 'ugb--is-locked' : '' }
						onClick={ this.onToggleLock }
						icon={ (
							<Dashicon
								icon={ this.state.locked ? 'admin-links' : 'editor-unlink' }
								size="16"
							/>
						) }
					>
					</IconButton>
				</div>
			</BaseControl>
		)
	}
}

FourNumberControl.defaultProps = {
	onChange: () => {},
	defaultLocked: true,
	top: '',
	right: '',
	bottom: '',
	left: '',
	units: [ 'px' ],
	unit: 'px',
	onChangeUnit: () => {},
	screens: [ 'desktop' ],
	enableTop: true,
	enableRight: true,
	enableBottom: true,
	enableLeft: true,
}

export default withInstanceId( FourNumberControl )
