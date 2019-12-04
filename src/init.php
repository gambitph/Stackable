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

		$enqueue_styles_in_frontend = apply_filters( 'stackable_enqueue_styles', ! is_admin() );
		$enqueue_scripts_in_frontend = apply_filters( 'stackable_enqueue_scripts', ! is_admin() );

		// Frontend block styles.
		if ( is_admin() || $enqueue_styles_in_frontend ) {
			wp_enqueue_style(
				'ugb-style-css',
				plugins_url( 'dist/frontend_blocks.css', STACKABLE_FILE ),
				array(),
				STACKABLE_VERSION
			);
		}

		// Frontend only scripts.
		if ( $enqueue_scripts_in_frontend ) {
			wp_enqueue_script(
				'ugb-block-frontend-js',
				plugins_url( 'dist/frontend_blocks.js', STACKABLE_FILE ),
				array(),
				STACKABLE_VERSION
			);
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

		// Enqueue CodeMirror for Custom CSS.
		wp_enqueue_code_editor( array(
			'type' => 'text/css', // @see https://developer.wordpress.org/reference/functions/wp_get_code_editor_settings/
			'codemirror' => array(
				'indentUnit' => 2,
				'tabSize' => 2,
			),
		) );

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
			// wp-util for wp.ajax.
			// wp-plugins & wp-edit-post for Gutenberg plugins.
			array( 'ugb-block-js-vendor', 'code-editor', 'wp-blocks', 'wp-element', 'wp-components', 'wp-editor', 'wp-util', 'wp-plugins', 'wp-edit-post', 'wp-i18n' ),
			STACKABLE_VERSION
		);

		// Add translations.
		wp_set_script_translations( 'ugb-block-js', STACKABLE_I18N );

		// Backend editor only styles.
		wp_enqueue_style(
			'ugb-block-editor-css',
			plugins_url( 'dist/editor_blocks.css', STACKABLE_FILE ),
			array( 'wp-edit-blocks' ),
			STACKABLE_VERSION
		);

		global $content_width;
		wp_localize_script( 'ugb-block-js-vendor', 'stackable', array(
			'srcUrl' => untrailingslashit( plugins_url( '/', STACKABLE_FILE ) ),
			'contentWidth' => isset( $content_width ) ? $content_width : 900,
			'i18n' => STACKABLE_I18N,
			'disabledBlocks' => stackable_get_disabled_blocks(),
			'nonce' => wp_create_nonce( 'stackable' ),
			'devMode' => defined( 'WP_ENV' ) ? WP_ENV === 'development' : false,

			// Fonts.
			'locale' => get_locale(),

			// Overridable default primary color for buttons and other blocks.
			'primaryColor' => get_theme_mod( 's_primary_color', '#2091e1' ),

			// Premium related variables.
			'isPro' => sugb_fs()->can_use_premium_code(),
			'showProNotice' => stackable_should_show_pro_notices(),
			'pricingURL' => sugb_fs()->get_upgrade_url(),
			'planName' => sugb_fs()->is_plan( 'starter', true ) ? 'starter' :
			              sugb_fs()->is_plan( 'professional', true ) ? 'professional' : 'business',
		) );
	}

	// Enqueue in a higher number so that other scripts that add on Stackable can load first. E.g. Premium.
	add_action( 'enqueue_block_editor_assets', 'stackable_block_editor_assets', 20 );
}

