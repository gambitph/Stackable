<?php
/**
 * Secure Site Kit ZIP reader.
 *
 * @package Stackable
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Site_Kit_Package_Reader' ) ) {
	class Stackable_Site_Kit_Package_Reader {

		const MAX_ARCHIVE_BYTES = 52428800;
		const MAX_EXTRACTED_BYTES = 104857600;
		const MAX_FILES = 500;

		private $validator;

		public function __construct( $validator ) {
			$this->validator = $validator;
		}

		/**
		 * Extract and validate a Site Kit archive without changing WordPress data.
		 *
		 * @param string $archive_path Uploaded ZIP path.
		 * @return Stackable_Site_Kit_Import_Package|WP_Error
		 */
		public function read( $archive_path ) {
			if ( ! is_file( $archive_path ) || ! is_readable( $archive_path ) ) {
				return $this->error( 'site_kit_import_missing_archive', __( 'The Site Kit archive is missing or unreadable.', STACKABLE_I18N ) );
			}

			$max_archive_bytes = (int) apply_filters( 'stackable_site_kit_import_max_archive_bytes', self::MAX_ARCHIVE_BYTES );
			if ( filesize( $archive_path ) > $max_archive_bytes ) {
				return $this->error( 'site_kit_import_archive_too_large', __( 'The Site Kit archive is larger than the allowed limit.', STACKABLE_I18N ) );
			}

			$directory = $this->temporary_directory();
			if ( is_wp_error( $directory ) ) {
				return $directory;
			}

			$entries = $this->extract_entries( $archive_path, $directory );
			if ( is_wp_error( $entries ) ) {
				$this->delete_directory( $directory );
				return $entries;
			}

			$meta_path = $directory . '/meta.json';
			if ( ! is_readable( $meta_path ) ) {
				$this->delete_directory( $directory );
				return $this->error( 'site_kit_import_missing_meta', __( 'The Site Kit archive does not contain meta.json at its root.', STACKABLE_I18N ) );
			}

			$data = json_decode( file_get_contents( $meta_path ) );
			if ( ! is_object( $data ) || JSON_ERROR_NONE !== json_last_error() ) {
				$this->delete_directory( $directory );
				return $this->error( 'site_kit_import_invalid_json', __( 'The Site Kit meta.json file is not valid JSON.', STACKABLE_I18N ) );
			}

			$files = array();
			foreach ( $entries as $entry ) {
				if ( 0 === strpos( $entry, 'assets/' ) ) {
					$files[ $entry ] = $directory . '/' . $entry;
				}
			}
			$package = new Stackable_Site_Kit_Import_Package( $data, $files, $directory );
			$validation = $this->validator->validate( $package );
			if ( $validation['errors'] ) {
				$package->cleanup();
				return new WP_Error(
					'site_kit_import_validation_failed',
					__( 'The Site Kit package did not pass validation.', STACKABLE_I18N ),
					array(
						'status' => 422,
						'validationErrors' => $validation['errors'],
						'warnings' => $validation['warnings'],
					)
				);
			}

			return $package;
		}

		private function extract_entries( $archive_path, $directory ) {
			if ( ! class_exists( 'ZipArchive' ) ) {
				return $this->error( 'site_kit_import_archive_unavailable', __( 'The server cannot securely inspect ZIP archives.', STACKABLE_I18N ) );
			}

			$archive = new ZipArchive();
			if ( true !== $archive->open( $archive_path, ZipArchive::CHECKCONS ) ) {
				return $this->error( 'site_kit_import_invalid_archive', __( 'The uploaded file is not a valid ZIP archive.', STACKABLE_I18N ) );
			}

			$max_files = (int) apply_filters( 'stackable_site_kit_import_max_files', self::MAX_FILES );
			$max_extracted_bytes = (int) apply_filters( 'stackable_site_kit_import_max_extracted_bytes', self::MAX_EXTRACTED_BYTES );
			if ( $archive->numFiles > $max_files ) {
				$archive->close();
				return $this->error( 'site_kit_import_too_many_files', __( 'The Site Kit archive contains too many files.', STACKABLE_I18N ) );
			}

			$entries = array();
			$total_size = 0;
			for ( $index = 0; $index < $archive->numFiles; ++$index ) {
				$stat = $archive->statIndex( $index );
				if ( ! $stat || ! isset( $stat['name'] ) ) {
					$archive->close();
					return $this->error( 'site_kit_import_invalid_archive', __( 'A Site Kit archive entry could not be inspected.', STACKABLE_I18N ) );
				}

				$name = $this->normalize_path( $stat['name'] );
				if ( ! $this->is_safe_path( $name ) || ! $this->is_allowed_path( $name ) || $this->is_symbolic_link( $archive, $index ) ) {
					$archive->close();
					return $this->error( 'site_kit_import_unsafe_archive', __( 'The Site Kit archive contains an unsafe or unsupported file.', STACKABLE_I18N ) );
				}
				if ( isset( $entries[ $name ] ) ) {
					$archive->close();
					return $this->error( 'site_kit_import_duplicate_file', __( 'The Site Kit archive contains duplicate file paths.', STACKABLE_I18N ) );
				}

				$total_size += isset( $stat['size'] ) ? (int) $stat['size'] : 0;
				if ( $total_size > $max_extracted_bytes ) {
					$archive->close();
					return $this->error( 'site_kit_import_extracted_too_large', __( 'The extracted Site Kit would exceed the allowed size.', STACKABLE_I18N ) );
				}

				if ( '/' === substr( $name, -1 ) ) {
					$entries[ $name ] = true;
					continue;
				}

				$contents = $archive->getFromIndex( $index );
				if ( false === $contents ) {
					$archive->close();
					return $this->error( 'site_kit_import_extract_failed', __( 'A Site Kit archive file could not be extracted.', STACKABLE_I18N ) );
				}
				$destination = $directory . '/' . $name;
				if ( ! wp_mkdir_p( dirname( $destination ) ) || false === file_put_contents( $destination, $contents ) ) {
					$archive->close();
					return $this->error( 'site_kit_import_extract_failed', __( 'A Site Kit archive file could not be written.', STACKABLE_I18N ) );
				}
				$entries[ $name ] = true;
			}
			$archive->close();
			return array_keys( $entries );
		}

		private function temporary_directory() {
			$base = trailingslashit( get_temp_dir() ) . 'stackable-site-kit-imports';
			if ( ! wp_mkdir_p( $base ) ) {
				return $this->error( 'site_kit_import_temp_failed', __( 'A temporary Site Kit directory could not be created.', STACKABLE_I18N ) );
			}
			$directory = $base . '/' . wp_generate_uuid4();
			if ( ! wp_mkdir_p( $directory ) ) {
				return $this->error( 'site_kit_import_temp_failed', __( 'A temporary Site Kit directory could not be created.', STACKABLE_I18N ) );
			}
			return $directory;
		}

		private function is_safe_path( $path ) {
			if ( ! $path || false !== strpos( $path, "\0" ) || false !== strpos( $path, '\\' ) || '/' === substr( $path, 0, 1 ) || preg_match( '/^[A-Za-z][A-Za-z0-9+.-]*:/', $path ) ) {
				return false;
			}
			foreach ( explode( '/', rtrim( $path, '/' ) ) as $segment ) {
				if ( '' === $segment || '.' === $segment || '..' === $segment ) {
					return false;
				}
			}
			return true;
		}

		private function is_allowed_path( $path ) {
			return 'meta.json' === $path || 'preview.webp' === $path || 'assets/' === $path || 0 === strpos( $path, 'assets/' );
		}

		private function is_symbolic_link( $archive, $index ) {
			$opsys = 0;
			$attributes = 0;
			if ( ! $archive->getExternalAttributesIndex( $index, $opsys, $attributes ) ) {
				return false;
			}
			return 0120000 === ( ( $attributes >> 16 ) & 0170000 );
		}

		private function normalize_path( $path ) {
			return str_replace( '\\', '/', (string) $path );
		}

		private function delete_directory( $directory ) {
			$package = new Stackable_Site_Kit_Import_Package( new stdClass(), array(), $directory );
			$package->cleanup();
		}

		private function error( $code, $message ) {
			return new WP_Error( $code, $message, array( 'status' => 422 ) );
		}
	}
}
