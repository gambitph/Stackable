import { request as playwrightRequest } from '@playwright/test'
import { RequestUtils as BaseRequestUtils } from '@wordpress/e2e-test-utils-playwright'

const REST_NONCE_PATTERN = /^[a-zA-Z0-9_-]{2,64}$/

/**
 * WP plugin routes identify a plugin as `dir/file`. The slash must be encoded
 * so it is one path segment (`dir%2Ffile`), not two.
 *
 * @param pluginFile Plugin file relative to wp-content/plugins, e.g. `stackable/plugin`.
 */
const pluginFileRestPath = ( pluginFile: string ) =>
	`/wp/v2/plugins/${ encodeURIComponent( pluginFile ) }`

class ExtendedRequestUtils extends BaseRequestUtils {
	/**
	 * Same as the upstream helper, with ignoreHTTPSErrors for local HTTPS overrides.
	 *
	 * @param options
	 */
	static async setup( options: {
		baseURL?: string;
		user?: { username: string; password: string };
		storageStatePath?: string;
	} = {} ) {
		const {
			baseURL = process.env.WP_BASE_URL,
			user,
			storageStatePath,
		} = options

		let storageState
		if ( storageStatePath ) {
			const fs = await import( 'fs/promises' )
			const path = await import( 'path' )
			await fs.mkdir( path.dirname( storageStatePath ), { recursive: true } )
			try {
				storageState = JSON.parse( await fs.readFile( storageStatePath, 'utf-8' ) )
			} catch ( error ) {
				if ( ! ( error instanceof Error && 'code' in error && error.code === 'ENOENT' ) ) {
					throw error
				}
			}
		}

		// Drop a poisoned nonce (e.g. HTML from a Freemius activation redirect)
		// so setupRest refreshes it instead of sending it as X-WP-Nonce.
		if ( storageState?.nonce && ! REST_NONCE_PATTERN.test( String( storageState.nonce ).trim() ) ) {
			storageState = {
				...storageState,
				nonce: undefined,
				rootURL: undefined,
			}
		}

		const requestContext = await playwrightRequest.newContext( {
			baseURL,
			ignoreHTTPSErrors: true,
			storageState: storageState && {
				cookies: storageState.cookies,
				origins: [],
			},
		} )

		return new this( requestContext, {
			user,
			storageState,
			storageStatePath,
			baseURL,
		} )
	}

	/**
	 * Upstream login() accepts any response body as the nonce. On Playground +
	 * Freemius, the first admin request after activation can 302 to Getting
	 * Started; following that redirect stores HTML as X-WP-Nonce and breaks REST.
	 *
	 * @param user
	 */
	login = async function( user = this.user ) {
		let response = await this.request.post( 'wp-login.php', {
			failOnStatusCode: true,
			form: {
				log: user.username,
				pwd: user.password,
			},
		} )
		await response.dispose()

		response = await this.request.get( 'wp-admin/admin-ajax.php?action=rest-nonce', {
			failOnStatusCode: false,
			maxRedirects: 0,
		} )

		if ( response.status() >= 300 && response.status() < 400 ) {
			await response.dispose()
			// Consume the one-shot activation redirect, then fetch the real nonce.
			const bounced = await this.request.get( 'wp-admin/' )
			await bounced.dispose()
			response = await this.request.get( 'wp-admin/admin-ajax.php?action=rest-nonce', {
				failOnStatusCode: true,
			} )
		} else if ( ! response.ok() ) {
			const body = await response.text()
			throw new Error( `rest-nonce failed (${ response.status() }): ${ body.slice( 0, 120 ) }` )
		}

		const nonce = ( await response.text() ).trim()
		if ( ! REST_NONCE_PATTERN.test( nonce ) ) {
			throw new Error(
				`Invalid REST nonce (got ${ JSON.stringify( nonce.slice( 0, 80 ) ) }). ` +
				'Likely followed an admin redirect instead of admin-ajax rest-nonce.'
			)
		}

		return nonce
	}

	getActivePlugins = async function() {
		const plugins : { [key: string]: any }[] = await this.rest( {
			path: '/wp/v2/plugins',
		} )
		// eslint-disable-next-line no-console
		console.info( 'plugins installed:', plugins.map( plugin => plugin.plugin ), '\n' )
		const activePlugins = plugins.filter( plugin => plugin.status === 'active' ).reduce( ( pluginsMap, plugin ) => {
			pluginsMap[ plugin.plugin ] = plugin.plugin
			return pluginsMap
		}, {} )

		return activePlugins
	}

	deactivatePlugin = async function( slug: string ) {
		try {
			await this.rest( {
				method: 'PUT',
				path: pluginFileRestPath( slug ),
				data: { status: 'inactive' },
			} )
		} catch ( error ) {
			throw new Error( `Cannot deactivate ${ slug }: ${ error.message }` )
		}
	}

	activatePlugin = async function( slug: string ) {
		try {
			await this.rest( {
				method: 'PUT',
				path: pluginFileRestPath( slug ),
				data: { status: 'active' },
			} )
		} catch ( error ) {
			throw new Error( `Cannot activate ${ slug }: ${ error.message }` )
		}
	}

	deletePost = async function( pid: string | number, postType: string = 'posts' ) {
		await this.rest( {
			method: 'DELETE',
			path: `/wp/v2/${ postType }/${ pid }`,
			params: {
				force: true,
			},
		} )
	}

	updatePost = async function( pid: string | number, data: Record<string, unknown>, postType: string = 'posts' ) {
		return await this.rest( {
			method: 'POST',
			path: `/wp/v2/${ postType }/${ pid }`,
			data,
		} )
	}

	/**
	 * Update post meta via REST. Requires the meta key to be registered with show_in_rest
	 * (see e2e/config/stackable-e2e-mu-plugin.php for stk_e2e_dc_meta).
	 *
	 * @param pid
	 * @param meta
	 * @param postType
	 */
	updatePostMeta = async function( pid: string | number, meta: Record<string, string | number | boolean>, postType: string = 'posts' ) {
		return await this.updatePost( pid, { meta }, postType )
	}
}

export { ExtendedRequestUtils }
