import backgroundImage from './images/cta-bg.jpg'
import { i18n, _isPro } from 'stackable'
import domReady from '@wordpress/dom-ready'
import classnames from 'classnames'
import {
	render, useEffect, useState, Fragment, createRef, useCallback,
} from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import { applyFilters, addFilter } from '@wordpress/hooks'
const isPro = true

const startStep = parseInt( location.hash.match( /^#step-(\d+)/ )?.[ 1 ] || 1, 10 )

const Wizard = () => {
	const [ step, setStep ] = useState( startStep )
	// const [ state, setState ] = useState( null )

	// Add the step to the URL so that we still get back here when the user refreshes.
	useEffect( () => {
		location.hash = `step-${ step }`
	}, [ step ] )

	// Move to the next step if the step component is done saving.
	// useEffect( () => {
	// if ( state === 'next' ) {
	// 	setState( null )
	// 	setStep( step + 1 )
	// }
	// }, [ state ] )

	// Remove premium steps if not premium.
	let steps = applyFilters( 'stackable.welcome-wizard.steps', STEPS )
	if ( ! isPro ) {
		steps = steps.filter( step => ! step.isPro )
	}

	// Get the current step component to render.
	const Comp = steps[ step - 1 ]?.component || null

	return <>
		<Steps
			steps={ steps.filter( ( { id } ) => id !== 'done' ) }
			step={ step }
		/>
		{ Comp && (
			<Comp
				// state={ state }
				// setState={ setState }
			/>
		) }
		<div className="s-welcome-wizard__buttons">
			{ step > 1 && (
				<button
					className="s-getting-started__button secondary"
					onClick={ () => setStep( step - 1 ) }
				>
					{ __( 'Previous', i18n ) }
				</button>
			) }
			<button
				className="s-getting-started__button primary"
				onClick={ () => {
					if ( step === steps.length ) {
						location.search = '?page=stackable-getting-started'
					} else {
						setStep( step + 1 )
					}
					// Trigger the component to start saving, it should set the state to 'next' when done.
					// setState( step !== steps.length ? 'save' : 'finished' )
				} }
			>
				{ step === steps.length ? __( 'Finish', i18n ) : __( 'Next', i18n ) }
			</button>
		</div>
	</>
}

const WelcomeMessage = () => {
	// TODO:
	return (
		<>
			<div className="s-welcome-wizard__content s-welcome-wizard__step-1" style={ { backgroundImage } }>
				<h3>{ __( 'Welcome to Stackable', i18n ) }</h3>
			</div>
		</>
	)
}

const ChooseBlocks = props => {
	// useEffect( () => {
	// 	if ( props.state === 'save' ) {
	// 		// Perform saving of stuff
	// 		props.setState( 'next' )
	// 	}
	// }, [ props.state ] )

	return (
		<>
			<h3>{ __( 'Enable & Disable Your Blocks', i18n ) }</h3>
			<p>{ __( 'Stackable has 3 categories of blocks, and you can choose which blocks to use to fit your specific work flow.', i18n ) }</p>
		</>
	)
}

const IconSettings = () => {
	// TODO:
	return (
		<>
			<h3>{ __( 'icons', i18n ) }</h3>
		</>
	)
}

const RoleManagerSettings = () => {
	// TODO:
	return (
		<>
			<h3>{ __( 'Role Manager', i18n ) }</h3>
		</>
	)
}

const CustomFieldsSettings = () => {
	// TODO:
	return (
		<>
			<h3>{ __( 'Custom Fields', i18n ) }</h3>
		</>
	)
}

const FinishedMessage = () => {
	// TODO:
	return (
		<>
			<h3>{ __( 'Finished', i18n ) }</h3>
		</>
	)
}

const Steps = props => {
	const {
		step,
		steps,
	} = props

	const classNames = classnames( 's-welcome-wizard__steps', {
		's-welcome-wizard__steps--small': steps.length < 4,
	} )

	return (
		<div className={ classNames }>
			{ steps.map( ( stepData, i ) => {
				const classNames = classnames( 's-welcome-wizard__step', {
					's-welcome-wizard__step--active': step >= i + 1,
				} )

				const dividerClassNames = classnames( 's-welcome-wizard__step-divider', {
					's-welcome-wizard__step--active': step >= i + 1,
				} )

				return (
					<Fragment key={ i }>
						{ i > 0 && <div className={ dividerClassNames } /> }
						<div
							className={ classNames }
						>
							<span className="s-welcome-wizard__step-number">{ i + 1 }</span>
							<span className="s-welcome-wizard__step-label">{ stepData.label }</span>
						</div>
					</Fragment>
				)
			} ) }
		</div>
	)
}

const STEPS = [
	{
		id: 'welcome',
		label: __( 'Welcome', i18n ),
		component: WelcomeMessage,
	},
	{
		id: 'disable-blocks',
		label: __( 'Choose Blocks', i18n ),
		component: ChooseBlocks,
	},
	{
		id: 'icon',
		label: __( 'Icons', i18n ),
		component: IconSettings,
		isPro: true,
	},
	{
		id: 'role-manager',
		label: __( 'Role Manager', i18n ),
		component: RoleManagerSettings,
		isPro: true,
	},
	{
		id: 'custom-fields',
		label: __( 'Custom Fields', i18n ),
		component: CustomFieldsSettings,
		isPro: true,
	},
	{
		id: 'done',
		label: '',
		component: FinishedMessage,
	},
]

domReady( () => {
	if ( document.querySelector( '.s-onboarding-wizard' ) ) {
		render(
			<Wizard />,
			document.querySelector( '.s-onboarding-wizard' )
		)
	}
} )
