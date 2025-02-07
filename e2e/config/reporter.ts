/* eslint-disable no-console */
import type {
	FullConfig, TestResult,
	Reporter, Suite, TestCase,
} from '@playwright/test/reporter'

import { ansiRegex, ms } from 'e2e/test-utils'

import fs from 'fs'
import path from 'path'

class StkReporter implements Reporter {
	outputFolder: string;
	failedTestErrors: Array<string>;
	totalTestCount: number;
	suite: Suite;

	constructor() {
		this.outputFolder = 'playwright-stk'
		this.cleanupFolder()

		this.totalTestCount = 0
		this.failedTestErrors = []
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

	onBegin( config: FullConfig, suite: Suite ): void {
		this.totalTestCount = suite.allTests().length
		this.suite = suite
		console.log( `Running ${ this.totalTestCount } tests:` )
	}

	onTestEnd( test: TestCase, result: TestResult ) {
		if ( test.outcome() === 'expected' ) {
			process.stdout.write( '·' )
		} else {
			const titlePath = test.titlePath().filter( t => t !== '' ).join( ' › ' )

			const out = test.results.length <= test.retries ? '×' : ( result.status === 'timedOut' ? 'T' : 'F' )
			process.stdout.write( out )

			let testResult = `${ titlePath } ${ test.results.length > 1 ? `(retry #${ test.results.length - 1 }) ` : '' }[${ ms( result.duration ) }]` + '\n\n'
			if ( result.errors.length >= 1 ) {
				result.errors.forEach( error => {
					if ( error.message ) {
						testResult += `${ error.message }` + '\n\n'
					}

					if ( error.snippet ) {
						testResult += `${ error.snippet }` + `\n\n`
					}
				} )
			}

			this.failedTestErrors.push( testResult )
		}
	}

	getSummary() {
		let skipped = 0
		let expected = 0
		let unexpected = 0
		let flaky = 0

		const unexpectedTestTitles : Array<string> = []

		this.suite.allTests().forEach( test => {
			switch ( test.outcome() ) {
				case 'skipped': skipped++; break
				case 'expected': expected++; break
				case 'unexpected':
					unexpected++
					unexpectedTestTitles.push( '- ' + test.titlePath().filter( t => t !== '' ).join( ' › ' ) )
					break
				case 'flaky': flaky++; break
			}
		} )

		if ( unexpected ) {
			console.log( '\nSummary:' )
			console.log( `${ expected } passed` )
			console.log( `${ flaky } flaky` )
			console.log( `${ skipped } skipped` )
			console.log( `${ unexpected } failed` )
			console.log( `---\n\nFailed Tests:` )
			console.log( this.failedTestErrors.join( '' ) )

			const md = `
| PASSED | FLAKY | SKIPPED | FAILED |
| ------ | ----- | ------- | ------ |
| ${ expected } | ${ flaky } | ${ skipped } | ${ unexpected } |

Failed Tests:
${ unexpectedTestTitles.join( '\n' ) }
`

			const folderPath = path.resolve( this.outputFolder )
			if ( ! fs.existsSync( folderPath ) ) {
				fs.mkdirSync( folderPath, { recursive: true } )
			}

			// Write the collected results to a JSON file
			const reportPath = path.join( folderPath, 'errors.md' )
			fs.writeFileSync( reportPath, md )
		}
	}

	async onEnd() {
		process.stdout.write( '\n' )
		this.getSummary()
	}
}

export default StkReporter
