/**
 * Internal dependencies
 */
import BaseControlMultiLabel from '../base-control-multi-label'
// import SVGAllImage from './images/all.svg'
import SVGBottomImage from './images/bottom.svg'
// import SVGHorizontalImage from './images/horizontal.svg'
import SVGLeftImage from './images/left.svg'
import SVGRightImage from './images/right.svg'
import SVGTopImage from './images/top.svg'

/**
 * WordPress dependencies
 */
import {
	BaseControl, Dashicon, IconButton, RangeControl, Tooltip,
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { Component, Fragment } from '@wordpress/element'
// import SVGVerticalImage from './images/vertical.svg'
/**
 * External dependencies
 */
import classnames from 'classnames'
import { i18n } from 'stackable'
import { pick } from 'lodash'

class FourRangeControl extends Component {
	constructor() {
		super( ...arguments )

		// Locked state.
		const values = this.getEnabledValues()
		const firstValue = this.firstValue()
		const isEqualValues = Object.values( values ).every( value => value === firstValue )
		const isDefaults = Object.values( values ).every( value => value === '' )

		this.state = {
			locked: isDefaults ? this.props.defaultLocked : isEqualValues,
		}

		this.onToggleLock = this.onToggleLock.bind( this )
		this.onChangeAll = this.onChangeAll.bind( this )
		this.onChangeTop = this.onChangeTop.bind( this )
		this.onChangeRight = this.onChangeRight.bind( this )
		this.onChangeBottom = this.onChangeBottom.bind( this )
		this.onChangeLeft = this.onChangeLeft.bind( this )
	}

	getEnabledValues() {
		return this.getEnabledLocations().reduce( ( values, key ) => {
			return {
				...values,
				[ key ]: this.props[ key ],
			}
		}, {} )
	}

	getEnabledLocations() {
		return [
			...( this.props.enableTop ? [ 'top' ] : [] ),
			...( this.props.enableRight ? [ 'right' ] : [] ),
			...( this.props.enableBottom ? [ 'bottom' ] : [] ),
			...( this.props.enableLeft ? [ 'left' ] : [] ),
		]
	}

	firstValue() {
		const locations = this.getEnabledLocations()
		if ( locations.length ) {
			return Object.values( this.getEnabledValues() )[ 0 ]
		}
		return ''
	}

	filterOnlyEnabled( forSaving = {} ) {
		return pick( forSaving, this.getEnabledLocations() )
	}

	onToggleLock() {
		this.setState( { locked: ! this.state.locked } )
	}

	onChangeAll( value ) {
		const newValue = ! value && value !== 0 ? '' : value
		this.props.onChange( this.filterOnlyEnabled( {
			top: newValue,
			right: newValue,
			bottom: newValue,
			left: newValue,
		} ) )
	}

	onChangeTop( value ) {
		this.props.onChange( {
			...this.getEnabledValues(),
			top: ! value && value !== 0 ? '' : value,
		} )
	}

	onChangeRight( value ) {
		this.props.onChange( {
			...this.getEnabledValues(),
			right: ! value && value !== 0 ? '' : value,
		} )
	}

	onChangeBottom( value ) {
		this.props.onChange( {
			...this.getEnabledValues(),
			bottom: ! value && value !== 0 ? '' : value,
		} )
	}

	onChangeLeft( value ) {
		this.props.onChange( {
			...this.getEnabledValues(),
			left: ! value && value !== 0 ? '' : value,
		} )
	}

	render() {
		const {
			instanceId, units, unit,
		} = this.props
		const id = `ugb-four-range-control-${ instanceId }__item-`
		const propsToPass = {
			min: this.props.min,
			max: this.props.max,
			step: this.props.step,
			placeholder: this.props.placeholder,
			initialPosition: this.props.initialPosition,
		}

		// Change the min, max & step values depending on the unit used.
		const i = units.indexOf( unit ) < 0 ? 0 : units.indexOf( unit )
		if ( Array.isArray( this.props.min ) ) {
			propsToPass.min = this.props.min[ i ]
		}
		if ( Array.isArray( this.props.max ) ) {
			propsToPass.max = this.props.max[ i ]
		}
		if ( Array.isArray( this.props.step ) ) {
			propsToPass.step = this.props.step[ i ]
		}
		if ( Array.isArray( this.props.placeholder ) ) {
			propsToPass.placeholder = this.props.placeholder[ i ]
		}
		if ( Array.isArray( this.props.initialPosition ) ) {
			propsToPass.initialPosition = this.props.initialPosition[ i ]
		}

		const lockClassNames = classnames( [
			'ugb-four-range-control__lock',
		], {
			'ugb--is-locked': this.state.locked,
		} )

		const lockButton = <IconButton
			className={ lockClassNames }
			onClick={ this.onToggleLock }
			icon={ (
				<Dashicon
					icon={ this.state.locked ? 'admin-links' : 'editor-unlink' }
					size="16"
				/>
			) }
		>
		</IconButton>

		// The ALL option can either be 'all', 'vertical', or 'horizontal'.
		// const allLabel = this.props.enableTop && this.props.enableBottom && ! this.props.enableRight && ! this.props.enableLeft ? __( 'Vertical', i18n ) :
		// 	! this.props.enableTop && ! this.props.enableBottom && this.props.enableRight && this.props.enableLeft ? __( 'Horizontal', i18n ) :
		// 		__( 'All', i18n )
		// const allIcon = this.props.enableTop && this.props.enableBottom && ! this.props.enableRight && ! this.props.enableLeft ? <SVGVerticalImage /> :
		// 	! this.props.enableTop && ! this.props.enableBottom && this.props.enableRight && this.props.enableLeft ? <SVGHorizontalImage /> :
		// 		( <SVGAllImage /> )

		return (
			<BaseControl
				help={ this.props.help }
				className={ classnames( 'ugb-four-range-control', this.props.className ) }
			>
				<BaseControlMultiLabel
					label={ this.props.label }
					units={ this.props.units }
					unit={ this.props.unit }
					onChangeUnit={ this.props.onChangeUnit }
					screens={ this.props.screens }
					afterButton={ lockButton }
				/>
				{ this.state.locked &&
					<div className="ugb-four-range-control__range">
						{

							/* <Tooltip text={ allLabel }>
								<span className="ugb-four-range-control__icon">{ allIcon }</span>
							</Tooltip> */
						}
						<RangeControl
							id={ `${ id }-all` }
							value={ this.firstValue() }
							onChange={ this.onChangeAll }
							allowReset={ true }
							{ ...propsToPass }
						/>
					</div>
				}
				{ ! this.state.locked &&
					<Fragment>
						{ this.props.enableTop &&
							<div className="ugb-four-range-control__range">
								<Tooltip text={ __( 'Top', i18n ) }>
									<span className="ugb-four-range-control__icon"><SVGTopImage /></span>
								</Tooltip>
								<RangeControl
									id={ `${ id }-top` }
									value={ this.props.top }
									onChange={ this.onChangeTop }
									allowReset={ true }
									{ ...propsToPass }
								/>
							</div>
						}
						{ this.props.enableRight &&
							<div className="ugb-four-range-control__range">
								<Tooltip text={ __( 'Right', i18n ) }>
									<span className="ugb-four-range-control__icon"><SVGRightImage /></span>
								</Tooltip>
								<RangeControl
									id={ `${ id }-right` }
									value={ this.props.right }
									onChange={ this.onChangeRight }
									allowReset={ true }
									{ ...propsToPass }
								/>
							</div>
						}
						{ this.props.enableBottom &&
							<div className="ugb-four-range-control__range">
								<Tooltip text={ __( 'Bottom', i18n ) }>
									<span className="ugb-four-range-control__icon"><SVGBottomImage /></span>
								</Tooltip>
								<RangeControl
									id={ `${ id }-bottom` }
									value={ this.props.bottom }
									onChange={ this.onChangeBottom }
									allowReset={ true }
									{ ...propsToPass }
								/>
							</div>
						}
						{ this.props.enableLeft &&
							<div className="ugb-four-range-control__range">
								<Tooltip text={ __( 'Left', i18n ) }>
									<span className="ugb-four-range-control__icon"><SVGLeftImage /></span>
								</Tooltip>
								<RangeControl
									id={ `${ id }-left` }
									value={ this.props.left }
									onChange={ this.onChangeLeft }
									allowReset={ true }
									{ ...propsToPass }
								/>
							</div>
						}
					</Fragment>
				}
			</BaseControl>
		)
	}
}

FourRangeControl.defaultProps = {
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
	min: 0,
	max: 50,
	step: 1,
	placeholder: '',
	initialPosition: '',
}

export default FourRangeControl
