import { Fragment } from '@wordpress/element'

// *******************************************************
// RAIL
// *******************************************************
const railOuterStyle = {
	position: 'absolute',
	width: '100%',
	height: 42,
	transform: 'translate(0%, -50%)',
	borderRadius: 7,
	cursor: 'pointer',
}

const railInnerStyle = {
	position: 'absolute',
	width: '100%',
	height: 3,
	backgroundColor: '#e2e4e7',
	transform: 'translate(0%, -50%)',
	borderRadius: 7,
	pointerEvents: 'none',
}

export const SliderRail = ( { getRailProps } ) => {
	return (
		<Fragment>
			<div style={ railOuterStyle } { ...getRailProps() } />
			<div style={ railInnerStyle } />
		</Fragment>
	)
}

// *******************************************************
// KEYBOARD HANDLE COMPONENT
// Uses a button to allow keyboard events
// *******************************************************
export const KeyboardHandle = props => {
	// console.log( props )
	const {
		domain: [ min, max ],
		handle: {
			id, value, percent,
		},
		disabled = false,
		getHandleProps,
	} = props
	// console.log( getHandleProps( id ) )
	return (
		<button
			role="slider"
			aria-valuemin={ min }
			aria-valuemax={ max }
			aria-valuenow={ value }
			style={ {
				left: `${ percent }%`,
			} }
			{ ...getHandleProps( id ) }
		/>
	)
}

// *******************************************************
// TRACK COMPONENT
// *******************************************************
export const Track = ( {
	source,
	target,
	getTrackProps,
	disabled = false,
} ) => {
	return (
		<div
			style={ {
				position: 'absolute',
				transform: 'translate(0%, -50%)',
				zIndex: 1,
				height: 3,
				backgroundColor: '#e2e4e7',
				borderRadius: 7,
				cursor: 'pointer',
				left: `${ source.percent }%`,
				width: `${ target.percent - source.percent }%`,
			} }
			{ ...getTrackProps() }
		/>
	)
}

// *******************************************************
// TICK COMPONENT
// *******************************************************
export const Tick = ( {
	tick, count, format = d => d,
} ) => {
	return (
		<div>
			<div
				style={ {
					position: 'absolute',
					marginTop: 14,
					width: 1,
					height: 5,
					backgroundColor: 'rgb(200,200,200)',
					left: `${ tick.percent }%`,
				} }
			/>
			{ /* <div
				style={ {
					position: 'absolute',
					marginTop: 22,
					fontSize: 10,
					textAlign: 'center',
					marginLeft: `${ -( 100 / count ) / 2 }%`,
					width: `${ 100 / count }%`,
					left: `${ tick.percent }%`,
				} }
			>
				{ format( tick.value ) }
			</div> */ }
		</div>
	)
}
