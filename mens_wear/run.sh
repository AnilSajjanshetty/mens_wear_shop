#!/bin/bash

# Load environment variables from .env file
export $(grep -v '^#' .env | xargs)

COURSES=$(for i in {1..250}; do echo -n "course.$i "; done)

# Function to create the Hydra client
create_hydra_client() {
    # docker compose exec hydra hydra clients create \
    #     --endpoint https://localhost:4445/ \
    #     --id $HYDRA_CLIENT_ID \
    #     --secret $HYDRA_CLIENT_SECRET \
    #     --grant-types authorization_code,refresh_token \
    #     --response-types code,id_token \
    #     --scope openid,offline,profile \
    #     --callbacks https://$HOST_IP:5000/api/v1/callback

  curl -k -X POST https://localhost:4445/clients \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -d '{
    "client_id": "'"$HYDRA_CLIENT_ID"'",
    "client_secret": "'"$HYDRA_CLIENT_SECRET"'",
    "grant_types": ["authorization_code", "refresh_token"],
    "response_types": ["code", "id_token"],
    "scope": "openid offline profile",
    "redirect_uris": ["https://'"$HOST_IP"':8000/api/v1/callback", "'"$CLIENT_BASE_URL"'/confirm"],
    "post_logout_redirect_uris": ["'"$CLIENT_BASE_URL"'/confirm?logout=true"]
  }'

  curl -k -X POST https://localhost:4445/clients \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json' \
  -d '{
    "client_id": "'"$MSK_CLIENT_ID"'",
    "client_secret": "'"$MSK_CLIENT_SECRET"'",
    "grant_types": ["authorization_code", "refresh_token"],
    "response_types": ["code", "id_token"],
    "scope": "openid offline profile role.admin role.instructor role.student '"$COURSES"'",
    "redirect_uris": ["'"$MSK_REDIRECT_URI"'", "https://'"$HOST_IP"':8000/api/v1/callback"],
    "post_logout_redirect_uris": ["https://'"$HOST_IP"':8000/api/v1/logout"]
  }'

}

# Create the network
docker network create hydraguide || true

# Build all images
docker compose build

# Start the Postgres service
docker compose up -d postgres 

# Wait for Postgres to start up. Adjust the sleep time as necessary.
sleep 10

# Run your commands
# export SECRETS_SYSTEM=$(export LC_CTYPE=C; cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1)
export DSN=postgres://hydra:secret@ory-hydra-example--postgres:5432/hydra?sslmode=disable

docker run -it --rm   --network hydraguide   oryd/hydra:v1.10.6   migrate sql --yes $DSN

# Start all other services
docker compose up -d
sleep 20
create_hydra_client

# # Ask user what to run
# echo "What do you want to run?"
# echo "1. Only authentication"
# echo "2. Authentication + backend"
# echo "3. Authentication + frontend"
# echo "4. Everything"
# read -p "Enter a number (1-4): " choice

# # Run the selected services
# case $choice in
#     1)
#         docker-compose up -d hydra
#         sleep 10
#         create_hydra_client
#         ;;
#     2)
#         docker-compose up -d hydra djangoapp
#         sleep 10
#         create_hydra_client
#         ;;
#     3)
#         docker-compose up -d hydra reactapp
#         sleep 10
#         create_hydra_client
#         ;;
#     4)
#         docker-compose up -d
#         sleep 10
#         create_hydra_client
#         ;;
#     *)
#         echo "Invalid option. Please enter a number between 1 and 4."
#         ;;
# esac