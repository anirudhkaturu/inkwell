CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(24),
	"phone" varchar(10) NOT NULL,
	"password" varchar(255) NOT NULL,
	"bio" varchar(150) DEFAULT '',
	"profilePicture" varchar DEFAULT '',
	"onboarding" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_phone_unique" UNIQUE("phone")
);
