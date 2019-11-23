/**
 * External dependencies
 */
import { urlIsVideo, __getValue } from '~stackable/util'
import { camelCase } from 'lodash'
import classnames from 'classnames'

/**
 * WordPress dependencies
 */
import { Fragment } from '@wordpress/element'
import { sprintf } from '@wordpress/i18n'

export const createVideoBackground = ( attrNameTemplate, blockProps ) => {
	const getAttrName = attrName => camelCase( sprintf( attrNameTemplate, attrName ) )
	const getValue = __getValue( blockProps.attributes, getAttrName, '' )

	const mediaUrl = getValue( 'BackgroundMediaUrl' )
	const tabletMediaUrl = getValue( 'TabletBackgroundMediaUrl' )
	const mobileMediaUrl = getValue( 'MobileBackgroundMediaUrl' )

	const desktopClassNames = classnames( [
		'ugb-video-background',
	], {
		'ugb--video-hide-tablet': tabletMediaUrl,
		'ugb--video-hide-mobile': mobileMediaUrl,
	} )
	const tabletClassNames = classnames( [
		'ugb-video-background',
	], {
		'ugb--video-hide-desktop': true,
		'ugb--video-hide-mobile': mobileMediaUrl,
	} )
	const mobileClassNames = classnames( [
		'ugb-video-background',
	], {
		'ugb--video-hide-desktop': true,
		'ugb--video-hide-tablet': true,
	} )

	return (
		<Fragment>
			{ urlIsVideo( mediaUrl ) &&
				<video
					className={ desktopClassNames }
					autoPlay
					muted
					loop
					src={ mediaUrl }
				/>
			}
			{ urlIsVideo( tabletMediaUrl ) &&
				<video
					className={ tabletClassNames }
					autoPlay
					muted
					loop
					src={ tabletMediaUrl }
				/>
			}
			{ urlIsVideo( mobileMediaUrl ) &&
				<video
					className={ mobileClassNames }
					autoPlay
					muted
					loop
					src={ mobileMediaUrl }
				/>
			}
		</Fragment>
	)
}
