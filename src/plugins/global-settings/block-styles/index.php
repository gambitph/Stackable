<?php
/**
 * Stackable Global Block Styles
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}


if ( ! class_exists( 'Stackable_Global_Block_Styles' ) ) {
	/**
	 * Stackable Global Block Styles
	 */
    class Stackable_Global_Block_Styles {

		/**
		 * Initialize
		 */
		public static $stackable_global_block_styles = array();

  		function __construct() {
			// Register our settings.
			add_action( 'register_stackable_global_settings', array( $this, 'register_block_styles' ) );

			if ( is_frontend() ) {
				$this::init_global_block_styles_associative();

				// Add the Global Block Styles styles in the frontend only.
				add_filter( 'stackable_inline_styles_nodep', array( $this, 'add_global_block_styles' ) );

				// Strip out the styles in the block if they're using global block styles
				add_filter( 'render_block', array( $this, 'use_global_block_styles' ), 1, 2);
			}
		}

		/**
		 * Register the settings we need for global color schemes.
		 *
		 * @return void
		 */
		public function register_block_styles() {
			register_setting(
				'stackable_global_settings',
				'stackable_global_block_styles',
				array(
					'type' => 'object',
					'description' => __( 'Stackable Block Styles', STACKABLE_I18N ),
					'sanitize_callback' => array( $this, 'sanitize_array_setting' ),
					'show_in_rest' => array(
						'schema' => array(
							'type' => 'object',
							// The keys are block names in kebab case.
							// The values are the block styles array for the block.
							'additionalProperties' => array(
								'type' => 'array',
								'items' => array(
									'type' => 'object',
									'properties' => array(
										'name' => array(
											'type' => 'string',
										),
										'slug' => array(
											'type' => 'string',
										),
										'attributes' => array(
											'type' => 'object',
											'additionalProperties' => true,
										),
										'css' => array(
											'type' => 'string',
										),
									),
								),
							),
						),
					),
					'default' => array(),
				)
			);
		}

		public function sanitize_array_setting( $input ) {
			return ! is_array( $input ) ? array( array() ) : $input;
		}


		/**-----------------------------------------------------------------------------
		 * Global Block Styles functions
		 *-----------------------------------------------------------------------------*/

		 /**
		  * Compiles all the global block styles CSS
		  */
		public function add_global_block_styles( $current_css ) {
			$global_block_styles = get_option( 'stackable_global_block_styles' );

			if ( ! $global_block_styles ) {
				return $current_css;
			}

			$block_style_css = "";

			foreach ( $global_block_styles as $block => $block_styles ) {
				$block_style_css .= "\n/* Global Block Styles ($block) */\n";
				foreach ( $block_styles as $block_style ) {
					$block_style_css .= $block_style[ 'css' ];
				}
			}

			$current_css .= $block_style_css;

			return $current_css;
		}

		/**
		 * Converts the global block styles to an associative array
		 * Make the block styles per Stackable block indexable by slug
		 */
		public static function init_global_block_styles_associative() {
			$global_block_styles = get_option( 'stackable_global_block_styles', array() );

			$block_styles_assoc = array();
			foreach ( $global_block_styles as $block => $block_styles ) {
				$block_block_styles = array();
				foreach ( $block_styles as $block_style ) {
					$block_block_styles[ $block_style[ 'slug' ] ] = $block_style;
				}

				$block_styles_assoc[ $block ] = $block_block_styles;
			}

			self::$stackable_global_block_styles = $block_styles_assoc;
		}

		/**
		 * Strips out the style tags in the block if they're using global block styles
		 */
		public function use_global_block_styles( $block_content, $block ) {
			if ( ! isset( $block['blockName'] ) || strpos( $block['blockName'], 'stackable/' ) === false ) {
				return $block_content;
			}

			if ( ! self::is_block_using_global_block_styles( $block ) ) {
				return $block_content;
			}

			if ( isset( $block['attrs']['uniqueId'] ) ) {
				$unique_id = $block[ 'attrs' ][ 'uniqueId' ];

				$styles = array();
				Stackable_CSS_Optimize::parse_block_style( $block, $styles, false );

				if ( isset ( $styles[ $unique_id ] ) ){
					foreach ( $styles[ $unique_id ] as $style ) {
						if ( is_array( $style ) ) {
							$block_content = str_replace( $style[0], '', $block_content );
							error_log( 'replaced');
						} else if ( is_string( $style ) ) {
							$block_content = str_replace( '<style>' . $style . '</style>', '', $block_content );
						}
					}
				}
			}

			return $block_content;
		}

		/**
		 * Checker if the block is using global block styles
		 */
		public static function is_block_using_global_block_styles( $block ) {
			$global_block_styles = self::$stackable_global_block_styles;

			if ( ! isset( $global_block_styles[ $block[ 'blockName' ] ] ) ||
				! isset( $block[ 'attrs' ][ 'blockStyle' ] )
			) {
				return false;
			}

			$block_name = $block[ 'blockName' ];
			$block_style = isset ( $block[ 'attrs' ][ 'blockStyle' ] ) ? $block[ 'attrs' ][ 'blockStyle' ] : '';
			$modified = isset( $block[ 'attrs' ][ 'modifiedBlockStyle' ] ) ? $block[ 'attrs' ][ 'modifiedBlockStyle' ] : false;

			if ( ! isset( $global_block_styles[ $block_name ] ) ||
				! isset( $global_block_styles[ $block_name ][ $block_style ] ) ||
				( $block_style && $modified )
			) {
				return false;
			}

			return true;
		}
	}

	new Stackable_Global_Block_Styles();
}
