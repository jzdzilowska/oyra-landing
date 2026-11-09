CREATE TABLE `demo_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`studio` text NOT NULL,
	`role` text NOT NULL,
	`context` text DEFAULT '' NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `demo_requests_email_time` ON `demo_requests` (`email`,`created_at`);