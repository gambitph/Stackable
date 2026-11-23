<?php
/**
 * Site Kit export orchestration.
 *
 * @package Stackable
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Site_Kit_Exporter' ) ) {
	class Stackable_Site_Kit_Exporter {

		private $collectors;
		private $media;
		private $archive_writer;

		public function __construct( $collectors, $media, $archive_writer ) {
			$this->collectors = $collectors;
			$this->media = $media;
			$this->archive_writer = $archive_writer;
		}

		/**
		 * Build the package model without writing an archive.
		 *
		 * @param array $metadata User-provided package metadata.
		 * @return Stackable_Site_Kit_Export_Package|WP_Error
		 */
		public function build_package( $metadata ) {
			$this->reset_collectors();
			$metadata_error = $this->validate_metadata( $metadata );
			if ( is_wp_error( $metadata_error ) ) {
				return $metadata_error;
			}

			$package_data = array(
				'version' => 1,
				'slug' => $metadata['slug'],
				'title' => $metadata['title'],
				'description' => isset( $metadata['description'] ) ? $metadata['description'] : '',
				'plan' => $metadata['plan'],
				'requires' => array(
					'stackable' => '>=' . STACKABLE_VERSION,
					'theme' => 'start-stackable',
				),
			);
			$warnings = array();

			foreach ( array( 'theme', 'site', 'pages', 'menu', 'patterns', 'stackable', 'plugins' ) as $key ) {
				if ( empty( $this->collectors[ $key ] ) || ! is_object( $this->collectors[ $key ] ) || ! method_exists( $this->collectors[ $key ], 'collect' ) ) {
					/* translators: %s: Site Kit collector name. */
					return new WP_Error( 'site_kit_missing_collector', sprintf( __( 'The Site Kit %s collector is unavailable.', STACKABLE_I18N ), $key ) );
				}

				$context = array(
					'metadata' => $metadata,
					'package' => $package_data,
				);
				$value = $this->collectors[ $key ]->collect( $context );
				if ( is_wp_error( $value ) ) {
					return $value;
				}
				$package_data[ $key ] = $value;
				$warnings = array_merge( $warnings, $this->collector_warnings( $this->collectors[ $key ] ) );
			}

			$package_data['media'] = $this->media->collect();
			$warnings = array_merge( $warnings, $this->collector_warnings( $this->media ) );

			return new Stackable_Site_Kit_Export_Package( $package_data, $this->media->get_files(), $warnings );
		}

		/**
		 * Build and write a Site Kit ZIP archive.
		 *
		 * @param array  $metadata User-provided package metadata.
		 * @param string $archive_path Destination path.
		 * @return array|WP_Error Export result and warnings.
		 */
		public function export( $metadata, $archive_path ) {
			$package = $this->build_package( $metadata );
			if ( is_wp_error( $package ) ) {
				return $package;
			}

			$written_path = $this->archive_writer->write( $package, $archive_path );
			if ( is_wp_error( $written_path ) ) {
				return $written_path;
			}

			return array(
				'path' => $written_path,
				'package' => $package,
				'warnings' => $package->get_warnings(),
			);
		}

		private function validate_metadata( $metadata ) {
			if ( ! is_array( $metadata ) ) {
				return new WP_Error( 'site_kit_invalid_metadata', __( 'Site Kit export metadata must be an array.', STACKABLE_I18N ) );
			}

			foreach ( array( 'slug', 'title', 'plan' ) as $required_key ) {
				if ( empty( $metadata[ $required_key ] ) || ! is_string( $metadata[ $required_key ] ) ) {
					/* translators: %s: Required Site Kit metadata field name. */
					return new WP_Error( 'site_kit_invalid_metadata', sprintf( __( 'Site Kit export metadata is missing %s.', STACKABLE_I18N ), $required_key ) );
				}
			}

			if ( 'default' === $metadata['slug'] || 1 !== preg_match( '/^[a-z0-9]+(?:-[a-z0-9]+)*$/', $metadata['slug'] ) ) {
				return new WP_Error( 'site_kit_invalid_slug', __( 'The Site Kit slug is invalid.', STACKABLE_I18N ) );
			}
			if ( ! in_array( $metadata['plan'], array( 'free', 'premium' ), true ) ) {
				return new WP_Error( 'site_kit_invalid_plan', __( 'The Site Kit plan must be free or premium.', STACKABLE_I18N ) );
			}

			return true;
		}

		private function collector_warnings( $collector ) {
			if ( is_object( $collector ) && method_exists( $collector, 'get_warnings' ) ) {
				return (array) $collector->get_warnings();
			}
			return array();
		}

		private function reset_collectors() {
			foreach ( array_merge( array_values( $this->collectors ), array( $this->media ) ) as $collector ) {
				if ( is_object( $collector ) && method_exists( $collector, 'reset' ) ) {
					$collector->reset();
				}
			}
		}
	}
}
