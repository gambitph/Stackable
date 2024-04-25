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

if ( ! function_exists( 'stackable_generate_unique_id' ) ) {
	function stackable_generate_unique_id() {
		$characters = '0123456789abcdefghijklmnopqrstuvwxyz';
		$unique_id = '';

		for ( $i = 0; $i < 7; $i++ ) {
			$unique_id .= $characters[ wp_rand( 0, strlen( $characters ) - 1 ) ];
		}

		return $unique_id;
	}
}

global $stackable_unique_ids;
$stackable_unique_ids = array();

if ( ! function_exists( 'stackable_prevent_duplicate_unique_ids' ) ) {
	function stackable_prevent_duplicate_unique_ids( $block_content, $block ) {
		if ( ! isset( $block['blockName'] ) || strpos( $block['blockName'], 'stackable/' ) === false ) {
			return $block_content;
		}

		if ( ! isset( $block['attrs']['uniqueId'] ) ) {
			return $block_content;
		}

		$unique_id = $block['attrs']['uniqueId'];
		if ( empty( $unique_id ) ) {
			return $block_content;
		}

		global $stackable_unique_ids;

		if ( isset( $stackable_unique_ids[ $unique_id ] ) ) {
			$random_unique_id = stackable_generate_unique_id();
			$stackable_unique_ids[ $random_unique_id ] = true;
			$block_content = str_replace( $unique_id, $random_unique_id, $block_content );
		} else {
			$stackable_unique_ids[ $unique_id ] = true;
		}

		return $block_content;
	}
	add_filter( 'render_block', 'stackable_prevent_duplicate_unique_ids', 9, 2 );
}
