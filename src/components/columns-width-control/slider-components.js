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
	height: 4,
	backgroundColor: 'rgb(221, 221, 221)',
	transform: 'translate(0%, -50%)',
	borderRadius: 7,
	pointerEvents: 'none',
}

const buttonStyle = {
	backgroundColor: 'var(--wp-admin-theme-color)',
	height: 12,
	width: 12,
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
			value, percent,
		},
		disabled = false,
		handleProps,
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
				...buttonStyle,
			} }
			{ ...handleProps }
		/>
	)
}
