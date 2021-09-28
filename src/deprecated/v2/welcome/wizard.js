import { i18n, v2optimizationScriptLoad } from 'stackable'
import { addFilter } from '@wordpress/hooks'
import { __ } from '@wordpress/i18n'

addFilter( 'stackable.welcome-wizard.steps', 'stackable/v2', steps => {
	const newSteps = [ ...steps ].filter( step => step.id !== 'welcome' )

	// Only add this if the optimization setting is not enabled.
	if ( ! v2optimizationScriptLoad ) {
		newSteps.unshift( {
			id: 'v2-optimize',
			label: __( 'Optimization', i18n ),
			component: OptimizationSettings,
		}, )
	}

	newSteps.unshift( {
		id: 'v2-migration',
		label: __( 'Migration', i18n ),
		component: MigrationSettings,
	}, )
	newSteps.unshift( {
		id: 'v2-welcome',
		label: __( 'Welcome to V3', i18n ),
		component: WelcomeMessage,
	}, )
	return newSteps
} )

const WelcomeMessage = () => {
	// TODO:
	return (
		<>
			<h3>{ __( 'Welcome from V2 to V3', i18n ) }</h3>
		</>
	)
}

const MigrationSettings = () => {
	// TODO: This should prompt the user to enable the settings: stackable_v2_frontend_compatibility
	// stackable_v2_editor_compatibility
	// stackable_v2_editor_compatibility_usage
	return (
		<>
			<h3>{ __( 'Migration', i18n ) }</h3>
		</>
	)
}

const OptimizationSettings = () => {
	// TODO: This should prompt the user to enable the setting stackable_optimize_script_load

	// const updateOptimizeScriptLoad = value => {
	// 	const model = new models.Settings( { stackable_optimize_script_load: value } ) // eslint-disable-line camelcase
	// 	model.save()
	// 	setOptimizeScriptLoad( value )
	// }

	return (
		<>
			<h3>{ __( 'Optimization Settings', i18n ) }</h3>
			<p>{ __( 'Stackable has 3 categories of blocks, and you can choose which blocks to use to fit your specific work flow.', i18n ) }</p>
		</>
	)
}
