/**
 * External dependencies
 */
import { i18n } from 'stackable'

/**
 * Wordpress dependencies
 */
import { ToggleControl, Button } from '@wordpress/components'
import { __ } from '@wordpress/i18n'

/**
 * Internal dependencies
 */
import SVGViewSingle from './images/view-single.svg'
import SVGViewMany from './images/view-many.svg'
import SVGViewFew from './images/view-few.svg'

const Topbar = props => {
	return (
		<div className="ugb-modal-design-library__topbar">
			<span className="ugb-modal-design-library__topbar-children">
				{ props.children }
			</span>
			<span className="ugb-modal-design-library__topbar-options">
				<ToggleControl
					className="ugb-modal-design-library__dev-mode"
					label="Dev Mode"
				/>

				<Button
					icon="image-rotate"
					label={ __( 'Refresh Library', i18n ) }
					className="ugb-modal-design-library__refresh"
				/>

				<Button
					icon={ <SVGViewSingle width="18" height="18" /> }
					className="is-active"
					label={ __( 'Large preview', i18n ) }
				/>
				<Button
					icon={ <SVGViewFew width="18" height="18" /> }
					label={ __( 'Medium preview', i18n ) }
				/>
				<Button
					icon={ <SVGViewMany width="18" height="18" /> }
					label={ __( 'Small preview', i18n ) }
				/>
			</span>
		</div>
	)
}

Topbar.defaultProps = {

}

export default Topbar
