<?php
/**
 * Block-theme data collector for Site Kit exports.
 *
 * @package Stackable
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Site_Kit_Theme_Collector' ) ) {
	class Stackable_Site_Kit_Theme_Collector {

		private $media;
		private $warnings = array();

		public function __construct( $media ) {
			$this->media = $media;
		}

		public function collect( $context = array() ) {
			$user_data = array();
			if ( class_exists( 'WP_Theme_JSON_Resolver' ) && function_exists( 'wp_get_theme' ) ) {
				$theme_json = WP_Theme_JSON_Resolver::get_user_data();
				if ( is_object( $theme_json ) && method_exists( $theme_json, 'get_data' ) ) {
					$user_data = $theme_json->get_data();
				}
			}

			$theme = array(
				'styles' => Stackable_Site_Kit_Portable_Data::as_object( $this->media->localize_value( isset( $user_data['styles'] ) ? $user_data['styles'] : array() ) ),
				'settings' => Stackable_Site_Kit_Portable_Data::as_object( $this->media->localize_value( isset( $user_data['settings'] ) ? $user_data['settings'] : array() ) ),
				'templates' => $this->collect_templates( 'wp_template' ),
				'templateParts' => $this->collect_templates( 'wp_template_part' ),
				'headerFlags' => array(
					'sticky' => (bool) apply_filters( 'stackable_site_kit_export_sticky_header', false ),
					'transparent' => (bool) apply_filters( 'stackable_site_kit_export_transparent_header', false ),
				),
			);

			$style_variation = apply_filters( 'stackable_site_kit_export_style_variation', '' );
			$header_part = apply_filters( 'stackable_site_kit_export_header_part', '' );
			$footer_part = apply_filters( 'stackable_site_kit_export_footer_part', '' );

			if ( $style_variation ) {
				$theme['styleVariation'] = sanitize_title( $style_variation );
			}
			if ( $header_part ) {
				$theme['headerPart'] = sanitize_title( $header_part );
			}
			if ( $footer_part ) {
				$theme['footerPart'] = sanitize_title( $footer_part );
			}

			return $theme;
		}

		public function get_warnings() {
			return $this->warnings;
		}

		public function reset() {
			$this->warnings = array();
		}

		private function collect_templates( $post_type ) {
			if ( ! function_exists( 'get_block_templates' ) ) {
				return array();
			}

			$templates = array();
			foreach ( get_block_templates( array(), $post_type ) as $template ) {
				if ( isset( $template->source ) && 'custom' !== $template->source ) {
					continue;
				}

				$entry = array(
					'slug' => sanitize_title( $template->slug ),
					'theme' => 'start-stackable',
					'type' => $post_type,
					'title' => isset( $template->title ) ? (string) $template->title : '',
					'status' => isset( $template->status ) ? $template->status : 'publish',
					'content' => $this->portable_navigation_references( $this->media->localize_content( isset( $template->content ) ? $template->content : '' ) ),
				);

				if ( 'wp_template' === $post_type ) {
					$entry['description'] = isset( $template->description ) ? (string) $template->description : '';
				} else {
					$entry['area'] = isset( $template->area ) && $template->area ? sanitize_title( $template->area ) : 'uncategorized';
				}

				$templates[] = $entry;
			}

			return $templates;
		}

		private function portable_navigation_references( $content ) {
			if ( ! function_exists( 'parse_blocks' ) || ! function_exists( 'serialize_blocks' ) ) {
				return $content;
			}

			$blocks = parse_blocks( $content );
			$references = array();
			$this->collect_navigation_references( $blocks, $references );
			if ( ! $references ) {
				return $content;
			}

			$posts = get_posts(
				array(
					'post_type' => 'wp_navigation',
					'post__in' => array_values( array_unique( $references ) ),
					'posts_per_page' => -1,
					'post_status' => array( 'publish', 'draft', 'private', 'pending', 'future' ),
					'no_found_rows' => true,
				)
			);
			$slugs = array();
			foreach ( $posts as $post ) {
				$slugs[ (int) $post->ID ] = sanitize_title( $post->post_name );
			}
			$this->rewrite_navigation_references( $blocks, $slugs );
			foreach ( array_diff( array_unique( $references ), array_keys( $slugs ) ) as $missing_id ) {
				$this->warnings[] = array(
					'code' => 'missing_navigation',
					'path' => '/theme',
					'message' => 'A referenced navigation entity could not be made portable: ' . $missing_id,
				);
			}
			return serialize_blocks( $blocks );
		}

		private function collect_navigation_references( $blocks, &$references ) {
			foreach ( $blocks as $block ) {
				if ( isset( $block['blockName'] ) && 'core/navigation' === $block['blockName'] && ! empty( $block['attrs']['ref'] ) ) {
					$references[] = (int) $block['attrs']['ref'];
				}
				if ( ! empty( $block['innerBlocks'] ) ) {
					$this->collect_navigation_references( $block['innerBlocks'], $references );
				}
			}
		}

		private function rewrite_navigation_references( &$blocks, $slugs ) {
			foreach ( $blocks as &$block ) {
				if ( isset( $block['blockName'] ) && 'core/navigation' === $block['blockName'] && ! empty( $block['attrs']['ref'] ) && isset( $slugs[ $block['attrs']['ref'] ] ) ) {
					$block['attrs']['stkSiteKitNavigation'] = $slugs[ $block['attrs']['ref'] ];
					unset( $block['attrs']['ref'] );
				}
				if ( ! empty( $block['innerBlocks'] ) ) {
					$this->rewrite_navigation_references( $block['innerBlocks'], $slugs );
				}
			}
			unset( $block );
		}
	}
}
