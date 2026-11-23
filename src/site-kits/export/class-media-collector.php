<?php
/**
 * Media collection and URL localization for Site Kit exports.
 *
 * @package Stackable
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Site_Kit_Media_Collector' ) ) {
	class Stackable_Site_Kit_Media_Collector {

		private $media = array();
		private $files = array();
		private $attachment_ids = array();
		private $warnings = array();

		public function reset() {
			$this->media = array();
			$this->files = array();
			$this->attachment_ids = array();
			$this->warnings = array();
		}

		/**
		 * Replace local attachment URLs in a string with package paths.
		 *
		 * @param string $content Content to localize.
		 * @return string
		 */
		public function localize_content( $content ) {
			if ( ! is_string( $content ) || '' === $content ) {
				return $content;
			}

			$uploads = wp_get_upload_dir();
			if ( empty( $uploads['baseurl'] ) ) {
				return $content;
			}

			$pattern = '#https?://[^\s"\'<>\\)]+#i';
			if ( ! preg_match_all( $pattern, $content, $matches ) ) {
				return $content;
			}

			foreach ( array_unique( $matches[0] ) as $url ) {
				$clean_url = strtok( $url, '?#' );
				if ( 0 !== strpos( $clean_url, $uploads['baseurl'] . '/' ) ) {
					continue;
				}

				$attachment_id = attachment_url_to_postid( $clean_url );
				if ( ! $attachment_id ) {
					$full_size_url = preg_replace( '/-(?:\d+x\d+|scaled)(?=\.[a-z0-9]+$)/i', '', $clean_url );
					if ( $full_size_url !== $clean_url ) {
						$attachment_id = attachment_url_to_postid( $full_size_url );
					}
				}
				if ( ! $attachment_id ) {
					$this->warnings[] = $this->warning( 'missing_media', '/', 'A local upload URL could not be matched to an attachment: ' . $clean_url );
					continue;
				}

				$media_id = $this->register_attachment( $attachment_id );
				if ( $media_id && isset( $this->attachment_ids[ $attachment_id ]['path'] ) ) {
					$content = str_replace( $url, $this->attachment_ids[ $attachment_id ]['path'], $content );
				}
			}

			return $content;
		}

		/**
		 * Recursively localize media URLs in portable data.
		 *
		 * @param mixed $value Value to localize.
		 * @return mixed
		 */
		public function localize_value( $value ) {
			if ( is_string( $value ) ) {
				return $this->localize_content( $value );
			}

			if ( is_array( $value ) ) {
				foreach ( $value as $key => $item ) {
					$value[ $key ] = $this->localize_value( $item );
				}
				return $value;
			}

			if ( is_object( $value ) ) {
				return (object) $this->localize_value( get_object_vars( $value ) );
			}

			return $value;
		}

		/**
		 * Add an attachment to the package manifest.
		 *
		 * @param int $attachment_id Attachment post ID.
		 * @return string|null Stable package media ID.
		 */
		public function register_attachment( $attachment_id ) {
			$attachment_id = (int) $attachment_id;
			if ( isset( $this->attachment_ids[ $attachment_id ] ) ) {
				return $this->attachment_ids[ $attachment_id ]['id'];
			}

			$source = get_attached_file( $attachment_id, true );
			if ( ! $source || ! is_file( $source ) || ! is_readable( $source ) ) {
				$this->warnings[] = $this->warning( 'missing_media', '/media', 'An attachment file is missing or unreadable: ' . $attachment_id );
				return null;
			}

			$mime_type = get_post_mime_type( $attachment_id );
			$allowed_mimes = get_allowed_mime_types();
			if ( ! $mime_type || ! in_array( $mime_type, $allowed_mimes, true ) ) {
				$this->warnings[] = $this->warning( 'unsupported_media', '/media', 'An attachment uses an unsupported media type: ' . $attachment_id );
				return null;
			}

			$filename = sanitize_file_name( wp_basename( $source ) );
			$package_path = $this->unique_package_path( 'assets/' . $filename );
			$media_id = $this->unique_media_id( sanitize_title( pathinfo( $filename, PATHINFO_FILENAME ) ) );
			$attachment = get_post( $attachment_id );

			$entry = array(
				'id' => $media_id,
				'path' => $package_path,
				'mimeType' => $mime_type,
				'title' => $attachment ? (string) $attachment->post_title : '',
				'alt' => (string) get_post_meta( $attachment_id, '_wp_attachment_image_alt', true ),
				'caption' => $attachment ? (string) $attachment->post_excerpt : '',
			);

			$this->attachment_ids[ $attachment_id ] = array(
				'id' => $media_id,
				'path' => $package_path,
			);
			$this->media[] = $entry;
			$this->files[ $package_path ] = $source;

			return $media_id;
		}

		public function collect() {
			return $this->media;
		}

		public function get_files() {
			return $this->files;
		}

		public function get_warnings() {
			return $this->warnings;
		}

		private function unique_package_path( $path ) {
			$candidate = $path;
			$extension = pathinfo( $path, PATHINFO_EXTENSION );
			$stem = substr( $path, 0, -1 * ( strlen( $extension ) + 1 ) );
			$suffix = 2;
			while ( isset( $this->files[ $candidate ] ) ) {
				$candidate = $stem . '-' . $suffix . '.' . $extension;
				++$suffix;
			}
			return $candidate;
		}

		private function unique_media_id( $media_id ) {
			$media_id = $media_id ? $media_id : 'media';
			$candidate = $media_id;
			$existing_ids = wp_list_pluck( $this->media, 'id' );
			$suffix = 2;
			while ( in_array( $candidate, $existing_ids, true ) ) {
				$candidate = $media_id . '-' . $suffix;
				++$suffix;
			}
			return $candidate;
		}

		private function warning( $code, $path, $message ) {
			return array(
				'code' => $code,
				'path' => $path,
				'message' => $message,
			);
		}
	}
}
