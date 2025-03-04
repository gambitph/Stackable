
import blockLayoutDefaults from './defaults.json'

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

export const getBlockLayoutDefaults = () => {
	const blockLayouts = { ...blockLayoutDefaults }
	return blockLayouts
}

export const getDefault = ( property, device ) => {
	const defaults = getBlockLayoutDefaults()

	const defaultValue = defaults[ property ]?.[ device ] ?? defaults[ property ]?.desktop

	return defaultValue ?? ( {
		top: 0, right: 0, bottom: 0, left: 0,
	} )
}
