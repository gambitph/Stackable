/**
 * Internal dependencies
 */
import ImageCheck from './images/check.svg'
import {
	i18n, v2optimizationScriptLoad, wizard,
} from 'stackable'
import AdminToggleSetting from '~stackable/components/admin-toggle-setting'

/**
 * Excternal dependencies
 */
import classNames from 'classnames'

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks'
import {
	useState, useCallback, useEffect,
} from '@wordpress/element'
import {
	__, _x, sprintf,
} from '@wordpress/i18n'
import { models } from '@wordpress/api'
import { Spinner } from '@wordpress/components'

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
	return (
		<>
			<div className="s-welcome-wizard__content s-box">
				<h2>{ __( 'Thanks for Updating to Stackable V3', i18n ) }</h2>
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

let migrationStartState = wizard.stackable_v2_editor_compatibility_usage ? 1
	: wizard.stackable_v2_editor_compatibility ? 2
		: 3

const MigrationSettings = () => {
	const [ selected, setSelected ] = useState( migrationStartState )
	const [ isBusy, setIsBusy ] = useState( false )

	useEffect( () => {
		migrationStartState = selected
	}, [ selected ] )

	const save = useCallback( selected => {
		let settings = {}
		if ( selected === 1 ) {
			settings = {
				stackable_v2_editor_compatibility: '', // eslint-disable-line camelcase
				stackable_v2_editor_compatibility_usage: '1', // eslint-disable-line camelcase
				stackable_v2_frontend_compatibility: '1', // eslint-disable-line camelcase
			}
		} else if ( selected === 2 ) {
			settings = {
				stackable_v2_editor_compatibility: '1', // eslint-disable-line camelcase
				stackable_v2_editor_compatibility_usage: '', // eslint-disable-line camelcase
				stackable_v2_frontend_compatibility: '1', // eslint-disable-line camelcase
			}
		} else if ( selected === 3 ) {
			settings = {
				stackable_v2_editor_compatibility: '', // eslint-disable-line camelcase
				stackable_v2_editor_compatibility_usage: '', // eslint-disable-line camelcase
				stackable_v2_frontend_compatibility: '1', // eslint-disable-line camelcase
			}
		}
		const model = new models.Settings( settings )
		model.save().then( () => setIsBusy( false ) )
		setIsBusy( true )
	}, [ setIsBusy ] )

	const Check = <ImageCheck height="40" width="40" viewBox="0 0 96 96" className="s-welcome-wizard__option-check-icon" />

	return (
		<>
			<div className="s-welcome-wizard__content">
				<h2>{ __( 'Migrating to the New Stackable Blocks', i18n ) }</h2>
				<p>{ __( 'Stackable V3 provides NEW blocks which are more flexible, more powerful and faster. These new blocks are meant to replace the old V2 blocks.', i18n ) }</p>
				<p>{ __( 'Not to worry, version 3 is fully backward compatible with version 2, all your existing blocks should work fine, and you don\'t have to rebuild any of your web pages!', i18n ) }</p>
				<h2>{ __( 'How would you like to transition your Editor workflow when editing your pages?', i18n ) }</h2>
				<div className="s-welcome-wizard__options s-welcome-wizard__migration">
					<div
						className={ classNames( 's-welcome-wizard__option s-box', {
							's--selected': selected === 1,
						} ) }
						onClick={ () => {
							setSelected( 1 )
							save( 1 )
						} }
						onKeyDown={ ev => {
							if ( ev.key === 'Enter' || ev.key === ' ' ) {
								ev.target.click()
							}
							if ( ev.key === 'ArrowRight' ) {
								ev.target.nextElementSibling.focus()
								ev.target.nextElementSibling.click()
							}
						} }
						role="button"
						tabIndex="0"
					>
						{ selected === 1 && Check }
						<p className="s-welcome-wizard__option-subtitle">{ sprintf( _x( 'Option %s', 'Option number', i18n ), 1 ) }</p>
						<h3>{ __( 'Use Old V2 Blocks, but Only When Editing Existing Posts', i18n ) }</h3>
						<p>{ __( 'Enable old V2 blocks in the Editor when editing posts that previously had old V2 blocks. For new posts, only use the new V3 blocks.', i18n ) }</p>
					</div>
					<div
						className={ classNames( 's-welcome-wizard__option s-box', {
							's--selected': selected === 2,
						} ) }
						onClick={ () => {
							setSelected( 2 )
							save( 2 )
						} }
						onKeyDown={ ev => {
							if ( ev.key === 'Enter' || ev.key === ' ' ) {
								ev.target.click()
							}
							if ( ev.key === 'ArrowRight' ) {
								ev.target.nextElementSibling.focus()
								ev.target.nextElementSibling.click()
							} else if ( ev.key === 'ArrowLeft' ) {
								ev.target.previousElementSibling.focus()
								ev.target.previousElementSibling.click()
							}
						} }
						role="button"
						tabIndex="0"
					>
						{ selected === 2 && Check }
						<p className="s-welcome-wizard__option-subtitle">{ sprintf( _x( 'Option %s', 'Option number', i18n ), 2 ) }</p>
						<h3>{ __( 'Use Both New V3 and Old V2 Blocks', i18n ) }</h3>
						<p>{ __( 'Always allow adding of both v2 and v3 blocks in the Editor, even in new posts.', i18n ) }</p>
					</div>
					<div
						className={ classNames( 's-welcome-wizard__option s-box', {
							's--selected': selected === 3,
						} ) }
						onClick={ () => {
							setSelected( 3 )
							save( 3 )
						} }
						onKeyDown={ ev => {
							if ( ev.key === 'Enter' || ev.key === ' ' ) {
								ev.target.click()
							}
							if ( ev.key === 'ArrowLeft' ) {
								ev.target.previousElementSibling.focus()
								ev.target.previousElementSibling.click()
							}
						} }
						role="button"
						tabIndex="0"
					>
						{ selected === 3 && Check }
						<p className="s-welcome-wizard__option-subtitle">{ sprintf( _x( 'Option %s', 'Option number', i18n ), 3 ) }</p>
						<h3>{ __( 'Use New V3 Blocks Only', i18n ) }</h3>
						<p>{ __( 'Only allow adding of the new v3 blocks in the Editor. Old v2 blocks will no longer work in the Editor, but they will still work fine in your frontend.', i18n ) }</p>
					</div>
				</div>
			</div>
			{ isBusy && <Spinner className="s-wizard-spinner" /> }
		</>
	)
}

let optimizationStateStart = v2optimizationScriptLoad

const OptimizationSettings = () => {
	const [ setting, setSetting ] = useState( optimizationStateStart )
	const [ isBusy, setIsBusy ] = useState( false )

	useEffect( () => {
		optimizationStateStart = setting
	}, [ setting ] )

	const save = useCallback( value => {
		const model = new models.Settings( { stackable_optimize_script_load: value } ) // eslint-disable-line camelcase
		model.save().then( () => setIsBusy( false ) )
		setIsBusy( true )
	}, [ setIsBusy ] )

	return (
		<>
			<div className="s-welcome-wizard__content s-box">
				<h2>{ __( 'Optimization Settings', i18n ) }</h2>
				<p>{ __( 'We recommend that you turn on the Optimization Setting for v2, so that old v2 styles and scripts would only get loaded when v2 blocks are present in the post. This will ensure your website loads fast even with version 2 backward compatibility enabled', i18n ) }</p>
				<h2>{ __( 'Please enable the option below', i18n ) }</h2>
				<AdminToggleSetting
					label={ __( 'Frontend JS & CSS Files', i18n ) }
					value={ setting }
					onChange={ value => {
						setSetting( value )
						save( value )
					} }
					disabled={ __( 'Load across entire site', i18n ) }
					enabled={ __( 'Load only in posts with Stackable blocks', i18n ) }
				/>
				<br />
			</div>
			{ isBusy && <Spinner className="s-wizard-spinner" /> }
		</>
	)
}
