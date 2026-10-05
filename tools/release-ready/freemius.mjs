/**
 * Product-scoped Freemius deployments client.
 *
 * - GET    /v1/products/{id}/tags.json
 * - GET    /v1/products/{id}/tags/latest.json
 * - POST   /v1/products/{id}/tags.json
 * - DELETE /v1/products/{id}/tags/{tagId}.zip
 * - GET    /v1/products/{id}/tags/{tagId}.zip
 * - GET    /v1/products/{id}/tags/latest.zip
 *
 * The collection list does not include pending tags. Pending versions are
 * only visible via tags/latest.json?type=pending (or type=all).
 *
 * @see https://freemius.com/help/api/deployments/list/
 * @see https://freemius.com/help/api/deployments/create/
 */

const PRODUCT_ID = 1748
const API_ORIGIN = 'https://api.freemius.com'
const LIST_PAGE_SIZE = 50
const DEPLOYMENT_POLL_MS = 5000
const DEPLOYMENT_WAIT_MS = 10 * 60 * 1000

const sleep = ms => new Promise( resolve => setTimeout( resolve, ms ) )

const tagsCollectionUrl = () => `${ API_ORIGIN }/v1/products/${ PRODUCT_ID }/tags.json`
const tagZipUrl = ( tagId, isPremium ) =>
	`${ API_ORIGIN }/v1/products/${ PRODUCT_ID }/tags/${ tagId }.zip?is_premium=${ isPremium ? 'true' : 'false' }`
const tagDeleteUrl = tagId =>
	`${ API_ORIGIN }/v1/products/${ PRODUCT_ID }/tags/${ tagId }.zip`
const latestZipUrl = ( isPremium, type ) =>
	`${ API_ORIGIN }/v1/products/${ PRODUCT_ID }/tags/latest.zip?is_premium=${ isPremium ? 'true' : 'false' }&type=${ encodeURIComponent( type ) }`
const latestJsonUrl = type =>
	`${ API_ORIGIN }/v1/products/${ PRODUCT_ID }/tags/latest.json?type=${ encodeURIComponent( type ) }`

const bearerHeaders = token => ( {
	Authorization: `Bearer ${ token }`,
} )

const readErrorBody = async response => {
	const text = await response.text()
	try {
		return JSON.parse( text )
	} catch ( error ) {
		return text || `${ response.status } ${ response.statusText }`
	}
}

const throwApiError = async ( action, response ) => {
	const body = await readErrorBody( response )
	const detail = typeof body === 'string' ? body : JSON.stringify( body )
	throw new Error( `Freemius ${ action } failed (${ response.status }): ${ detail }` )
}

/**
 * List every deployment tag (paginated).
 *
 * @param {string} token Product Bearer token.
 * @see https://freemius.com/help/api/deployments/list/
 */
export const listAllDeployments = async token => {
	const tags = []
	let offset = 0

	while ( true ) {
		const url = `${ tagsCollectionUrl() }?count=${ LIST_PAGE_SIZE }&offset=${ offset }`
		const response = await fetch( url, {
			method: 'GET',
			headers: {
				...bearerHeaders( token ),
				Accept: 'application/json',
			},
		} )
		if ( ! response.ok ) {
			await throwApiError( 'list all deployments', response )
		}
		const payload = await response.json()
		const page = Array.isArray( payload ) ? payload : ( payload.tags || [] )
		tags.push( ...page )
		if ( page.length < LIST_PAGE_SIZE ) {
			break
		}
		offset += LIST_PAGE_SIZE
	}

	return tags
}

const describeFetchError = error => {
	const cause = error?.cause?.code || error?.cause?.message
	return cause ? `${ error.message } (${ cause })` : error.message
}

/**
 * Latest tag for a release type. Pending tags do not appear in the collection list.
 *
 * @param {string} token Product Bearer token.
 * @param {string} type `pending`, `released`, `beta`, or `all`.
 * @return {Promise<object|null>}
 */
export const getLatestDeployment = async ( token, type = 'pending' ) => {
	let response
	try {
		response = await fetch( latestJsonUrl( type ), {
			method: 'GET',
			headers: {
				...bearerHeaders( token ),
				Accept: 'application/json',
			},
		} )
	} catch ( error ) {
		throw new Error(
			`Freemius retrieve the latest ${ type } deployment failed: ${ describeFetchError( error ) }`
		)
	}
	if ( response.status === 404 ) {
		return null
	}
	if ( ! response.ok ) {
		await throwApiError( `retrieve the latest ${ type } deployment`, response )
	}
	const payload = await response.json()
	if ( ! payload || typeof payload !== 'object' ) {
		return null
	}
	if ( payload.id && payload.version ) {
		return payload
	}
	if ( Array.isArray( payload.tags ) && payload.tags[ 0 ] ) {
		return payload.tags[ 0 ]
	}
	if ( payload.tags && payload.tags.id ) {
		return payload.tags
	}
	return null
}

