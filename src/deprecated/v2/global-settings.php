<?php

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'stackable_global_typography_selectors_v2' ) ) {
	function stackable_global_typography_selectors_v2( $selectors, $selector ) {
		// If the selector is a class selector, remove the white space in between.
		if ( stripos( $selector, '.' ) === 0 ) {
			$selectors[] = '.ugb-main-block' . $selector;
			$selectors[] = '.ugb-main-block' . $selector . ' p';
		} else {
			$selectors[] = '.ugb-main-block ' . $selector;
		}
		return $selectors;
	}
	add_filter( 'stackable_global_typography_selectors', 'stackable_global_typography_selectors_v2', 10, 2 );
}
