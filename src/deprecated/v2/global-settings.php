<?php

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'stackable_global_typography_selectors_v2' ) ) {
	function stackable_global_typography_selectors_v2( $selectors, $tag ) {
		$selectors[] = '.ugb-main-block ' . $tag;
		return $selectors;
	}
	add_filter( 'stackable_global_typography_selectors', 'stackable_global_typography_selectors_v2', 10, 2 );
}
