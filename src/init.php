<?php
/**
 * Blocks Initializer
 *
 * Enqueue CSS/JS of all the blocks.
 *
 * @since 	0.1
 * @package Stackable
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'stackable_block_assets' ) ) {

	/**
	* Enqueue block assets for both frontend + backend.
	*
	* @since 0.1
	*/
	function stackable_block_assets() {

		$plugin_path  = trailingslashit( plugin_dir_path( STACKABLE_FILE ) );

		// Frontend block styles.
		wp_enqueue_style(
			'ugb-style-css',
			plugins_url( 'dist/frontend_blocks.css', STACKABLE_FILE ),
			array(),
			STACKABLE_VERSION
		);

		// Frontend only scripts.
		if ( ! is_admin() ) {
			wp_enqueue_script(
				'ugb-block-frontend-js',
				plugins_url( 'dist/frontend_blocks.js', STACKABLE_FILE ),
				array(),
				STACKABLE_VERSION
			);
		}

		// Premium specific stuff.
		if ( sugb_fs()->is__premium_only() ) {

			if ( file_exists( $plugin_path . 'dist/frontend_blocks__premium_only.css' ) ) {
				wp_enqueue_style(
					'ugb-style-css-premium',
					plugins_url( 'dist/frontend_blocks__premium_only.css', STACKABLE_FILE ),
					array( 'ugb-style-css' ),
					STACKABLE_VERSION
				);
			}

			if ( file_exists( $plugin_path . 'dist/frontend_blocks__premium_only.js' ) ) {
				if ( ! is_admin() ) {
					wp_enqueue_script(
						'ugb-block-frontend-js-premium',
						plugins_url( 'dist/frontend_blocks__premium_only.js', STACKABLE_FILE ),
						array( 'ugb-block-frontend-js' ),
						STACKABLE_VERSION
					);
				}
			}
		}
	}
	add_action( 'enqueue_block_assets', 'stackable_block_assets' );
}

if ( ! function_exists( 'stackable_block_editor_assets' ) ) {

	/**
	 * Enqueue block assets for backend editor.
	 *
	 * @since 0.1
	 */
	function stackable_block_editor_assets() {

		$plugin_path  = trailingslashit( plugin_dir_path( STACKABLE_FILE ) );

		// Backend editor scripts: common vendor files.
		wp_enqueue_script(
			'ugb-block-js-vendor',
			plugins_url( 'dist/editor_vendor.js', STACKABLE_FILE ),
			array(),
			STACKABLE_VERSION
		);

		// Backend editor scripts: blocks.
		wp_enqueue_script(
			'ugb-block-js',
			plugins_url( 'dist/editor_blocks.js', STACKABLE_FILE ),
			array( 'ugb-block-js-vendor', 'wp-blocks', 'wp-element', 'wp-components', 'wp-editor' ),
			STACKABLE_VERSION
		);

		// Backend editor only styles.
		wp_enqueue_style(
			'ugb-block-editor-css',
			plugins_url( 'dist/editor_blocks.css', STACKABLE_FILE ),
			array( 'wp-edit-blocks' ),
			STACKABLE_VERSION
		);

		// Premium specific stuff.
		if ( sugb_fs()->is__premium_only() ) {

			if ( file_exists( $plugin_path . 'dist/editor_blocks__premium_only.js' ) ) {
				wp_enqueue_script(
					'ugb-block-js-premium',
					plugins_url( 'dist/editor_blocks__premium_only.js', STACKABLE_FILE ),
					array( 'ugb-block-js' ),
					STACKABLE_VERSION
				);
			}

			if ( file_exists( $plugin_path . 'dist/editor_blocks__premium_only.css' ) ) {
				wp_enqueue_style(
					'ugb-block-editor-css-premium',
					plugins_url( 'dist/editor_blocks__premium_only.css', STACKABLE_FILE ),
					array( 'ugb-block-editor-css' ),
					STACKABLE_VERSION
				);
			}
		}

		global $content_width;
		wp_localize_script( 'ugb-block-js', 'stackable', array(
			'srcUrl' => untrailingslashit( plugins_url( '/', STACKABLE_FILE ) ),
			'contentWidth' => isset( $content_width ) ? $content_width : 900,
			'disabledBlocks' => stackable_get_disabled_blocks(),

			// Overridable default primary color for buttons and other blocks.
			'primaryColor' => get_theme_mod( 's_primary_color', '#2091e1' ),

			// Premium related variables.
			'isPro' => sugb_fs()->can_use_premium_code(),
			'showProNotice' => STACKABLE_SHOW_PRO_NOTICES && ! sugb_fs()->can_use_premium_code(),
			'pricingURL' => sugb_fs()->get_upgrade_url(),
			'planName' => sugb_fs()->get_plan_name(),
		) );
	}
	add_action( 'enqueue_block_editor_assets', 'stackable_block_editor_assets' );
}

if ( ! function_exists( 'stackable_block_category' ) ) {

	/**
	 * Add our custom block category for Stackable blocks.
	 *
	 * @since 0.6
	 */
	function stackable_block_category( $categories, $post ) {
		return array_merge(
			$categories,
			array(
				array(
					'slug' => 'stackable',
					'title' => __( 'Stackable', 'stackable' ),
				),
			)
		);
	}
	add_filter( 'block_categories', 'stackable_block_category', 10, 2 );
}

if ( ! function_exists( 'stackable_add_required_block_styles' ) ) {

	/**
	 * Adds the required global styles for Stackable blocks.
	 *
	 * @since 1.3
	 */
	function stackable_add_required_block_styles() {
		global $content_width;
		$full_width_block_inner_width = isset( $content_width ) ? $content_width : 900;

		$custom_css = ':root {
			--content-width: ' . esc_attr( $full_width_block_inner_width ) . 'px;
		}';
		wp_add_inline_style( 'ugb-style-css', $custom_css );
	}
	add_action( 'enqueue_block_assets', 'stackable_add_required_block_styles', 11 );
}
