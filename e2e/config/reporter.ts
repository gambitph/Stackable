/* eslint-disable no-console */
import type {
	Reporter, TestCase, TestResult,
} from '@playwright/test/reporter'

import fs from 'fs'
import path from 'path'

class MyReporter implements Reporter {
	outputFolder: string;
	testResults: Array<{title: string, id: string, trace: any}>;

	constructor() {
		this.outputFolder = 'playwright-traces'
		this.cleanupFolder()
		this.testResults = []
	}
	cleanupFolder() {
		const folderPath = path.resolve( this.outputFolder )

		if ( fs.existsSync( folderPath ) ) {
			// Read the directory and delete files
			const files = fs.readdirSync( folderPath )
			for ( const file of files ) {
				const filePath = path.join( folderPath, file )
				if ( fs.lstatSync( filePath ).isFile() ) {
					fs.unlinkSync( filePath ) // Remove the file
				}
			}
			console.log( `All files removed from: ${ folderPath }` )
		} else {
			// If folder doesn't exist, create it
			fs.mkdirSync( folderPath, { recursive: true } )
		}
	}

	onTestEnd( test: TestCase, result: TestResult ) {
		if ( result.attachments.length !== 0 ) {
			console.log( 'title:', test.title )
			console.log( 'attachments', result.attachments )
			this.testResults.push( {
				id: test.id,
				title: test.title,
				trace: result.attachments.find( attachment => attachment.name === 'trace' ).path,
			} )
		}
	}

	async onEnd() {
		// Ensure the output folder exists
		const folderPath = path.resolve( this.outputFolder )
		if ( ! fs.existsSync( folderPath ) ) {
		  fs.mkdirSync( folderPath, { recursive: true } )
		}

		// Write the collected results to a JSON file
		const reportPath = path.join( folderPath, 'test-traces.json' )
		fs.writeFileSync( reportPath, JSON.stringify( this.testResults, null, 2 ) )
	}
}
export default MyReporter
