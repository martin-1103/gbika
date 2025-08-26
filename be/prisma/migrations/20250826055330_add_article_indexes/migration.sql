-- CreateIndex
CREATE INDEX `Article_status_deleted_at_published_at_idx` ON `Article`(`status`, `deleted_at`, `published_at`);

-- CreateIndex
CREATE INDEX `Article_published_at_idx` ON `Article`(`published_at`);
