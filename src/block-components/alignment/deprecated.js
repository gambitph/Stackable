/**
 * Migration function for the old horizontal orientation. In the old way, we
 * didn't have column gap, and inner blocks had left margins of 24px. Now that
 * we have column gap that has a default value of 24px and the margins are
 * untouched, we need to simulate the old way of doing things.
 *
 * @param {Object} attributes Old block attributes
 * @param {Array} innerBlocks Old block inner blocks
 *
 * @return {Object} New attributes and inner blocks
 */
export const horizontalOrientationMigrate = ( attributes, innerBlocks ) => {
	if ( attributes.innerBlockOrientation !== 'horizontal' ) {
		return [ attributes, innerBlocks ]
	}

	innerBlocks.forEach( ( block, index ) => {
		if ( index ) {
			if ( ! block.attributes.blockMargin ) {
				block.attributes.blockMargin = {
					top: '',
					right: '',
					bottom: '',
					left: '',
				}
			}
			if ( block.attributes.blockMargin.left === '' ) {
				block.attributes.blockMargin.left = 24
			}
		}
	} )

	return [ {
		...attributes,
		innerBlockColumnGap: 0,
	}, innerBlocks ]
}
