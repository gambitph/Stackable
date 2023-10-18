<?php
/**
 * Rendering of the blocks based on the display condition.
 *
 * @package Stackable
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'stackableGetRandomString' ) ) {
	function stackableGetRandomString( $length ) {
		$characters = '0123456789abcdefghijklmnopqrstuvwxyz';
		$string = '';

		for ($i = 0; $i < $length; $i++) {
			$string .= $characters[mt_rand(0, strlen($characters) - 1)];
		}

		return $string;
	}
}

function stackable_generate_unique_id( $block_content, $block ) {

	$test = wp_cache_get('stackable_unique_ids');
	if ( ! $test ) {
		if ( isset( $block['attrs'] ) && array_key_exists( 'uniqueId', $block['attrs'] ) ) {
			wp_cache_set( 'stackable_unique_ids', array( $block['attrs']['uniqueId'] ) );
		}
	}

	if ( isset( $block['attrs'] ) && array_key_exists( 'uniqueId', $block['attrs'] ) && $test ) {
		$random_unique_id = stackableGetRandomString(7);
		if ( in_array( $block['attrs']['uniqueId'], $test ) && ! in_array( $random_unique_id, $test ) ) {
			wp_cache_set( 'stackable_unique_ids', array_merge( $test, array( $random_unique_id )  ) );
			$block_content = str_replace( $block['attrs']['uniqueId'], $random_unique_id, $block_content );
		}
	}

	return $block_content;
}

add_filter( 'render_block', 'stackable_generate_unique_id', 9, 2 );
