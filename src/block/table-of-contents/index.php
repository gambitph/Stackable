<?

/**
 * Filter to add our plugin to the list of compatible plugins in rank math.
 *
 * @param array TOC plugins.
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_filter( 'rank_math/researches/toc_plugins', function( $toc_plugins ) {
       $toc_plugins['Stackable/plugin.php'] = 'Stackable';
    return $toc_plugins;
} );
