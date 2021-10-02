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
			<div className="s-welcome-wizard__content s-box">
				<h2>{ __( 'Thanks for Updating to Stackable 3', i18n ) }</h2>
				<p>{ __( 'There are huge changes in Stackable, and this wizard will help you get started with migrating to the new version.', i18n ) }</p>
				<p>{ __( 'We\'ve made upgrading as smooth and hassle free as possible, click on the Next button at the lower right to move to the next step.', i18n ) }</p>
				<h2>{ __( 'What\’s New in Version 3', i18n ) }</h2>
				<ul>
					<li>{ __( 'Unbelievably lightweight, faster performance, focus on core web vitals and accessibility', i18n ) }</li>
					<li>{ __( 'Completely new way to use Stackable blocks', i18n ) }</li>
					<li>{ __( 'Advanced Columns which are immensely responsive (you can control how they collapse in tablet and mobile)', i18n ) }</li>
					<li>{ __( 'Style blocks when they\'re hovered', i18n ) }</li>
					<li>{ __( 'Stackable Custom Fields (premium)', i18n ) }</li>
					<li>{ __( 'Use Dynamic Content in images, buttons, and other content (premium)', i18n ) }</li>
					<li>{ __( 'Motion Effects (premium)', i18n ) }</li>
					<li>{ __( 'Conditionally Display blocks (premium)', i18n ) }</li>
					<li>{ __( 'and more!', i18n ) }</li>
				</ul>
			</div>
		</>
	)
}

const MigrationSettings = () => {
	// TODO: This should prompt the user to enable the settings: stackable_v2_frontend_compatibility
	// stackable_v2_editor_compatibility
	// stackable_v2_editor_compatibility_usage
	return (
		<>
			<div className="s-welcome-wizard__content s-box">
				<h2>{ __( 'Migrating to the New Stackable Blocks', i18n ) }</h2>
				<p>{ __( 'Stackable 3 replaces ALL Stackable blocks with an updated set of new, more flexible, more powerful and faster blocks.', i18n ) }</p>
				<p>{ __( 'While we\'ve replaced all blocks, version 3 is fully backward compatible with version 2. Don\'t worry, you don\'t have to rebuild any of your web pages!', i18n ) }</p>
				<p><strong>{ __( 'How would you like to transition your workflow when editing your pages?', i18n ) }</strong></p>
				{ /* → Option 1: Allow adding of v2 blocks only if there are already existing v2 blocks in the post/page being edited

→ Option 2: Allow adding of both v2 and v3 blocks in Gutenberg

→ Option 3: Only allow adding of the new v3 blocks */ }
			</div>
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
