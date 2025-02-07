// Reference: https://github.com/microsoft/playwright/issues/16084
export const ansiRegex = new RegExp( '([\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)|(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~])))', 'g' )

// Reference: /playwright-core/lib/utilsBundle.js
export const ms = ( ms : number ) => {
	if ( ! isFinite( ms ) ) {
		return '-'
	}
	if ( ms === 0 ) {
		return '0ms'
	}
	if ( ms < 1000 ) {
		return ms.toFixed( 0 ) + 'ms'
	}
	const seconds = ms / 1000
	if ( seconds < 60 ) {
		return seconds.toFixed( 1 ) + 's'
	}
	const minutes = seconds / 60
	if ( minutes < 60 ) {
		return minutes.toFixed( 1 ) + 'm'
	}
	const hours = minutes / 60
	if ( hours < 24 ) {
		return hours.toFixed( 1 ) + 'h'
	}
	const days = hours / 24
	return days.toFixed( 1 ) + 'd'
}
