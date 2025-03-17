
export const STATES = {
	ALL: {
		responsive: true, hover: true, unit: false,
	},
	ALL_UNIT: {
		responsive: true, hover: true, unit: true,
	},
	RESPONSIVE: {
		responsive: true, hover: false, unit: false,
	},
	RESPONSIVE_UNIT: {
		responsive: true, hover: false, unit: true,
	},
	HOVER: {
		responsive: false, hover: true, unit: false,
	},
	HOVER_UNIT: {
		responsive: false, hover: true, unit: true,
	},
}

export const hoverState = {
	normal: '',
	hover: 'Hover',
	'parent-hover': 'ParentHover',
}

export const LayoutSettings = props => {
	return <>
		<div className="ugb-global-block-layouts__section-settings">
			<p className="ugb-global-block-layouts__section-title">{ props.title }</p>
			<p>{ props.description }</p>
			{ props.children }
		</div>
	</>
}

export const getDefault = ( defaults, property, device ) => {
	let defaultValue = defaults[ property ]?.[ device ]

	if ( ! defaultValue && device === 'mobile' ) {
		defaultValue = defaults[ property ]?.tablet
	}

	if ( ! defaultValue && ( device === 'mobile' || device === 'tablet' ) ) {
		defaultValue = defaults[ property ]?.desktop
	}

	return defaultValue ?? ''
}
