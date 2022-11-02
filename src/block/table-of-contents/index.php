<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Filter to add our plugin to the list of compatible plugins in rank math.
 *
 * @param array TOC plugins.
 */
add_filter( 'rank_math/researches/toc_plugins', function( $toc_plugins ) {
	$toc_plugins['stackable-ultimate-gutenberg-blocks-premium/plugin.php'] = 'Stackable';
	$toc_plugins['stackable-ultimate-gutenberg-blocks/plugin.php'] = 'Stackable';
 	return $toc_plugins;
} );
