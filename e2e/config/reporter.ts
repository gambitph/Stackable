/* eslint-disable no-console */
import type {
	Reporter, TestCase, TestResult,
} from '@playwright/test/reporter'

import fs from 'fs'
import path from 'path'

class MyReporter implements Reporter {
	outputFolder: string;
	testResults: Array<string>;

	constructor() {
		this.outputFolder = 'playwright-errors'
		this.cleanupFolder()
		this.testResults = []
	}

	removeColorCodes( input : string ) {
		return input.replace( /\[[0-9;]*m/g, '' )
	}

	escapeSpecialCharacters( input: string ) {
		return input.replace( /([\'\"\&\{\}])/g, '\\$1' )
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
		if ( result.status !== test.expectedStatus ) {
			let testResult = `### ${ test.title }
`
			if ( result.errors.length >= 1 ) {
				testResult += `\`\`\`
`
				result.errors.forEach( error => {
					if ( error.message ) {
						testResult += `${ this.removeColorCodes( error.message ) }

`
					}

					if ( error.snippet ) {
						testResult += `${ this.removeColorCodes( error.snippet ) }

`
					}
				} )
				testResult += `\`\`\`

`
			}

			this.testResults.push( testResult )
		}
	}

	async onEnd() {
		// Ensure the output folder exists
		const folderPath = path.resolve( this.outputFolder )
		if ( ! fs.existsSync( folderPath ) ) {
		  fs.mkdirSync( folderPath, { recursive: true } )
		}

		// Write the collected results to a JSON file
		const reportPath = path.join( folderPath, 'errors.md' )
		let reportContent = ''
		if ( this.testResults.length ) {
			reportContent += `## Failed Tests

${ this.testResults.join( '' ) }`

			reportContent = this.escapeSpecialCharacters( reportContent )
		}

		fs.writeFileSync( reportPath, reportContent )
	}
}
export default MyReporter
