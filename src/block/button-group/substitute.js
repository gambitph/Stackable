import { BLOCK_STATE } from '~stackable/util'

export const substitute = {
	from: 'stackable/button-group',
	variants: [ 'stackable/button-group|icon-button', 'stackable/button-group|button' ],
	to: [ 'core/buttons', 'core/social-links' ],
	transform: ( oldAttributes, innerBlocks, disabledBlocks ) => {
		if ( 'stackable/button-group|icon-button' in disabledBlocks && disabledBlocks[ 'stackable/button-group|icon-button' ] === BLOCK_STATE.DISABLED && // eslint-disable-line camelcase
			innerBlocks.length &&
			innerBlocks[ 0 ][ 0 ] === 'stackable/icon-button'
		) {
			return [ 'core/social-links',
				{ align: oldAttributes.contentAlign },
				[
					[ 'core/social-link', { service: 'facebook' } ],
					[ 'core/social-link', { service: 'twitter' } ],
				],
			]
		}
		if ( 'stackable/button-group|button' in disabledBlocks && disabledBlocks[ 'stackable/button-group|button' ] === BLOCK_STATE.DISABLED ) { // eslint-disable-line camelcase
			return [ 'core/buttons', {}, innerBlocks ]
		}
		return [ 'stackable/button-group', oldAttributes, innerBlocks ]
	},
}

export default substitute
