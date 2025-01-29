#!/bin/bash

# Load environment variables from .env file
export $(grep -v '^#' .env | xargs)

COURSES=$(for i in {1..250}; do echo -n "course.$i "; done)

# Function to create the Hydra client
create_hydra_client() {
 curl -v -k -X POST http://192.168.68.231:4445/clients -H 'Content-Type: application/json' -H 'Accept: application/json' -d '{
    "client_id": "'"$HYDRA_CLIENT_ID"'",
    "client_secret": "'"$HYDRA_CLIENT_SECRET"'",
    "grant_types": ["authorization_code", "refresh_token"],
    "response_types": ["code", "id_token"],
    "scope": "openid offline profile",
    "redirect_uris": ["http://'"$HOST_IP"':8000/api/v1/callback", "'"$CLIENT_BASE_URL"'/confirm"],
    "post_logout_redirect_uris": ["'"$CLIENT_BASE_URL"'/confirm?logout=true"]
  }'

  curl -k -X POST http://192.168.68.231:4445/clients \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -d '{
    "client_id": "'"$MSK_CLIENT_ID"'",
    "client_secret": "'"$MSK_CLIENT_SECRET"'",
    "grant_types": ["authorization_code", "refresh_token"],
    "response_types": ["code", "id_token"],
    "scope": "openid offline profile role.admin role.instructor role.student '"$COURSES"'",
    "redirect_uris": ["'"$MSK_REDIRECT_URI"'", "http://'"$HOST_IP"':8000/api/v1/callback"],
    "post_logout_redirect_uris": ["http://'"$HOST_IP"':8000/api/v1/logout"]
  }'
}

# Create the network if it doesn't exist.
docker network ls | grep -q hydraguide || docker network create hydraguide

# Build images
docker compose build

docker compose up -d postgres
sleep 10
docker run --rm --network hydraguide oryd/hydra:v2.0.0 migrate sql --yes postgres://hydra:secret@postgres:5432/hydra?sslmode=disable


# Wait for Postgres to become ready
echo "Waiting for PostgreSQL to be ready..."
until docker run --rm --network hydraguide postgres:13 pg_isready -h postgres -U hydra; do
  sleep 10
done


# Set DSN correctly
export DSN=postgres://hydra:secret@postgres:5432/hydra?sslmode=disable

# Run Hydra migrations
docker run --rm --network hydraguide oryd/hydra:v2.0.0 migrate sql --yes $DSN

# Start other services
docker compose up -d

# Wait before creating clients
sleep 20
create_hydra_client
