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

	deletePost = async function( pid: string, postType: string = 'posts' ) {
		await this.rest( {
			method: 'DELETE',
			path: `/wp/v2/${ postType }/${ pid }`,
			params: {
				force: true,
			},
		} )
	}
}

export { ExtendedRequestUtils }
