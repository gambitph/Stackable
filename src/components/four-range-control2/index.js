/**
 * Internal dependencies
 */
import SVGAllImage from './images/all.svg'
import SVGBottomImage from './images/bottom.svg'
import SVGLeftImage from './images/left.svg'
import SVGRightImage from './images/right.svg'
import SVGTopImage from './images/top.svg'
import SVGFullImage from './images/full.svg'
import AdvancedControl, { extractControlProps } from '../base-control2'
import { ResetButton } from '../base-control2/reset-button'

/**
 * External dependencies
 */
import {
	capitalize, first, pick,
} from 'lodash'
import classnames from 'classnames'
import {
	Button,
} from '~stackable/components'
import { useControlHandlers } from '~stackable/components/base-control2/hooks'
import { i18n } from 'stackable'
import RangeControl from '~stackable/components/advanced-range-control2/range-control'

/**
 * WordPress dependencies
 */
import {
	useMemo, useState, Fragment,
} from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import {
	Tooltip,
} from '@wordpress/components'

const FourRangeControl2 = props => {
	const {
		enableTop,
		enableRight,
		enableBottom,
		enableLeft,
		defaultLocked,
		units,
		unit,
		suffixes: _suffixes,

		attribute,
		responsive,
		hover,
		valueCallback,
		changeCallback,
		default: _default,
	} = props

	const enabledLocations = useMemo( () => [
		...( enableTop ? [ 'top' ] : [] ),
		...( enableRight ? [ 'right' ] : [] ),
		...( enableBottom ? [ 'bottom' ] : [] ),
		...( enableLeft ? [ 'left' ] : [] ),
	], [ enableTop, enableRight, enableBottom, enableLeft ] )

	const [ value, onChange ] = useControlHandlers( attribute, responsive, hover, valueCallback, changeCallback, enabledLocations.map( capitalize ) )
	const [ _propsToPass, controlProps ] = extractControlProps( props )

	const valueTop = enableTop ? value[ enabledLocations.findIndex( l => l === 'top' ) ] : undefined
	const valueRight = enableRight ? value[ enabledLocations.findIndex( l => l === 'right' ) ] : undefined
	const valueBottom = enableBottom ? value[ enabledLocations.findIndex( l => l === 'bottom' ) ] : undefined
	const valueLeft = enableLeft ? value[ enabledLocations.findIndex( l => l === 'left' ) ] : undefined

	const onChangeTop = enableTop ? onChange[ enabledLocations.findIndex( l => l === 'top' ) ] : undefined
	const onChangeRight = enableRight ? onChange[ enabledLocations.findIndex( l => l === 'right' ) ] : undefined
	const onChangeBottom = enableBottom ? onChange[ enabledLocations.findIndex( l => l === 'bottom' ) ] : undefined
	const onChangeLeft = enableLeft ? onChange[ enabledLocations.findIndex( l => l === 'left' ) ] : undefined

	const propsToPass = pick( _propsToPass, [
		'min', 'max', 'step', 'placeholder', 'initialPosition', 'sliderMin', 'sliderMax',
	] )

	const enabledValues = useMemo( () => {
		return enabledLocations.reduce( ( v, k ) => ( { ...v, [ k ]: props[ k ] } ), {} )
	}, [ ...enabledLocations ] )

	const firstValue = useMemo( () => {
		const locations = enabledLocations
		if ( locations.length ) {
			return Object.values( enabledValues )
		}
	}, [ JSON.stringify( enabledValues ) ] )

	const [ locked, setLocked ] = useState(
		Object.values( enabledValues ).every( value => value === '' )
			? defaultLocked
			: Object.values( enabledValues ).every( value => value === firstValue )
	)

	// Change the min, max & step values depending on the unit used.
	const i = units.indexOf( unit ) < 0 ? 0 : units.indexOf( unit )
	if ( Array.isArray( props.min ) ) {
		propsToPass.min = props.min[ i ]
	}
	if ( Array.isArray( props.max ) ) {
		propsToPass.max = props.max[ i ]
	}
	if ( Array.isArray( props.sliderMin ) ) {
		propsToPass.sliderMin = props.sliderMin[ i ]
	}
	if ( Array.isArray( props.sliderMax ) ) {
		propsToPass.sliderMax = props.sliderMax[ i ]
	}
	if ( Array.isArray( props.step ) ) {
		propsToPass.step = props.step[ i ]
	}
	if ( Array.isArray( props.placeholder ) ) {
		propsToPass.placeholder = props.placeholder[ i ]
	}
	if ( Array.isArray( props.initialPosition ) ) {
		propsToPass.initialPosition = props.initialPosition[ i ]
	}

	const lockClassNames = classnames( [
		'ugb-four-range-control__lock',
	], {
		'ugb--is-locked': locked,
	} )

	const lockButton = <Button
		className={ lockClassNames }
		onClick={ () => setLocked( ! locked ) }
		isSecondary
		icon={ locked ? <SVGAllImage /> : <SVGFullImage /> }
		label={ locked ? __( 'Individual sides', i18n ) : __( 'All sides', i18n ) }
	/>

	return (
		<AdvancedControl { ...controlProps } after={ lockButton }>
			{ locked && (
				<div className="ugb-four-range-control__range">
					<RangeControl
						onChange={ value => {
							( onChange || [] ).forEach( _onChange => _onChange( value ) )
						} }
						allowReset={ false }
						value={ first( value ) }
						{ ...propsToPass }
					/>
					<ResetButton
						allowReset={ true }
						value={ first( value ) }
						default={ _default }
						onChange={ value => {
							( onChange || [] ).forEach( _onChange => _onChange( value ) )
						} }
					/>
				</div>
			) }

			{ ! locked && (
				<Fragment>
					{ enableTop && (
						<div className="ugb-four-range-control__range">
							<Tooltip text={ __( 'Top', i18n ) }>
								<span className="ugb-four-range-control__icon"><SVGTopImage /></span>
							</Tooltip>
							<RangeControl
								value={ valueTop }
								onChange={ onChangeTop }
								allowReset={ false }
							/>
							<ResetButton
								allowReset={ true }
								value={ valueTop }
								default={ _default }
								onChange={ onChangeTop }
							/>
						</div>
					) }

					{ enableRight && (
						<div className="ugb-four-range-control__range">
							<Tooltip text={ __( 'Right', i18n ) }>
								<span className="ugb-four-range-control__icon"><SVGRightImage /></span>
							</Tooltip>
							<RangeControl
								value={ valueRight }
								onChange={ onChangeRight }
								allowReset={ false }
							/>
							<ResetButton
								allowReset={ true }
								value={ valueRight }
								default={ _default }
								onChange={ onChangeRight }
							/>
						</div>
					) }

					{ enableBottom && (
						<div className="ugb-four-range-control__range">
							<Tooltip text={ __( 'Bottom', i18n ) }>
								<span className="ugb-four-range-control__icon"><SVGBottomImage /></span>
							</Tooltip>
							<RangeControl
								value={ valueBottom }
								onChange={ onChangeBottom }
								allowReset={ false }
							/>
							<ResetButton
								allowReset={ true }
								value={ valueBottom }
								default={ _default }
								onChange={ onChangeBottom }
							/>
						</div>
					) }

					{ enableLeft && (
						<div className="ugb-four-range-control__range">
							<Tooltip text={ __( 'Left', i18n ) }>
								<span className="ugb-four-range-control__icon"><SVGLeftImage /></span>
							</Tooltip>
							<RangeControl
								value={ valueLeft }
								onChange={ onChangeLeft }
								allowReset={ false }
							/>
							<ResetButton
								allowReset={ true }
								value={ valueLeft }
								default={ _default }
								onChange={ onChangeLeft }
							/>
						</div>
					) }

				</Fragment>
			) }
		</AdvancedControl>
	)
}

FourRangeControl2.defaultProps = {
	enableTop: true,
	enableRight: true,
	enableBottom: true,
	enableLeft: true,
	default: 0,
}

export default FourRangeControl2

