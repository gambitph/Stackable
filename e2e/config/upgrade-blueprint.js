/**
 * Upgrade Playground blueprint, generated from upgrade-from.js so the WP.org
 * zip URL is not pinned in a second file.
 */
const fs = require( 'fs' )
const path = require( 'path' )
const { OLD_PLUGIN_ZIP_URL } = require( './upgrade-from.js' )

const UPGRADE_BLUEPRINT = {
	$schema: 'https://playground.wordpress.net/blueprint-schema.json',
	features: {
		networking: true,
	},
	steps: [
		{
			step: 'login',
			username: 'admin',
			password: 'password',
		},
		{
			step: 'installPlugin',
			pluginData: {
				resource: 'url',
				url: OLD_PLUGIN_ZIP_URL,
			},
			options: {
				activate: true,
			},
		},
		{
			step: 'runPHP',
			code: "<?php\nrequire_once '/wordpress/wp-load.php';\ndelete_option( 'stackable_redirect_to_welcome' );\nupdate_option( 'stackable_guided_tour_states', array( 'design-system', 'editor', 'design-library', 'blocks' ), false );\nif ( function_exists( 'sugb_fs' ) ) {\n\t$fs = sugb_fs();\n\tif ( is_object( $fs ) && method_exists( $fs, 'skip_connection' ) && method_exists( $fs, 'is_registered' ) && ! $fs->is_registered() ) {\n\t\t$fs->skip_connection();\n\t}\n}\n",
		},
	],
}

const writeUpgradeBlueprint = destPath => {
	fs.mkdirSync( path.dirname( destPath ), { recursive: true } )
	fs.writeFileSync( destPath, `${ JSON.stringify( UPGRADE_BLUEPRINT, null, '\t' ) }\n` )
	return destPath
}

module.exports = {
	UPGRADE_BLUEPRINT,
	writeUpgradeBlueprint,
}
