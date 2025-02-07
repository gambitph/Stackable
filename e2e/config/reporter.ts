/* eslint-disable no-console */
import type {
	Reporter, TestCase, TestResult,
} from '@playwright/test/reporter'

import fs from 'fs'
import path from 'path'

const ansiRegex = new RegExp( '([\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)|(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~])))', 'g' )

class MyReporter implements Reporter {
	outputFolder: string;
	testResults: Array<string>;
	testIds: Array<string>;
	traceFiles: Array<string>;

	constructor() {
		this.outputFolder = 'playwright-errors'
		this.cleanupFolder()
		this.testResults = []
		this.testIds = []
		this.traceFiles = []
	}

	stripAnsiEscapes( str: string ): string {
		return str.replace( ansiRegex, '' )
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
						testResult += `${ error.message }

`
					}

					if ( error.snippet ) {
						testResult += `${ error.snippet }

`
					}
				} )
				testResult += `\`\`\`

`
			}

			this.testResults.push( testResult )
			this.testIds.push( test.id )
			this.traceFiles.push( result.attachments.find( attachment => attachment.name === 'trace' ).path )
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

		const testIdsPath = path.join( folderPath, 'testIds.json' )
		let testIdsContent = ''

		const traceFilesPath = path.join( folderPath, 'traceFiles.json' )
		let traceFilesContent = ''
		if ( this.testResults.length ) {
			reportContent += `## Failed Tests

${ this.testResults.join( '' ) }`

			reportContent = this.stripAnsiEscapes( reportContent )
			testIdsContent = JSON.stringify( this.testIds, null, 2 )
			traceFilesContent = JSON.stringify( this.traceFiles, null, 2 )
		}

		fs.writeFileSync( reportPath, reportContent )
		fs.writeFileSync( testIdsPath, testIdsContent )
		fs.writeFileSync( traceFilesPath, traceFilesContent )
	}
}
export default MyReporter
