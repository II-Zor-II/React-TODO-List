.PHONY: cc connect_app db_reset db_reset_seed e2e-install e2e-run e2e-headed e2e-ui e2e-report e2e-reset e2e-up e2e-down e2e-logs

cc:
	claude --dangerously-skip-permissions

connect_app:
	@docker compose -f docker-compose.yml exec app sh

db_reset_seed:
	docker compose exec app npx prisma migrate reset --force

# --- E2E Tests (Playwright) ---

e2e-install:
	cd app && npx playwright install chromium

e2e-run:
	cd app && npm run test:e2e

e2e-headed:
	cd app && SLOW_MO=500 npx playwright test --headed

e2e-ui:
	cd app && npm run test:e2e:ui

e2e-report:
	cd app && npm run test:e2e:report

e2e-reset:
	docker compose --profile test exec app-test npx prisma migrate reset --force

e2e-up:
	docker compose --profile test up -d --wait

e2e-down:
	docker compose --profile test down -v

e2e-logs:
	docker compose --profile test logs -f app-test
