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
			// A pseudo-random unique ID is generated to replace the duplicate unique ID.
			$random_unique_id = substr( str_shuffle( '0123456789abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz' ), 0, 7 );
			$stackable_unique_ids[ $random_unique_id ] = true;
			$block_content = str_replace( $unique_id, $random_unique_id, $block_content );
		} else {
			$stackable_unique_ids[ $unique_id ] = true;
		}

		return $block_content;
	}

	// Only do this in the frontend.
	if ( is_frontend() ) {
		add_filter( 'render_block', 'stackable_prevent_duplicate_unique_ids', 9, 2 );
	}
}
