import { deprecationBackgrounColorOpacity } from '../helpers'

export const deprecateContainerBackgroundColorOpacity = {
	isEligible: attributes => {
		return deprecationBackgrounColorOpacity.isEligible( 'container%s' )( attributes )
	},
	migrate: attributes => {
		return deprecationBackgrounColorOpacity.migrate( 'container%s' )( attributes )
	},
}
