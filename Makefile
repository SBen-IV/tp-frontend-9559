COMPOSE_FILE=docker-compose.override.yml

# Run without building (unless never built)
up:
	docker compose -f $(COMPOSE_FILE) up

# Build the images
build:
	docker compose -f $(COMPOSE_FILE) build

# Stop and remove containers
down:
	docker compose -f $(COMPOSE_FILE) down

# Force building images and run
run: build up

# To see logs of containers, useful when using `watch` as it
# doesn't provide logs
logs:
	docker compose logs -f




