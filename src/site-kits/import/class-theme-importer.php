<?php
/**
 * Site Kit block-theme and website settings import.
 *
 * @package Stackable
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Site_Kit_Theme_Importer' ) ) {
	class Stackable_Site_Kit_Theme_Importer {

		private $rollback;
		private $media;

		public function __construct( $rollback, $media ) {
			$this->rollback = $rollback;
			$this->media = $media;
		}

		public function import( $package_data ) {
			$result = $this->import_global_styles( $package_data['theme'] );
			if ( is_wp_error( $result ) ) {
				return $result;
			}

			foreach ( array( 'templates' => 'wp_template', 'templateParts' => 'wp_template_part' ) as $collection => $post_type ) {
				foreach ( $package_data['theme'][ $collection ] as $template ) {
					$result = $this->upsert_template( $package_data['slug'], $post_type, $template );
					if ( is_wp_error( $result ) ) {
						return $result;
					}
				}
			}
			return true;
		}

		public function apply_site_settings( $package_data, $page_map ) {
			foreach ( array( 'show_on_front', 'page_on_front', 'page_for_posts' ) as $option_name ) {
				$this->rollback->record_option( $option_name );
			}

			$site = $package_data['site'];
			update_option( 'show_on_front', $site['showOnFront'] );
			update_option( 'page_on_front', $site['frontPage'] && isset( $page_map[ $site['frontPage'] ] ) ? $page_map[ $site['frontPage'] ] : 0 );
			update_option( 'page_for_posts', $site['postsPage'] && isset( $page_map[ $site['postsPage'] ] ) ? $page_map[ $site['postsPage'] ] : 0 );

			return true;
		}

		public function apply_shell_flags( $package_data, $page_map ) {
			$front_page_id = 0;
			if ( $package_data['site']['frontPage'] && isset( $page_map[ $package_data['site']['frontPage'] ] ) ) {
				$front_page_id = $page_map[ $package_data['site']['frontPage'] ];
			}

			if ( $front_page_id ) {
				$this->rollback->record_post( $front_page_id );
				update_post_meta( $front_page_id, 'stk_header_sticky', ! empty( $package_data['theme']['headerFlags']['sticky'] ) );
				update_post_meta( $front_page_id, 'stk_header_transparent', ! empty( $package_data['theme']['headerFlags']['transparent'] ) );
			}
			return true;
		}

		private function import_global_styles( $theme ) {
			if ( ! class_exists( 'WP_Theme_JSON_Resolver' ) ) {
				return new WP_Error( 'site_kit_import_theme_api_unavailable', __( 'WordPress Global Styles are unavailable.', STACKABLE_I18N ) );
			}

			$settings = $this->media->rewrite_value( $theme['settings'] );
			$styles = $this->media->rewrite_value( $theme['styles'] );
			if ( ! empty( $theme['styleVariation'] ) && method_exists( 'WP_Theme_JSON_Resolver', 'get_style_variations' ) ) {
				foreach ( WP_Theme_JSON_Resolver::get_style_variations() as $variation ) {
					$variation_slug = ! empty( $variation['slug'] ) ? sanitize_title( $variation['slug'] ) : sanitize_title( isset( $variation['title'] ) ? $variation['title'] : '' );
					if ( $variation_slug !== $theme['styleVariation'] ) {
						continue;
					}
					$settings = array_replace_recursive( isset( $variation['settings'] ) ? $variation['settings'] : array(), $settings );
					$styles = array_replace_recursive( isset( $variation['styles'] ) ? $variation['styles'] : array(), $styles );
					break;
				}
			}

			$user_data = WP_Theme_JSON_Resolver::get_user_data_from_wp_global_styles( wp_get_theme() );
			$post_id = ! empty( $user_data['ID'] ) ? (int) $user_data['ID'] : 0;
			$content = wp_json_encode(
				array(
					'version' => class_exists( 'WP_Theme_JSON' ) ? WP_Theme_JSON::LATEST_SCHEMA : 3,
					'isGlobalStylesUserThemeJSON' => true,
					'settings' => $settings,
					'styles' => $styles,
				),
				JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP
			);
			if ( false === $content ) {
				return new WP_Error( 'site_kit_import_theme_json_failed', __( 'The Site Kit Global Styles could not be encoded.', STACKABLE_I18N ) );
			}

			if ( $post_id ) {
				$this->rollback->record_post( $post_id );
				$result = wp_update_post( wp_slash( array( 'ID' => $post_id, 'post_content' => $content ) ), true );
			} else {
				$result = wp_insert_post(
					wp_slash(
						array(
							'post_type' => 'wp_global_styles',
							'post_name' => 'wp-global-styles-' . get_stylesheet(),
							'post_title' => 'Custom Styles',
							'post_status' => 'publish',
							'post_content' => $content,
							'tax_input' => array(
								'wp_theme' => array( get_stylesheet() ),
							),
						)
					),
					true
				);
				if ( ! is_wp_error( $result ) ) {
					$this->rollback->record_new_post( $result );
				}
			}
			if ( is_wp_error( $result ) ) {
				return $result;
			}

			WP_Theme_JSON_Resolver::clean_cached_data();
			return true;
		}

		private function upsert_template( $kit_slug, $post_type, $template ) {
			$posts = get_posts(
				array(
					'post_type' => $post_type,
					'post_status' => 'any',
					'posts_per_page' => 1,
					'fields' => 'ids',
					'meta_query' => array(
						array( 'key' => 'stk_site_kit', 'value' => $kit_slug ),
						array( 'key' => 'stk_site_kit_template', 'value' => $template['slug'] ),
					),
				)
			);
			$post_id = $posts ? (int) $posts[0] : 0;
			$is_existing = (bool) $post_id;
			$post = array(
				'post_type' => $post_type,
				'post_name' => $template['slug'],
				'post_title' => isset( $template['title'] ) ? $template['title'] : '',
				'post_status' => $template['status'],
				'post_content' => $this->media->rewrite_content( $template['content'] ),
			);
			if ( $post_id ) {
				$this->rollback->record_post( $post_id );
				$post['ID'] = $post_id;
				$post_id = wp_update_post( wp_slash( $post ), true );
			} else {
				$post_id = wp_insert_post( wp_slash( $post ), true );
				if ( ! is_wp_error( $post_id ) ) {
					$this->rollback->record_new_post( $post_id );
				}
			}
			if ( is_wp_error( $post_id ) ) {
				return $post_id;
			}
			update_post_meta( $post_id, 'stk_site_kit', $kit_slug );
			update_post_meta( $post_id, 'stk_site_kit_template', $template['slug'] );
			if ( $is_existing ) {
				$result = $this->rollback->record_post_terms( $post_id, 'wp_theme' );
				if ( is_wp_error( $result ) ) {
					return $result;
				}
			}
			$term_result = wp_set_object_terms( $post_id, 'start-stackable', 'wp_theme' );
			if ( is_wp_error( $term_result ) ) {
				return $term_result;
			}
			if ( 'wp_template_part' === $post_type ) {
				if ( $is_existing ) {
					$result = $this->rollback->record_post_terms( $post_id, 'wp_template_part_area' );
					if ( is_wp_error( $result ) ) {
						return $result;
					}
				}
				$term_result = wp_set_object_terms( $post_id, $template['area'], 'wp_template_part_area' );
				if ( is_wp_error( $term_result ) ) {
					return $term_result;
				}
			}
			return $post_id;
		}
	}
}
