/**
 * External dependencies
 */
import { camelCase } from 'lodash'

/**
 * WordPress dependencies
 */
import { addFilter, hasFilter } from '@wordpress/hooks'
import { Fragment } from '@wordpress/element'
import { sprintf } from '@wordpress/i18n'
import striptags from 'striptags'

if ( ! hasFilter( 'stackable.div-background.output.after', 'stackable/clickable-container' ) ) {
	addFilter( 'stackable.div-background.output.after', 'stackable/clickable-container', ( output, props, blockProps ) => {
		const {
			index = 1,
			className,
		} = props

		if ( ! className.match( /ugb-clickable-container/ ) ) {
			return output
		}

		const {
			showClickableContainer = false,
		} = blockProps.attributes

		const getAttrName = attrName => camelCase( sprintf( `container%d%s`, index, attrName ) )
		const getAttrValue = ( attrName, defaultValue = '' ) => {
			const value = blockProps.attributes[ getAttrName( attrName ) ]
			return value === '' ? value : ( value || defaultValue )
		}

		const newTab = getAttrValue( 'NewTab' )
		const noFollow = getAttrValue( 'NoFollow' )
		const title = getAttrValue( 'Title' )
		const url = getAttrValue( 'Url' )

		const rel = []
		if ( newTab ) {
			rel.push( 'noopener' )
			rel.push( 'noreferrer' )
		}
		if ( noFollow ) {
			rel.push( 'nofollow' )
		}

		return (
			<Fragment>
				{ output }
				{ showClickableContainer && url && (
					<a
						href={ url }
						target={ newTab ? '_blank' : undefined }
						rel={ rel.join( ' ' ) }
						title={ striptags( title ) }
					>{ null }</a>
				) }
			</Fragment>
		)
	} )
}
