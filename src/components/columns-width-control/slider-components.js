import { Fragment } from '@wordpress/element'

/* Slider rail */
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

/* Slider handle */
export const Handle = props => {
	const {
		domain: [ min, max ],
		handle: {
			id, value, percent,
		},
		disabled = false,
		getHandleProps,
	} = props
	return (
		<button
			role="slider"
			aria-valuemin={ min }
			aria-valuemax={ max }
			aria-valuenow={ value }
			disabled={ disabled }
			style={ {
				left: `${ percent }%`,
			} }
			{ ...getHandleProps( id ) }
		/>
	)
}
