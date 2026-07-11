/**
 * External deprendencies
 */
import {
	i18n, isPro, devMode, showProNotice,
} from 'stackable'
import { AdvancedToolbarControl, Button } from '~stackable/components'

/**
 * WordPress deprendencies
 */
import {
	Dashicon,
	Dropdown,
	ToggleControl,
} from '@wordpress/components'

import { __ } from '@wordpress/i18n'

export const PLAN_OPTIONS = [ { key: '', label: __( 'All', i18n ) }, { key: 'free', label: __( 'Free', i18n ) }, { key: 'premium', label: __( 'Premium', i18n ) } ]

export const HeaderActions = props => {
	const {
		selectedTab,
		setSelectedTab,
		selectedPlan,
		setSelectedPlan,
		setDoReset,
		onClose,
	} = props

	let controls = [
		{
			value: 'patterns',
			title: __( 'Patterns', i18n ),
		},
		{
			value: 'pages',
			title: __( 'Pages', i18n ),
		},
	]

	controls = ! isPro && ! showProNotice ? controls : [ ...controls, {
		value: 'saved',
		title: __( 'Saved', i18n ),
	} ]

	return <>
		{ /* DEV NOTE: hide for now */ }
		<AdvancedToolbarControl
			className="stk-design-library-tabs"
			fullwidth={ false }
			controls={ controls }
			value={ selectedTab }
			onChange={ setSelectedTab }
			isToggleOnly={ true }
			allowReset={ false }
		/>

		<div className="stk-design-library__header-settings">
			{ devMode && (
				<ToggleControl
					label="Dev Mode"
					checked={ !! localStorage.getItem( 'stk__design_library__dev_mode' ) || false }
					onChange={ value => {
						localStorage.setItem( 'stk__design_library__dev_mode', value ? '1' : '' )
						setTimeout( () => {
							document?.querySelector( '.ugb-insert-library-button__wrapper .ugb-insert-library-button' )?.click()
						}, 100 )
						onClose()
					} }
					__nextHasNoMarginBottom
				/>
			) }
			<Button
				icon="image-rotate"
				iconSize={ 14 }
				label={ __( 'Refresh Library', i18n ) }
				className="ugb-modal-design-library__refresh"
				onClick={ () => setDoReset( true ) }
			/>
			{ ! isPro && <Dropdown
				focusOnMount="container"
				renderToggle={ ( { onToggle } ) => (
					<Button
						onClick={ onToggle }
						style={ { height: 'auto' } }
						icon="arrow-down-alt2"
						iconSize={ 12 }
						iconPosition="right"
						variant="secondary"
					>
						<Dashicon icon="lock" size={ 12 } />
						<span>{ selectedPlan.label }</span>
					</Button>
				) }
				renderContent={ ( { onClose } ) => (
					<div className="stk-design-library__plan-dropdown">
						{ PLAN_OPTIONS.map( ( plan, i ) => {
							return <Button
								key={ i }
								onClick={ () => {
									setSelectedPlan( plan )
									onClose()
								} }
							>
								{ plan.label }
							</Button>
						} ) }
					</div>
				) }
			/> }
		</div>
	</>
}
