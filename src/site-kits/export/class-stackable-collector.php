<?php
/**
 * Stackable settings collector for Site Kit exports.
 *
 * @package Stackable
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Site_Kit_Stackable_Collector' ) ) {
	class Stackable_Site_Kit_Stackable_Collector {

		private $warnings = array();
		private $media;

		public function __construct( $media = null ) {
			$this->media = $media;
		}

		public function collect( $context = array() ) {
			$colors = $this->unwrap_single_value( get_option( 'stackable_global_colors', array() ) );
			$typography = $this->unwrap_single_value( get_option( 'stackable_global_typography', array() ) );
			$color_schemes = $this->key_by_property( get_option( 'stackable_global_color_schemes', array() ), 'key' );
			$spacing = get_option( 'stackable_global_spacing_and_borders', array() );

			$design_system = array(
				'colors' => Stackable_Site_Kit_Portable_Data::as_object( Stackable_Site_Kit_Portable_Data::sanitize( $colors, $this->warnings, '/stackable/designSystem/colors' ) ),
				'colorSchemes' => Stackable_Site_Kit_Portable_Data::as_object( Stackable_Site_Kit_Portable_Data::sanitize( $color_schemes, $this->warnings, '/stackable/designSystem/colorSchemes' ) ),
				'typography' => Stackable_Site_Kit_Portable_Data::as_object( Stackable_Site_Kit_Portable_Data::sanitize( $typography, $this->warnings, '/stackable/designSystem/typography' ) ),
				'spacing' => Stackable_Site_Kit_Portable_Data::as_object( Stackable_Site_Kit_Portable_Data::sanitize( $spacing, $this->warnings, '/stackable/designSystem/spacing' ) ),
			);

			return array(
				'designSystem' => $design_system,
				'settings' => Stackable_Site_Kit_Portable_Data::as_object( $this->collect_settings() ),
			);
		}

		public function get_warnings() {
			return $this->warnings;
		}

		public function reset() {
			$this->warnings = array();
		}

		private function collect_settings() {
			$settings = array();
			$missing = new stdClass();
			foreach ( Stackable_Site_Kit_Stackable_Settings::option_names() as $option_name ) {
				if ( 'stackable_global_block_styles' === $option_name ) {
					continue;
				}
				$value = get_option( $option_name, $missing );
				if ( $missing !== $value ) {
					$settings[ $option_name ] = $value;
				}
			}

			$block_styles = get_option( 'stackable_global_block_styles', $missing );
			if ( $missing !== $block_styles ) {
				$settings['stackable_global_block_styles'] = $this->portable_block_styles( $block_styles );
			}

			return Stackable_Site_Kit_Portable_Data::sanitize( $settings, $this->warnings, '/stackable/settings' );
		}

		private function portable_block_styles( $block_styles ) {
			if ( ! is_array( $block_styles ) ) {
				return array();
			}

			$portable = array();
			foreach ( $block_styles as $block_name => $styles ) {
				if ( ! is_array( $styles ) ) {
					continue;
				}
				foreach ( $styles as $style ) {
					if ( ! is_array( $style ) ) {
						continue;
					}
					$entry = array();
					foreach ( array( 'name', 'slug', 'attributes', 'nonCssAttributes' ) as $field ) {
						if ( array_key_exists( $field, $style ) ) {
							$entry[ $field ] = $style[ $field ];
						}
					}
					if ( $this->media && isset( $entry['attributes'] ) ) {
						$entry['attributes'] = $this->media->localize_block_attributes( $block_name, $entry['attributes'] );
					}
					if ( $this->media && isset( $entry['nonCssAttributes'] ) ) {
						$entry['nonCssAttributes'] = $this->media->localize_value( $entry['nonCssAttributes'] );
					}
					$portable[ $block_name ][] = $entry;
				}
			}

			return $portable;
		}

		private function unwrap_single_value( $value ) {
			if ( is_array( $value ) && 1 === count( $value ) && isset( $value[0] ) && is_array( $value[0] ) ) {
				return $value[0];
			}
			return is_array( $value ) ? $value : array();
		}

		private function key_by_property( $items, $property ) {
			if ( ! is_array( $items ) ) {
				return array();
			}

			$keyed = array();
			foreach ( $items as $index => $item ) {
				if ( ! is_array( $item ) ) {
					continue;
				}
				$key = ! empty( $item[ $property ] ) ? sanitize_title( $item[ $property ] ) : 'item-' . ( $index + 1 );
				$keyed[ $key ] = $item;
			}
			return $keyed;
		}
	}
}
