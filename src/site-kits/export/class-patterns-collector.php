<?php
/**
 * User-pattern collector for Site Kit exports.
 *
 * @package Stackable
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Site_Kit_Patterns_Collector' ) ) {
	class Stackable_Site_Kit_Patterns_Collector {

		private $media;
		private $warnings = array();

		public function __construct( $media ) {
			$this->media = $media;
		}

		public function collect( $context = array() ) {
			$posts = get_posts(
				array(
					'post_type' => 'wp_block',
					'post_status' => array( 'publish', 'draft', 'private', 'pending', 'future' ),
					'posts_per_page' => -1,
					'orderby' => 'ID',
					'order' => 'ASC',
					'no_found_rows' => true,
					'update_post_meta_cache' => false,
					'update_post_term_cache' => false,
				)
			);

			$patterns = array();
			foreach ( $posts as $post ) {
				$patterns[] = array(
					'slug' => Stackable_Site_Kit_Portable_Data::slug( $post->post_name ? $post->post_name : $post->post_title, 'pattern-' . $post->ID ),
					'title' => (string) $post->post_title,
					'status' => $post->post_status,
					'content' => Stackable_Site_Kit_Portable_Data::localize_pattern_references( $this->media->localize_content( $post->post_content ), $this->warnings, '/patterns/content' ),
				);
			}

			return $patterns;
		}

		public function get_warnings() {
			return $this->warnings;
		}

		public function reset() {
			$this->warnings = array();
		}
	}
}
