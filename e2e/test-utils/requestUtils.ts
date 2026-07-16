import { RequestUtils as BaseRequestUtils } from '@wordpress/e2e-test-utils-playwright'

class ExtendedRequestUtils extends BaseRequestUtils {
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
				path: `/wp/v2/plugins/${ slug }`,
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
				path: `/wp/v2/plugins/${ slug }`,
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
