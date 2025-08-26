# Task: ScheduleForm
ID: CMP-018
Title: Schedule Form
Type: component
Priority: p2
Page(s): /admin/schedules
Status: todo
Owner: -
Depends On: DS-001

## Scope
- Form untuk menambah/mengedit jadwal siaran.
- Fields: `programId`, `dayOfWeek`, `startTime`, `endTime`, `isActive`.
- Asumsi: Memerlukan CRUD `/schedules` dan `GET /programs`.

## Acceptance
- Admin dapat mengelola jadwal siaran.
