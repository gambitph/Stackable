<?php

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'stackable_migrate_block_hidden_states' ) ) {
	/**
	 * Migrate from disabled blocks array to block states object.
	 *
	 * @return void
	 */
	function stackable_migrate_block_hidden_states() {
		// Check if the old setting exists and the new setting is empty.
		if ( get_option( 'stackable_disabled_blocks' ) !== false && empty( get_option( 'stackable_block_states', [] ) ) ) {
			$old_disabled_blocks = get_option( 'stackable_disabled_blocks', [] );
			$new_block_states = [];

			if ( is_array( $old_disabled_blocks ) ) {
				foreach ( $old_disabled_blocks as $block_name ) {
					// In the block_states, hidden is 2 and disabled is 3
					$new_block_states[ $block_name ] = 2;
				}
			}

			update_option( 'stackable_block_states', $new_block_states );
			delete_option( 'stackable_disabled_blocks' );
		}
	}

	// Migrate settings.
	add_action( 'admin_init', 'stackable_migrate_block_hidden_states' );
}
