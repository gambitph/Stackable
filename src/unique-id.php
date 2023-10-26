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

if ( ! function_exists( 'stackable_get_random_string' ) ) {
	function stackable_get_random_string( $length ) {
		$characters = '0123456789abcdefghijklmnopqrstuvwxyz';
		$string = '';

		for ( $i = 0; $i < $length; $i++ ) {
			$string .= $characters[ wp_rand( 0, strlen( $characters ) - 1 ) ];
		}

		return $string;
	}
}

function stackable_generate_unique_id( $block_content, $block ) {

	if ( strpos( $block['blockName'], 'stackable/' ) === false ) {
		return $block_content;
	}

	global $stackable_unique_ids;
	$unique_id = isset( $block['attrs']['uniqueId'] ) ? $block['attrs']['uniqueId'] : '';

	if ( empty( $unique_id ) ) {
		return $block_content;
	}

	if ( ! is_array( $stackable_unique_ids ) ) {
		$stackable_unique_ids = array( $unique_id );
		return $block_content;
	}

	if ( in_array( $unique_id, $stackable_unique_ids ) ) {
		$random_unique_id = stackable_get_random_string( 7 );
		$stackable_unique_ids = array_merge( $stackable_unique_ids, array( $random_unique_id )  );
		$block_content = str_replace( $unique_id, $random_unique_id, $block_content );
	} else {
		$stackable_unique_ids = array_merge( $stackable_unique_ids, array( $unique_id )  );
	}

	return $block_content;
}

add_filter( 'render_block', 'stackable_generate_unique_id', 9, 2 );
