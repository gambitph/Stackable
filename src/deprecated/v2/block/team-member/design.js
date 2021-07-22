/**
 * External dependencies
 */
import { omit } from 'lodash'

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'

// Remove text from block designs being applied.
addFilter( 'stackable.team-member.design.no-text-attributes', 'stackable/team-member', attributes => {
	return omit( attributes, [
		'name1',
		'name2',
		'name3',
		'position1',
		'position2',
		'position3',
		'description1',
		'description2',
		'description3',
	] )
} )

// Ignore these attributes when exporting / applying designs.
addFilter( 'stackable.team-member.design.filtered-block-attributes', 'stackable/team-member', ( attributes, blockAttributes = null ) => {
	return {
		...omit( attributes, [
			'image1Id',
			...( blockAttributes && blockAttributes.image1Id ? [ 'image1Url' ] : [] ),
			'image2Id',
			...( blockAttributes && blockAttributes.image2Id ? [ 'image2Url' ] : [] ),
			'image3Id',
			...( blockAttributes && blockAttributes.image3Id ? [ 'image3Url' ] : [] ),
			'image1Alt',
			'image2Alt',
			'image3Alt',
			'showEmail',
			'showFacebook',
			'showImage',
			'showInstagram',
			'showLinkedin',
			'showPinterest',
			'showTwitter',
			'showYoutube',
			'social1FacebookUrl',
			'social1TwitterUrl',
			'social1InstagramUrl',
			'social1PinterestUrl',
			'social1LinkedinUrl',
			'social1YoutubeUrl',
			'social1EmailUrl',
			'social2FacebookUrl',
			'social2TwitterUrl',
			'social2InstagramUrl',
			'social2PinterestUrl',
			'social2LinkedinUrl',
			'social2YoutubeUrl',
			'social2EmailUrl',
			'social3FacebookUrl',
			'social3TwitterUrl',
			'social3InstagramUrl',
			'social3PinterestUrl',
			'social3LinkedinUrl',
			'social3YoutubeUrl',
			'social3EmailUrl',
		] ),
	}
} )
