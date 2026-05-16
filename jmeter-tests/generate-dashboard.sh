#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
JMETER_BIN="$ROOT_DIR/tools/apache-jmeter-5.6.3/bin/jmeter"
RESULTS_FILE="${1:-$ROOT_DIR/jmeter-tests/results.jtl}"
DASHBOARD_DIR="${2:-$ROOT_DIR/jmeter-tests/dashboard-$(date +%Y%m%d-%H%M%S)}"

"$JMETER_BIN" -g "$RESULTS_FILE" -o "$DASHBOARD_DIR"

echo "Dashboard generado en: $DASHBOARD_DIR/index.html"
