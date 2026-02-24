.PHONY: cc 

cc:
	claude --dangerously-skip-permissions

connect_app:
	@docker compose -f docker-compose.yml exec app sh

db_reset:
	docker compose exec app npx prisma migrate reset --force