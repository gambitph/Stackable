import { BaseControl, Dashicon, IconButton } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import BaseControlMultiLabel from '../base-control-multi-label'
import classnames from 'classnames'
import { Component } from '@wordpress/element'
import { i18n } from 'stackable'
import { withInstanceId } from '@wordpress/compose'

class FourNumberControl extends Component {
	constructor() {
		super( ...arguments )
		this.state = {
			locked: typeof this.props.locked !== 'undefined' ? this.props.locked : this.props.top === this.props.left && this.props.top === this.props.bottom && this.props.top === this.props.right,
			top: this.props.top || '',
			right: this.props.right || '',
			bottom: this.props.bottom || '',
			left: this.props.left || '',
		}
		this.onToggleLock = this.onToggleLock.bind( this )
		this.onChangeTop = this.onChangeTop.bind( this )
		this.onChangeRight = this.onChangeRight.bind( this )
		this.onChangeBottom = this.onChangeBottom.bind( this )
		this.onChangeLeft = this.onChangeLeft.bind( this )
	}

	onToggleLock() {
		if ( ! this.state.locked ) {
			const value = this.state.top
			this.setState( {
				top: value,
				right: value,
				bottom: value,
				left: value,
			} )
		}
		this.setState( { locked: ! this.state.locked } )
	}

	onChangeTop( event ) {
		const value = event.target.value
		if ( ! this.state.locked ) {
			this.setState( { top: value } )
		} else {
			this.setState( {
				top: value,
				right: value,
				bottom: value,
				left: value,
			} )
		}
	}

	onChangeRight( event ) {
		const value = event.target.value
		if ( ! this.state.locked ) {
			this.setState( { right: value } )
		} else {
			this.setState( {
				top: value,
				right: value,
				bottom: value,
				left: value,
			} )
		}
	}

	onChangeBottom( event ) {
		const value = event.target.value
		if ( ! this.state.locked ) {
			this.setState( { bottom: value } )
		} else {
			this.setState( {
				top: value,
				right: value,
				bottom: value,
				left: value,
			} )
		}
	}

	onChangeLeft( event ) {
		const value = event.target.value
		if ( ! this.state.locked ) {
			this.setState( { left: value } )
		} else {
			this.setState( {
				top: value,
				right: value,
				bottom: value,
				left: value,
			} )
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
							aria-label={ __( 'Top', i18n ) }
							value={ this.state.top }
						/>
						<span>{ __( 'Top', i18n ) }</span>
					</label>
					<label className="ugb-four-number-control__label" htmlFor={ `${ id }-right` }>
						<input
							id={ `${ id }-right` }
							type="number"
							onChange={ this.onChangeRight }
							aria-label={ this.props.label }
							value={ this.state.right }
						/>
						<span>{ __( 'Right', i18n ) }</span>
					</label>
					<label className="ugb-four-number-control__label" htmlFor={ `${ id }-bottom` }>
						<input
							id={ `${ id }-bottom` }
							type="number"
							onChange={ this.onChangeBottom }
							aria-label={ this.props.label }
							value={ this.state.bottom }
						/>
						<span>{ __( 'Bottom', i18n ) }</span>
					</label>
					<label className="ugb-four-number-control__label" htmlFor={ `${ id }-left` }>
						<input
							id={ `${ id }-left` }
							type="number"
							onChange={ this.onChangeLeft }
							aria-label={ this.props.label }
							value={ this.state.left }
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
	locked: undefined,
	top: '',
	right: '',
	bottom: '',
	left: '',
	units: [ 'px' ],
	unit: 'px',
	onChangeUnit: () => {},
	screens: [ 'desktop' ],
}

export default withInstanceId( FourNumberControl )
