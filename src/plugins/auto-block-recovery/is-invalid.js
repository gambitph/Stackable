// Checks whether the block is invalid because of a styling issue.
export const isInvalid = block => {
	const {
		name, isValid, validationIssues, originalContent,
	} = block

	// Only do this for Stackable blocks.
	if ( ! name || ! name.match( /^ugb\// ) ) {
		return false
	}

	// Only do this for invalid blocks.
	if ( isValid ) {
		return false
	}
	if ( ! validationIssues.length ) {
		return false
	}

	// Check whether the error came from the block's <style> contents.
	// Only the latest issue.
	const issue = validationIssues[ 0 ]
	const { args } = issue
	if ( args.length !== 3 ) {
		return false
	}

	// Get the HTML code that generated the error.
	const sourceError = args[ 2 ]
	if ( typeof sourceError !== 'string' ) {
		return false
	}

	// For any errors that come from styling, auto-attempt recovery for these.
	return originalContent.includes( `<style>${ sourceError }</style>` )
}
