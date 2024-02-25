import { deprecationBackgrounColorOpacity, deprecateShadowColor } from '../helpers'

export const deprecateContainerBackgroundColorOpacity = {
	isEligible: attributes => {
		return deprecationBackgrounColorOpacity.isEligible( 'container%s' )( attributes )
	},
	migrate: attributes => {
		return deprecationBackgrounColorOpacity.migrate( 'container%s' )( attributes )
	},
}

export const deprecateContainerShadowColor = {
	isEligible: attributes => {
		return deprecateShadowColor.isEligible( 'container%s' )( attributes )
	},
	migrate: attributes => {
		return deprecateShadowColor.migrate( 'container%s' )( attributes )
	},
}
