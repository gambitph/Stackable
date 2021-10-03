/**
 * Internal dependencies
 */
import { BLOCKS, BLOCK_CATEROGIES } from './admin'
import SVGCheck from './images/check.svg'
import { AdminToggleSetting } from '~stackable/components'

/**
 * External dependencies
 */
import {
	wizard, i18n, isPro,
} from 'stackable'
import classnames from 'classnames'

/**
 * WordPress dependencies
 */
import domReady from '@wordpress/dom-ready'
import {
	render, useEffect, useState, Fragment, useMemo, useCallback,
} from '@wordpress/element'
import { Button, Spinner } from '@wordpress/components'
import { __, sprintf } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import { models } from '@wordpress/api'

const startStep = parseInt( location.hash.match( /^#step-(\d+)/ )?.[ 1 ] || 1, 10 )

const Wizard = () => {
	const [ step, setStep ] = useState( startStep )

	// Add the step to the URL so that we still get back here when the user refreshes.
	useEffect( () => {
		location.hash = `step-${ step }`
	}, [ step ] )

	// Remove premium steps if not premium.
	let steps = applyFilters( 'stackable.welcome-wizard.steps', STEPS )
	if ( ! isPro ) {
		steps = steps.filter( step => ! step.isPro )
	}

	// Get the current step component to render.
	const Comp = steps[ step - 1 ]?.component || null

	return (
		<div className={ `s-welcome-wizard__wrapper s-welcome-wizard--step-${ step }` }>
			<Steps
				steps={ steps.filter( ( { id } ) => id !== 'done' ) }
				step={ step }
			/>
			{ Comp && <Comp /> }
			{ step !== steps.length && (
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
						} }
					>
						{ step === 1 ? __( 'Get Started', i18n ) : step === steps.length ? __( 'Finish', i18n ) : __( 'Next / Skip', i18n ) }
					</button>
				</div>
			) }
			{ step > 1 &&
				<p><em>{ __( 'All these settings can be changed in the settings page.', i18n ) }</em></p>
			}
		</div>
	)
}

const WelcomeMessage = () => {
	return (
		<>
			<div className="s-welcome-wizard__content s-welcome-wizard--centered">
				<h2>{ __( 'Welcome to Stackable!', i18n ) }</h2>
				<p>{ __( 'Let\'s get you started with your page building journey by configuring some settings first.', i18n ) }</p>
			</div>
		</>
	)
}

const BLOCK_DATA = {
	essential: {
		description: __( 'All the necessary building blocks you need to design anything.', i18n ),
	},
	special: {
		description: __( 'Blocks with special functionality that will allow you to create distinctive designs.', i18n ),
	},
	section: {
		description: __( 'Use these blocks act as templates to help you build sections effortlessly.', i18n ),
	},
}

let blocksStarting = wizard.disabled_blocks

const ChooseBlocks = () => {
	const [ disabledBlocks, setDisabledBlocks ] = useState( blocksStarting )
	const [ showBlocks, setShowBlocks ] = useState( {} )
	const [ isBusy, setIsBusy ] = useState( false )

	useEffect( () => {
		blocksStarting = disabledBlocks
	}, [ disabledBlocks ] )

	const save = useCallback( disabledBlocks => {
		const model = new models.Settings( { stackable_disabled_blocks: disabledBlocks } ) // eslint-disable-line camelcase
		model.save().then( () => setIsBusy( false ) )
		setIsBusy( true )
	}, [ setIsBusy ] )

	return (
		<>
			<div className="s-welcome-wizard__content">
				<h2>{ __( 'Choose Blocks That Fit You', i18n ) }</h2>
				<p>{ __( 'Stackable has 3 categories of blocks, and you can choose which blocks to use to fit your specific workflow.', i18n ) }</p>
				<div className="s-welcome-wizard__options s-welcome-wizard__blocks">
					{ BLOCK_CATEROGIES.map( ( {
						id, label, Icon,
					} ) => {
						const isShowBlocks = showBlocks[ id ] || false
						const allBlocksDisabled = BLOCKS[ id ].every( ( { name } ) => disabledBlocks.includes( name ) )
						const someBlocksDisabled = BLOCKS[ id ].some( ( { name } ) => disabledBlocks.includes( name ) )
						const allBlocksEnabled = BLOCKS[ id ].every( ( { name } ) => ! disabledBlocks.includes( name ) )

						return (
							<div
								className={ `s-welcome-wizard__option s-box s-box--${ id }` }
								key={ id }
							>
								{ Icon && <Icon className="s-welcome-wizard__option-icon" height="32" width="32" /> }
								<h3>{ label }</h3>
								<AdminToggleSetting
									value={ allBlocksEnabled || ( ! allBlocksDisabled && someBlocksDisabled ) }
									onChange={ value => {
										const blockNames = BLOCKS[ id ].map( block => block.name )
										let newDisabledBlocks = disabledBlocks.filter( blockName => ! blockNames.includes( blockName ) )
										if ( ! value ) {
											// Disable all blocks
											newDisabledBlocks = [
												...newDisabledBlocks,
												...blockNames,
											]
										}
										setDisabledBlocks( newDisabledBlocks )
										save( newDisabledBlocks )
									} }
									disabled={ __( 'All blocks disabled', i18n ) }
									enabled={ allBlocksEnabled ? __( 'All blocks enabled', i18n ) : __( 'Some blocks enabled', i18n ) }
								/>
								<p>{ BLOCK_DATA[ id ]?.description }</p>
								<Button
									onClick={ () => setShowBlocks( {
										...showBlocks,
										[ id ]: ! isShowBlocks,
									 } ) }
								>
									{ isShowBlocks ? __( 'Hide all blocks', i18n ) : __( 'Show all blocks', i18n ) + ` (${ BLOCKS[ id ].length })` }
								</Button>
								<div className={ classnames( 's-welcome-wizard__block-list', {
									's--show-all-blocks': isShowBlocks,
								} ) }>
									{ BLOCKS[ id ].map( ( block, i ) => {
										const isDisabled = disabledBlocks.includes( block.name )
										return (
											<AdminToggleSetting
												key={ i }
												label={ block.title }
												value={ ! isDisabled }
												onChange={ value => {
													let newDisabledBlocks = disabledBlocks.filter( blockName => blockName !== block.name )
													if ( ! value ) {
														newDisabledBlocks = [
															...newDisabledBlocks,
															block.name,
														]
													}
													setDisabledBlocks( newDisabledBlocks )
													save( newDisabledBlocks )
												} }
												disabled={ __( 'Disabled', i18n ) }
												enabled={ __( 'Enabled', i18n ) }
												isDisabled={ ! isShowBlocks }
											/>
										)
									} ) }
								</div>
							</div>
						)
					} ) }
				</div>
			</div>
			{ isBusy && <Spinner className="s-wizard-spinner" /> }
		</>
	)
}

