/**
 * External dependencies
 */
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { useMemo } from '@wordpress/element'

const LIST_VIEW_SELECTOR = '.edit-post-header-toolbar__list-view-toggle, .block-editor-block-navigation'

let hasViewButton = null

const InspectorBottomTip = () => {
	const displayListViewTip = useMemo( () => {
		if ( hasViewButton === null ) {
			hasViewButton = !! document.querySelector( LIST_VIEW_SELECTOR )
			return hasViewButton
		}
		return hasViewButton
	}, [] )

	return (
		<p className="stk-inspector-bottom-tip">
			{ __( 'Click on any inner block in the editor to style it.', i18n ) }
			<br />
			<br />
			{ displayListViewTip && (
				// translators: %s will wrap the word in a link that opens the List View
				__( 'Tip: Open the %sList View%s to better see the blocks.', i18n ).split( /%s/g ).map( ( text, i ) => {
					if ( i === 1 ) {
						return (
							<a href="#0" role="button" key="link" onClick={ () => {
								document.querySelector( LIST_VIEW_SELECTOR )?.click()
							} } >
								{ text }
							</a>
						)
					}
					return text
				} )
			) }
		</p>
	)
}

export default InspectorBottomTip
