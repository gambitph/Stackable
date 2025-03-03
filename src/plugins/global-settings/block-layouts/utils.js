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
			{ props.children }
		</div>
	</>
}

export const getDefault = ( property, device ) => {
	const defaults = {
		'--stk-container-padding': {
			desktop: {
				top: 32,
				right: 32,
				bottom: 32,
				left: 32,
			},
			mobile: {
				top: 24,
				right: 24,
				bottom: 24,
				left: 24,
			},
		},
		'--stk-block-background-padding': {
			desktop: {
				top: 24,
				right: 24,
				bottom: 24,
				left: 24,
			},
			mobile: {
				top: 16,
				right: 16,
				bottom: 16,
				left: 16,
			},
		},
		'--stk-button-padding': {
			desktop: {
				top: 12,
				right: 16,
				bottom: 12,
				left: 16,
			},
		},
		'--stk-icon-button-padding': {
			desktop: {
				top: 12,
				right: 12,
				bottom: 12,
				left: 12,
			},
		},
	}

	const defaultValue = defaults[ property ]?.[ device ] ?? defaults[ property ]?.desktop

	return defaultValue ?? ( {
		top: 0, right: 0, bottom: 0, left: 0,
	} )
}
