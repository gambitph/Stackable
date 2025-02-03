import { BLOCK_STATE } from '~stackable/util'

export const substitute = {
	from: 'stackable/button',
	variants: [ 'stackable/button-group|button' ],
	transform: ( oldAttributes, innerBlocks, disabledBlocks ) => {
		if ( 'stackable/button-group|button' in disabledBlocks && disabledBlocks[ 'stackable/button-group|button' ] === BLOCK_STATE.DISABLED ) { // eslint-disable-line camelcase
			return [ 'core/button', {
				text: oldAttributes.text,
			} ]
		}
		return [ 'stackable/button', oldAttributes ]
	},
}

export default substitute
