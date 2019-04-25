import { BaseControl, Dashicon, IconButton } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import BaseControlMultiLabel from '../base-control-multi-label'
import classnames from 'classnames'
import { Component } from '@wordpress/element'
import { omit } from 'lodash'
import { withInstanceId } from '@wordpress/compose'

class FourNumberControl extends Component {
	constructor() {
		super( ...arguments )

		// The directions to omit from all saving.
		this.omit = [
			...( ! this.props.enableTop ? [ 'top' ] : [] ),
			...( ! this.props.enableRight ? [ 'right' ] : [] ),
			...( ! this.props.enableBottom ? [ 'bottom' ] : [] ),
			...( ! this.props.enableLeft ? [ 'left' ] : [] ),
		]

		// Need to set the state first so we can check if we should lock the inputs.
		this.state = {
			top: this.props.top,
			right: this.props.right,
			bottom: this.props.bottom,
			left: this.props.left,
		}

		// Locked state.
		const values = this.getEnabledValues()
		const isEqualValues = ! values.length ? true : values.every( value => value === values[ 0 ] )
		this.state.locked = typeof this.props.locked !== 'undefined' ? this.props.locked : isEqualValues

		this.onToggleLock = this.onToggleLock.bind( this )
		this.onChangeTop = this.onChangeTop.bind( this )
		this.onChangeRight = this.onChangeRight.bind( this )
		this.onChangeBottom = this.onChangeBottom.bind( this )
		this.onChangeLeft = this.onChangeLeft.bind( this )
	}

	getEnabledValues() {
		return [
			...( this.props.enableTop ? [ this.state.top ] : [] ),
			...( this.props.enableRight ? [ this.state.right ] : [] ),
			...( this.props.enableBottom ? [ this.state.bottom ] : [] ),
			...( this.props.enableLeft ? [ this.state.left ] : [] ),
		]
	}

	getFirstEnabledValue() {
		return this.getEnabledValues().shift()
	}

	onToggleLock() {
		if ( ! this.state.locked ) {
			const value = this.getFirstEnabledValue()
			this.setState( omit( {
				top: value,
				right: value,
				bottom: value,
				left: value,
			}, this.omit ) )
		}
		this.setState( { locked: ! this.state.locked } )
	}

	onChangeTop( event ) {
		const value = event.target.value
		if ( ! this.state.locked ) {
			this.setState( { top: value } )
		} else {
			this.setState( omit( {
				top: value,
				right: value,
				bottom: value,
				left: value,
			}, this.omit ) )
		}
	}

	onChangeRight( event ) {
		const value = event.target.value
		if ( ! this.state.locked ) {
			this.setState( { right: value } )
		} else {
			this.setState( omit( {
				top: value,
				right: value,
				bottom: value,
				left: value,
			}, this.omit ) )
		}
	}

	onChangeBottom( event ) {
		const value = event.target.value
		if ( ! this.state.locked ) {
			this.setState( { bottom: value } )
		} else {
			this.setState( omit( {
				top: value,
				right: value,
				bottom: value,
				left: value,
			}, this.omit ) )
		}
	}

	onChangeLeft( event ) {
		const value = event.target.value
		if ( ! this.state.locked ) {
			this.setState( { left: value } )
		} else {
			this.setState( omit( {
				top: value,
				right: value,
				bottom: value,
				left: value,
			}, this.omit ) )
		}
	}

	componentDidUpdate( prevProps, prevState ) {
		if ( this.props.top !== prevProps.top ) {
			this.setState( { top: this.props.top } )
		}
		if ( this.props.right !== prevProps.right ) {
			this.setState( { right: this.props.right } )
		}
		if ( this.props.bottom !== prevProps.bottom ) {
			this.setState( { bottom: this.props.bottom } )
		}
		if ( this.props.left !== prevProps.left ) {
			this.setState( { left: this.props.left } )
		}

		if ( this.state.top === prevState.top &&
			 this.state.right === prevState.right &&
			 this.state.bottom === prevState.bottom &&
			 this.state.left === prevState.left ) {
			return
		}

		this.props.onChange( {
			top: this.state.top,
			right: this.state.right,
			bottom: this.state.bottom,
			left: this.state.left,
		} )
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
							aria-label={ __( 'Top' ) }
							value={ this.state.top }
							disabled={ ! this.props.enableTop }
						/>
						<span>{ __( 'Top' ) }</span>
					</label>
					<label className="ugb-four-number-control__label" htmlFor={ `${ id }-right` }>
						<input
							id={ `${ id }-right` }
							type="number"
							onChange={ this.onChangeRight }
							aria-label={ this.props.label }
							value={ this.state.right }
							disabled={ ! this.props.enableRight }
						/>
						<span>{ __( 'Right' ) }</span>
					</label>
					<label className="ugb-four-number-control__label" htmlFor={ `${ id }-bottom` }>
						<input
							id={ `${ id }-bottom` }
							type="number"
							onChange={ this.onChangeBottom }
							aria-label={ this.props.label }
							value={ this.state.bottom }
							disabled={ ! this.props.enableBottom }
						/>
						<span>{ __( 'Bottom' ) }</span>
					</label>
					<label className="ugb-four-number-control__label" htmlFor={ `${ id }-left` }>
						<input
							id={ `${ id }-left` }
							type="number"
							onChange={ this.onChangeLeft }
							aria-label={ this.props.label }
							value={ this.state.left }
							disabled={ ! this.props.enableLeft }
						/>
						<span>{ __( 'Left' ) }</span>
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
	locked: undefined,
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