const IconSettings = () => {
	const Control = useMemo( () => applyFilters( 'stackable.welcome-wizard.icon', null ), [] )

	return (
		<>
			<div className="s-welcome-wizard__content s-box">
				<h2>{ __( 'Icon Settings', i18n ) }</h2>
				<p>{ __( 'Our integration with FontAwesome Pro allows you to import icons from their extensive icon library and use them in Stackable blocks.', i18n ) }</p>
				{ /* Use the same string below to lessen translations, so sprintf with empty strings. */ }
				<p>{ sprintf( __( 'If you have %sFont Awesome Pro%s, you can use your Pro icons by inputting your Pro Kit code below.', i18n ), '', '' ) }</p>
				{ Control && <Control /> }
			</div>
		</>
	)
}

const RoleManagerSettings = () => {
	const [ isBusy, setIsBusy ] = useState( false )
	const Control = useMemo( () => applyFilters( 'stackable.welcome-wizard.role-manager', null ), [] )

	return (
		<>
			<div className="s-welcome-wizard__content s-box">
				<h2>{ __( 'Role Manager', i18n ) }</h2>
				<p>
					{ __( 'Stackable comes with a Role Manager so you can allow who can edit your content. By default, all user roles have full editing access in the Block Editor.', i18n ) }
					&nbsp;
					<a href="https://docs.wpstackable.com/article/360-role-manager-and-content-editing-mode?utm_source=wp-settings-role-manager&utm_campaign=learnmore&utm_medium=wp-dashboard" target="_docs">
						{ __( 'Learn more', i18n ) }
					</a>
				</p>
				<br />
				{ Control && <Control
					doneCallback={ () => setIsBusy( false ) }
					saveCallback={ () => setIsBusy( true ) }
				 /> }
			</div>
			{ isBusy && <Spinner /> }
		</>
	)
}

const CustomFieldsSettings = () => {
	const Control = useMemo( () => applyFilters( 'stackable.welcome-wizard.custom-fields', null ), [] )

	return (
		<>
			<div className="s-welcome-wizard__content s-box">
				<h2>{ __( 'Custom Fields', i18n ) }</h2>
				<p>
					{ __( 'Custom Fields allow you to create Fields that you can reference across your entire site. This is helpful when you display the same text in multiple areas in your site.', i18n ) }
					&nbsp;
					<a href="https://docs.wpstackable.com/article/463-how-to-use-stackable-custom-fields/?utm_source=wp-settings-custom-fields&utm_campaign=learnmore&utm_medium=wp-dashboard" target="_docs">
						{ __( 'Learn more', i18n ) }
					</a>
				</p>
				<br />
				{ Control && <Control label={ __( 'Custom Fields', i18n ) } /> }
			</div>
		</>
	)
}

const FinishedMessage = () => {
	return (
		<>
			<div className="s-welcome-wizard__content s-welcome-wizard--centered s-box">
				<SVGCheck className="s-welcome-wizard__check" height="96" width="96" />
				<h2>{ __( 'You\'re all set!', i18n ) }</h2>
				<p>{ __( 'Let\'s get you started on your page building journey with Stackable.', i18n ) }</p>
				<button
					className="s-getting-started__button primary"
					onClick={ () => {
						location.search = '?page=stackable-getting-started'
					} }
				>
					{ __( 'Finish', i18n ) }
				</button>
			</div>
		</>
	)
}

const Steps = props => {
	const {
		step,
		steps,
	} = props

	const classNames = classnames( [
		's-welcome-wizard__steps',
		`s-welcome-wizard__steps--num-${ steps.length }`,
	] )

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
