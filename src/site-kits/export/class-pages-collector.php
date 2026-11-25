<?php
/**
 * Page collector for Site Kit exports.
 *
 * @package Stackable
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Site_Kit_Pages_Collector' ) ) {
	class Stackable_Site_Kit_Pages_Collector {

		private $media;
		private $warnings = array();

		public function __construct( $media ) {
			$this->media = $media;
		}

		public function collect( $context = array() ) {
			$posts = get_posts(
				array(
					'post_type' => 'page',
					'post_status' => array( 'publish', 'draft', 'private', 'pending', 'future' ),
					'posts_per_page' => -1,
					'orderby' => 'ID',
					'order' => 'ASC',
					'no_found_rows' => true,
					'update_post_meta_cache' => false,
					'update_post_term_cache' => false,
				)
			);

			$pages = array();
			foreach ( $posts as $post ) {
				$entry = array(
					'slug' => Stackable_Site_Kit_Portable_Data::slug( $post->post_name, 'page-' . $post->ID ),
					'title' => (string) $post->post_title,
					'status' => $this->normalize_status( $post->post_status ),
					'template' => $this->normalize_template( get_page_template_slug( $post->ID ), $post->ID ),
					'content' => Stackable_Site_Kit_Portable_Data::localize_pattern_references( $this->media->localize_content( $post->post_content ), $this->warnings, '/pages/content' ),
					'meta' => Stackable_Site_Kit_Portable_Data::as_object( $this->media->localize_value( $this->collect_meta( $post->ID ) ) ),
				);

				$featured_media = get_post_thumbnail_id( $post->ID );
				if ( $featured_media ) {
					$media_id = $this->media->register_attachment( $featured_media );
					if ( $media_id ) {
						$entry['featuredMedia'] = $media_id;
					}
				}

				$pages[] = $entry;
			}

			return $pages;
		}

		public function get_warnings() {
			return $this->warnings;
		}

		public function reset() {
			$this->warnings = array();
		}

		private function collect_meta( $post_id ) {
			$meta = array();
			$keys = apply_filters( 'stackable_site_kit_export_page_meta_keys', array(), $post_id );
			foreach ( array_unique( array_filter( $keys, 'is_string' ) ) as $key ) {
				$meta[ $key ] = get_post_meta( $post_id, $key, true );
			}

			return Stackable_Site_Kit_Portable_Data::sanitize( $meta, $this->warnings, '/pages/meta' );
		}

		private function normalize_status( $status ) {
			$allowed = array( 'publish', 'draft', 'private', 'pending', 'future' );
			return in_array( $status, $allowed, true ) ? $status : 'draft';
		}

		private function normalize_template( $template, $post_id ) {
			$template = (string) $template;
			$mapping = array(
				'' => 'page',
				'default' => 'page',
				'page' => 'page',
				'page.html' => 'page',
				'full-width' => 'full-width',
				'full-width.html' => 'full-width',
				'blank' => 'blank',
				'blank.html' => 'blank',
			);
			$normalized = isset( $mapping[ $template ] ) ? $mapping[ $template ] : 'page';

			return apply_filters( 'stackable_site_kit_export_page_template', $normalized, $template, $post_id );
		}
	}
}
