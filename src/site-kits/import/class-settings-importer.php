<?php
/**
 * Site Kit Stackable settings import and cache invalidation.
 *
 * @package Stackable
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Site_Kit_Settings_Importer' ) ) {
	class Stackable_Site_Kit_Settings_Importer {

		private $rollback;
		private $media;
		private $prepared_block_styles = null;

		public function __construct( $rollback, $media = null ) {
			$this->rollback = $rollback;
			$this->media = $media;
		}

		public function preflight( $stackable ) {
			if ( empty( $stackable['settings']['stackable_global_block_styles'] ) ) {
				return true;
			}
			$this->prepared_block_styles = $this->prepare_block_styles( $stackable['settings']['stackable_global_block_styles'] );
			return is_wp_error( $this->prepared_block_styles ) ? $this->prepared_block_styles : true;
		}

		public function import( $stackable ) {
			$options = Stackable_Site_Kit_Stackable_Settings::design_system_options( $stackable['designSystem'] );
			$allowlist = Stackable_Site_Kit_Stackable_Settings::option_names();
			foreach ( $stackable['settings'] as $name => $value ) {
				if ( in_array( $name, $allowlist, true ) ) {
					$options[ $name ] = $value;
				}
			}

			if ( isset( $options['stackable_global_block_styles'] ) ) {
				$options['stackable_global_block_styles'] = null !== $this->prepared_block_styles
					? $this->prepared_block_styles
					: $this->prepare_block_styles( $options['stackable_global_block_styles'] );
				if ( is_wp_error( $options['stackable_global_block_styles'] ) ) {
					return $options['stackable_global_block_styles'];
				}
			}
			if ( $this->media ) {
				$options = $this->media->rewrite_value( $options );
			}

			foreach ( $options as $name => $value ) {
				$this->rollback->record_option( $name );
				update_option( $name, $value, false );
			}
			return true;
		}

		public function flush_caches( $package_data ) {
			foreach ( array( 'stackable_global_color_scheme_generated_css' ) as $option_name ) {
				$this->rollback->record_option( $option_name );
				delete_option( $option_name );
			}
			delete_transient( 'stackable_block_style_inheritance_css' );
			if ( class_exists( 'WP_Theme_JSON_Resolver' ) ) {
				WP_Theme_JSON_Resolver::clean_cached_data();
			}
			do_action( 'stackable_site_kit_import_completed', $package_data );
		}

		private function prepare_block_styles( $block_styles ) {
			if ( ! is_array( $block_styles ) ) {
				return array();
			}
			if ( ! $block_styles ) {
				return $block_styles;
			}
			foreach ( $block_styles as $block_name => $styles ) {
				if ( ! is_array( $styles ) ) {
					unset( $block_styles[ $block_name ] );
					continue;
				}
				foreach ( $styles as $index => $style ) {
					if ( ! is_array( $style ) ) {
						unset( $block_styles[ $block_name ][ $index ] );
						continue;
					}
				}
				$block_styles[ $block_name ] = array_values( $block_styles[ $block_name ] );
			}
			$generated = apply_filters( 'stackable_site_kit_import_block_styles', null, $block_styles );
			if ( ! $this->valid_generated_block_styles( $generated, $block_styles ) ) {
				return new WP_Error( 'site_kit_import_block_styles_unavailable', __( 'Global Block Styles cannot be regenerated on this site.', STACKABLE_I18N ) );
			}
			return $generated;
		}

		private function valid_generated_block_styles( $generated, $portable ) {
			if ( ! is_array( $generated ) || array_diff( array_keys( $generated ), array_keys( $portable ) ) || array_diff( array_keys( $portable ), array_keys( $generated ) ) ) {
				return false;
			}
			foreach ( $portable as $block_name => $styles ) {
				if ( ! isset( $generated[ $block_name ] ) || ! is_array( $generated[ $block_name ] ) || count( $generated[ $block_name ] ) !== count( $styles ) ) {
					return false;
				}
				foreach ( $styles as $index => $style ) {
					$candidate = $generated[ $block_name ][ $index ];
					if ( ! is_array( $candidate ) ) {
						return false;
					}
					$allowed_fields = array_merge( array_keys( $style ), array( 'saveCss', 'editCss' ) );
					if ( array_diff( array_keys( $candidate ), $allowed_fields ) ) {
						return false;
					}
					foreach ( array( 'name', 'slug', 'attributes', 'nonCssAttributes' ) as $field ) {
						$expected = array_key_exists( $field, $style ) ? $style[ $field ] : null;
						$actual = array_key_exists( $field, $candidate ) ? $candidate[ $field ] : null;
						if ( $expected !== $actual ) {
							return false;
						}
					}
					foreach ( array( 'saveCss', 'editCss' ) as $field ) {
						if ( ! isset( $candidate[ $field ] ) || ! is_string( $candidate[ $field ] ) || ! $this->safe_generated_css( $candidate[ $field ] ) ) {
							return false;
						}
					}
					$generated[ $block_name ][ $index ] = $candidate;
				}
			}
			return true;
		}

		private function safe_generated_css( $css ) {
			if ( strlen( $css ) > 1048576 ) {
				return false;
			}
			return 0 === preg_match( '#(?:<|@import|expression\s*\(|javascript\s*:|data\s*:\s*text/html|-moz-binding\s*:|behavior\s*:)#i', $css );
		}
	}
}