const sameVersion = ( tag, version ) =>
	tag && String( tag.version ) === String( version )

/**
 * Same-version pending tag, if one exists.
 * Checks latest.json (pending/all) because the collection list omits pending tags.
 *
 * @param {string} token Product Bearer token.
 * @param {string} version Plugin version being released.
 * @return {Promise<object|null>}
 */
export const findPendingDeploymentForVersion = async ( token, version ) => {
	if ( ! version ) {
		return null
	}
	for ( const type of [ 'pending', 'all' ] ) {
		const tag = await getLatestDeployment( token, type )
		if ( sameVersion( tag, version ) && tag.release_mode === 'pending' ) {
			return tag
		}
	}
	const listed = findPendingTagsForVersion( await listAllDeployments( token ), version )
	return listed[ 0 ] || null
}

/**
 * Tags that may be deleted: same version and still pending.
 * Never matches released or beta tags, or any other version.
 *
 * @param {Array<object>} tags Deployment tags from listAllDeployments.
 * @param {string} version Plugin version being released.
 * @return {Array<object>}
 */
export const findPendingTagsForVersion = ( tags, version ) => {
	if ( ! version ) {
		return []
	}
	return tags.filter( tag =>
		tag &&
		tag.version === version &&
		tag.release_mode === 'pending'
	)
}

/**
 * Refuse to delete unless the tag is the version we are releasing and pending.
 *
 * @param {object} tag Deployment tag.
 * @param {string} expectedVersion Plugin version being released.
 * @return {string|number} tag id
 */
export const assertSafeToDeletePendingTag = ( tag, expectedVersion ) => {
	if ( ! expectedVersion ) {
		throw new Error( 'Refusing to delete a Freemius tag without an expected version' )
	}
	if ( ! tag || tag.version !== expectedVersion ) {
		throw new Error(
			`Refusing to delete Freemius tag ${ tag?.id }: version ${ tag?.version } is not ${ expectedVersion }`
		)
	}
	if ( tag.release_mode !== 'pending' ) {
		throw new Error(
			`Refusing to delete Freemius tag ${ tag.id }: release_mode is ${ tag.release_mode }, not pending`
		)
	}
	if ( tag.id === undefined || tag.id === null || tag.id === '' ) {
		throw new Error( 'Refusing to delete a Freemius tag without an id' )
	}
	return tag.id
}

/**
 * Delete one pending same-version tag.
 * Callers must pass the listed tag and the version they are releasing.
 *
 * @param {string} token Product Bearer token.
 * @param {object} tag Deployment tag from the list API.
 * @param {string} expectedVersion Plugin version being released.
 */
export const deletePendingDeployment = async ( token, tag, expectedVersion ) => {
	const tagId = assertSafeToDeletePendingTag( tag, expectedVersion )
	let response
	try {
		response = await fetch( tagDeleteUrl( tagId ), {
			method: 'DELETE',
			headers: bearerHeaders( token ),
		} )
	} catch ( error ) {
		throw new Error(
			`Freemius delete a deployment failed: ${ describeFetchError( error ) }`
		)
	}
	if ( ! response.ok ) {
		await throwApiError( 'delete a deployment', response )
	}
	if ( response.status === 204 ) {
		return null
	}
	const text = await response.text()
	if ( ! text ) {
		return null
	}
	try {
		return JSON.parse( text )
	} catch ( error ) {
		return text
	}
}

/**
 * Find and delete the pending tag for `version`, if one exists.
 * Never deletes a different version or a non-pending tag.
 *
 * @param {string} token Product Bearer token.
 * @param {string} version Plugin version being released.
 * @return {Array<object>} Tags that were deleted.
 */
export const deletePendingDeploymentsForVersion = async ( token, version ) => {
	const pending = await findPendingDeploymentForVersion( token, version )
	if ( ! pending ) {
		return []
	}
	await deletePendingDeployment( token, pending, version )
	return [ pending ]
}

/**
 * Poll the deployments list until `version` appears (optionally ignoring
 * tag ids we just deleted). Download only after this resolves.
 *
 * @param {string} token Product Bearer token.
 * @param {string} version Plugin version being released.
 * @param {object} [options]
 * @param {Array<string|number>} [options.excludeIds] Tag ids that must not count as ready.
 * @param {number} [options.intervalMs]
 * @param {number} [options.timeoutMs]
 * @param {Function} [options.onAttempt]
 * @return {Promise<object>} The listed tag for `version`.
 */
