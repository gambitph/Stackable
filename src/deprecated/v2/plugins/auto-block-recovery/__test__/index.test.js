import * as recoveryModule from '../attempt-recovery'
import { initAutoAttemptRecovery } from '../'

describe( 'initAutoAttemptRecovery', () => {
	it( 'should call autoAttemptRecovery', async () => {
		recoveryModule.autoAttemptRecovery = jest.fn() // Mock the function since we're only testing whether it's called.
		const spy = jest.spyOn( recoveryModule, 'autoAttemptRecovery' )

		// Mimic block editor loading.
		window._wpLoadBlockEditor = new Promise( resolve => resolve() )

		initAutoAttemptRecovery()
		await Promise.resolve()

		expect( spy ).toHaveBeenCalled()

		spy.mockRestore()
	} )
} )
