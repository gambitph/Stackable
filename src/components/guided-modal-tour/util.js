/**
 * Global tour state management utilities
 *
 * This module provides functions to manage the global state of guided modal tours,
 * ensuring that only one tour can be active at a time.
 */

// Global tour state
let activeTourId = null
const tourStateListeners = new Set()

/**
 * Set the currently active tour
 *
 * @param {string} tourId - The ID of the tour to set as active
 */
export const setActiveTour = tourId => {
	activeTourId = tourId
	tourStateListeners.forEach( listener => listener( tourId ) )
}

/**
 * Clear the currently active tour
 */
export const clearActiveTour = () => {
	activeTourId = null
	tourStateListeners.forEach( listener => listener( null ) )
}

/**
 * Check if any tour is currently active
 *
 * @return {boolean} True if a tour is active, false otherwise
 */
export const isTourActive = () => activeTourId !== null

/**
 * Get the currently active tour ID
 *
 * @return {string|null} The active tour ID or null if no tour is active
 */
export const getActiveTourId = () => activeTourId

/**
 * Add a listener for tour state changes
 *
 * @param {Function} listener - Function to call when tour state changes
 * @return {Function} Function to remove the listener
 */
export const addTourStateListener = listener => {
	tourStateListeners.add( listener )
	return () => tourStateListeners.delete( listener )
}
