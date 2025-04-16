
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

// Listener when a class is changed on an element.
export const onClassChange = ( node, callback ) => {
	let lastClassString = node.classList.toString()

	const mutationObserver = new MutationObserver( mutationList => {
		for ( const item of mutationList ) {
			if ( item.attributeName === 'class' ) {
				const classString = node.classList.toString()
				if ( classString !== lastClassString ) {
					callback( mutationObserver )
					lastClassString = classString
					break
				}
			}
	  }
	} )

	mutationObserver.observe( node, { attributes: true } )

	return mutationObserver
}
