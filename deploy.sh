#!/bin/bash
# deploy.sh — full Cloudflare setup + deploy for berrybiz.org
# First run: prompts for CF API token (saved to ~/.cf-berrybiz-token), creates
#            zone, Pages project, deploys, adds custom domain.
# Subsequent runs: just rebuilds and redeploys.
set -euo pipefail

DOMAIN="berrybiz.org"
PROJECT="berrybiz"
BASE_DIR="$(cd "$(dirname "$0")" && pwd)"
WRANGLER=/Users/awolfend/Intertek-Website/node_modules/.bin/wrangler
TOKEN_FILE="$HOME/.cf-berrybiz-token"
NODE=/opt/homebrew/bin/node
NPM=/opt/homebrew/bin/npm

cf_api() {
  local method="$1" path="$2" data="${3:-}"
  local args=(-sf -X "$method"
    "https://api.cloudflare.com/client/v4$path"
    -H "Authorization: Bearer $CF_TOKEN"
    -H "Content-Type: application/json")
  [[ -n "$data" ]] && args+=(-d "$data")
  curl "${args[@]}"
}

# ── 1. API token ────────────────────────────────────────────────────────────
if [[ -f "$TOKEN_FILE" ]]; then
  CF_TOKEN=$(cat "$TOKEN_FILE")
  echo "✓ Using saved Cloudflare token ($TOKEN_FILE)"
else
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "  Cloudflare API token required (one-time setup)"
  echo ""
  echo "  1. Go to: https://dash.cloudflare.com/profile/api-tokens"
  echo "  2. Click 'Create Token' → 'Create Custom Token'"
  echo "  3. Add these permissions:"
  echo "       Account  |  Cloudflare Pages  |  Edit"
  echo "       Account  |  Account Settings  |  Read"
  echo "       Zone     |  Zone              |  Edit"
  echo "       Zone     |  DNS               |  Edit"
  echo "  4. Set 'Account Resources' = your account"
  echo "  5. Set 'Zone Resources' = All zones"
  echo "  6. Click Continue → Create Token → copy the token"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  read -rsp "Paste API token (hidden): " CF_TOKEN
  echo ""
  echo "$CF_TOKEN" > "$TOKEN_FILE"
  chmod 600 "$TOKEN_FILE"
  echo "  Token saved."
fi

export CLOUDFLARE_API_TOKEN="$CF_TOKEN"

