/**
 * Internal dependencies
 */
import { useLocalStorage } from '~stackable/util'

/**
 * External dependencies
 */
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { Button } from '@wordpress/components'
import { __, sprintf } from '@wordpress/i18n'
import { close } from '@wordpress/icons'

export const Hints = props => {
	const { activeTab } = props
	const [ showLayoutHint, setShowLayoutHint ] = useLocalStorage( 'stk__inspector_hint_layout', true )
	const [ showStyleHint, setShowStyleHint ] = useLocalStorage( 'stk__inspector_hint_style', true )

	if ( activeTab === 'layout' && showLayoutHint ) {
		return (
			<div className="stk-inspector-hint stk-inspector-hint-layout">
				<span>{ sprintf( __( 'Looking for other settings? They\'ve moved to the %s tab.', i18n ), __( 'style', i18n ) ) }</span>
				<Button
					className="stk-inspector-hint__close block-editor-inspector-controls-tabs__hint-dismiss"
					icon={ close }
					iconSize="16"
					label={ __( 'Dismiss hint', i18n ) }
					onClick={ () => setShowLayoutHint( false ) }
					showTooltip={ false }
				/>
			</div>
		)
	}

	if ( activeTab === 'style' && showStyleHint ) {
		return (
			<div className="stk-inspector-hint stk-inspector-hint-layout">
				<span>{ sprintf( __( 'Looking for other settings? They\'ve moved to the %s tab.', i18n ), __( 'layout', i18n ) ) }</span>
				<Button
					className="stk-inspector-hint__close block-editor-inspector-controls-tabs__hint-dismiss"
					icon={ close }
					iconSize="16"
					label={ __( 'Dismiss hint', i18n ) }
					onClick={ () => setShowStyleHint( false ) }
					showTooltip={ false }
				/>
			</div>
		)
	}

	return null
}
