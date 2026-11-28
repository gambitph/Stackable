<?php
/**
 * Navigation collector for Site Kit exports.
 *
 * @package Stackable
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Site_Kit_Navigation_Collector' ) ) {
	class Stackable_Site_Kit_Navigation_Collector {

		private $media;
		private $warnings = array();

		public function __construct( $media ) {
			$this->media = $media;
		}

		public function collect( $context = array() ) {
			$location = sanitize_title( apply_filters( 'stackable_site_kit_export_menu_location', 'primary' ) );

			return array(
				'location' => $location ? $location : 'primary',
				'items' => $this->collect_classic_menu_items( $location ),
				'entities' => $this->collect_navigation_entities( isset( $context['package']['theme'] ) ? $context['package']['theme'] : array() ),
			);
		}

		public function get_warnings() {
			return $this->warnings;
		}

		public function reset() {
			$this->warnings = array();
		}

		private function collect_classic_menu_items( $location ) {
			$locations = get_nav_menu_locations();
			if ( empty( $locations[ $location ] ) ) {
				return array();
			}

			$menu_items = wp_get_nav_menu_items( $locations[ $location ] );
			if ( ! is_array( $menu_items ) ) {
				return array();
			}

			$page_ids = array();
			foreach ( $menu_items as $item ) {
				if ( 'page' === $item->object ) {
					$page_ids[] = (int) $item->object_id;
				}
			}

			$page_slugs = array();
			if ( $page_ids ) {
				$pages = get_posts(
					array(
						'post_type' => 'page',
						'post__in' => array_values( array_unique( $page_ids ) ),
						'posts_per_page' => -1,
						'post_status' => array( 'publish', 'draft', 'private', 'pending', 'future' ),
						'no_found_rows' => true,
					)
				);
				foreach ( $pages as $page ) {
					$page_slugs[ $page->ID ] = Stackable_Site_Kit_Portable_Data::slug( $page->post_name, 'page-' . $page->ID );
				}
			}

			$items = array();
			foreach ( $menu_items as $item ) {
				if ( 'page' !== $item->object || empty( $page_slugs[ $item->object_id ] ) ) {
					$this->warnings[] = array(
						'code' => 'unsupported_navigation_item',
						'path' => '/menu/items',
						'message' => 'A menu item was omitted because it does not reference an exported page.',
					);
					continue;
				}
				$items[ $item->ID ] = array(
					'parent' => (int) $item->menu_item_parent,
					'page' => $page_slugs[ $item->object_id ],
					'label' => (string) $item->title,
					'children' => array(),
				);
			}
			foreach ( $items as &$item ) {
				if ( $item['parent'] && ! isset( $items[ $item['parent'] ] ) ) {
					$item['parent'] = 0;
				}
			}
			unset( $item );

			return $this->nest_menu_items( $items, 0 );
		}

		private function nest_menu_items( $items, $parent_id ) {
			$nested = array();
			foreach ( $items as $item_id => $item ) {
				if ( $item['parent'] !== (int) $parent_id ) {
					continue;
				}
				$children = $this->nest_menu_items( $items, $item_id );
				$entry = array(
					'page' => $item['page'],
					'label' => $item['label'],
				);
				if ( $children ) {
					$entry['children'] = $children;
				}
				$nested[] = $entry;
			}
			return $nested;
		}

		private function collect_navigation_entities( $theme ) {
			$references = array();
			$slugs = array();
			foreach ( array( 'templates', 'templateParts' ) as $collection ) {
				foreach ( isset( $theme[ $collection ] ) ? $theme[ $collection ] : array() as $template ) {
					if ( preg_match_all( '/<!--\s+wp:navigation\s+({.*?})\s*(?:\/)?-->/', $template['content'], $matches ) ) {
						foreach ( $matches[1] as $attributes_json ) {
							$attributes = json_decode( $attributes_json, true );
							if ( ! empty( $attributes['ref'] ) ) {
								$references[] = (int) $attributes['ref'];
							}
						}
					}
					if ( preg_match_all( '/"stkSiteKitNavigation"\s*:\s*"([a-z0-9]+(?:-[a-z0-9]+)*)"/', $template['content'], $token_matches ) ) {
						$slugs = array_merge( $slugs, $token_matches[1] );
					}
				}
			}

			$references = array_values( array_unique( array_filter( $references ) ) );
			$slugs = array_values( array_unique( array_filter( $slugs ) ) );
			if ( ! $references && ! $slugs ) {
				return array();
			}

			$posts = array();
			if ( $references ) {
				$posts = get_posts( array(
					'post_type' => 'wp_navigation',
					'post__in' => $references,
					'posts_per_page' => -1,
					'post_status' => array( 'publish', 'draft', 'private', 'pending', 'future' ),
					'no_found_rows' => true,
				) );
			}
			if ( $slugs ) {
				$posts = array_merge( $posts, get_posts( array(
					'post_type' => 'wp_navigation',
					'post_name__in' => $slugs,
					'posts_per_page' => -1,
					'post_status' => array( 'publish', 'draft', 'private', 'pending', 'future' ),
					'no_found_rows' => true,
				) ) );
			}
			$posts_by_id = array();
			foreach ( $posts as $post ) {
				$posts_by_id[ $post->ID ] = $post;
			}
			$posts = array_values( $posts_by_id );

			$entities = array();
			foreach ( $posts as $post ) {
				$entities[] = array(
					'slug' => Stackable_Site_Kit_Portable_Data::slug( $post->post_name, 'navigation-' . $post->ID ),
					'title' => (string) $post->post_title,
					'status' => $post->post_status,
					'content' => $this->portable_navigation_content( $this->media->localize_content( $post->post_content ) ),
				);
			}

			$found_ids = wp_list_pluck( $posts, 'ID' );
			foreach ( array_diff( $references, $found_ids ) as $missing_id ) {
				$this->warnings[] = array(
					'code' => 'missing_navigation',
					'path' => '/menu/entities',
					'message' => 'A referenced navigation entity could not be exported: ' . $missing_id,
				);
			}
			$found_slugs = wp_list_pluck( $posts, 'post_name' );
			foreach ( array_diff( $slugs, $found_slugs ) as $missing_slug ) {
				$this->warnings[] = array(
					'code' => 'missing_navigation',
					'path' => '/menu/entities',
					'message' => 'A referenced navigation entity could not be exported: ' . $missing_slug,
				);
			}

			return $entities;
		}

		private function portable_navigation_content( $content ) {
			if ( ! function_exists( 'parse_blocks' ) || ! function_exists( 'serialize_blocks' ) ) {
				return $content;
			}

			$blocks = parse_blocks( $content );
			$page_ids = array();
			$this->collect_navigation_page_ids( $blocks, $page_ids );
			$page_slugs = array();
			if ( $page_ids ) {
				$pages = get_posts(
					array(
						'post_type' => 'page',
						'post__in' => array_values( array_unique( $page_ids ) ),
						'posts_per_page' => -1,
						'post_status' => array( 'publish', 'draft', 'private', 'pending', 'future' ),
						'no_found_rows' => true,
					)
				);
				foreach ( $pages as $page ) {
					$page_slugs[ $page->ID ] = Stackable_Site_Kit_Portable_Data::slug( $page->post_name, 'page-' . $page->ID );
				}
			}

			$this->rewrite_navigation_page_ids( $blocks, $page_slugs );
			return serialize_blocks( $blocks );
		}

		private function collect_navigation_page_ids( $blocks, &$page_ids ) {
			foreach ( $blocks as $block ) {
				if ( isset( $block['blockName'] ) && in_array( $block['blockName'], array( 'core/navigation-link', 'core/navigation-submenu' ), true ) &&
					! empty( $block['attrs']['id'] ) &&
					isset( $block['attrs']['type'] ) && 'page' === $block['attrs']['type'] ) {
					$page_ids[] = (int) $block['attrs']['id'];
				}
				if ( ! empty( $block['innerBlocks'] ) ) {
					$this->collect_navigation_page_ids( $block['innerBlocks'], $page_ids );
				}
			}
		}

		private function rewrite_navigation_page_ids( &$blocks, $page_slugs ) {
			foreach ( $blocks as &$block ) {
				if ( isset( $block['blockName'] ) && in_array( $block['blockName'], array( 'core/navigation-link', 'core/navigation-submenu' ), true ) &&
					! empty( $block['attrs']['id'] ) &&
					isset( $block['attrs']['type'] ) && 'page' === $block['attrs']['type'] &&
					isset( $page_slugs[ $block['attrs']['id'] ] ) ) {
					$block['attrs']['stkSiteKitPage'] = $page_slugs[ $block['attrs']['id'] ];
					unset( $block['attrs']['id'], $block['attrs']['url'] );
				}
				if ( ! empty( $block['innerBlocks'] ) ) {
					$this->rewrite_navigation_page_ids( $block['innerBlocks'], $page_slugs );
				}
			}
			unset( $block );
		}
	}
}
