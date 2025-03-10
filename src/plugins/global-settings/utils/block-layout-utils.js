
import { select } from '@wordpress/data'

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

export const getDefault = ( defaults, property, device ) => {
	const defaultValue = defaults[ property ]?.[ device ] ?? defaults[ property ]?.desktop

	return defaultValue ?? ( {
		top: 0, right: 0, bottom: 0, left: 0,
	} )
}

export const getBlockLayoutDefault = ( property, device = 'desktop' ) => {
	const spacingAndBorders = select( 'stackable/global-spacing-and-borders' ).getBlockLayouts()
	const buttonsAndIcons = select( 'stackable/global-buttons-and-icons' ).getBlockLayouts()

	const blockLayouts = { ...spacingAndBorders, ...buttonsAndIcons }

	let defaultValue = blockLayouts?.[ property ]?.[ device ]

	if ( device === 'mobile' && ! defaultValue ) {
		defaultValue = blockLayouts[ property ].tablet
	}

	if ( ( device === 'mobile' || device === 'tablet' ) && ! defaultValue ) {
		defaultValue = blockLayouts[ property ].desktop
	}

	return defaultValue || ''
}
