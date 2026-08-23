#!/usr/bin/env bash
set -Eeuo pipefail

# Override these values with environment variables or a .env.sit file.
IMAGE_NAME="${IMAGE_NAME:-harava-insights-web}"
VERSION="${VERSION:-v1.0}"
COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.yml}"
ENV_FILE="${ENV_FILE:-.env.sit}"
CONTAINER_NAME="${CONTAINER_NAME:-harava-insights-web}"
SERVER_USER="${SERVER_USER:-odunayo}"
SERVER_HOST="${SERVER_HOST:-10.100.25.73}"
SERVER_DIR="${SERVER_DIR:-/home/odunayo}"
HOST_PORT="${HOST_PORT:-9041}"
CONTAINER_PORT="${CONTAINER_PORT:-3000}"

ARCHIVE="${IMAGE_NAME}-${VERSION#v}.tar"
REMOTE_ARCHIVE="${SERVER_DIR}/${ARCHIVE}"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing environment file: $ENV_FILE" >&2
  echo "Create it from .env.example, then rerun this script." >&2
  exit 1
fi

command -v docker >/dev/null || { echo "Docker is required." >&2; exit 1; }
command -v scp >/dev/null || { echo "scp is required." >&2; exit 1; }
command -v ssh >/dev/null || { echo "ssh is required." >&2; exit 1; }

echo "Building ${IMAGE_NAME}:${VERSION}..."
docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" build --no-cache web
docker tag "${IMAGE_NAME}:latest" "${IMAGE_NAME}:${VERSION}"

echo "Saving ${IMAGE_NAME}:${VERSION} to ${ARCHIVE}..."
docker save "${IMAGE_NAME}:${VERSION}" -o "$ARCHIVE"

echo "Transferring image to ${SERVER_USER}@${SERVER_HOST}:${SERVER_DIR}..."
scp "$ARCHIVE" "${SERVER_USER}@${SERVER_HOST}:${SERVER_DIR}/"

echo "Replacing remote container..."
ssh "${SERVER_USER}@${SERVER_HOST}" \
  "docker rm -f '${CONTAINER_NAME}' 2>/dev/null || true; \
   docker load -i '${REMOTE_ARCHIVE}'; \
   docker run --name '${CONTAINER_NAME}' \
     -p '${HOST_PORT}:${CONTAINER_PORT}' \
     -d --restart unless-stopped '${IMAGE_NAME}:${VERSION}'; \
   docker image prune -f; \
   rm -f '${REMOTE_ARCHIVE}'"

rm -f "$ARCHIVE"
echo "Deployment complete: ${IMAGE_NAME}:${VERSION} on ${SERVER_HOST}:${HOST_PORT}"
echo "Configure server Nginx/SSL to proxy HTTPS traffic to 127.0.0.1:${HOST_PORT}."