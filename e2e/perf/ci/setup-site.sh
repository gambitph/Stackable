#!/bin/bash
# Creates the throwaway WordPress site the frontend performance suite
# (e2e/perf) runs against, for CI: WordPress + SQLite (no MySQL), Twenty
# Twenty-Five and Twenty Twenty-One, pretty permalinks, served by `php -S`
# (the suite starts and stops the server itself). The fresh-install database
# is saved as the snapshot every test file restores.
#
#   e2e/perf/ci/setup-site.sh <wp dir> <snapshot file> [wp version] [url]
#
# Then run the suite with
#   STK_PERF_WP_PATH=<wp dir> STK_PERF_SNAPSHOT=<snapshot file> STK_PERF_PLUGIN=<plugin build> npm run test:perf:ci
set -euo pipefail
WPDIR=$1
SNAP=$2
VER=${3:-6.8.3}
URL=${4:-http://127.0.0.1:8896}

if ! command -v wp > /dev/null; then
	curl -sSfL -o /tmp/wp-cli.phar https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
	chmod +x /tmp/wp-cli.phar
	sudo mv /tmp/wp-cli.phar /usr/local/bin/wp
fi
W="wp --path=$WPDIR"

rm -rf "$WPDIR"
mkdir -p "$WPDIR"
$W core download --version="$VER" --quiet

# SQLite database (drop-in from the SQLite Database Integration plugin).
curl -sSfL -o /tmp/sqlite.zip https://downloads.wordpress.org/plugin/sqlite-database-integration.latest-stable.zip
unzip -q -o /tmp/sqlite.zip -d "$WPDIR/wp-content/plugins"
SQ="$WPDIR/wp-content/plugins/sqlite-database-integration"
sed -e "s#{SQLITE_IMPLEMENTATION_FOLDER_PATH}#$SQ#" -e "s#{SQLITE_PLUGIN}#sqlite-database-integration/load.php#" "$SQ/db.copy" > "$WPDIR/wp-content/db.php"

$W config create --dbname=wp --dbuser=x --dbpass=x --skip-check --quiet --extra-php <<'PHP'
define( 'DISABLE_WP_CRON', true );
define( 'AUTOMATIC_UPDATER_DISABLED', true );
define( 'WP_AUTO_UPDATE_CORE', false );
define( 'WP_MEMORY_LIMIT', '256M' );
PHP
$W core install --url="$URL" --title="Stackable perf" --admin_user=admin --admin_password=password --admin_email=admin@example.com --skip-email --quiet
$W plugin activate sqlite-database-integration --quiet
$W theme install twentytwentyone --quiet
$W theme activate twentytwentyfive --quiet
$W rewrite structure '/%postname%/' --quiet
$W plugin delete akismet hello --quiet 2>/dev/null || true

DB=$(find "$WPDIR/wp-content/database" -name '.ht.sqlite' | head -1)
mkdir -p "$(dirname "$SNAP")"
cp "$DB" "$SNAP"
echo "WordPress $($W core version) at $WPDIR, snapshot $SNAP"
