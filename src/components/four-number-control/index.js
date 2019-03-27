import { BaseControl, Dashicon, IconButton } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import classnames from 'classnames'
import { Component } from '@wordpress/element'
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
				label={ this.props.label }
				help={ this.props.help }
				className={ classnames( 'ugb-four-number-control', this.props.className ) }
			>
				<div className="ugb-four-number-control__wrapper">
					<label className="ugb-four-number-control__label" htmlFor={ `${ id }-top` }>
						<input
							id={ `${ id }-top` }
							type="number"
							onChange={ this.onChangeTop }
							aria-label={ __( 'Top' ) }
							value={ this.state.top }
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
}

export default withInstanceId( FourNumberControl )
