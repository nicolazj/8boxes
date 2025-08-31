CREATE TABLE `weekly_box_log` (
	`box` text NOT NULL,
	`created_at` integer,
	`id` text PRIMARY KEY NOT NULL,
	`week` integer NOT NULL,
	`year` integer NOT NULL
);
