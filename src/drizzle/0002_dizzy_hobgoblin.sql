CREATE TABLE `notes` (
	`box` text NOT NULL,
	`content` text NOT NULL,
	`created_at` integer,
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`updated_at` integer
);
