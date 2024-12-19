.PHONY: deploy
deploy:
	@git pull origin develop
	@docker-compose -f docker-compose.yml build --no-cache
	@docker-compose -f docker-compose.yml up -d


.PHONY: down
down:
	@docker-compose -f docker-compose.yml down

.PHONY: dev
dev:
	@docker-compose -f docker-compose.yml  up --build -d