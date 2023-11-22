CREATE TABLE `episodes` (
	`id` text PRIMARY KEY NOT NULL,
	`podcast_id` text,
	`title` text,
	`description` text,
	`notes` text,
	`audio` text,
	`duration` integer,
	`published` text,
	FOREIGN KEY (`podcast_id`) REFERENCES `podcasts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `podcasts` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text,
	`slug` text,
	`categories` text,
	`owner` text,
	`cover_image_url` text,
	`description` text,
	`links` text,
	`author` text,
	`copyright` text
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`key` text PRIMARY KEY NOT NULL,
	`type` text,
	`value` text
);
--> statement-breakpoint
ALTER TABLE users ADD `password_salt` text;--> statement-breakpoint
CREATE UNIQUE INDEX `podcasts_slug_unique` ON `podcasts` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);