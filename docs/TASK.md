# Scalable Backend Architecture Task List (TODO Domain)

## Goal
Design and implement a scalable, maintainable backend architecture for TODO lists with proper REST method usage, including:
- create a todo list
- manage todos inside a todo list
- expose a board endpoint for all todo lists
- include Prisma migration + seed updates

## Locked Decisions
- API style: REST v1 (`/api/v1/...`)
- Ownership model (v1): Global shared (no auth ownership yet)
- Delete policy: Soft delete (`deletedAt`)
- Todo lifecycle: Enum status (`TODO`, `IN_PROGRESS`, `DONE`)
- Update method policy: Support both `PATCH` (partial) and `PUT` (full replacement)
- Board response: Paginated + filterable
- Request validation: Zod schemas
- Response contract: Standard envelope (`data/error/meta`)
- Auth timing: No auth in v1 (architecture must be auth-ready)

## Scope
### In Scope
- Add backend folder architecture (route handlers, validators, services, repositories, shared utils)
- Add Prisma schema for `TodoList` and `Todo`, relations, enums, indexes, soft-delete fields
- Generate/commit migration for TODO domain
- Update seed with idempotent sample todo lists + todos
- Implement REST endpoints with correct HTTP method semantics and status codes
- Implement board endpoint with pagination/filter/sort and summary counts
- Add backend docs in `README.md`

### Out of Scope
- Authentication/authorization implementation
- Realtime updates/websockets
- Production observability stack

## Implementation Checklist
- [ ] Add route handlers:
  - [ ] `GET/POST /api/v1/todolists`
  - [ ] `GET/PATCH/PUT/DELETE /api/v1/todolists/:listId`
  - [ ] `GET/POST /api/v1/todolists/:listId/todos`
  - [ ] `GET/PATCH/PUT/DELETE /api/v1/todos/:todoId`
  - [ ] `GET /api/v1/board/todolists`
- [ ] Add backend architecture folders under `src/server`:
  - [ ] `todos.repository.ts`
  - [ ] `todos.service.ts`
  - [ ] `todos.validators.ts`
  - [ ] `todos.types.ts`
  - [ ] shared error/response/pagination helpers
- [ ] Add Prisma enums/models:
  - [ ] `TodoStatus`, `TodoPriority`
  - [ ] `TodoList` with soft-delete
  - [ ] `Todo` with soft-delete + relation to `TodoList`
- [ ] Add indexes for scalable list/todo queries
- [ ] Generate and commit migration SQL
- [ ] Update seed script with idempotent todo lists + todos
- [ ] Enforce standard API response envelope and domain error mapping
- [ ] Add/update README API documentation
- [ ] Validate lint/build and endpoint behavior

## Acceptance Criteria
- [ ] CRUD endpoints exist and use correct HTTP methods/status codes
- [ ] `PATCH` and `PUT` both implemented with distinct behavior
- [ ] Board endpoint supports pagination + filtering + sorting
- [ ] Prisma migration creates TODO schema successfully
- [ ] Soft-delete works for lists and todos
- [ ] Seed creates todo lists and todos idempotently
- [ ] API responses follow consistent envelope
- [ ] `npm run lint` and `npm run build` pass

## Verification Scenarios
1. Create todo list via `POST /api/v1/todolists`, then fetch with `GET`.
2. Create todos under a list via `POST /api/v1/todolists/:listId/todos`.
3. Update with `PATCH` (partial) and `PUT` (full payload) and confirm behavior differences.
4. Soft-delete todo and todo list; confirm deleted items are hidden by default.
5. Query board endpoint with pagination/filter/sort and verify metadata.
6. Re-run seed and verify no uncontrolled duplicates.
