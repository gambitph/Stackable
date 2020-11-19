/**
 * External dependencies
 */
import { i18n, devMode } from 'stackable'
import { setDevModeDesignLibrary } from '~stackable/design-library'

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
	const {
		columns,
		setColumns,
		isDevMode,
		setDoReset,
		setIsDevMode,
	} = props

	return (
		<div className="ugb-modal-design-library__topbar">
			<span className="ugb-modal-design-library__topbar-children">
				{ props.children }
			</span>
			<span className="ugb-modal-design-library__topbar-options">

				{ devMode && (
					<ToggleControl
						className="ugb-modal-design-library__dev-mode"
						label="Dev Mode"
						checked={ isDevMode }
						onChange={ value => {
							setDevModeDesignLibrary( value ).then( () => {
								setDoReset( true )
							} )
							setIsDevMode( value )
						} }
					/>
				) }

				<Button
					icon="image-rotate"
					label={ __( 'Refresh Library', i18n ) }
					className="ugb-modal-design-library__refresh"
					onClick={ () => setDoReset( true ) }
				/>

				<Button
					icon={ <SVGViewSingle width="18" height="18" /> }
					label={ __( 'Large preview', i18n ) }
					className={ columns === 1 ? 'is-active' : '' }
					onClick={ () => setColumns( 1 ) }
				/>
				<Button
					icon={ <SVGViewFew width="18" height="18" /> }
					label={ __( 'Medium preview', i18n ) }
					className={ columns === 2 ? 'is-active' : '' }
					onClick={ () => setColumns( 2 ) }
				/>
				<Button
					icon={ <SVGViewMany width="18" height="18" /> }
					label={ __( 'Small preview', i18n ) }
					className={ columns === 4 ? 'is-active' : '' }
					onClick={ () => setColumns( 4 ) }
				/>
			</span>
		</div>
	)
}

Topbar.defaultProps = {
	columns: 4,
	setColumns: () => {},
	setIsDevMode: () => {},
	isDevMode: false,
	setDoReset: () => {},
}

export default Topbar
