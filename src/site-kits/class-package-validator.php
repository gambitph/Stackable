<?php
/**
 * Site Kit package validation shared by export and import.
 *
 * @package Stackable
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Site_Kit_Package_Validator' ) ) {
	class Stackable_Site_Kit_Package_Validator {

		private $schema_path;

		public function __construct( $schema_path = '' ) {
			$this->schema_path = $schema_path ? $schema_path : __DIR__ . '/schema/site-kit-v1.schema.json';
		}

		/**
		 * Validate a Site Kit package before archive writing or site changes.
		 *
		 * @param object $package Package exposing get_data() and get_files().
		 * @return array Validation errors and warnings.
		 */
		public function validate( $package ) {
			$schema = $this->load_schema();
			if ( is_wp_error( $schema ) ) {
				return array(
					'errors' => array( $this->error( $schema->get_error_code(), '/', $schema->get_error_message() ) ),
					'warnings' => array(),
				);
			}

			$data = $package->get_data();
			$errors = $this->validate_schema( $data, $schema, '', $schema );
			if ( ! $errors ) {
				$errors = array_merge( $errors, $this->validate_package_rules( $data, $package->get_files() ) );
			}

			return array(
				'errors' => $errors,
				'warnings' => $this->collect_unsupported_block_warnings( $data ),
			);
		}

		private function load_schema() {
			if ( ! is_readable( $this->schema_path ) ) {
				return new WP_Error( 'site_kit_schema_unavailable', __( 'The Site Kit schema could not be read.', STACKABLE_I18N ) );
			}

			$schema = json_decode( file_get_contents( $this->schema_path ), true );
			if ( ! is_array( $schema ) ) {
				return new WP_Error( 'site_kit_schema_invalid', __( 'The Site Kit schema is invalid.', STACKABLE_I18N ) );
			}

			return $schema;
		}

		private function validate_schema( $value, $schema, $path, $root_schema ) {
			if ( isset( $schema['$ref'] ) ) {
				$resolved = $this->resolve_reference( $schema['$ref'], $root_schema );
				if ( ! $resolved ) {
					return array( $this->error( 'schema_reference', $path, __( 'The Site Kit schema contains an unknown reference.', STACKABLE_I18N ) ) );
				}
				return $this->validate_schema( $value, $resolved, $path, $root_schema );
			}

			if ( isset( $schema['oneOf'] ) ) {
				$matches = 0;
				foreach ( $schema['oneOf'] as $candidate ) {
					if ( ! $this->validate_schema( $value, $candidate, $path, $root_schema ) ) {
						++$matches;
					}
				}
				return 1 === $matches
					? array()
					: array( $this->error( 'schema_oneOf', $path, __( 'The value does not match exactly one allowed Site Kit shape.', STACKABLE_I18N ) ) );
			}

			if ( array_key_exists( 'const', $schema ) && $value !== $schema['const'] ) {
				$code = '/version' === $path ? 'unknown_version' : 'schema_const';
				return array( $this->error( $code, $path, __( 'The value does not match the required Site Kit value.', STACKABLE_I18N ) ) );
			}

			if ( isset( $schema['enum'] ) && ! in_array( $value, $schema['enum'], true ) ) {
				return array( $this->error( 'schema_enum', $path, __( 'The value is not one of the allowed Site Kit values.', STACKABLE_I18N ) ) );
			}

			if ( isset( $schema['type'] ) && ! $this->matches_type( $value, $schema['type'] ) ) {
				return array( $this->error( 'schema_type', $path, __( 'The value has an invalid Site Kit data type.', STACKABLE_I18N ) ) );
			}

			$errors = array();
			if ( isset( $schema['type'] ) && 'object' === $schema['type'] ) {
				$object = is_object( $value ) ? get_object_vars( $value ) : $value;
				foreach ( isset( $schema['required'] ) ? $schema['required'] : array() as $property ) {
					if ( ! array_key_exists( $property, $object ) ) {
						$errors[] = $this->error( 'schema_required', $path . '/' . $property, __( 'A required Site Kit property is missing.', STACKABLE_I18N ) );
					}
				}

				foreach ( $object as $property => $item ) {
					if ( isset( $schema['properties'][ $property ] ) ) {
						$errors = array_merge( $errors, $this->validate_schema( $item, $schema['properties'][ $property ], $path . '/' . $property, $root_schema ) );
					} elseif ( isset( $schema['additionalProperties'] ) && false === $schema['additionalProperties'] ) {
						$errors[] = $this->error( 'schema_additionalProperties', $path . '/' . $property, __( 'The Site Kit contains an unsupported property.', STACKABLE_I18N ) );
					}
				}
			}

			if ( isset( $schema['type'] ) && 'array' === $schema['type'] ) {
				if ( isset( $schema['minItems'] ) && count( $value ) < $schema['minItems'] ) {
					$errors[] = $this->error( 'schema_minItems', $path, __( 'The Site Kit array does not contain enough items.', STACKABLE_I18N ) );
				}
				if ( isset( $schema['items'] ) ) {
					foreach ( $value as $index => $item ) {
						$errors = array_merge( $errors, $this->validate_schema( $item, $schema['items'], $path . '/' . $index, $root_schema ) );
					}
				}
			}

			if ( isset( $schema['type'] ) && 'string' === $schema['type'] ) {
				if ( isset( $schema['minLength'] ) && strlen( $value ) < $schema['minLength'] ) {
					$errors[] = $this->error( 'schema_minLength', $path, __( 'The Site Kit string is too short.', STACKABLE_I18N ) );
				}
				if ( isset( $schema['pattern'] ) && 1 !== preg_match( '#' . str_replace( '#', '\\#', $schema['pattern'] ) . '#u', $value ) ) {
					$code = preg_match( '#^/media/\d+/path$#', $path ) ? 'invalid_path' : 'schema_pattern';
					$errors[] = $this->error( $code, $path, __( 'The Site Kit string has an invalid format.', STACKABLE_I18N ) );
				}
			}

			return $errors;
		}

		private function validate_package_rules( $data, $files ) {
			$data = $this->to_array( $data );
			$errors = array();
			$package_files = array();
			foreach ( $files as $package_path => $source_path ) {
				$package_files[ $this->normalize_path( $package_path ) ] = $source_path;
			}

			foreach ( $data['media'] as $index => $media ) {
				$media = is_object( $media ) ? get_object_vars( $media ) : $media;
				$media_path = $this->normalize_path( $media['path'] );
				if ( ! $this->is_portable_path( $media['path'] ) ) {
					$errors[] = $this->error( 'invalid_path', '/media/' . $index . '/path', __( 'Media paths must stay inside the Site Kit package.', STACKABLE_I18N ) );
					continue;
				}
				if ( empty( $package_files[ $media_path ] ) || ! is_file( $package_files[ $media_path ] ) || ! is_readable( $package_files[ $media_path ] ) ) {
					$errors[] = $this->error( 'missing_file', '/media/' . $index . '/path', __( 'A Site Kit media file is missing or unreadable.', STACKABLE_I18N ) );
				} elseif ( is_link( $package_files[ $media_path ] ) ) {
					$errors[] = $this->error( 'invalid_path', '/media/' . $index . '/path', __( 'Site Kit media files must not be symbolic links.', STACKABLE_I18N ) );
				}
			}

			$errors = array_merge(
				$errors,
				$this->duplicate_errors( $this->pluck( $data['pages'], 'slug' ), '/pages', __( 'Page slugs', STACKABLE_I18N ) ),
				$this->duplicate_errors( $this->pluck( $data['media'], 'id' ), '/media', __( 'Media IDs', STACKABLE_I18N ) ),
				$this->duplicate_errors( $this->pluck( $data['media'], 'path' ), '/media', __( 'Media paths', STACKABLE_I18N ) ),
				$this->duplicate_errors( $this->pluck( $data['theme']['templates'], 'slug' ), '/theme/templates', __( 'Template slugs', STACKABLE_I18N ) ),
				$this->duplicate_errors( $this->pluck( $data['theme']['templateParts'], 'slug' ), '/theme/templateParts', __( 'Template part slugs', STACKABLE_I18N ) ),
				$this->duplicate_errors( $this->pluck( $data['menu']['entities'], 'slug' ), '/menu/entities', __( 'Navigation slugs', STACKABLE_I18N ) ),
				$this->duplicate_errors( $this->pluck( $data['patterns'], 'slug' ), '/patterns', __( 'Pattern slugs', STACKABLE_I18N ) ),
				$this->duplicate_errors( $this->pluck( $data['plugins'], 'slug' ), '/plugins', __( 'Plugin slugs', STACKABLE_I18N ) ),
				$this->reference_errors( $data ),
				$this->external_media_errors( $data )
			);

			$manifest_paths = array_flip( array_map( array( $this, 'normalize_path' ), $this->pluck( $data['media'], 'path' ) ) );
			foreach ( $this->collect_package_media_references( $data ) as $reference ) {
				if ( ! isset( $manifest_paths[ $reference ] ) ) {
					$errors[] = $this->error( 'unlisted_media_reference', '/', __( 'A package media reference is missing from the media manifest.', STACKABLE_I18N ) );
				}
			}

			return $errors;
		}

		private function reference_errors( $data ) {
			$errors = array();
			$page_slugs = array_flip( $this->pluck( $data['pages'], 'slug' ) );
			$media_ids = array_flip( $this->pluck( $data['media'], 'id' ) );

			if ( 'page' === $data['site']['showOnFront'] && empty( $data['site']['frontPage'] ) ) {
				$errors[] = $this->error( 'front_page_required', '/site/frontPage', __( 'A front page is required when the Site Kit uses a static front page.', STACKABLE_I18N ) );
			}
			foreach ( array( 'frontPage', 'postsPage' ) as $property ) {
				if ( ! empty( $data['site'][ $property ] ) && ! isset( $page_slugs[ $data['site'][ $property ] ] ) ) {
					$errors[] = $this->error( 'unknown_page_reference', '/site/' . $property, __( 'A website setting references a page that is not in the Site Kit.', STACKABLE_I18N ) );
				}
			}
			foreach ( $data['pages'] as $index => $page ) {
				$page = is_object( $page ) ? get_object_vars( $page ) : $page;
				if ( ! empty( $page['featuredMedia'] ) && ! isset( $media_ids[ $page['featuredMedia'] ] ) ) {
					$errors[] = $this->error( 'unknown_media_reference', '/pages/' . $index . '/featuredMedia', __( 'A page references media that is not in the Site Kit.', STACKABLE_I18N ) );
				}
			}
			foreach ( $this->flatten_menu_items( $data['menu']['items'] ) as $index => $item ) {
				if ( ! isset( $page_slugs[ $item['page'] ] ) ) {
					$errors[] = $this->error( 'unknown_page_reference', '/menu/items/' . $index . '/page', __( 'Navigation references a page that is not in the Site Kit.', STACKABLE_I18N ) );
				}
			}

			return $errors;
		}

		private function collect_unsupported_block_warnings( $value, $path = '' ) {
			$warnings = array();
			if ( is_string( $value ) && class_exists( 'WP_Block_Type_Registry' ) ) {
				if ( preg_match_all( '/<!--\s+wp:([a-z0-9-]+(?:\/[a-z0-9-]+)?)/i', $value, $matches ) ) {
					$registry = WP_Block_Type_Registry::get_instance();
					foreach ( array_unique( $matches[1] ) as $block_name ) {
						$block_name = false === strpos( $block_name, '/' ) ? 'core/' . $block_name : $block_name;
						if ( ! $registry->is_registered( $block_name ) ) {
							$warnings[] = $this->error( 'unsupported_block', $path, sprintf( __( 'The block type %s is not registered on this site.', STACKABLE_I18N ), $block_name ) );
						}
					}
				}
				return $warnings;
			}

			foreach ( $this->iterable_value( $value ) as $key => $item ) {
				$warnings = array_merge( $warnings, $this->collect_unsupported_block_warnings( $item, $path . '/' . $key ) );
			}
			return $warnings;
		}

		private function external_media_errors( $value, $path = '' ) {
			$errors = array();
			if ( is_string( $value ) ) {
				if ( preg_match_all( '~(?:https?:)?//[^\s"\'<>\\)]+?\.(?:avif|gif|jpe?g|png|svg|webp|mp4|webm|mp3|wav|ogg|pdf)(?:[?#][^\s"\'<>\\)]*)?~i', $value, $matches ) ) {
					foreach ( $matches[0] as $url ) {
						$errors[] = $this->error( 'external_media_url', $path, sprintf( __( 'External media must be packaged locally: %s', STACKABLE_I18N ), $url ) );
					}
				}
				return $errors;
			}

			foreach ( $this->iterable_value( $value ) as $key => $item ) {
				$errors = array_merge( $errors, $this->external_media_errors( $item, $path . '/' . $key ) );
			}
			return $errors;
		}

		private function collect_package_media_references( $value ) {
			$references = array();
			if ( is_string( $value ) ) {
				if ( preg_match_all( '#(?:^|["\'(\s])((?:assets/)[A-Za-z0-9._/-]+)#', $value, $matches ) ) {
					return array_map( array( $this, 'normalize_path' ), $matches[1] );
				}
				return array();
			}

			foreach ( $this->iterable_value( $value ) as $item ) {
				$references = array_merge( $references, $this->collect_package_media_references( $item ) );
			}
			return $references;
		}

		private function duplicate_errors( $values, $path, $name ) {
			$errors = array();
			$seen = array();
			foreach ( $values as $index => $value ) {
				if ( isset( $seen[ $value ] ) ) {
					$errors[] = $this->error( 'duplicate_value', $path . '/' . $index, sprintf( __( '%s must be unique.', STACKABLE_I18N ), $name ) );
				}
				$seen[ $value ] = true;
			}
			return $errors;
		}

		private function flatten_menu_items( $items ) {
			$flattened = array();
			foreach ( $items as $item ) {
				$item = is_object( $item ) ? get_object_vars( $item ) : $item;
				$flattened[] = $item;
				if ( ! empty( $item['children'] ) ) {
					$flattened = array_merge( $flattened, $this->flatten_menu_items( $item['children'] ) );
				}
			}
			return $flattened;
		}

		private function pluck( $items, $property ) {
			$values = array();
			foreach ( $items as $item ) {
				$item = is_object( $item ) ? get_object_vars( $item ) : $item;
				if ( array_key_exists( $property, $item ) ) {
					$values[] = $item[ $property ];
				}
			}
			return $values;
		}

		private function resolve_reference( $reference, $root_schema ) {
			if ( 0 !== strpos( $reference, '#/' ) ) {
				return null;
			}
			$value = $root_schema;
			foreach ( explode( '/', substr( $reference, 2 ) ) as $segment ) {
				$segment = str_replace( array( '~1', '~0' ), array( '/', '~' ), $segment );
				if ( ! isset( $value[ $segment ] ) ) {
					return null;
				}
				$value = $value[ $segment ];
			}
			return $value;
		}

		private function matches_type( $value, $type ) {
			switch ( $type ) {
				case 'object':
					return is_object( $value ) || ( is_array( $value ) && ! $this->is_list( $value ) );
				case 'array':
					return is_array( $value ) && $this->is_list( $value );
				case 'string':
					return is_string( $value );
				case 'integer':
					return is_int( $value );
				case 'number':
					return is_int( $value ) || is_float( $value );
				case 'boolean':
					return is_bool( $value );
				case 'null':
					return is_null( $value );
			}
			return false;
		}

		private function is_list( $value ) {
			$index = 0;
			foreach ( $value as $key => $item ) {
				if ( $key !== $index ) {
					return false;
				}
				++$index;
			}
			return true;
		}

		private function iterable_value( $value ) {
			if ( is_object( $value ) ) {
				return get_object_vars( $value );
			}
			return is_array( $value ) ? $value : array();
		}

		private function to_array( $value ) {
			if ( is_object( $value ) ) {
				$value = get_object_vars( $value );
			}
			if ( ! is_array( $value ) ) {
				return $value;
			}
			foreach ( $value as $key => $item ) {
				$value[ $key ] = $this->to_array( $item );
			}
			return $value;
		}

		private function is_portable_path( $path ) {
			if ( ! is_string( $path ) || '' === $path || false !== strpos( $path, '\\' ) || '/' === substr( $path, 0, 1 ) || preg_match( '/^[A-Za-z][A-Za-z0-9+.-]*:/', $path ) ) {
				return false;
			}
			foreach ( explode( '/', $path ) as $segment ) {
				if ( '' === $segment || '.' === $segment || '..' === $segment ) {
					return false;
				}
			}
			return true;
		}

		private function normalize_path( $path ) {
			return preg_replace( '#^\./#', '', str_replace( '\\', '/', $path ) );
		}

		private function error( $code, $path, $message ) {
			return array(
				'code' => $code,
				'path' => $path ? $path : '/',
				'message' => $message,
			);
		}
	}
}
