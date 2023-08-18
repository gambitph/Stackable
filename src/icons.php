<?php
/**
 * Loads the Font Awesome Kit
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Icons' ) ) {

	/**
	 * Stackable Icons
	 */
    class Stackable_Icons {

		/**
		 * Initialize
		 */
        function __construct() {
			// Enqueue our FA Kit.
			add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_block_editor_assets' ) );

			// Add our FA Kit as a dependency to our editor script.
			add_filter( 'stackable_editor_js_dependencies', array( $this, 'add_kit_dependency' ) );
			// Deprecated v2 call.
			add_filter( 'stackable_editor_js_dependencies_v2', array( $this, 'add_kit_dependency' ) );
		}

		/**
		 * Add our Font Awesome script as a dependency on our editor script.
		 *
		 * @param array $deps
		 * @return array
		 */
		public function add_kit_dependency( $deps ) {
			$deps[] = 'ugb-font-awesome-kit';
			return $deps;
		}

		/**
		 * Enqueue our Font Awesome free kit.
		 *
		 * @return void
		 */
		public function enqueue_block_editor_assets() {
			// Load our Free Font Awesome Icons.
			if ( apply_filters( 'stackable_load_font_awesome_kit', true ) ) {
				wp_enqueue_script(
					'ugb-font-awesome-kit',
					// 'https://kit.fontawesome.com/9664e939d9.js', // This is our free kit.
					'https://use.fontawesome.com/releases/v5.15.4/js/all.js',
					null,
					null,
					true
				);

				// Add FA parameters to the script tag.
				add_filter( 'script_loader_tag', array( $this, 'script_loader_tag' ), 10, 2 );
			}
		}

		/**
		 * Added the necessary parameters to the FA Kit.
		 *
		 * @param string $html
		 * @param string $handle
		 * @return string The script that will be printed on the header.
		 */
		public function script_loader_tag( $html, $handle ) {
			if ( $handle === 'ugb-font-awesome-kit' ) {
				$html = str_replace( '></script>', ' crossorigin="anonymous" data-auto-replace-svg="false" data-auto-add-css="false" data-family-prefix="fa" data-observe-mutations="false" data-show-missing-icons="false" async></script>', $html );
			}
			return $html;
		}
	}

	new Stackable_Icons();
}