if ( ! function_exists( 'stackable_load_plugin_textdomain' ) ) {

	/**
	 * Translations.
	 */
	function stackable_load_plugin_textdomain() {
		load_plugin_textdomain( 'stackable-ultimate-gutenberg-blocks' );
	}
	add_action( 'plugins_loaded', 'stackable_load_plugin_textdomain' );
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
					'title' => __( 'Stackable', STACKABLE_I18N ),
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

if ( ! function_exists( 'stackable_allow_safe_style_css' ) ) {

	/**
	 * Fix block saving for Non-Super-Admins (no unfiltered_html capability).
	 * For Non-Super-Admins, some styles & HTML tags/attributes are removed upon saving,
	 * this allows Stackable styles from being saved.
	 *
	 * For every Stackable block, add the styles used here.
	 * Inlined styles are the only ones filtered out. Styles inside
	 * <style> tags are okay.
	 *
	 * @see The list of style rules allowed: https://core.trac.wordpress.org/browser/tags/5.2/src/wp-includes/kses.php#L2069
	 * @see https://github.com/gambitph/Stackable/issues/184
	 *
	 * @param array $styles Allowed CSS style rules.
	 *
	 * @return array Modified CSS style rules.
	 */
	function stackable_allow_safe_style_css( $styles ) {
		return array_merge( $styles, array(
			'border-radius',
			'opacity',
			'justify-content',
			'display',
		) );
	}
	add_filter( 'safe_style_css', 'stackable_allow_safe_style_css' );
}

if ( ! function_exists( 'stackable_allow_wp_kses_allowed_html' ) ) {

	/**
	 * Fix block saving for Non-Super-Admins (no unfiltered_html capability).
	 * For Non-Super-Admins, some styles & HTML tags/attributes are removed upon saving,
	 * this allows Stackable HTML tags & attributes from being saved.
	 *
	 * For every Stackable block, add the HTML tags and attributes used here.
	 *
	 * @see The list of tags & attributes currently allowed: https://core.trac.wordpress.org/browser/tags/5.2/src/wp-includes/kses.php#L61
	 * @see https://github.com/gambitph/Stackable/issues/184
	 *
	 * @param array $tags Allowed HTML tags & attributes.
	 * @param string $context The context wherein the HTML is being filtered.
	 *
	 * @return array Modified HTML tags & attributes.
	 */
	function stackable_allow_wp_kses_allowed_html( $tags, $context ) {
		$tags['style'] = array();

		// Used by Separators & Icons.
		$tags['svg'] = array(
			'viewbox' => true,
			'filter' => true,
			'enablebackground' => true,
			'xmlns' => true,
			'class' => true,
			'preserveaspectratio' => true,
			'aria-hidden' => true,
			'data-*' => true,
			'role' => true,
			'height' => true,
			'width' => true,
		);
		$tags['path'] = array(
			'class' => true,
			'fill' => true,
			'd' => true,
		);
		$tags['filter'] = array(
			'id' => true,
		);
		$tags['fegaussianblur'] = array(
			'in' => true,
			'stddeviation' => true,
		);
		$tags['fecomponenttransfer'] = array();
		$tags['fefunca'] = array(
			'type' => true,
			'slope' => true,
		);
		$tags['femerge'] = array();
		$tags['femergenode'] = array(
			'in' => true,
		);

		_stackable_common_attributes( $tags, 'div' );
		_stackable_common_attributes( $tags, 'h1' );
		_stackable_common_attributes( $tags, 'h2' );
		_stackable_common_attributes( $tags, 'h3' );
		_stackable_common_attributes( $tags, 'h4' );
		_stackable_common_attributes( $tags, 'h5' );
		_stackable_common_attributes( $tags, 'h6' );
		_stackable_common_attributes( $tags, 'svg' );

		return $tags;
	}

	function _stackable_common_attributes( &$tags, $tag ) {
		$tags[ $tag ]['aria-hidden'] = true; // Used by Separators & Icons
		$tags[ $tag ]['aria-expanded'] = true; // Used by Expand block.
		$tags[ $tag ]['aria-level'] = true; // Used by Accordion block.
		$tags[ $tag ]['role'] = true; // Used by Accordion block.
		$tags[ $tag ]['tabindex'] = true; // Used by Accordion block.
	}
	add_filter( 'wp_kses_allowed_html', 'stackable_allow_wp_kses_allowed_html', 10, 2 );
}
