/**
 * Internal dependencies
 */
// import { TOUR_STEPS } from './tour-steps'
import { TOUR_CONDITIONS } from './tour-conditions'
import {
	clearActiveTour,
	isTourActive,
	getActiveTourId,
	addTourStateListener,
} from './util'

/**
 * External dependencies
 */
import { guidedTourStates } from 'stackable'

/**
 * WordPress dependencies
 */
import { models } from '@wordpress/api'
import {
	useEffect, useState, lazy, Suspense, memo,
} from '@wordpress/element'
import { applyFilters } from '@wordpress/hooks'

// The main tour component.
const GuidedModalTour = memo( props => {
	const {
		tourId = '', // This is the ID of the tour, this will be used to store the tour state in the database and to get the steps.
	} = props

	// On mount, check if the tour has been completed, if so, don't show it.
	const [ isDone, setIsDone ] = useState( guidedTourStates.includes( tourId ) )

	// We need this to prevent the tour from being shown again if it's just completed.
	const [ justCompleted, setJustCompleted ] = useState( false )

	// Check if another tour is already active
	const [ isAnotherTourActive, setIsAnotherTourActive ] = useState( isTourActive() && getActiveTourId() !== tourId )

	// Listen for tour state changes
	useEffect( () => {
		const removeListener = addTourStateListener( activeId => {
			setIsAnotherTourActive( activeId !== null && activeId !== tourId )
		} )
		return removeListener
	}, [ tourId ] )

	if ( justCompleted ) {
		return null
	}

	// If another tour is already active, don't show this tour
	if ( isAnotherTourActive ) {
		return null
	}

	// If there is a condition, check if it's met, if not, don't show the tour.
	// condition can be true, false, or null. true will show the tour (even if
	// it's already done), false will not show the tour, null will show the tour
	// only once (normal behavior).
	const conditions = applyFilters( 'stackable.guided-tour.conditions', TOUR_CONDITIONS )
	const condition = conditions[ tourId ]
	const conditionResult = condition ? condition() : null
	if ( conditionResult === false ) {
		return null
	} else if ( conditionResult === null ) {
		if ( isDone ) {
			return null
		}
	}

	// Only lazy-load ModalTour when we're actually going to render it
	const ModalTour = lazy( () => import( /* webpackChunkName: "modal-tour" */ '~stackable/lazy-components/modal-tour' ) )

	return (
		<Suspense fallback={ null }>
			<ModalTour
				tourId={ tourId }
				onClose={ () => {
					setIsDone( true )
					setJustCompleted( true )

					// Clear the active tour
					clearActiveTour()

					// Update the stackable_guided_tour_states setting
					if ( ! guidedTourStates.includes( tourId ) ) {
						// eslint-disable-next-line camelcase
						const settings = new models.Settings( { stackable_guided_tour_states: [ ...guidedTourStates, tourId ] } )
						settings.save()
					}

					// Soft update the global variable to prevent the tour from being shown again.
					guidedTourStates.push( tourId )

					// Remove the "tour" GET parameter from the URL so conditions won't get triggered again.
					const url = new URL( window.location.href )
					url.searchParams.delete( 'tour' )
					window.history.replaceState( null, '', url.toString() )
				} }
			/>
		</Suspense>
	)
} )

export default GuidedModalTour