export const waitForDeploymentVersion = async ( token, version, options = {} ) => {
	if ( ! version ) {
		throw new Error( 'Cannot wait for a Freemius tag without a version' )
	}
	const {
		excludeIds = [],
		intervalMs = DEPLOYMENT_POLL_MS,
		timeoutMs = DEPLOYMENT_WAIT_MS,
		onAttempt,
	} = options
	const excluded = new Set( excludeIds.map( id => String( id ) ) )
	const started = Date.now()
	let attempt = 0

	while ( Date.now() - started < timeoutMs ) {
		attempt += 1
		try {
			const tag = await getLatestDeployment( token, 'pending' )
			const match = (
				sameVersion( tag, version ) &&
				! excluded.has( String( tag.id ) )
			) ? tag : null
			if ( onAttempt ) {
				onAttempt( {
					attempt,
					found: match || null,
				} )
			}
			if ( match ) {
				return match
			}
		} catch ( error ) {
			if ( onAttempt ) {
				onAttempt( {
					attempt,
					found: null,
					error,
				} )
			}
		}
		await sleep( intervalMs )
	}

	throw new Error(
		`Timed out after ${ Math.round( timeoutMs / 1000 ) }s waiting for Freemius to list ${ version }`
	)
}

/**
 * Upload a plugin zip as a new pending deployment.
 * Does not send release_mode. Does not overwrite an existing tag.
 *
 * @param {string} token Product Bearer token.
 * @param {string} zipPath Absolute path to the local plugin zip.
 * @see https://freemius.com/help/api/deployments/create/
 */
export const createDeployment = async ( token, zipPath ) => {
	const { readFile } = await import( 'node:fs/promises' )
	const { basename } = await import( 'node:path' )
	const bytes = await readFile( zipPath )
	const form = new FormData()
	form.append(
		'file',
		new Blob( [ new Uint8Array( bytes ) ], { type: 'application/zip' } ),
		basename( zipPath )
	)
	form.append( 'data', '{"add_contributor":true}' )

	const response = await fetch( tagsCollectionUrl(), {
		method: 'POST',
		headers: bearerHeaders( token ),
		body: form,
	} )
	if ( ! response.ok ) {
		await throwApiError( 'create a deployment', response )
	}
	return response.json()
}

const parseContentDispositionFilename = header => {
	if ( ! header ) {
		return null
	}
	const utf = header.match( /filename\*\s*=\s*UTF-8''([^;]+)/i )
	if ( utf ) {
		return decodeURIComponent( utf[ 1 ].trim() )
	}
	const quoted = header.match( /filename\s*=\s*"([^"]+)"/i )
	if ( quoted ) {
		return quoted[ 1 ]
	}
	const plain = header.match( /filename\s*=\s*([^;]+)/i )
	return plain ? plain[ 1 ].trim() : null
}

const writeZipResponse = async ( response, destDir, fallbackName ) => {
	const { mkdir, writeFile } = await import( 'node:fs/promises' )
	const { join } = await import( 'node:path' )
	const rawName = parseContentDispositionFilename( response.headers.get( 'content-disposition' ) )
	const filename = rawName || fallbackName
	await mkdir( destDir, { recursive: true } )
	const destPath = join( destDir, filename )
	const buffer = Buffer.from( await response.arrayBuffer() )
	await writeFile( destPath, buffer )
	return { destPath, filename }
}

const fetchZip = async ( token, url, action ) => {
	const response = await fetch( url, {
		method: 'GET',
		headers: bearerHeaders( token ),
		redirect: 'follow',
	} )
	if ( ! response.ok ) {
		await throwApiError( action, response )
	}
	return response
}

/**
 * Download the Freemius-processed FREE or PAID zip for a tag.
 *
 * @param {string} token Product Bearer token.
 * @param {string|number} tagId Freemius tag id.
 * @param {boolean} isPremium When true, download the paid zip.
 * @param {string} destDir Directory to write the zip into.
 * @see https://freemius.com/help/api/deployments/download/
 */
export const downloadDeployment = async ( token, tagId, isPremium, destDir ) => {
	const response = await fetchZip(
		token,
		tagZipUrl( tagId, isPremium ),
		`download a deployment (is_premium=${ isPremium })`
	)
	return writeZipResponse(
		response,
		destDir,
		`stackable-tag-${ tagId }-${ isPremium ? 'premium' : 'free' }.zip`
	)
}

/**
 * Download the latest deployment zip.
 * `type` must be passed: Freemius defaults it to `released`, which is the
 * previous live tag, not the pending upload we just created.
 *
 * @param {string} token Product Bearer token.
 * @param {boolean} isPremium When true, download the paid zip. Freemius defaults this to true.
 * @param {string} destDir Directory to write the zip into.
 * @param {string} type `pending`, `released`, `beta`, or `all`.
 * @see https://freemius.com/help/api/deployments/download-latest/
 */
export const downloadLatestDeployment = async ( token, isPremium, destDir, type = 'pending' ) => {
	const response = await fetchZip(
		token,
		latestZipUrl( isPremium, type ),
		`download the latest deployment (is_premium=${ isPremium }, type=${ type })`
	)
	return writeZipResponse(
		response,
		destDir,
		`stackable-latest-${ type }-${ isPremium ? 'premium' : 'free' }.zip`
	)
}

export const PRODUCT_ID_USED = PRODUCT_ID
