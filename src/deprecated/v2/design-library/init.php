<?php
/**
 * V3 Design Library
 *
 * @since 	3.0.0
 * @package Stackable
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Design_Library_V2' ) ) {
	class Stackable_Design_Library_V2 {
		/**
		 * Add our hooks.
		 */
		function __construct() {
			if ( has_stackable_v2_frontend_compatibility() || has_stackable_v2_editor_compatibility() ) {
				// Check whether we need to clear the design library cache.
				$this->reset_design_library_cache();

				add_filter( 'stackable_fetch_design_library', array( $this, 'fetch_v2_design_library' ) );
			}
		}

		/**
		 * Checks whether the user just turned on the V2 compatibility, and if
		 * we should reset any cached design library files.
		 *
		 * @return void
		 */
		public function reset_design_library_cache() {
			$designs = get_transient( 'stackable_get_design_library_v3' );
			if ( ! empty( $designs ) && ! array_key_exists( 'v2', $designs ) ) {
				delete_transient( 'stackable_get_design_library_v3' );
			}
		}

		public function fetch_v2_design_library( $designs ) {
			$response = wp_remote_get( Stackable_Design_Library::get_cdn_url() . 'library/library-v2.json' );
			$content = wp_remote_retrieve_body( $response );
			$content = apply_filters( 'stackable_design_library_retreive_body', $content );

			$designs['v2'] = json_decode( $content, true );

			return $designs;
		}
	}

	new Stackable_Design_Library_V2();
}