# ── 2. Verify token + get account ID ────────────────────────────────────────
echo ""
echo "→ Verifying token..."
ACCOUNTS=$(cf_api GET "/accounts?per_page=1")
ACCOUNT_ID=$(echo "$ACCOUNTS" | "$NODE" -e "
  let d=''; process.stdin.on('data',c=>d+=c).on('end',()=>{
    const r=JSON.parse(d);
    if(!r.success||!r.result.length){console.error('Token error: '+JSON.stringify(r.errors));process.exit(1);}
    console.log(r.result[0].id);
  });
" 2>&1) || { echo "✗ Token invalid or missing permissions."; rm -f "$TOKEN_FILE"; exit 1; }

ACCOUNT_NAME=$(echo "$ACCOUNTS" | "$NODE" -e "
  let d=''; process.stdin.on('data',c=>d+=c).on('end',()=>{console.log(JSON.parse(d).result[0].name);});
")
echo "  ✓ Account: $ACCOUNT_NAME ($ACCOUNT_ID)"
export CLOUDFLARE_ACCOUNT_ID="$ACCOUNT_ID"

# ── 3. Build ─────────────────────────────────────────────────────────────────
echo ""
echo "→ Building..."
cd "$BASE_DIR"
"$NODE" "$NPM" run build --silent
echo "  ✓ Built ($(du -sh dist 2>/dev/null | cut -f1) output)"

# ── 4. Pages project ─────────────────────────────────────────────────────────
echo ""
echo "→ Cloudflare Pages project..."
PROJECT_EXISTS=$(cf_api GET "/accounts/$ACCOUNT_ID/pages/projects/$PROJECT" | \
  "$NODE" -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>console.log(JSON.parse(d).success));")
if [[ "$PROJECT_EXISTS" != "true" ]]; then
  echo "  Creating project '$PROJECT'..."
  cf_api POST "/accounts/$ACCOUNT_ID/pages/projects" \
    "{\"name\":\"$PROJECT\",\"production_branch\":\"main\"}" > /dev/null
  echo "  ✓ Project created."
else
  echo "  ✓ Project already exists."
fi

# ── 5. Deploy ─────────────────────────────────────────────────────────────────
echo ""
echo "→ Deploying to Cloudflare Pages..."
"$WRANGLER" pages deploy dist --project-name "$PROJECT" 2>&1 | grep -v "^$" | sed 's/^/  /'
echo "  ✓ Deployed → https://$PROJECT.pages.dev"

# ── 6. Zone for berrybiz.org ─────────────────────────────────────────────────
echo ""
echo "→ Cloudflare zone for $DOMAIN..."
ZONE_LIST=$(cf_api GET "/zones?name=$DOMAIN")
ZONE_ID=$(echo "$ZONE_LIST" | "$NODE" -e "
  let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{
    const r=JSON.parse(d).result;
    console.log(r.length ? r[0].id : '');
  });
")
if [[ -z "$ZONE_ID" ]]; then
  echo "  Creating zone..."
  CREATE=$(cf_api POST "/zones" \
    "{\"name\":\"$DOMAIN\",\"account\":{\"id\":\"$ACCOUNT_ID\"},\"jump_start\":false}")
  ZONE_ID=$(echo "$CREATE" | "$NODE" -e "
    let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{
      const r=JSON.parse(d);
      if(!r.success){console.error(JSON.stringify(r.errors));process.exit(1);}
      console.log(r.result.id);
    });
  ")
  echo "  ✓ Zone created: $ZONE_ID"
else
  echo "  ✓ Zone already exists: $ZONE_ID"
fi

# ── 7. Custom domain on Pages ─────────────────────────────────────────────────
echo ""
echo "→ Custom domain $DOMAIN on Pages..."
DOMAINS_LIST=$(cf_api GET "/accounts/$ACCOUNT_ID/pages/projects/$PROJECT/domains")
DOMAIN_EXISTS=$(echo "$DOMAINS_LIST" | "$NODE" -e "
  let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{
    const r=JSON.parse(d).result||[];
    console.log(r.some(x=>x.name==='$DOMAIN'));
  });
")
if [[ "$DOMAIN_EXISTS" != "true" ]]; then
  cf_api POST "/accounts/$ACCOUNT_ID/pages/projects/$PROJECT/domains" \
    "{\"name\":\"$DOMAIN\"}" > /dev/null
  echo "  ✓ Custom domain added."
else
  echo "  ✓ Custom domain already configured."
fi

# www redirect via DNS CNAME
echo ""
echo "→ www redirect (CNAME → $DOMAIN)..."
WWW_EXISTS=$(cf_api GET "/zones/$ZONE_ID/dns_records?type=CNAME&name=www.$DOMAIN" | \
  "$NODE" -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{const r=JSON.parse(d).result||[];console.log(r.length>0);});")
if [[ "$WWW_EXISTS" != "true" ]]; then
  cf_api POST "/zones/$ZONE_ID/dns_records" \
    "{\"type\":\"CNAME\",\"name\":\"www\",\"content\":\"$DOMAIN\",\"proxied\":true}" > /dev/null
  echo "  ✓ www CNAME added (→ $DOMAIN)."
else
  echo "  ✓ www CNAME already exists."
fi

# ── 8. Get nameservers ────────────────────────────────────────────────────────
NS=$(cf_api GET "/zones/$ZONE_ID" | "$NODE" -e "
  let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{
    console.log(JSON.parse(d).result.name_servers.join('\n'));
  });
")

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  ✅  All Cloudflare setup complete."
echo ""
echo "  ONE STEP LEFT — update nameservers at your registrar:"
echo ""
echo "$NS" | while read -r ns; do echo "    $ns"; done
echo ""
echo "  After propagation (5–60 min), berrybiz.org is live."
echo "  Test first at: https://$PROJECT.pages.dev"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
