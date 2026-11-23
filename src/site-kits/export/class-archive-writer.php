<?php
/**
 * ZIP archive writer for Site Kit exports.
 *
 * @package Stackable
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Site_Kit_Archive_Writer' ) ) {
	class Stackable_Site_Kit_Archive_Writer {

		/**
		 * Write a package as an archive rooted at meta.json and assets/.
		 *
		 * @param Stackable_Site_Kit_Export_Package $package Package to write.
		 * @param string                            $archive_path Destination path.
		 * @return string|WP_Error
		 */
		public function write( $package, $archive_path ) {
			$entries = $this->build_entries( $package );
			if ( is_wp_error( $entries ) ) {
				return $entries;
			}

			if ( class_exists( 'ZipArchive' ) ) {
				return $this->write_with_zip_archive( $entries, $archive_path );
			}

			return $this->write_with_pclzip( $entries, $archive_path );
		}

		private function build_entries( $package ) {
			$json = wp_json_encode( $package->get_data(), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES );
			if ( false === $json ) {
				return new WP_Error( 'site_kit_json_failed', __( 'The Site Kit package could not be encoded as JSON.', STACKABLE_I18N ) );
			}

			$entries = array(
				array(
					'path' => 'meta.json',
					'content' => $json . "\n",
				),
			);

			foreach ( $package->get_files() as $package_path => $source_path ) {
				if ( ! $this->is_safe_package_path( $package_path ) ) {
					return new WP_Error( 'site_kit_invalid_path', __( 'A Site Kit asset has an unsafe package path.', STACKABLE_I18N ) );
				}
				if ( ! is_file( $source_path ) || ! is_readable( $source_path ) ) {
					return new WP_Error( 'site_kit_missing_file', __( 'A Site Kit asset is missing or unreadable.', STACKABLE_I18N ) );
				}
				$entries[] = array(
					'path' => $package_path,
					'source' => $source_path,
				);
			}

			return $entries;
		}

		private function write_with_zip_archive( $entries, $archive_path ) {
			$archive = new ZipArchive();
			if ( true !== $archive->open( $archive_path, ZipArchive::CREATE | ZipArchive::OVERWRITE ) ) {
				return new WP_Error( 'site_kit_archive_failed', __( 'The Site Kit archive could not be created.', STACKABLE_I18N ) );
			}

			foreach ( $entries as $entry ) {
				$added = isset( $entry['content'] )
					? $archive->addFromString( $entry['path'], $entry['content'] )
					: $archive->addFile( $entry['source'], $entry['path'] );
				if ( ! $added ) {
					$archive->close();
					return new WP_Error( 'site_kit_archive_failed', __( 'A file could not be added to the Site Kit archive.', STACKABLE_I18N ) );
				}
			}

			if ( ! $archive->close() ) {
				return new WP_Error( 'site_kit_archive_failed', __( 'The Site Kit archive could not be finalized.', STACKABLE_I18N ) );
			}

			return $archive_path;
		}

		private function write_with_pclzip( $entries, $archive_path ) {
			if ( ! class_exists( 'PclZip' ) && file_exists( ABSPATH . 'wp-admin/includes/class-pclzip.php' ) ) {
				require_once ABSPATH . 'wp-admin/includes/class-pclzip.php';
			}
			if ( ! class_exists( 'PclZip' ) ) {
				return new WP_Error( 'site_kit_archive_unavailable', __( 'No ZIP archive implementation is available.', STACKABLE_I18N ) );
			}

			$pcl_entries = array();
			foreach ( $entries as $entry ) {
				$pcl_entry = array(
					PCLZIP_ATT_FILE_NAME => isset( $entry['source'] ) ? $entry['source'] : $entry['path'],
					PCLZIP_ATT_FILE_NEW_FULL_NAME => $entry['path'],
				);
				if ( isset( $entry['content'] ) ) {
					$pcl_entry[ PCLZIP_ATT_FILE_CONTENT ] = $entry['content'];
				}
				$pcl_entries[] = $pcl_entry;
			}

			$archive = new PclZip( $archive_path );
			if ( 0 === $archive->create( $pcl_entries ) ) {
				return new WP_Error( 'site_kit_archive_failed', $archive->errorInfo( true ) );
			}

			return $archive_path;
		}

		private function is_safe_package_path( $path ) {
			if ( ! is_string( $path ) || 0 !== strpos( $path, 'assets/' ) || false !== strpos( $path, '\\' ) ) {
				return false;
			}
			foreach ( explode( '/', $path ) as $segment ) {
				if ( '' === $segment || '.' === $segment || '..' === $segment ) {
					return false;
				}
			}
			return true;
		}
	}
}
