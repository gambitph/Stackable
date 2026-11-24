<?php
/**
 * Site Kit media import and package-reference rewriting.
 *
 * @package Stackable
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Site_Kit_Media_Importer' ) ) {
	class Stackable_Site_Kit_Media_Importer {

		private $rollback;
		private $map = array();

		public function __construct( $rollback ) {
			$this->rollback = $rollback;
		}

		public function select( $package_data, $selected_data ) {
			$selected = array();
			foreach ( $package_data['media'] as $media ) {
				if ( $this->contains_reference( $selected_data, $media['id'], $media['path'] ) ) {
					$selected[] = $media;
				}
			}
			return $selected;
		}

		public function preflight( $package_data, $package_files, $selected_media = null ) {
			$selected_media = null === $selected_media ? $package_data['media'] : $selected_media;
			foreach ( $selected_media as $media ) {
				if ( empty( $package_files[ $media['path'] ] ) || ! is_readable( $package_files[ $media['path'] ] ) ) {
					return new WP_Error( 'site_kit_import_missing_media', __( 'A selected Site Kit media file is missing.', STACKABLE_I18N ) );
				}
				$source = $package_files[ $media['path'] ];
				$filename = sanitize_file_name( wp_basename( $media['path'] ) );
				$filetype = wp_check_filetype_and_ext( $source, $filename );
				if ( empty( $filetype['type'] ) || $filetype['type'] !== $media['mimeType'] || ! in_array( $filetype['type'], get_allowed_mime_types(), true ) ) {
					return new WP_Error( 'site_kit_import_invalid_media', __( 'A Site Kit media file does not match its declared type.', STACKABLE_I18N ) );
				}
			}
			return true;
		}

		public function import( $package_data, $package_files, $selected_media = null ) {
			if ( ! function_exists( 'wp_generate_attachment_metadata' ) && file_exists( ABSPATH . 'wp-admin/includes/image.php' ) ) {
				require_once ABSPATH . 'wp-admin/includes/image.php';
			}

			$selected_media = null === $selected_media ? $package_data['media'] : $selected_media;
			foreach ( $selected_media as $media ) {
				$existing = $this->find_attachment( $package_data['slug'], $media['id'] );
				if ( $existing ) {
					$this->map[ $media['id'] ] = array(
						'id' => $existing,
						'url' => wp_get_attachment_url( $existing ),
						'path' => $media['path'],
					);
					continue;
				}

				$source = $package_files[ $media['path'] ];
				$filename = sanitize_file_name( wp_basename( $media['path'] ) );
				$filetype = wp_check_filetype_and_ext( $source, $filename );
				if ( empty( $filetype['type'] ) || $filetype['type'] !== $media['mimeType'] || ! in_array( $filetype['type'], get_allowed_mime_types(), true ) ) {
					return new WP_Error( 'site_kit_import_invalid_media', __( 'A Site Kit media file does not match its declared type.', STACKABLE_I18N ) );
				}

				$contents = file_get_contents( $source );
				if ( false === $contents ) {
					return new WP_Error( 'site_kit_import_missing_media', __( 'A selected Site Kit media file could not be read.', STACKABLE_I18N ) );
				}
				$upload = wp_upload_bits( $filename, null, $contents );
				if ( ! empty( $upload['error'] ) ) {
					return new WP_Error( 'site_kit_import_media_upload_failed', $upload['error'] );
				}

				$attachment_id = wp_insert_attachment(
					array(
						'post_mime_type' => $filetype['type'],
						'post_title' => $media['title'],
						'post_excerpt' => $media['caption'],
						'post_status' => 'inherit',
					),
					$upload['file'],
					0,
					true
				);
				if ( is_wp_error( $attachment_id ) ) {
					wp_delete_file( $upload['file'] );
					return $attachment_id;
				}

				$this->rollback->record_new_attachment( $attachment_id );
				update_post_meta( $attachment_id, '_wp_attachment_image_alt', $media['alt'] );
				update_post_meta( $attachment_id, 'stk_site_kit', $package_data['slug'] );
				update_post_meta( $attachment_id, 'stk_site_kit_media', $media['id'] );
				if ( function_exists( 'wp_generate_attachment_metadata' ) ) {
					$metadata = wp_generate_attachment_metadata( $attachment_id, $upload['file'] );
					if ( $metadata ) {
						wp_update_attachment_metadata( $attachment_id, $metadata );
					}
				}
				$this->map[ $media['id'] ] = array(
					'id' => $attachment_id,
					'url' => $upload['url'],
					'path' => $media['path'],
				);
			}

			return $this->map;
		}

		public function rewrite_value( $value ) {
			if ( is_string( $value ) ) {
				foreach ( $this->map as $entry ) {
					$value = str_replace( $entry['path'], $entry['url'], $value );
				}
				return $value;
			}
			if ( is_array( $value ) ) {
				foreach ( $value as $key => $item ) {
					$value[ $key ] = $this->rewrite_value( $item );
				}
			}
			return $value;
		}

		public function rewrite_content( $content ) {
			if ( function_exists( 'parse_blocks' ) && function_exists( 'serialize_blocks' ) ) {
				$blocks = parse_blocks( $content );
				$this->restore_attachment_ids( $blocks );
				$content = serialize_blocks( $blocks );
			}
			return $this->rewrite_value( $content );
		}

		public function attachment_id( $media_id ) {
			return isset( $this->map[ $media_id ] ) ? (int) $this->map[ $media_id ]['id'] : 0;
		}

		public function count() {
			return count( $this->map );
		}

		private function find_attachment( $kit_slug, $media_id ) {
			$posts = get_posts(
				array(
					'post_type' => 'attachment',
					'post_status' => 'inherit',
					'posts_per_page' => 1,
					'fields' => 'ids',
					'meta_query' => array(
						array( 'key' => 'stk_site_kit', 'value' => $kit_slug ),
						array( 'key' => 'stk_site_kit_media', 'value' => $media_id ),
					),
				)
			);
			if ( ! $posts ) {
				return 0;
			}
			$attachment_id = (int) $posts[0];
			$path = get_attached_file( $attachment_id, true );
			return $path && is_readable( $path ) ? $attachment_id : 0;
		}

		private function restore_attachment_ids( &$blocks ) {
			foreach ( $blocks as &$block ) {
				if ( ! empty( $block['attrs']['stkSiteKitMediaIds'] ) && is_array( $block['attrs']['stkSiteKitMediaIds'] ) ) {
					foreach ( $block['attrs']['stkSiteKitMediaIds'] as $name => $portable ) {
						$block['attrs'][ $name ] = $this->restore_attachment_value( $portable );
					}
					unset( $block['attrs']['stkSiteKitMediaIds'] );
				}
				if ( ! empty( $block['innerBlocks'] ) ) {
					$this->restore_attachment_ids( $block['innerBlocks'] );
				}
			}
			unset( $block );
		}

		private function restore_attachment_value( $value ) {
			if ( is_string( $value ) && isset( $this->map[ $value ] ) ) {
				return $this->map[ $value ]['id'];
			}
			if ( is_array( $value ) ) {
				foreach ( $value as $key => $item ) {
					$value[ $key ] = $this->restore_attachment_value( $item );
				}
			}
			return $value;
		}

		private function contains_reference( $value, $media_id, $media_path, $is_media_id = false ) {
			if ( is_string( $value ) ) {
				return ( $is_media_id && $value === $media_id ) || false !== strpos( $value, $media_path );
			}
			if ( is_array( $value ) ) {
				foreach ( $value as $key => $item ) {
					$child_is_media_id = $is_media_id || 'featuredMedia' === $key || 'stkSiteKitMediaIds' === $key;
					if ( $this->contains_reference( $item, $media_id, $media_path, $child_is_media_id ) ) {
						return true;
					}
				}
			}
			return false;
		}
	}
}
