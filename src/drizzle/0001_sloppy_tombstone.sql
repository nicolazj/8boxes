PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_weekly_box_log` (
	`box` text NOT NULL,
	`created_at` integer,
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`week` integer NOT NULL,
	`year` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_weekly_box_log`("box", "created_at", "id", "week", "year") SELECT "box", "created_at", "id", "week", "year" FROM `weekly_box_log`;--> statement-breakpoint
DROP TABLE `weekly_box_log`;--> statement-breakpoint
ALTER TABLE `__new_weekly_box_log` RENAME TO `weekly_box_log`;--> statement-breakpoint
PRAGMA foreign_keys=ON;