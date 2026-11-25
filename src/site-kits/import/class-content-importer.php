<?php
/**
 * Site Kit pages, patterns, and navigation import.
 *
 * @package Stackable
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Site_Kit_Content_Importer' ) ) {
	class Stackable_Site_Kit_Content_Importer {

		private $rollback;
		private $media;
		private $page_map = array();
		private $navigation_map = array();
		private $pattern_map = array();

		public function __construct( $rollback, $media ) {
			$this->rollback = $rollback;
			$this->media = $media;
		}

		public function import_pages( $package_data ) {
			foreach ( $package_data['pages'] as $page ) {
				$post_id = $this->find_owned_post( 'page', $package_data['slug'], 'stk_site_kit_page', $page['slug'] );
				$post = array(
					'post_type' => 'page',
					'post_name' => $page['slug'],
					'post_title' => $page['title'],
					'post_status' => $page['status'],
					'post_content' => $this->media->rewrite_content( $page['content'] ),
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

				update_post_meta( $post_id, 'stk_site_kit', $package_data['slug'] );
				update_post_meta( $post_id, 'stk_site_kit_page', $page['slug'] );
				update_post_meta( $post_id, '_wp_page_template', $page['template'] );
				foreach ( $this->media->rewrite_value( $page['meta'] ) as $key => $value ) {
					update_post_meta( $post_id, $key, $value );
				}
				if ( ! empty( $page['featuredMedia'] ) ) {
					$thumbnail_id = $this->media->attachment_id( $page['featuredMedia'] );
					if ( $thumbnail_id ) {
						set_post_thumbnail( $post_id, $thumbnail_id );
					}
				}
				$this->page_map[ $page['slug'] ] = (int) $post_id;
			}

			foreach ( $package_data['patterns'] as $pattern ) {
				$result = $this->upsert_owned_post(
					'wp_block',
					$package_data['slug'],
					'stk_site_kit_pattern',
					$pattern['slug'],
					array(
						'post_name' => $pattern['slug'],
						'post_title' => $pattern['title'],
						'post_status' => $pattern['status'],
						'post_content' => $this->media->rewrite_content( $pattern['content'] ),
					)
				);
				if ( is_wp_error( $result ) ) {
					return $result;
				}
				$this->pattern_map[ $pattern['slug'] ] = (int) $result;
			}

			return $this->page_map;
		}

		public function resolve_pattern_tokens( $package_data ) {
			return $this->resolve_owned_post_tokens( $package_data, 'stkSiteKitPattern', $this->pattern_map, false );
		}

		public function resolve_page_tokens( $package_data ) {
			return $this->resolve_owned_post_tokens( $package_data, 'stkSiteKitPage', $this->page_map, true );
		}

		private function resolve_owned_post_tokens( $package_data, $attribute, $map, $include_url ) {
			foreach ( array( 'page', 'wp_block', 'wp_template', 'wp_template_part' ) as $post_type ) {
				$posts = get_posts(
					array(
						'post_type' => $post_type,
						'post_status' => array( 'publish', 'draft', 'private', 'pending', 'future' ),
						'posts_per_page' => -1,
						'meta_key' => 'stk_site_kit',
						'meta_value' => $package_data['slug'],
					)
				);
				foreach ( $posts as $post ) {
					$content = $this->rewrite_block_tokens( $post->post_content, $attribute, $map, $include_url );
					if ( $content !== $post->post_content ) {
						$this->rollback->record_post( $post->ID );
						$result = wp_update_post( wp_slash( array( 'ID' => $post->ID, 'post_content' => $content ) ), true );
						if ( is_wp_error( $result ) ) {
							return $result;
						}
					}
				}
			}
			return true;
		}

		public function import_navigation( $package_data ) {
			foreach ( $package_data['menu']['entities'] as $entity ) {
				$content = $this->rewrite_page_tokens( $this->media->rewrite_content( $entity['content'] ) );
				$post_id = $this->upsert_owned_post(
					'wp_navigation',
					$package_data['slug'],
					'stk_site_kit_navigation',
					$entity['slug'],
					array(
						'post_name' => $entity['slug'],
						'post_title' => $entity['title'],
						'post_status' => $entity['status'],
						'post_content' => $content,
					)
				);
				if ( is_wp_error( $post_id ) ) {
					return $post_id;
				}
				$this->navigation_map[ $entity['slug'] ] = (int) $post_id;
			}

			$menu_result = $this->import_classic_menu( $package_data );
			if ( is_wp_error( $menu_result ) ) {
				return $menu_result;
			}
			return $this->navigation_map;
		}

		public function resolve_template_navigation_tokens( $package_data ) {
			foreach ( array( 'wp_template', 'wp_template_part' ) as $post_type ) {
				$posts = get_posts(
					array(
						'post_type' => $post_type,
						'post_status' => array( 'publish', 'draft', 'private', 'pending', 'future' ),
						'posts_per_page' => -1,
						'meta_key' => 'stk_site_kit',
						'meta_value' => $package_data['slug'],
					)
				);
				foreach ( $posts as $post ) {
					$content = $this->rewrite_navigation_tokens( $post->post_content );
					if ( $content !== $post->post_content ) {
						$this->rollback->record_post( $post->ID );
						$result = wp_update_post( wp_slash( array( 'ID' => $post->ID, 'post_content' => $content ) ), true );
						if ( is_wp_error( $result ) ) {
							return $result;
						}
					}
				}
			}
			return true;
		}

		public function get_page_map() {
			return $this->page_map;
		}

		private function import_classic_menu( $package_data ) {
			if ( ! $package_data['menu']['items'] ) {
				return true;
			}
			$menu = $this->find_owned_menu( $package_data['slug'] );
			$menu_id = $menu
				? (int) $menu->term_id
				: wp_create_nav_menu( $this->unique_menu_name( 'Site Kit: ' . $package_data['title'] . ' [' . $package_data['slug'] . ']' ) );
			if ( is_wp_error( $menu_id ) ) {
				return $menu_id;
			}
			if ( ! $menu ) {
				$this->rollback->record_new_menu( $menu_id );
			} else {
				$this->rollback->record_term_meta( $menu_id );
			}
			update_term_meta( $menu_id, 'stk_site_kit', $package_data['slug'] );
			$imported_paths = array();
			$result = $this->upsert_menu_items( $menu_id, $package_data['slug'], $package_data['menu']['items'], 0, '', $imported_paths );
			if ( is_wp_error( $result ) ) {
				return $result;
			}
			$result = $this->remove_obsolete_menu_items( $menu_id, $package_data['slug'], $imported_paths );
			if ( is_wp_error( $result ) ) {
				return $result;
			}

			$option_name = 'theme_mods_' . get_option( 'stylesheet' );
			$this->rollback->record_option( $option_name );
			$locations = get_theme_mod( 'nav_menu_locations', array() );
			$locations[ $package_data['menu']['location'] ] = $menu_id;
			set_theme_mod( 'nav_menu_locations', $locations );
			return true;
		}

		private function upsert_menu_items( $menu_id, $kit_slug, $items, $parent_id, $parent_path, &$imported_paths ) {
			foreach ( $items as $index => $item ) {
				if ( empty( $this->page_map[ $item['page'] ] ) ) {
					return new WP_Error( 'site_kit_import_unknown_page', __( 'Navigation references a page that was not imported.', STACKABLE_I18N ) );
				}
				$item_path = '' === $parent_path ? (string) $index : $parent_path . '.' . $index;
				$imported_paths[] = $item_path;
				$existing = get_posts(
					array(
						'post_type' => 'nav_menu_item',
						'post_status' => 'any',
						'posts_per_page' => 1,
						'fields' => 'ids',
						'meta_query' => array(
							array( 'key' => '_stk_site_kit', 'value' => $kit_slug ),
							array( 'key' => '_stk_site_kit_item', 'value' => $item_path ),
						),
					)
				);
				$item_id = $existing ? (int) $existing[0] : 0;
				if ( $item_id ) {
					$this->rollback->record_post( $item_id );
				}
				$item_id = wp_update_nav_menu_item(
					$menu_id,
					$item_id,
					array(
						'menu-item-title' => wp_slash( $item['label'] ),
						'menu-item-object' => 'page',
						'menu-item-object-id' => $this->page_map[ $item['page'] ],
						'menu-item-type' => 'post_type',
						'menu-item-status' => 'publish',
						'menu-item-parent-id' => $parent_id,
					)
				);
				if ( is_wp_error( $item_id ) ) {
					return $item_id;
				}
				if ( ! $existing ) {
					$this->rollback->record_new_post( $item_id );
				}
				update_post_meta( $item_id, '_stk_site_kit', $kit_slug );
				update_post_meta( $item_id, '_stk_site_kit_page', $item['page'] );
				update_post_meta( $item_id, '_stk_site_kit_item', $item_path );
				if ( ! empty( $item['children'] ) ) {
					$result = $this->upsert_menu_items( $menu_id, $kit_slug, $item['children'], $item_id, $item_path, $imported_paths );
					if ( is_wp_error( $result ) ) {
						return $result;
					}
				}
			}
			return true;
		}

		private function find_owned_menu( $kit_slug ) {
			$menus = get_terms(
				array(
					'taxonomy' => 'nav_menu',
					'hide_empty' => false,
					'number' => 1,
					'meta_key' => 'stk_site_kit',
					'meta_value' => $kit_slug,
				)
			);
			return ! is_wp_error( $menus ) && $menus ? $menus[0] : false;
		}

		private function unique_menu_name( $base_name ) {
			$candidate = $base_name;
			$suffix = 2;
			while ( wp_get_nav_menu_object( $candidate ) ) {
				$candidate = $base_name . ' ' . $suffix;
				++$suffix;
			}
			return $candidate;
		}

		private function remove_obsolete_menu_items( $menu_id, $kit_slug, $imported_paths ) {
			$items = get_posts(
				array(
					'post_type' => 'nav_menu_item',
					'post_status' => 'any',
					'posts_per_page' => -1,
					'fields' => 'ids',
					'meta_key' => '_stk_site_kit',
					'meta_value' => $kit_slug,
					'tax_query' => array(
						array(
							'taxonomy' => 'nav_menu',
							'field' => 'term_id',
							'terms' => array( $menu_id ),
						),
					),
				)
			);
			foreach ( $items as $item_id ) {
				if ( in_array( get_post_meta( $item_id, '_stk_site_kit_item', true ), $imported_paths, true ) ) {
					continue;
				}
				$this->rollback->record_post( $item_id );
				if ( ! wp_trash_post( $item_id ) ) {
					return new WP_Error( 'site_kit_import_menu_cleanup_failed', __( 'An obsolete Site Kit menu item could not be removed.', STACKABLE_I18N ) );
				}
			}
			return true;
		}

		private function rewrite_page_tokens( $content ) {
			return $this->rewrite_block_tokens( $content, 'stkSiteKitPage', $this->page_map, true );
		}

		private function rewrite_navigation_tokens( $content ) {
			return $this->rewrite_block_tokens( $content, 'stkSiteKitNavigation', $this->navigation_map, false );
		}

		private function rewrite_block_tokens( $content, $attribute, $map, $include_url ) {
			if ( ! function_exists( 'parse_blocks' ) || ! function_exists( 'serialize_blocks' ) ) {
				return $content;
			}
			$blocks = parse_blocks( $content );
			$this->rewrite_blocks( $blocks, $attribute, $map, $include_url );
			return serialize_blocks( $blocks );
		}

		private function rewrite_blocks( &$blocks, $attribute, $map, $include_url ) {
			foreach ( $blocks as &$block ) {
				if ( ! empty( $block['attrs'][ $attribute ] ) && isset( $map[ $block['attrs'][ $attribute ] ] ) ) {
					$block['attrs']['ref'] = $map[ $block['attrs'][ $attribute ] ];
					if ( $include_url ) {
						$block['attrs']['id'] = $map[ $block['attrs'][ $attribute ] ];
						$block['attrs']['url'] = get_permalink( $map[ $block['attrs'][ $attribute ] ] );
						unset( $block['attrs']['ref'] );
					}
					unset( $block['attrs'][ $attribute ] );
				}
				if ( ! empty( $block['innerBlocks'] ) ) {
					$this->rewrite_blocks( $block['innerBlocks'], $attribute, $map, $include_url );
				}
			}
			unset( $block );
		}

		private function upsert_owned_post( $post_type, $kit_slug, $identity_key, $identity, $post ) {
			$post_id = $this->find_owned_post( $post_type, $kit_slug, $identity_key, $identity );
			$post['post_type'] = $post_type;
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
			update_post_meta( $post_id, $identity_key, $identity );
			return $post_id;
		}

		private function find_owned_post( $post_type, $kit_slug, $identity_key, $identity ) {
			$posts = get_posts(
				array(
					'post_type' => $post_type,
					'post_status' => 'any',
					'posts_per_page' => 1,
					'fields' => 'ids',
					'meta_query' => array(
						array( 'key' => 'stk_site_kit', 'value' => $kit_slug ),
						array( 'key' => $identity_key, 'value' => $identity ),
					),
				)
			);
			return $posts ? (int) $posts[0] : 0;
		}
	}
}
