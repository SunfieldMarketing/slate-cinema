import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`_industries_v_version_gallery\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_industries_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_industries_v_version_gallery_order_idx\` ON \`_industries_v_version_gallery\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_industries_v_version_gallery_parent_id_idx\` ON \`_industries_v_version_gallery\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_industries_v_version_gallery_image_idx\` ON \`_industries_v_version_gallery\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_industries_v_version_stats\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` numeric,
  	\`suffix\` text,
  	\`label\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_industries_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_industries_v_version_stats_order_idx\` ON \`_industries_v_version_stats\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_industries_v_version_stats_parent_id_idx\` ON \`_industries_v_version_stats\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_industries_v_version_services\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_industries_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_industries_v_version_services_order_idx\` ON \`_industries_v_version_services\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_industries_v_version_services_parent_id_idx\` ON \`_industries_v_version_services\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_industries_v_version_service_cards_deliverables\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`item\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_industries_v_version_service_cards\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_industries_v_version_service_cards_deliverables_order_idx\` ON \`_industries_v_version_service_cards_deliverables\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_industries_v_version_service_cards_deliverables_parent_id_idx\` ON \`_industries_v_version_service_cards_deliverables\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_industries_v_version_service_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`outcome\` text,
  	\`meta\` text,
  	\`image_id\` integer,
  	\`video_id\` integer,
  	\`featured\` integer DEFAULT false,
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`video_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_industries_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_industries_v_version_service_cards_order_idx\` ON \`_industries_v_version_service_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_industries_v_version_service_cards_parent_id_idx\` ON \`_industries_v_version_service_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_industries_v_version_service_cards_image_idx\` ON \`_industries_v_version_service_cards\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`_industries_v_version_service_cards_video_idx\` ON \`_industries_v_version_service_cards\` (\`video_id\`);`)
  await db.run(sql`CREATE TABLE \`_industries_v_version_video_testimonials\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`quote\` text,
  	\`name\` text,
  	\`role\` text,
  	\`company\` text,
  	\`video_id\` integer,
  	\`outcome\` text,
  	\`poster_id\` integer,
  	\`logo_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`video_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`poster_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_industries_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_industries_v_version_video_testimonials_order_idx\` ON \`_industries_v_version_video_testimonials\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_industries_v_version_video_testimonials_parent_id_idx\` ON \`_industries_v_version_video_testimonials\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_industries_v_version_video_testimonials_video_idx\` ON \`_industries_v_version_video_testimonials\` (\`video_id\`);`)
  await db.run(sql`CREATE INDEX \`_industries_v_version_video_testimonials_poster_idx\` ON \`_industries_v_version_video_testimonials\` (\`poster_id\`);`)
  await db.run(sql`CREATE INDEX \`_industries_v_version_video_testimonials_logo_idx\` ON \`_industries_v_version_video_testimonials\` (\`logo_id\`);`)
  await db.run(sql`CREATE TABLE \`_industries_v_version_process\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`week\` text,
  	\`title\` text,
  	\`body\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_industries_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_industries_v_version_process_order_idx\` ON \`_industries_v_version_process\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_industries_v_version_process_parent_id_idx\` ON \`_industries_v_version_process\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_industries_v_version_faqs\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`question\` text,
  	\`answer\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_industries_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_industries_v_version_faqs_order_idx\` ON \`_industries_v_version_faqs\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_industries_v_version_faqs_parent_id_idx\` ON \`_industries_v_version_faqs\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_industries_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_slug\` text,
  	\`version_label\` text,
  	\`version_icon\` text,
  	\`version_accent\` text,
  	\`version_blurb\` text,
  	\`version_description\` text,
  	\`version_stat\` text,
  	\`version_hero_image_id\` integer,
  	\`version_hero_video_id\` integer,
  	\`version_testimonial_quote\` text,
  	\`version_testimonial_name\` text,
  	\`version_testimonial_role\` text,
  	\`version_testimonial_company\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`industries\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_hero_video_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_industries_v_parent_idx\` ON \`_industries_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_industries_v_version_version_slug_idx\` ON \`_industries_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_industries_v_version_version_hero_image_idx\` ON \`_industries_v\` (\`version_hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_industries_v_version_version_hero_video_idx\` ON \`_industries_v\` (\`version_hero_video_id\`);`)
  await db.run(sql`CREATE INDEX \`_industries_v_version_version_updated_at_idx\` ON \`_industries_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_industries_v_version_version_created_at_idx\` ON \`_industries_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_industries_v_version_version__status_idx\` ON \`_industries_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_industries_v_created_at_idx\` ON \`_industries_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_industries_v_updated_at_idx\` ON \`_industries_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_industries_v_latest_idx\` ON \`_industries_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_portfolio_projects_v_version_metrics\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`value\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_portfolio_projects_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_portfolio_projects_v_version_metrics_order_idx\` ON \`_portfolio_projects_v_version_metrics\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_portfolio_projects_v_version_metrics_parent_id_idx\` ON \`_portfolio_projects_v_version_metrics\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_portfolio_projects_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_category\` text,
  	\`version_company\` text,
  	\`version_poster_id\` integer,
  	\`version_copy\` text,
  	\`version_video_id\` integer,
  	\`version_video_vimeo_url\` text,
  	\`version_order\` numeric,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`portfolio_projects\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_poster_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_video_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_portfolio_projects_v_parent_idx\` ON \`_portfolio_projects_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_portfolio_projects_v_version_version_poster_idx\` ON \`_portfolio_projects_v\` (\`version_poster_id\`);`)
  await db.run(sql`CREATE INDEX \`_portfolio_projects_v_version_version_video_idx\` ON \`_portfolio_projects_v\` (\`version_video_id\`);`)
  await db.run(sql`CREATE INDEX \`_portfolio_projects_v_version_version_updated_at_idx\` ON \`_portfolio_projects_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_portfolio_projects_v_version_version_created_at_idx\` ON \`_portfolio_projects_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_portfolio_projects_v_version_version__status_idx\` ON \`_portfolio_projects_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_portfolio_projects_v_created_at_idx\` ON \`_portfolio_projects_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_portfolio_projects_v_updated_at_idx\` ON \`_portfolio_projects_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_portfolio_projects_v_latest_idx\` ON \`_portfolio_projects_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_journal_posts_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_slug\` text,
  	\`version_title\` text,
  	\`version_excerpt\` text,
  	\`version_category\` text,
  	\`version_accent\` text,
  	\`version_date\` text,
  	\`version_read_time\` text,
  	\`version_cover_image_id\` integer,
  	\`version_author\` text,
  	\`version_content\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`journal_posts\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_cover_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_journal_posts_v_parent_idx\` ON \`_journal_posts_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_journal_posts_v_version_version_slug_idx\` ON \`_journal_posts_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_journal_posts_v_version_version_cover_image_idx\` ON \`_journal_posts_v\` (\`version_cover_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_journal_posts_v_version_version_updated_at_idx\` ON \`_journal_posts_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_journal_posts_v_version_version_created_at_idx\` ON \`_journal_posts_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_journal_posts_v_version_version__status_idx\` ON \`_journal_posts_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_journal_posts_v_created_at_idx\` ON \`_journal_posts_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_journal_posts_v_updated_at_idx\` ON \`_journal_posts_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_journal_posts_v_latest_idx\` ON \`_journal_posts_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_navigation_v_version_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_navigation_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_navigation_v_version_links_order_idx\` ON \`_navigation_v_version_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_navigation_v_version_links_parent_id_idx\` ON \`_navigation_v_version_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_navigation_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_cta_button_label\` text DEFAULT 'Schedule Call',
  	\`version_cta_button_href\` text DEFAULT '/schedule-a-call',
  	\`version_client_portal_href\` text DEFAULT 'https://my.slatecinema.com/',
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer
  );
  `)
  await db.run(sql`CREATE INDEX \`_navigation_v_version_version__status_idx\` ON \`_navigation_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_navigation_v_created_at_idx\` ON \`_navigation_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_navigation_v_updated_at_idx\` ON \`_navigation_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_navigation_v_latest_idx\` ON \`_navigation_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_footer_v_version_marquee_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_footer_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_footer_v_version_marquee_items_order_idx\` ON \`_footer_v_version_marquee_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_footer_v_version_marquee_items_parent_id_idx\` ON \`_footer_v_version_marquee_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_footer_v_version_sitemap_column_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_footer_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_footer_v_version_sitemap_column_links_order_idx\` ON \`_footer_v_version_sitemap_column_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_footer_v_version_sitemap_column_links_parent_id_idx\` ON \`_footer_v_version_sitemap_column_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_footer_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_cta_heading\` text DEFAULT 'Ready to create?',
  	\`version_cta_button_label\` text DEFAULT 'Get Started',
  	\`version_cta_button_href\` text DEFAULT '/contact',
  	\`version_newsletter_heading\` text DEFAULT 'Subscribe to our Newsletter',
  	\`version_newsletter_sentence\` text DEFAULT 'Want to stay up to date on the latest AI trends, social media frenzies and the latest in media marketing tech? We share valuable tips straight into your inbox!',
  	\`version_newsletter_placeholder\` text DEFAULT 'Your email address',
  	\`version_newsletter_button_label\` text DEFAULT 'Sign Up',
  	\`version_sitemap_column_heading\` text DEFAULT 'Studio',
  	\`version_bottom_bar_crafted_with_love_text\` text DEFAULT 'Crafted with love by Slate Cinema',
  	\`version_bottom_bar_privacy_href\` text DEFAULT '/privacy-policy',
  	\`version_bottom_bar_terms_href\` text DEFAULT '/terms-of-service',
  	\`version_bottom_bar_client_portal_href\` text DEFAULT 'https://my.slatecinema.com/',
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer
  );
  `)
  await db.run(sql`CREATE INDEX \`_footer_v_version_version__status_idx\` ON \`_footer_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_footer_v_created_at_idx\` ON \`_footer_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_footer_v_updated_at_idx\` ON \`_footer_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_footer_v_latest_idx\` ON \`_footer_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_site_settings_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_seo_title_template\` text DEFAULT '%s | Slate Cinema',
  	\`version_seo_default_title\` text DEFAULT 'Slate Cinema',
  	\`version_seo_default_description\` text DEFAULT 'From concept to campaign, we create cinematic content built to capture attention, tell stories, and drive engagement. Brooklyn, NY.',
  	\`version_seo_og_image_id\` integer,
  	\`version_contact_email\` text DEFAULT 'info@slatecinema.com',
  	\`version_contact_phone\` text DEFAULT '+1 732 930 1934',
  	\`version_contact_studio_name\` text DEFAULT 'Slate Cinema Studio',
  	\`version_contact_address_line\` text DEFAULT '132 32nd St',
  	\`version_contact_city\` text DEFAULT 'Brooklyn',
  	\`version_contact_state\` text DEFAULT 'NY',
  	\`version_contact_postal_code\` text DEFAULT '11232',
  	\`version_contact_hours\` text DEFAULT 'Mon–Fri · 9am – 7pm ET · On-location by appointment',
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`version_seo_og_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_seo_version_seo_og_image_idx\` ON \`_site_settings_v\` (\`version_seo_og_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_version_version__status_idx\` ON \`_site_settings_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_created_at_idx\` ON \`_site_settings_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_updated_at_idx\` ON \`_site_settings_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_site_settings_v_latest_idx\` ON \`_site_settings_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_pipeline_v_version_categories_services_tags\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`tag\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pipeline_v_version_categories_services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pipeline_v_version_categories_services_tags_order_idx\` ON \`_pipeline_v_version_categories_services_tags\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pipeline_v_version_categories_services_tags_parent_id_idx\` ON \`_pipeline_v_version_categories_services_tags\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pipeline_v_version_categories_services\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`desc\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pipeline_v_version_categories\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pipeline_v_version_categories_services_order_idx\` ON \`_pipeline_v_version_categories_services\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pipeline_v_version_categories_services_parent_id_idx\` ON \`_pipeline_v_version_categories_services\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pipeline_v_version_categories\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`category_id\` text,
  	\`title\` text,
  	\`video_id\` integer,
  	\`color\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`video_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pipeline_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pipeline_v_version_categories_order_idx\` ON \`_pipeline_v_version_categories\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pipeline_v_version_categories_parent_id_idx\` ON \`_pipeline_v_version_categories\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pipeline_v_version_categories_video_idx\` ON \`_pipeline_v_version_categories\` (\`video_id\`);`)
  await db.run(sql`CREATE TABLE \`_pipeline_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_heading_eyebrow\` text DEFAULT 'How It Works',
  	\`version_heading_title\` text DEFAULT 'The Production Pipeline',
  	\`version_heading_description\` text DEFAULT 'Four phases, each broken down into the exact services behind it. Open a phase to see what''s included.',
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer
  );
  `)
  await db.run(sql`CREATE INDEX \`_pipeline_v_version_version__status_idx\` ON \`_pipeline_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_pipeline_v_created_at_idx\` ON \`_pipeline_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_pipeline_v_updated_at_idx\` ON \`_pipeline_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_pipeline_v_latest_idx\` ON \`_pipeline_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_final_cta_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_eyebrow\` text DEFAULT '// Ready To Scale?',
  	\`version_headline_line1\` text DEFAULT 'Your next era',
  	\`version_headline_line2\` text DEFAULT 'starts here',
  	\`version_description\` text DEFAULT 'Don''t let your brand fade into the background. Partner with Slate Cinema to engineer attention, drive engagement, and generate scalable ROI.',
  	\`version_button_label\` text DEFAULT 'Get Started',
  	\`version_button_href\` text DEFAULT '/contact',
  	\`version_trust_note\` text DEFAULT 'Replies within minutes',
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer
  );
  `)
  await db.run(sql`CREATE INDEX \`_final_cta_v_version_version__status_idx\` ON \`_final_cta_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_final_cta_v_created_at_idx\` ON \`_final_cta_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_final_cta_v_updated_at_idx\` ON \`_final_cta_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_final_cta_v_latest_idx\` ON \`_final_cta_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_ready_to_talk_v_version_badges\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`icon\` text,
  	\`label\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_ready_to_talk_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_ready_to_talk_v_version_badges_order_idx\` ON \`_ready_to_talk_v_version_badges\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_ready_to_talk_v_version_badges_parent_id_idx\` ON \`_ready_to_talk_v_version_badges\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_ready_to_talk_v_version_prep_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`icon\` text,
  	\`label\` text,
  	\`desc\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_ready_to_talk_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_ready_to_talk_v_version_prep_items_order_idx\` ON \`_ready_to_talk_v_version_prep_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_ready_to_talk_v_version_prep_items_parent_id_idx\` ON \`_ready_to_talk_v_version_prep_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_ready_to_talk_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_eyebrow\` text DEFAULT '// Ready to Talk',
  	\`version_headline\` text DEFAULT 'Book a time on our calendar',
  	\`version_description\` text DEFAULT 'Prefer to talk it through live? Grab a 20-minute slot with our team — no pitch deck, no sales script, just an honest read on scope, timeline, and budget so you know exactly where you stand.',
  	\`version_button_label\` text DEFAULT 'Schedule a Call',
  	\`version_button_href\` text DEFAULT '/schedule-a-call',
  	\`version_note\` text DEFAULT 'No commitment — reschedule or cancel anytime.',
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer
  );
  `)
  await db.run(sql`CREATE INDEX \`_ready_to_talk_v_version_version__status_idx\` ON \`_ready_to_talk_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_ready_to_talk_v_created_at_idx\` ON \`_ready_to_talk_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_ready_to_talk_v_updated_at_idx\` ON \`_ready_to_talk_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_ready_to_talk_v_latest_idx\` ON \`_ready_to_talk_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_home_page_v_version_media_void_lines\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`color\` text DEFAULT '#ffffff',
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_home_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_home_page_v_version_media_void_lines_order_idx\` ON \`_home_page_v_version_media_void_lines\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_home_page_v_version_media_void_lines_parent_id_idx\` ON \`_home_page_v_version_media_void_lines\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_home_page_v_version_industry_standards_phase2_morph_words\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`word\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_home_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_home_page_v_version_industry_standards_phase2_morph_words_order_idx\` ON \`_home_page_v_version_industry_standards_phase2_morph_words\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_home_page_v_version_industry_standards_phase2_morph_words_parent_id_idx\` ON \`_home_page_v_version_industry_standards_phase2_morph_words\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_home_page_v_version_trust_section_flagship_logos\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`logo_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_home_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_home_page_v_version_trust_section_flagship_logos_order_idx\` ON \`_home_page_v_version_trust_section_flagship_logos\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_home_page_v_version_trust_section_flagship_logos_parent_id_idx\` ON \`_home_page_v_version_trust_section_flagship_logos\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_home_page_v_version_trust_section_flagship_logos_logo_idx\` ON \`_home_page_v_version_trust_section_flagship_logos\` (\`logo_id\`);`)
  await db.run(sql`CREATE TABLE \`_home_page_v_version_trust_section_marquee_clients\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`logo_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_home_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_home_page_v_version_trust_section_marquee_clients_order_idx\` ON \`_home_page_v_version_trust_section_marquee_clients\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_home_page_v_version_trust_section_marquee_clients_parent_id_idx\` ON \`_home_page_v_version_trust_section_marquee_clients\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_home_page_v_version_trust_section_marquee_clients_logo_idx\` ON \`_home_page_v_version_trust_section_marquee_clients\` (\`logo_id\`);`)
  await db.run(sql`CREATE TABLE \`_home_page_v_version_reviews_testimonials\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`quote\` text,
  	\`name\` text,
  	\`role\` text,
  	\`company\` text,
  	\`rating\` numeric DEFAULT 5,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_home_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_home_page_v_version_reviews_testimonials_order_idx\` ON \`_home_page_v_version_reviews_testimonials\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_home_page_v_version_reviews_testimonials_parent_id_idx\` ON \`_home_page_v_version_reviews_testimonials\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_home_page_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_hero_wordmark_part1\` text DEFAULT 'SLATE',
  	\`version_hero_wordmark_part2\` text DEFAULT 'CINEMA',
  	\`version_hero_subtitle\` text DEFAULT 'Video Marketing At Your Fingertips',
  	\`version_hero_cta_label\` text DEFAULT 'Get Started',
  	\`version_hero_cta_href\` text DEFAULT '/contact',
  	\`version_hero_secondary_cta_label\` text DEFAULT 'Watch Our Reel',
  	\`version_hero_secondary_cta_href\` text DEFAULT '#reel',
  	\`version_industry_standards_phase1_eyebrow\` text DEFAULT '// The Standard',
  	\`version_industry_standards_phase1_headline_line1\` text DEFAULT 'WE ENGINEER',
  	\`version_industry_standards_phase1_headline_line2\` text DEFAULT 'ATTENTION',
  	\`version_industry_standards_phase1_description\` text DEFAULT 'In a crowded digital landscape, being ''good enough'' means being invisible. We build content systems designed specifically to hijack feeds, halt thumbs, and demand viewer retention from the very first frame.',
  	\`version_industry_standards_phase2_eyebrow\` text DEFAULT '// The Execution',
  	\`version_industry_standards_phase2_headline\` text DEFAULT 'EVERY FRAME',
  	\`version_industry_standards_phase2_description\` text DEFAULT 'We don''t just shoot video. We engineer visual experiences designed to capture and hold attention in a world that never stops scrolling.',
  	\`version_industry_standards_phase3_eyebrow\` text DEFAULT '// The Result',
  	\`version_industry_standards_phase3_headline\` text DEFAULT 'DOMINATE YOUR MARKET',
  	\`version_industry_standards_phase3_description\` text DEFAULT 'The result is scalable, predictable growth. We turn passive viewers into active communities, and organic reach into tangible ROI.',
  	\`version_industry_standards_phase3_cta_label\` text DEFAULT 'Get Started',
  	\`version_industry_standards_phase3_cta_href\` text DEFAULT '/contact',
  	\`version_trust_section_eyebrow\` text DEFAULT 'Join the leaders working with Slate Cinema',
  	\`version_trust_section_rating_text\` text DEFAULT '5.0/5 · 44 Google reviews',
  	\`version_trust_section_marquee_label\` text DEFAULT 'More collaborations & partnerships',
  	\`version_results_views_target\` numeric DEFAULT 120000000,
  	\`version_results_likes_target\` numeric DEFAULT 14352910,
  	\`version_results_comments_target\` numeric DEFAULT 1670823,
  	\`version_results_reach_percent\` text DEFAULT '98.2%',
  	\`version_results_description\` text DEFAULT 'Slate Cinema creates content built for the platforms where attention is won or lost in seconds. Every frame, hook, cut, and caption is meticulously shaped to make audiences stop scrolling.',
  	\`version_results_cta_label\` text DEFAULT 'See Case Studies',
  	\`version_results_cta_href\` text DEFAULT '/portfolio',
  	\`version_reviews_eyebrow\` text DEFAULT 'Client Feedback',
  	\`version_reviews_headline_line1\` text DEFAULT 'Trusted by leaders',
  	\`version_reviews_headline_line2\` text DEFAULT 'across industries',
  	\`version_reviews_rating_text\` text DEFAULT '5.0/5 average · 44 Google reviews',
  	\`version_reviews_video_testimonials_label\` text DEFAULT 'Hear it from them, not us',
  	\`version_reviews_google_reviews_label\` text DEFAULT 'From Google reviews',
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer
  );
  `)
  await db.run(sql`CREATE INDEX \`_home_page_v_version_version__status_idx\` ON \`_home_page_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_home_page_v_created_at_idx\` ON \`_home_page_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_home_page_v_updated_at_idx\` ON \`_home_page_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_home_page_v_latest_idx\` ON \`_home_page_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_how_it_works_page_v_version_process_overview_timeline_steps\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`color\` text,
  	\`line\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_how_it_works_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_how_it_works_page_v_version_process_overview_timeline_steps_order_idx\` ON \`_how_it_works_page_v_version_process_overview_timeline_steps\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_how_it_works_page_v_version_process_overview_timeline_steps_parent_id_idx\` ON \`_how_it_works_page_v_version_process_overview_timeline_steps\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_how_it_works_page_v_version_behind_the_scenes_stills\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`label\` text,
  	\`desc\` text,
  	\`span\` text DEFAULT 'normal',
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_how_it_works_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_how_it_works_page_v_version_behind_the_scenes_stills_order_idx\` ON \`_how_it_works_page_v_version_behind_the_scenes_stills\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_how_it_works_page_v_version_behind_the_scenes_stills_parent_id_idx\` ON \`_how_it_works_page_v_version_behind_the_scenes_stills\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_how_it_works_page_v_version_behind_the_scenes_stills_im_idx\` ON \`_how_it_works_page_v_version_behind_the_scenes_stills\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_how_it_works_page_v_version_process_walkthrough_phases\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`color\` text,
  	\`video_id\` integer,
  	\`description\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`video_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_how_it_works_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_how_it_works_page_v_version_process_walkthrough_phases_order_idx\` ON \`_how_it_works_page_v_version_process_walkthrough_phases\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_how_it_works_page_v_version_process_walkthrough_phases_parent_id_idx\` ON \`_how_it_works_page_v_version_process_walkthrough_phases\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_how_it_works_page_v_version_process_walkthrough_phases__idx\` ON \`_how_it_works_page_v_version_process_walkthrough_phases\` (\`video_id\`);`)
  await db.run(sql`CREATE TABLE \`_how_it_works_page_v_version_stats_band\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`value\` numeric,
  	\`suffix\` text,
  	\`label\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_how_it_works_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_how_it_works_page_v_version_stats_band_order_idx\` ON \`_how_it_works_page_v_version_stats_band\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_how_it_works_page_v_version_stats_band_parent_id_idx\` ON \`_how_it_works_page_v_version_stats_band\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_how_it_works_page_v_version_guarantees\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`icon\` text,
  	\`title\` text,
  	\`desc\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_how_it_works_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_how_it_works_page_v_version_guarantees_order_idx\` ON \`_how_it_works_page_v_version_guarantees\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_how_it_works_page_v_version_guarantees_parent_id_idx\` ON \`_how_it_works_page_v_version_guarantees\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_how_it_works_page_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_hero_eyebrow\` text DEFAULT 'The Process',
  	\`version_hero_title\` text DEFAULT 'How It Works',
  	\`version_hero_subtitle\` text DEFAULT 'A clear, structured process designed to take your project from idea to final delivery — seamlessly, efficiently, and cinematically.',
  	\`version_hero_cta_label\` text DEFAULT 'Get Started',
  	\`version_hero_cta_href\` text DEFAULT '/contact',
  	\`version_process_overview_eyebrow\` text DEFAULT 'At A Glance',
  	\`version_process_overview_headline\` text DEFAULT 'Four phases, start to finish',
  	\`version_behind_the_scenes_eyebrow\` text DEFAULT 'Behind The Scenes',
  	\`version_behind_the_scenes_headline\` text DEFAULT 'Where the work happens',
  	\`version_behind_the_scenes_subhead\` text DEFAULT 'Every phase has a room, a rig, and a person who obsesses over it.',
  	\`version_process_walkthrough_eyebrow\` text DEFAULT 'Every Project Includes',
  	\`version_process_walkthrough_headline\` text DEFAULT 'Watch it move through every phase',
  	\`version_process_walkthrough_subhead\` text DEFAULT 'A complete production — not just raw footage. Scroll through to see what''s actually happening at each stage.',
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer
  );
  `)
  await db.run(sql`CREATE INDEX \`_how_it_works_page_v_version_version__status_idx\` ON \`_how_it_works_page_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_how_it_works_page_v_created_at_idx\` ON \`_how_it_works_page_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_how_it_works_page_v_updated_at_idx\` ON \`_how_it_works_page_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_how_it_works_page_v_latest_idx\` ON \`_how_it_works_page_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_portfolio_index_page_v_version_portfolio_filters\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_portfolio_index_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_portfolio_index_page_v_version_portfolio_filters_order_idx\` ON \`_portfolio_index_page_v_version_portfolio_filters\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_portfolio_index_page_v_version_portfolio_filters_parent_id_idx\` ON \`_portfolio_index_page_v_version_portfolio_filters\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_portfolio_index_page_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_hero_video_id\` integer,
  	\`version_hero_title\` text DEFAULT 'Our Work',
  	\`version_hero_date\` text DEFAULT 'Selected Campaigns',
  	\`version_hero_scroll_to_expand_label\` text DEFAULT 'Scroll To Explore',
  	\`version_hero_description\` text DEFAULT 'Discover a world of captivating storytelling. From immersive brand journeys to campaigns that dominate the feed — this is Slate Cinema''s showcase.',
  	\`version_hero_cta_label\` text DEFAULT 'Get Started',
  	\`version_hero_cta_href\` text DEFAULT '/contact',
  	\`version_reel_carousel_eyebrow\` text DEFAULT 'The Reel',
  	\`version_reel_carousel_headline\` text DEFAULT 'Spin through the work',
  	\`version_reel_carousel_subhead\` text DEFAULT 'Drag to spin the reel · click a frame to open it',
  	\`version_industries_section_eyebrow\` text DEFAULT 'Who We Work With',
  	\`version_industries_section_headline\` text DEFAULT 'Cinematic work for every industry',
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`version_hero_video_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_portfolio_index_page_v_version_hero_version_hero_video_idx\` ON \`_portfolio_index_page_v\` (\`version_hero_video_id\`);`)
  await db.run(sql`CREATE INDEX \`_portfolio_index_page_v_version_version__status_idx\` ON \`_portfolio_index_page_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_portfolio_index_page_v_created_at_idx\` ON \`_portfolio_index_page_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_portfolio_index_page_v_updated_at_idx\` ON \`_portfolio_index_page_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_portfolio_index_page_v_latest_idx\` ON \`_portfolio_index_page_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_contact_page_v_version_what_happens_next_badges\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`icon\` text,
  	\`label\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_contact_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_contact_page_v_version_what_happens_next_badges_order_idx\` ON \`_contact_page_v_version_what_happens_next_badges\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_contact_page_v_version_what_happens_next_badges_parent_id_idx\` ON \`_contact_page_v_version_what_happens_next_badges\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_contact_page_v_version_what_happens_next_steps\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`icon\` text,
  	\`step\` text,
  	\`title\` text,
  	\`desc\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_contact_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_contact_page_v_version_what_happens_next_steps_order_idx\` ON \`_contact_page_v_version_what_happens_next_steps\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_contact_page_v_version_what_happens_next_steps_parent_id_idx\` ON \`_contact_page_v_version_what_happens_next_steps\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_contact_page_v_version_stage_router_stages\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`icon\` text,
  	\`step\` text,
  	\`title\` text,
  	\`desc\` text,
  	\`cta_label\` text,
  	\`href\` text,
  	\`accent\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_contact_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_contact_page_v_version_stage_router_stages_order_idx\` ON \`_contact_page_v_version_stage_router_stages\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_contact_page_v_version_stage_router_stages_parent_id_idx\` ON \`_contact_page_v_version_stage_router_stages\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_contact_page_v_version_lead_form_badges\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`icon\` text,
  	\`label\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_contact_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_contact_page_v_version_lead_form_badges_order_idx\` ON \`_contact_page_v_version_lead_form_badges\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_contact_page_v_version_lead_form_badges_parent_id_idx\` ON \`_contact_page_v_version_lead_form_badges\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_contact_page_v_version_contact_methods_badges\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`icon\` text,
  	\`label\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_contact_page_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_contact_page_v_version_contact_methods_badges_order_idx\` ON \`_contact_page_v_version_contact_methods_badges\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_contact_page_v_version_contact_methods_badges_parent_id_idx\` ON \`_contact_page_v_version_contact_methods_badges\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_contact_page_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_hero_eyebrow\` text DEFAULT 'Get Started',
  	\`version_hero_title_line1\` text DEFAULT 'Let''s get',
  	\`version_hero_title_line2\` text DEFAULT 'you started',
  	\`version_hero_subtitle\` text DEFAULT 'Tell us where you''re at and we''ll point you to the right next step. We reply within minutes.',
  	\`version_what_happens_next_eyebrow\` text DEFAULT '// After You Reach Out',
  	\`version_what_happens_next_headline\` text DEFAULT 'What happens next',
  	\`version_what_happens_next_subhead\` text DEFAULT 'From hello until final delivery, here''s the road map laid out.',
  	\`version_what_happens_next_form_prompt\` text DEFAULT 'Fill out a form below',
  	\`version_stage_router_eyebrow\` text DEFAULT '// Get Started',
  	\`version_stage_router_headline\` text DEFAULT 'What stage are you at?',
  	\`version_stage_router_subhead\` text DEFAULT 'No wrong answer here, pick whichever fits where you''re at now.',
  	\`version_lead_form_eyebrow\` text DEFAULT '// Not Sure Yet',
  	\`version_lead_form_headline\` text DEFAULT 'Drop us a line',
  	\`version_lead_form_description\` text DEFAULT 'Not sure exactly what you need yet? Totally fine — most people aren''t at first. Leave your info and a real person on our team will reach out with the right next step, no matter how vague the ask.',
  	\`version_lead_form_submit_label\` text DEFAULT 'Send Message',
  	\`version_lead_form_success_message\` text DEFAULT 'We''ll be in touch within minutes.',
  	\`version_contact_methods_eyebrow\` text DEFAULT 'Or Reach Us Directly',
  	\`version_contact_methods_headline\` text DEFAULT 'Real Humans. Real Work.',
  	\`version_contact_methods_description\` text DEFAULT 'No forms, no queue — email, call, or stop by the studio directly. Whatever''s easiest for you.',
  	\`version_studio_location_eyebrow\` text DEFAULT '// The Studio',
  	\`version_studio_location_headline_line1\` text DEFAULT 'Based in Brooklyn,',
  	\`version_studio_location_headline_line2\` text DEFAULT 'shooting everywhere.',
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer
  );
  `)
  await db.run(sql`CREATE INDEX \`_contact_page_v_version_version__status_idx\` ON \`_contact_page_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_contact_page_v_created_at_idx\` ON \`_contact_page_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_contact_page_v_updated_at_idx\` ON \`_contact_page_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_contact_page_v_latest_idx\` ON \`_contact_page_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_schedule_a_call_page_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`version_hero_eyebrow\` text DEFAULT 'Schedule a Call',
  	\`version_hero_title_line1\` text DEFAULT 'Let''s talk',
  	\`version_hero_title_line2\` text DEFAULT 'it through',
  	\`version_hero_subtitle\` text DEFAULT 'Grab a time that works for you. We''ll walk through your project, timeline, and budget — and outline exactly what happens next.',
  	\`version_calendar_eyebrow\` text DEFAULT '// Production Meeting',
  	\`version_calendar_headline\` text DEFAULT 'Lock In A Time',
  	\`version_calendar_session_label\` text DEFAULT 'Strategy Session',
  	\`version_calendar_duration_label\` text DEFAULT '45 Min Video Call',
  	\`version_calendar_month_label\` text DEFAULT 'OCTOBER 2026',
  	\`version_calendar_select_date_label\` text DEFAULT 'Select Date',
  	\`version_calendar_select_time_label\` text DEFAULT 'Select Time',
  	\`version_calendar_confirm_label\` text DEFAULT 'Confirm Time',
  	\`version_calendar_confirmed_label\` text DEFAULT 'You''re Booked — We''ll Be in Touch',
  	\`version__status\` text DEFAULT 'draft',
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer
  );
  `)
  await db.run(sql`CREATE INDEX \`_schedule_a_call_page_v_version_version__status_idx\` ON \`_schedule_a_call_page_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_schedule_a_call_page_v_created_at_idx\` ON \`_schedule_a_call_page_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_schedule_a_call_page_v_updated_at_idx\` ON \`_schedule_a_call_page_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_schedule_a_call_page_v_latest_idx\` ON \`_schedule_a_call_page_v\` (\`latest\`);`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_industries_gallery\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`industries\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_industries_gallery\`("_order", "_parent_id", "id", "image_id") SELECT "_order", "_parent_id", "id", "image_id" FROM \`industries_gallery\`;`)
  await db.run(sql`DROP TABLE \`industries_gallery\`;`)
  await db.run(sql`ALTER TABLE \`__new_industries_gallery\` RENAME TO \`industries_gallery\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`industries_gallery_order_idx\` ON \`industries_gallery\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`industries_gallery_parent_id_idx\` ON \`industries_gallery\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`industries_gallery_image_idx\` ON \`industries_gallery\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_industries_stats\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` numeric,
  	\`suffix\` text,
  	\`label\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`industries\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_industries_stats\`("_order", "_parent_id", "id", "value", "suffix", "label") SELECT "_order", "_parent_id", "id", "value", "suffix", "label" FROM \`industries_stats\`;`)
  await db.run(sql`DROP TABLE \`industries_stats\`;`)
  await db.run(sql`ALTER TABLE \`__new_industries_stats\` RENAME TO \`industries_stats\`;`)
  await db.run(sql`CREATE INDEX \`industries_stats_order_idx\` ON \`industries_stats\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`industries_stats_parent_id_idx\` ON \`industries_stats\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_industries_services\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`industries\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_industries_services\`("_order", "_parent_id", "id", "name") SELECT "_order", "_parent_id", "id", "name" FROM \`industries_services\`;`)
  await db.run(sql`DROP TABLE \`industries_services\`;`)
  await db.run(sql`ALTER TABLE \`__new_industries_services\` RENAME TO \`industries_services\`;`)
  await db.run(sql`CREATE INDEX \`industries_services_order_idx\` ON \`industries_services\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`industries_services_parent_id_idx\` ON \`industries_services\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_industries_service_cards_deliverables\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`item\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`industries_service_cards\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_industries_service_cards_deliverables\`("_order", "_parent_id", "id", "item") SELECT "_order", "_parent_id", "id", "item" FROM \`industries_service_cards_deliverables\`;`)
  await db.run(sql`DROP TABLE \`industries_service_cards_deliverables\`;`)
  await db.run(sql`ALTER TABLE \`__new_industries_service_cards_deliverables\` RENAME TO \`industries_service_cards_deliverables\`;`)
  await db.run(sql`CREATE INDEX \`industries_service_cards_deliverables_order_idx\` ON \`industries_service_cards_deliverables\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`industries_service_cards_deliverables_parent_id_idx\` ON \`industries_service_cards_deliverables\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_industries_service_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`description\` text,
  	\`outcome\` text,
  	\`meta\` text,
  	\`image_id\` integer,
  	\`video_id\` integer,
  	\`featured\` integer DEFAULT false,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`video_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`industries\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_industries_service_cards\`("_order", "_parent_id", "id", "title", "description", "outcome", "meta", "image_id", "video_id", "featured") SELECT "_order", "_parent_id", "id", "title", "description", "outcome", "meta", "image_id", "video_id", "featured" FROM \`industries_service_cards\`;`)
  await db.run(sql`DROP TABLE \`industries_service_cards\`;`)
  await db.run(sql`ALTER TABLE \`__new_industries_service_cards\` RENAME TO \`industries_service_cards\`;`)
  await db.run(sql`CREATE INDEX \`industries_service_cards_order_idx\` ON \`industries_service_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`industries_service_cards_parent_id_idx\` ON \`industries_service_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`industries_service_cards_image_idx\` ON \`industries_service_cards\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`industries_service_cards_video_idx\` ON \`industries_service_cards\` (\`video_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_industries_video_testimonials\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`quote\` text,
  	\`name\` text,
  	\`role\` text,
  	\`company\` text,
  	\`video_id\` integer,
  	\`outcome\` text,
  	\`poster_id\` integer,
  	\`logo_id\` integer,
  	FOREIGN KEY (\`video_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`poster_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`industries\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_industries_video_testimonials\`("_order", "_parent_id", "id", "quote", "name", "role", "company", "video_id", "outcome", "poster_id", "logo_id") SELECT "_order", "_parent_id", "id", "quote", "name", "role", "company", "video_id", "outcome", "poster_id", "logo_id" FROM \`industries_video_testimonials\`;`)
  await db.run(sql`DROP TABLE \`industries_video_testimonials\`;`)
  await db.run(sql`ALTER TABLE \`__new_industries_video_testimonials\` RENAME TO \`industries_video_testimonials\`;`)
  await db.run(sql`CREATE INDEX \`industries_video_testimonials_order_idx\` ON \`industries_video_testimonials\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`industries_video_testimonials_parent_id_idx\` ON \`industries_video_testimonials\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`industries_video_testimonials_video_idx\` ON \`industries_video_testimonials\` (\`video_id\`);`)
  await db.run(sql`CREATE INDEX \`industries_video_testimonials_poster_idx\` ON \`industries_video_testimonials\` (\`poster_id\`);`)
  await db.run(sql`CREATE INDEX \`industries_video_testimonials_logo_idx\` ON \`industries_video_testimonials\` (\`logo_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_industries_process\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`week\` text,
  	\`title\` text,
  	\`body\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`industries\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_industries_process\`("_order", "_parent_id", "id", "week", "title", "body") SELECT "_order", "_parent_id", "id", "week", "title", "body" FROM \`industries_process\`;`)
  await db.run(sql`DROP TABLE \`industries_process\`;`)
  await db.run(sql`ALTER TABLE \`__new_industries_process\` RENAME TO \`industries_process\`;`)
  await db.run(sql`CREATE INDEX \`industries_process_order_idx\` ON \`industries_process\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`industries_process_parent_id_idx\` ON \`industries_process\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_industries_faqs\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`question\` text,
  	\`answer\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`industries\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_industries_faqs\`("_order", "_parent_id", "id", "question", "answer") SELECT "_order", "_parent_id", "id", "question", "answer" FROM \`industries_faqs\`;`)
  await db.run(sql`DROP TABLE \`industries_faqs\`;`)
  await db.run(sql`ALTER TABLE \`__new_industries_faqs\` RENAME TO \`industries_faqs\`;`)
  await db.run(sql`CREATE INDEX \`industries_faqs_order_idx\` ON \`industries_faqs\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`industries_faqs_parent_id_idx\` ON \`industries_faqs\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_industries\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`slug\` text,
  	\`label\` text,
  	\`icon\` text,
  	\`accent\` text,
  	\`blurb\` text,
  	\`description\` text,
  	\`stat\` text,
  	\`hero_image_id\` integer,
  	\`hero_video_id\` integer,
  	\`testimonial_quote\` text,
  	\`testimonial_name\` text,
  	\`testimonial_role\` text,
  	\`testimonial_company\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`hero_video_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_industries\`("id", "slug", "label", "icon", "accent", "blurb", "description", "stat", "hero_image_id", "hero_video_id", "testimonial_quote", "testimonial_name", "testimonial_role", "testimonial_company", "updated_at", "created_at") SELECT "id", "slug", "label", "icon", "accent", "blurb", "description", "stat", "hero_image_id", "hero_video_id", "testimonial_quote", "testimonial_name", "testimonial_role", "testimonial_company", "updated_at", "created_at" FROM \`industries\`;`)
  await db.run(sql`DROP TABLE \`industries\`;`)
  await db.run(sql`ALTER TABLE \`__new_industries\` RENAME TO \`industries\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`industries_slug_idx\` ON \`industries\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`industries_hero_image_idx\` ON \`industries\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`industries_hero_video_idx\` ON \`industries\` (\`hero_video_id\`);`)
  await db.run(sql`CREATE INDEX \`industries_updated_at_idx\` ON \`industries\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`industries_created_at_idx\` ON \`industries\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`industries__status_idx\` ON \`industries\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`__new_portfolio_projects_metrics\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`value\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`portfolio_projects\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_portfolio_projects_metrics\`("_order", "_parent_id", "id", "label", "value") SELECT "_order", "_parent_id", "id", "label", "value" FROM \`portfolio_projects_metrics\`;`)
  await db.run(sql`DROP TABLE \`portfolio_projects_metrics\`;`)
  await db.run(sql`ALTER TABLE \`__new_portfolio_projects_metrics\` RENAME TO \`portfolio_projects_metrics\`;`)
  await db.run(sql`CREATE INDEX \`portfolio_projects_metrics_order_idx\` ON \`portfolio_projects_metrics\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`portfolio_projects_metrics_parent_id_idx\` ON \`portfolio_projects_metrics\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_portfolio_projects\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`category\` text,
  	\`company\` text,
  	\`poster_id\` integer,
  	\`copy\` text,
  	\`video_id\` integer,
  	\`video_vimeo_url\` text,
  	\`order\` numeric,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`poster_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`video_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_portfolio_projects\`("id", "title", "category", "company", "poster_id", "copy", "video_id", "video_vimeo_url", "order", "updated_at", "created_at") SELECT "id", "title", "category", "company", "poster_id", "copy", "video_id", "video_vimeo_url", "order", "updated_at", "created_at" FROM \`portfolio_projects\`;`)
  await db.run(sql`DROP TABLE \`portfolio_projects\`;`)
  await db.run(sql`ALTER TABLE \`__new_portfolio_projects\` RENAME TO \`portfolio_projects\`;`)
  await db.run(sql`CREATE INDEX \`portfolio_projects_poster_idx\` ON \`portfolio_projects\` (\`poster_id\`);`)
  await db.run(sql`CREATE INDEX \`portfolio_projects_video_idx\` ON \`portfolio_projects\` (\`video_id\`);`)
  await db.run(sql`CREATE INDEX \`portfolio_projects_updated_at_idx\` ON \`portfolio_projects\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`portfolio_projects_created_at_idx\` ON \`portfolio_projects\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`portfolio_projects__status_idx\` ON \`portfolio_projects\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`__new_journal_posts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`slug\` text,
  	\`title\` text,
  	\`excerpt\` text,
  	\`category\` text,
  	\`accent\` text,
  	\`date\` text,
  	\`read_time\` text,
  	\`cover_image_id\` integer,
  	\`author\` text,
  	\`content\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`cover_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_journal_posts\`("id", "slug", "title", "excerpt", "category", "accent", "date", "read_time", "cover_image_id", "author", "content", "updated_at", "created_at") SELECT "id", "slug", "title", "excerpt", "category", "accent", "date", "read_time", "cover_image_id", "author", "content", "updated_at", "created_at" FROM \`journal_posts\`;`)
  await db.run(sql`DROP TABLE \`journal_posts\`;`)
  await db.run(sql`ALTER TABLE \`__new_journal_posts\` RENAME TO \`journal_posts\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`journal_posts_slug_idx\` ON \`journal_posts\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`journal_posts_cover_image_idx\` ON \`journal_posts\` (\`cover_image_id\`);`)
  await db.run(sql`CREATE INDEX \`journal_posts_updated_at_idx\` ON \`journal_posts\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`journal_posts_created_at_idx\` ON \`journal_posts\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`journal_posts__status_idx\` ON \`journal_posts\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`__new_navigation_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`navigation\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_navigation_links\`("_order", "_parent_id", "id", "label", "href") SELECT "_order", "_parent_id", "id", "label", "href" FROM \`navigation_links\`;`)
  await db.run(sql`DROP TABLE \`navigation_links\`;`)
  await db.run(sql`ALTER TABLE \`__new_navigation_links\` RENAME TO \`navigation_links\`;`)
  await db.run(sql`CREATE INDEX \`navigation_links_order_idx\` ON \`navigation_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`navigation_links_parent_id_idx\` ON \`navigation_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_navigation\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`cta_button_label\` text DEFAULT 'Schedule Call',
  	\`cta_button_href\` text DEFAULT '/schedule-a-call',
  	\`client_portal_href\` text DEFAULT 'https://my.slatecinema.com/',
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`INSERT INTO \`__new_navigation\`("id", "cta_button_label", "cta_button_href", "client_portal_href", "updated_at", "created_at") SELECT "id", "cta_button_label", "cta_button_href", "client_portal_href", "updated_at", "created_at" FROM \`navigation\`;`)
  await db.run(sql`DROP TABLE \`navigation\`;`)
  await db.run(sql`ALTER TABLE \`__new_navigation\` RENAME TO \`navigation\`;`)
  await db.run(sql`CREATE INDEX \`navigation__status_idx\` ON \`navigation\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`__new_footer_marquee_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`footer\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_footer_marquee_items\`("_order", "_parent_id", "id", "text") SELECT "_order", "_parent_id", "id", "text" FROM \`footer_marquee_items\`;`)
  await db.run(sql`DROP TABLE \`footer_marquee_items\`;`)
  await db.run(sql`ALTER TABLE \`__new_footer_marquee_items\` RENAME TO \`footer_marquee_items\`;`)
  await db.run(sql`CREATE INDEX \`footer_marquee_items_order_idx\` ON \`footer_marquee_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`footer_marquee_items_parent_id_idx\` ON \`footer_marquee_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_footer_sitemap_column_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`href\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`footer\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_footer_sitemap_column_links\`("_order", "_parent_id", "id", "label", "href") SELECT "_order", "_parent_id", "id", "label", "href" FROM \`footer_sitemap_column_links\`;`)
  await db.run(sql`DROP TABLE \`footer_sitemap_column_links\`;`)
  await db.run(sql`ALTER TABLE \`__new_footer_sitemap_column_links\` RENAME TO \`footer_sitemap_column_links\`;`)
  await db.run(sql`CREATE INDEX \`footer_sitemap_column_links_order_idx\` ON \`footer_sitemap_column_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`footer_sitemap_column_links_parent_id_idx\` ON \`footer_sitemap_column_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_footer\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`cta_heading\` text DEFAULT 'Ready to create?',
  	\`cta_button_label\` text DEFAULT 'Get Started',
  	\`cta_button_href\` text DEFAULT '/contact',
  	\`newsletter_heading\` text DEFAULT 'Subscribe to our Newsletter',
  	\`newsletter_sentence\` text DEFAULT 'Want to stay up to date on the latest AI trends, social media frenzies and the latest in media marketing tech? We share valuable tips straight into your inbox!',
  	\`newsletter_placeholder\` text DEFAULT 'Your email address',
  	\`newsletter_button_label\` text DEFAULT 'Sign Up',
  	\`sitemap_column_heading\` text DEFAULT 'Studio',
  	\`bottom_bar_crafted_with_love_text\` text DEFAULT 'Crafted with love by Slate Cinema',
  	\`bottom_bar_privacy_href\` text DEFAULT '/privacy-policy',
  	\`bottom_bar_terms_href\` text DEFAULT '/terms-of-service',
  	\`bottom_bar_client_portal_href\` text DEFAULT 'https://my.slatecinema.com/',
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`INSERT INTO \`__new_footer\`("id", "cta_heading", "cta_button_label", "cta_button_href", "newsletter_heading", "newsletter_sentence", "newsletter_placeholder", "newsletter_button_label", "sitemap_column_heading", "bottom_bar_crafted_with_love_text", "bottom_bar_privacy_href", "bottom_bar_terms_href", "bottom_bar_client_portal_href", "updated_at", "created_at") SELECT "id", "cta_heading", "cta_button_label", "cta_button_href", "newsletter_heading", "newsletter_sentence", "newsletter_placeholder", "newsletter_button_label", "sitemap_column_heading", "bottom_bar_crafted_with_love_text", "bottom_bar_privacy_href", "bottom_bar_terms_href", "bottom_bar_client_portal_href", "updated_at", "created_at" FROM \`footer\`;`)
  await db.run(sql`DROP TABLE \`footer\`;`)
  await db.run(sql`ALTER TABLE \`__new_footer\` RENAME TO \`footer\`;`)
  await db.run(sql`CREATE INDEX \`footer__status_idx\` ON \`footer\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`__new_site_settings\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`seo_title_template\` text DEFAULT '%s | Slate Cinema',
  	\`seo_default_title\` text DEFAULT 'Slate Cinema',
  	\`seo_default_description\` text DEFAULT 'From concept to campaign, we create cinematic content built to capture attention, tell stories, and drive engagement. Brooklyn, NY.',
  	\`seo_og_image_id\` integer,
  	\`contact_email\` text DEFAULT 'info@slatecinema.com',
  	\`contact_phone\` text DEFAULT '+1 732 930 1934',
  	\`contact_studio_name\` text DEFAULT 'Slate Cinema Studio',
  	\`contact_address_line\` text DEFAULT '132 32nd St',
  	\`contact_city\` text DEFAULT 'Brooklyn',
  	\`contact_state\` text DEFAULT 'NY',
  	\`contact_postal_code\` text DEFAULT '11232',
  	\`contact_hours\` text DEFAULT 'Mon–Fri · 9am – 7pm ET · On-location by appointment',
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`seo_og_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_site_settings\`("id", "seo_title_template", "seo_default_title", "seo_default_description", "seo_og_image_id", "contact_email", "contact_phone", "contact_studio_name", "contact_address_line", "contact_city", "contact_state", "contact_postal_code", "contact_hours", "updated_at", "created_at") SELECT "id", "seo_title_template", "seo_default_title", "seo_default_description", "seo_og_image_id", "contact_email", "contact_phone", "contact_studio_name", "contact_address_line", "contact_city", "contact_state", "contact_postal_code", "contact_hours", "updated_at", "created_at" FROM \`site_settings\`;`)
  await db.run(sql`DROP TABLE \`site_settings\`;`)
  await db.run(sql`ALTER TABLE \`__new_site_settings\` RENAME TO \`site_settings\`;`)
  await db.run(sql`CREATE INDEX \`site_settings_seo_seo_og_image_idx\` ON \`site_settings\` (\`seo_og_image_id\`);`)
  await db.run(sql`CREATE INDEX \`site_settings__status_idx\` ON \`site_settings\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`__new_pipeline_categories_services_tags\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`tag\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pipeline_categories_services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_pipeline_categories_services_tags\`("_order", "_parent_id", "id", "tag") SELECT "_order", "_parent_id", "id", "tag" FROM \`pipeline_categories_services_tags\`;`)
  await db.run(sql`DROP TABLE \`pipeline_categories_services_tags\`;`)
  await db.run(sql`ALTER TABLE \`__new_pipeline_categories_services_tags\` RENAME TO \`pipeline_categories_services_tags\`;`)
  await db.run(sql`CREATE INDEX \`pipeline_categories_services_tags_order_idx\` ON \`pipeline_categories_services_tags\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pipeline_categories_services_tags_parent_id_idx\` ON \`pipeline_categories_services_tags\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_pipeline_categories_services\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`desc\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pipeline_categories\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_pipeline_categories_services\`("_order", "_parent_id", "id", "name", "desc") SELECT "_order", "_parent_id", "id", "name", "desc" FROM \`pipeline_categories_services\`;`)
  await db.run(sql`DROP TABLE \`pipeline_categories_services\`;`)
  await db.run(sql`ALTER TABLE \`__new_pipeline_categories_services\` RENAME TO \`pipeline_categories_services\`;`)
  await db.run(sql`CREATE INDEX \`pipeline_categories_services_order_idx\` ON \`pipeline_categories_services\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pipeline_categories_services_parent_id_idx\` ON \`pipeline_categories_services\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_pipeline_categories\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`category_id\` text,
  	\`title\` text,
  	\`video_id\` integer,
  	\`color\` text,
  	FOREIGN KEY (\`video_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pipeline\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_pipeline_categories\`("_order", "_parent_id", "id", "category_id", "title", "video_id", "color") SELECT "_order", "_parent_id", "id", "category_id", "title", "video_id", "color" FROM \`pipeline_categories\`;`)
  await db.run(sql`DROP TABLE \`pipeline_categories\`;`)
  await db.run(sql`ALTER TABLE \`__new_pipeline_categories\` RENAME TO \`pipeline_categories\`;`)
  await db.run(sql`CREATE INDEX \`pipeline_categories_order_idx\` ON \`pipeline_categories\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pipeline_categories_parent_id_idx\` ON \`pipeline_categories\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pipeline_categories_video_idx\` ON \`pipeline_categories\` (\`video_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_final_cta\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`eyebrow\` text DEFAULT '// Ready To Scale?',
  	\`headline_line1\` text DEFAULT 'Your next era',
  	\`headline_line2\` text DEFAULT 'starts here',
  	\`description\` text DEFAULT 'Don''t let your brand fade into the background. Partner with Slate Cinema to engineer attention, drive engagement, and generate scalable ROI.',
  	\`button_label\` text DEFAULT 'Get Started',
  	\`button_href\` text DEFAULT '/contact',
  	\`trust_note\` text DEFAULT 'Replies within minutes',
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`INSERT INTO \`__new_final_cta\`("id", "eyebrow", "headline_line1", "headline_line2", "description", "button_label", "button_href", "trust_note", "updated_at", "created_at") SELECT "id", "eyebrow", "headline_line1", "headline_line2", "description", "button_label", "button_href", "trust_note", "updated_at", "created_at" FROM \`final_cta\`;`)
  await db.run(sql`DROP TABLE \`final_cta\`;`)
  await db.run(sql`ALTER TABLE \`__new_final_cta\` RENAME TO \`final_cta\`;`)
  await db.run(sql`CREATE INDEX \`final_cta__status_idx\` ON \`final_cta\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`__new_ready_to_talk_badges\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon\` text,
  	\`label\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`ready_to_talk\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_ready_to_talk_badges\`("_order", "_parent_id", "id", "icon", "label") SELECT "_order", "_parent_id", "id", "icon", "label" FROM \`ready_to_talk_badges\`;`)
  await db.run(sql`DROP TABLE \`ready_to_talk_badges\`;`)
  await db.run(sql`ALTER TABLE \`__new_ready_to_talk_badges\` RENAME TO \`ready_to_talk_badges\`;`)
  await db.run(sql`CREATE INDEX \`ready_to_talk_badges_order_idx\` ON \`ready_to_talk_badges\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`ready_to_talk_badges_parent_id_idx\` ON \`ready_to_talk_badges\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_ready_to_talk_prep_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon\` text,
  	\`label\` text,
  	\`desc\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`ready_to_talk\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_ready_to_talk_prep_items\`("_order", "_parent_id", "id", "icon", "label", "desc") SELECT "_order", "_parent_id", "id", "icon", "label", "desc" FROM \`ready_to_talk_prep_items\`;`)
  await db.run(sql`DROP TABLE \`ready_to_talk_prep_items\`;`)
  await db.run(sql`ALTER TABLE \`__new_ready_to_talk_prep_items\` RENAME TO \`ready_to_talk_prep_items\`;`)
  await db.run(sql`CREATE INDEX \`ready_to_talk_prep_items_order_idx\` ON \`ready_to_talk_prep_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`ready_to_talk_prep_items_parent_id_idx\` ON \`ready_to_talk_prep_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_ready_to_talk\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`eyebrow\` text DEFAULT '// Ready to Talk',
  	\`headline\` text DEFAULT 'Book a time on our calendar',
  	\`description\` text DEFAULT 'Prefer to talk it through live? Grab a 20-minute slot with our team — no pitch deck, no sales script, just an honest read on scope, timeline, and budget so you know exactly where you stand.',
  	\`button_label\` text DEFAULT 'Schedule a Call',
  	\`button_href\` text DEFAULT '/schedule-a-call',
  	\`note\` text DEFAULT 'No commitment — reschedule or cancel anytime.',
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`INSERT INTO \`__new_ready_to_talk\`("id", "eyebrow", "headline", "description", "button_label", "button_href", "note", "updated_at", "created_at") SELECT "id", "eyebrow", "headline", "description", "button_label", "button_href", "note", "updated_at", "created_at" FROM \`ready_to_talk\`;`)
  await db.run(sql`DROP TABLE \`ready_to_talk\`;`)
  await db.run(sql`ALTER TABLE \`__new_ready_to_talk\` RENAME TO \`ready_to_talk\`;`)
  await db.run(sql`CREATE INDEX \`ready_to_talk__status_idx\` ON \`ready_to_talk\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`__new_home_page_media_void_lines\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text,
  	\`color\` text DEFAULT '#ffffff',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_home_page_media_void_lines\`("_order", "_parent_id", "id", "text", "color") SELECT "_order", "_parent_id", "id", "text", "color" FROM \`home_page_media_void_lines\`;`)
  await db.run(sql`DROP TABLE \`home_page_media_void_lines\`;`)
  await db.run(sql`ALTER TABLE \`__new_home_page_media_void_lines\` RENAME TO \`home_page_media_void_lines\`;`)
  await db.run(sql`CREATE INDEX \`home_page_media_void_lines_order_idx\` ON \`home_page_media_void_lines\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_page_media_void_lines_parent_id_idx\` ON \`home_page_media_void_lines\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_home_page_industry_standards_phase2_morph_words\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`word\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_home_page_industry_standards_phase2_morph_words\`("_order", "_parent_id", "id", "word") SELECT "_order", "_parent_id", "id", "word" FROM \`home_page_industry_standards_phase2_morph_words\`;`)
  await db.run(sql`DROP TABLE \`home_page_industry_standards_phase2_morph_words\`;`)
  await db.run(sql`ALTER TABLE \`__new_home_page_industry_standards_phase2_morph_words\` RENAME TO \`home_page_industry_standards_phase2_morph_words\`;`)
  await db.run(sql`CREATE INDEX \`home_page_industry_standards_phase2_morph_words_order_idx\` ON \`home_page_industry_standards_phase2_morph_words\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_page_industry_standards_phase2_morph_words_parent_id_idx\` ON \`home_page_industry_standards_phase2_morph_words\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_home_page_trust_section_flagship_logos\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`logo_id\` integer,
  	FOREIGN KEY (\`logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_home_page_trust_section_flagship_logos\`("_order", "_parent_id", "id", "name", "logo_id") SELECT "_order", "_parent_id", "id", "name", "logo_id" FROM \`home_page_trust_section_flagship_logos\`;`)
  await db.run(sql`DROP TABLE \`home_page_trust_section_flagship_logos\`;`)
  await db.run(sql`ALTER TABLE \`__new_home_page_trust_section_flagship_logos\` RENAME TO \`home_page_trust_section_flagship_logos\`;`)
  await db.run(sql`CREATE INDEX \`home_page_trust_section_flagship_logos_order_idx\` ON \`home_page_trust_section_flagship_logos\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_page_trust_section_flagship_logos_parent_id_idx\` ON \`home_page_trust_section_flagship_logos\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`home_page_trust_section_flagship_logos_logo_idx\` ON \`home_page_trust_section_flagship_logos\` (\`logo_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_home_page_trust_section_marquee_clients\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`logo_id\` integer,
  	FOREIGN KEY (\`logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_home_page_trust_section_marquee_clients\`("_order", "_parent_id", "id", "name", "logo_id") SELECT "_order", "_parent_id", "id", "name", "logo_id" FROM \`home_page_trust_section_marquee_clients\`;`)
  await db.run(sql`DROP TABLE \`home_page_trust_section_marquee_clients\`;`)
  await db.run(sql`ALTER TABLE \`__new_home_page_trust_section_marquee_clients\` RENAME TO \`home_page_trust_section_marquee_clients\`;`)
  await db.run(sql`CREATE INDEX \`home_page_trust_section_marquee_clients_order_idx\` ON \`home_page_trust_section_marquee_clients\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_page_trust_section_marquee_clients_parent_id_idx\` ON \`home_page_trust_section_marquee_clients\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`home_page_trust_section_marquee_clients_logo_idx\` ON \`home_page_trust_section_marquee_clients\` (\`logo_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_home_page_reviews_testimonials\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`quote\` text,
  	\`name\` text,
  	\`role\` text,
  	\`company\` text,
  	\`rating\` numeric DEFAULT 5,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_home_page_reviews_testimonials\`("_order", "_parent_id", "id", "quote", "name", "role", "company", "rating") SELECT "_order", "_parent_id", "id", "quote", "name", "role", "company", "rating" FROM \`home_page_reviews_testimonials\`;`)
  await db.run(sql`DROP TABLE \`home_page_reviews_testimonials\`;`)
  await db.run(sql`ALTER TABLE \`__new_home_page_reviews_testimonials\` RENAME TO \`home_page_reviews_testimonials\`;`)
  await db.run(sql`CREATE INDEX \`home_page_reviews_testimonials_order_idx\` ON \`home_page_reviews_testimonials\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_page_reviews_testimonials_parent_id_idx\` ON \`home_page_reviews_testimonials\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_home_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_wordmark_part1\` text DEFAULT 'SLATE',
  	\`hero_wordmark_part2\` text DEFAULT 'CINEMA',
  	\`hero_subtitle\` text DEFAULT 'Video Marketing At Your Fingertips',
  	\`hero_cta_label\` text DEFAULT 'Get Started',
  	\`hero_cta_href\` text DEFAULT '/contact',
  	\`hero_secondary_cta_label\` text DEFAULT 'Watch Our Reel',
  	\`hero_secondary_cta_href\` text DEFAULT '#reel',
  	\`industry_standards_phase1_eyebrow\` text DEFAULT '// The Standard',
  	\`industry_standards_phase1_headline_line1\` text DEFAULT 'WE ENGINEER',
  	\`industry_standards_phase1_headline_line2\` text DEFAULT 'ATTENTION',
  	\`industry_standards_phase1_description\` text DEFAULT 'In a crowded digital landscape, being ''good enough'' means being invisible. We build content systems designed specifically to hijack feeds, halt thumbs, and demand viewer retention from the very first frame.',
  	\`industry_standards_phase2_eyebrow\` text DEFAULT '// The Execution',
  	\`industry_standards_phase2_headline\` text DEFAULT 'EVERY FRAME',
  	\`industry_standards_phase2_description\` text DEFAULT 'We don''t just shoot video. We engineer visual experiences designed to capture and hold attention in a world that never stops scrolling.',
  	\`industry_standards_phase3_eyebrow\` text DEFAULT '// The Result',
  	\`industry_standards_phase3_headline\` text DEFAULT 'DOMINATE YOUR MARKET',
  	\`industry_standards_phase3_description\` text DEFAULT 'The result is scalable, predictable growth. We turn passive viewers into active communities, and organic reach into tangible ROI.',
  	\`industry_standards_phase3_cta_label\` text DEFAULT 'Get Started',
  	\`industry_standards_phase3_cta_href\` text DEFAULT '/contact',
  	\`trust_section_eyebrow\` text DEFAULT 'Join the leaders working with Slate Cinema',
  	\`trust_section_rating_text\` text DEFAULT '5.0/5 · 44 Google reviews',
  	\`trust_section_marquee_label\` text DEFAULT 'More collaborations & partnerships',
  	\`results_views_target\` numeric DEFAULT 120000000,
  	\`results_likes_target\` numeric DEFAULT 14352910,
  	\`results_comments_target\` numeric DEFAULT 1670823,
  	\`results_reach_percent\` text DEFAULT '98.2%',
  	\`results_description\` text DEFAULT 'Slate Cinema creates content built for the platforms where attention is won or lost in seconds. Every frame, hook, cut, and caption is meticulously shaped to make audiences stop scrolling.',
  	\`results_cta_label\` text DEFAULT 'See Case Studies',
  	\`results_cta_href\` text DEFAULT '/portfolio',
  	\`reviews_eyebrow\` text DEFAULT 'Client Feedback',
  	\`reviews_headline_line1\` text DEFAULT 'Trusted by leaders',
  	\`reviews_headline_line2\` text DEFAULT 'across industries',
  	\`reviews_rating_text\` text DEFAULT '5.0/5 average · 44 Google reviews',
  	\`reviews_video_testimonials_label\` text DEFAULT 'Hear it from them, not us',
  	\`reviews_google_reviews_label\` text DEFAULT 'From Google reviews',
  	\`_status\` text DEFAULT 'draft',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`INSERT INTO \`__new_home_page\`("id", "hero_wordmark_part1", "hero_wordmark_part2", "hero_subtitle", "hero_cta_label", "hero_cta_href", "hero_secondary_cta_label", "hero_secondary_cta_href", "industry_standards_phase1_eyebrow", "industry_standards_phase1_headline_line1", "industry_standards_phase1_headline_line2", "industry_standards_phase1_description", "industry_standards_phase2_eyebrow", "industry_standards_phase2_headline", "industry_standards_phase2_description", "industry_standards_phase3_eyebrow", "industry_standards_phase3_headline", "industry_standards_phase3_description", "industry_standards_phase3_cta_label", "industry_standards_phase3_cta_href", "trust_section_eyebrow", "trust_section_rating_text", "trust_section_marquee_label", "results_views_target", "results_likes_target", "results_comments_target", "results_reach_percent", "results_description", "results_cta_label", "results_cta_href", "reviews_eyebrow", "reviews_headline_line1", "reviews_headline_line2", "reviews_rating_text", "reviews_video_testimonials_label", "reviews_google_reviews_label", "updated_at", "created_at") SELECT "id", "hero_wordmark_part1", "hero_wordmark_part2", "hero_subtitle", "hero_cta_label", "hero_cta_href", "hero_secondary_cta_label", "hero_secondary_cta_href", "industry_standards_phase1_eyebrow", "industry_standards_phase1_headline_line1", "industry_standards_phase1_headline_line2", "industry_standards_phase1_description", "industry_standards_phase2_eyebrow", "industry_standards_phase2_headline", "industry_standards_phase2_description", "industry_standards_phase3_eyebrow", "industry_standards_phase3_headline", "industry_standards_phase3_description", "industry_standards_phase3_cta_label", "industry_standards_phase3_cta_href", "trust_section_eyebrow", "trust_section_rating_text", "trust_section_marquee_label", "results_views_target", "results_likes_target", "results_comments_target", "results_reach_percent", "results_description", "results_cta_label", "results_cta_href", "reviews_eyebrow", "reviews_headline_line1", "reviews_headline_line2", "reviews_rating_text", "reviews_video_testimonials_label", "reviews_google_reviews_label", "updated_at", "created_at" FROM \`home_page\`;`)
  await db.run(sql`DROP TABLE \`home_page\`;`)
  await db.run(sql`ALTER TABLE \`__new_home_page\` RENAME TO \`home_page\`;`)
  await db.run(sql`CREATE INDEX \`home_page__status_idx\` ON \`home_page\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`__new_how_it_works_page_process_overview_timeline_steps\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`color\` text,
  	\`line\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`how_it_works_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_how_it_works_page_process_overview_timeline_steps\`("_order", "_parent_id", "id", "title", "color", "line") SELECT "_order", "_parent_id", "id", "title", "color", "line" FROM \`how_it_works_page_process_overview_timeline_steps\`;`)
  await db.run(sql`DROP TABLE \`how_it_works_page_process_overview_timeline_steps\`;`)
  await db.run(sql`ALTER TABLE \`__new_how_it_works_page_process_overview_timeline_steps\` RENAME TO \`how_it_works_page_process_overview_timeline_steps\`;`)
  await db.run(sql`CREATE INDEX \`how_it_works_page_process_overview_timeline_steps_order_idx\` ON \`how_it_works_page_process_overview_timeline_steps\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`how_it_works_page_process_overview_timeline_steps_parent_id_idx\` ON \`how_it_works_page_process_overview_timeline_steps\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_how_it_works_page_behind_the_scenes_stills\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`label\` text,
  	\`desc\` text,
  	\`span\` text DEFAULT 'normal',
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`how_it_works_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_how_it_works_page_behind_the_scenes_stills\`("_order", "_parent_id", "id", "image_id", "label", "desc", "span") SELECT "_order", "_parent_id", "id", "image_id", "label", "desc", "span" FROM \`how_it_works_page_behind_the_scenes_stills\`;`)
  await db.run(sql`DROP TABLE \`how_it_works_page_behind_the_scenes_stills\`;`)
  await db.run(sql`ALTER TABLE \`__new_how_it_works_page_behind_the_scenes_stills\` RENAME TO \`how_it_works_page_behind_the_scenes_stills\`;`)
  await db.run(sql`CREATE INDEX \`how_it_works_page_behind_the_scenes_stills_order_idx\` ON \`how_it_works_page_behind_the_scenes_stills\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`how_it_works_page_behind_the_scenes_stills_parent_id_idx\` ON \`how_it_works_page_behind_the_scenes_stills\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`how_it_works_page_behind_the_scenes_stills_image_idx\` ON \`how_it_works_page_behind_the_scenes_stills\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_how_it_works_page_process_walkthrough_phases\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`color\` text,
  	\`video_id\` integer,
  	\`description\` text,
  	FOREIGN KEY (\`video_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`how_it_works_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_how_it_works_page_process_walkthrough_phases\`("_order", "_parent_id", "id", "title", "color", "video_id", "description") SELECT "_order", "_parent_id", "id", "title", "color", "video_id", "description" FROM \`how_it_works_page_process_walkthrough_phases\`;`)
  await db.run(sql`DROP TABLE \`how_it_works_page_process_walkthrough_phases\`;`)
  await db.run(sql`ALTER TABLE \`__new_how_it_works_page_process_walkthrough_phases\` RENAME TO \`how_it_works_page_process_walkthrough_phases\`;`)
  await db.run(sql`CREATE INDEX \`how_it_works_page_process_walkthrough_phases_order_idx\` ON \`how_it_works_page_process_walkthrough_phases\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`how_it_works_page_process_walkthrough_phases_parent_id_idx\` ON \`how_it_works_page_process_walkthrough_phases\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`how_it_works_page_process_walkthrough_phases_video_idx\` ON \`how_it_works_page_process_walkthrough_phases\` (\`video_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_how_it_works_page_stats_band\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` numeric,
  	\`suffix\` text,
  	\`label\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`how_it_works_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_how_it_works_page_stats_band\`("_order", "_parent_id", "id", "value", "suffix", "label") SELECT "_order", "_parent_id", "id", "value", "suffix", "label" FROM \`how_it_works_page_stats_band\`;`)
  await db.run(sql`DROP TABLE \`how_it_works_page_stats_band\`;`)
  await db.run(sql`ALTER TABLE \`__new_how_it_works_page_stats_band\` RENAME TO \`how_it_works_page_stats_band\`;`)
  await db.run(sql`CREATE INDEX \`how_it_works_page_stats_band_order_idx\` ON \`how_it_works_page_stats_band\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`how_it_works_page_stats_band_parent_id_idx\` ON \`how_it_works_page_stats_band\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_how_it_works_page_guarantees\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon\` text,
  	\`title\` text,
  	\`desc\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`how_it_works_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_how_it_works_page_guarantees\`("_order", "_parent_id", "id", "icon", "title", "desc") SELECT "_order", "_parent_id", "id", "icon", "title", "desc" FROM \`how_it_works_page_guarantees\`;`)
  await db.run(sql`DROP TABLE \`how_it_works_page_guarantees\`;`)
  await db.run(sql`ALTER TABLE \`__new_how_it_works_page_guarantees\` RENAME TO \`how_it_works_page_guarantees\`;`)
  await db.run(sql`CREATE INDEX \`how_it_works_page_guarantees_order_idx\` ON \`how_it_works_page_guarantees\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`how_it_works_page_guarantees_parent_id_idx\` ON \`how_it_works_page_guarantees\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_portfolio_index_page_portfolio_filters\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`portfolio_index_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_portfolio_index_page_portfolio_filters\`("_order", "_parent_id", "id", "name") SELECT "_order", "_parent_id", "id", "name" FROM \`portfolio_index_page_portfolio_filters\`;`)
  await db.run(sql`DROP TABLE \`portfolio_index_page_portfolio_filters\`;`)
  await db.run(sql`ALTER TABLE \`__new_portfolio_index_page_portfolio_filters\` RENAME TO \`portfolio_index_page_portfolio_filters\`;`)
  await db.run(sql`CREATE INDEX \`portfolio_index_page_portfolio_filters_order_idx\` ON \`portfolio_index_page_portfolio_filters\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`portfolio_index_page_portfolio_filters_parent_id_idx\` ON \`portfolio_index_page_portfolio_filters\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_contact_page_what_happens_next_badges\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon\` text,
  	\`label\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`contact_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_contact_page_what_happens_next_badges\`("_order", "_parent_id", "id", "icon", "label") SELECT "_order", "_parent_id", "id", "icon", "label" FROM \`contact_page_what_happens_next_badges\`;`)
  await db.run(sql`DROP TABLE \`contact_page_what_happens_next_badges\`;`)
  await db.run(sql`ALTER TABLE \`__new_contact_page_what_happens_next_badges\` RENAME TO \`contact_page_what_happens_next_badges\`;`)
  await db.run(sql`CREATE INDEX \`contact_page_what_happens_next_badges_order_idx\` ON \`contact_page_what_happens_next_badges\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`contact_page_what_happens_next_badges_parent_id_idx\` ON \`contact_page_what_happens_next_badges\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_contact_page_what_happens_next_steps\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon\` text,
  	\`step\` text,
  	\`title\` text,
  	\`desc\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`contact_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_contact_page_what_happens_next_steps\`("_order", "_parent_id", "id", "icon", "step", "title", "desc") SELECT "_order", "_parent_id", "id", "icon", "step", "title", "desc" FROM \`contact_page_what_happens_next_steps\`;`)
  await db.run(sql`DROP TABLE \`contact_page_what_happens_next_steps\`;`)
  await db.run(sql`ALTER TABLE \`__new_contact_page_what_happens_next_steps\` RENAME TO \`contact_page_what_happens_next_steps\`;`)
  await db.run(sql`CREATE INDEX \`contact_page_what_happens_next_steps_order_idx\` ON \`contact_page_what_happens_next_steps\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`contact_page_what_happens_next_steps_parent_id_idx\` ON \`contact_page_what_happens_next_steps\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_contact_page_stage_router_stages\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon\` text,
  	\`step\` text,
  	\`title\` text,
  	\`desc\` text,
  	\`cta_label\` text,
  	\`href\` text,
  	\`accent\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`contact_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_contact_page_stage_router_stages\`("_order", "_parent_id", "id", "icon", "step", "title", "desc", "cta_label", "href", "accent") SELECT "_order", "_parent_id", "id", "icon", "step", "title", "desc", "cta_label", "href", "accent" FROM \`contact_page_stage_router_stages\`;`)
  await db.run(sql`DROP TABLE \`contact_page_stage_router_stages\`;`)
  await db.run(sql`ALTER TABLE \`__new_contact_page_stage_router_stages\` RENAME TO \`contact_page_stage_router_stages\`;`)
  await db.run(sql`CREATE INDEX \`contact_page_stage_router_stages_order_idx\` ON \`contact_page_stage_router_stages\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`contact_page_stage_router_stages_parent_id_idx\` ON \`contact_page_stage_router_stages\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_contact_page_lead_form_badges\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon\` text,
  	\`label\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`contact_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_contact_page_lead_form_badges\`("_order", "_parent_id", "id", "icon", "label") SELECT "_order", "_parent_id", "id", "icon", "label" FROM \`contact_page_lead_form_badges\`;`)
  await db.run(sql`DROP TABLE \`contact_page_lead_form_badges\`;`)
  await db.run(sql`ALTER TABLE \`__new_contact_page_lead_form_badges\` RENAME TO \`contact_page_lead_form_badges\`;`)
  await db.run(sql`CREATE INDEX \`contact_page_lead_form_badges_order_idx\` ON \`contact_page_lead_form_badges\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`contact_page_lead_form_badges_parent_id_idx\` ON \`contact_page_lead_form_badges\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_contact_page_contact_methods_badges\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon\` text,
  	\`label\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`contact_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_contact_page_contact_methods_badges\`("_order", "_parent_id", "id", "icon", "label") SELECT "_order", "_parent_id", "id", "icon", "label" FROM \`contact_page_contact_methods_badges\`;`)
  await db.run(sql`DROP TABLE \`contact_page_contact_methods_badges\`;`)
  await db.run(sql`ALTER TABLE \`__new_contact_page_contact_methods_badges\` RENAME TO \`contact_page_contact_methods_badges\`;`)
  await db.run(sql`CREATE INDEX \`contact_page_contact_methods_badges_order_idx\` ON \`contact_page_contact_methods_badges\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`contact_page_contact_methods_badges_parent_id_idx\` ON \`contact_page_contact_methods_badges\` (\`_parent_id\`);`)
  await db.run(sql`ALTER TABLE \`pipeline\` ADD \`_status\` text DEFAULT 'draft';`)
  await db.run(sql`CREATE INDEX \`pipeline__status_idx\` ON \`pipeline\` (\`_status\`);`)
  await db.run(sql`ALTER TABLE \`how_it_works_page\` ADD \`_status\` text DEFAULT 'draft';`)
  await db.run(sql`CREATE INDEX \`how_it_works_page__status_idx\` ON \`how_it_works_page\` (\`_status\`);`)
  await db.run(sql`ALTER TABLE \`portfolio_index_page\` ADD \`_status\` text DEFAULT 'draft';`)
  await db.run(sql`CREATE INDEX \`portfolio_index_page__status_idx\` ON \`portfolio_index_page\` (\`_status\`);`)
  await db.run(sql`ALTER TABLE \`contact_page\` ADD \`_status\` text DEFAULT 'draft';`)
  await db.run(sql`CREATE INDEX \`contact_page__status_idx\` ON \`contact_page\` (\`_status\`);`)
  await db.run(sql`ALTER TABLE \`schedule_a_call_page\` ADD \`_status\` text DEFAULT 'draft';`)
  await db.run(sql`CREATE INDEX \`schedule_a_call_page__status_idx\` ON \`schedule_a_call_page\` (\`_status\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`_industries_v_version_gallery\`;`)
  await db.run(sql`DROP TABLE \`_industries_v_version_stats\`;`)
  await db.run(sql`DROP TABLE \`_industries_v_version_services\`;`)
  await db.run(sql`DROP TABLE \`_industries_v_version_service_cards_deliverables\`;`)
  await db.run(sql`DROP TABLE \`_industries_v_version_service_cards\`;`)
  await db.run(sql`DROP TABLE \`_industries_v_version_video_testimonials\`;`)
  await db.run(sql`DROP TABLE \`_industries_v_version_process\`;`)
  await db.run(sql`DROP TABLE \`_industries_v_version_faqs\`;`)
  await db.run(sql`DROP TABLE \`_industries_v\`;`)
  await db.run(sql`DROP TABLE \`_portfolio_projects_v_version_metrics\`;`)
  await db.run(sql`DROP TABLE \`_portfolio_projects_v\`;`)
  await db.run(sql`DROP TABLE \`_journal_posts_v\`;`)
  await db.run(sql`DROP TABLE \`_navigation_v_version_links\`;`)
  await db.run(sql`DROP TABLE \`_navigation_v\`;`)
  await db.run(sql`DROP TABLE \`_footer_v_version_marquee_items\`;`)
  await db.run(sql`DROP TABLE \`_footer_v_version_sitemap_column_links\`;`)
  await db.run(sql`DROP TABLE \`_footer_v\`;`)
  await db.run(sql`DROP TABLE \`_site_settings_v\`;`)
  await db.run(sql`DROP TABLE \`_pipeline_v_version_categories_services_tags\`;`)
  await db.run(sql`DROP TABLE \`_pipeline_v_version_categories_services\`;`)
  await db.run(sql`DROP TABLE \`_pipeline_v_version_categories\`;`)
  await db.run(sql`DROP TABLE \`_pipeline_v\`;`)
  await db.run(sql`DROP TABLE \`_final_cta_v\`;`)
  await db.run(sql`DROP TABLE \`_ready_to_talk_v_version_badges\`;`)
  await db.run(sql`DROP TABLE \`_ready_to_talk_v_version_prep_items\`;`)
  await db.run(sql`DROP TABLE \`_ready_to_talk_v\`;`)
  await db.run(sql`DROP TABLE \`_home_page_v_version_media_void_lines\`;`)
  await db.run(sql`DROP TABLE \`_home_page_v_version_industry_standards_phase2_morph_words\`;`)
  await db.run(sql`DROP TABLE \`_home_page_v_version_trust_section_flagship_logos\`;`)
  await db.run(sql`DROP TABLE \`_home_page_v_version_trust_section_marquee_clients\`;`)
  await db.run(sql`DROP TABLE \`_home_page_v_version_reviews_testimonials\`;`)
  await db.run(sql`DROP TABLE \`_home_page_v\`;`)
  await db.run(sql`DROP TABLE \`_how_it_works_page_v_version_process_overview_timeline_steps\`;`)
  await db.run(sql`DROP TABLE \`_how_it_works_page_v_version_behind_the_scenes_stills\`;`)
  await db.run(sql`DROP TABLE \`_how_it_works_page_v_version_process_walkthrough_phases\`;`)
  await db.run(sql`DROP TABLE \`_how_it_works_page_v_version_stats_band\`;`)
  await db.run(sql`DROP TABLE \`_how_it_works_page_v_version_guarantees\`;`)
  await db.run(sql`DROP TABLE \`_how_it_works_page_v\`;`)
  await db.run(sql`DROP TABLE \`_portfolio_index_page_v_version_portfolio_filters\`;`)
  await db.run(sql`DROP TABLE \`_portfolio_index_page_v\`;`)
  await db.run(sql`DROP TABLE \`_contact_page_v_version_what_happens_next_badges\`;`)
  await db.run(sql`DROP TABLE \`_contact_page_v_version_what_happens_next_steps\`;`)
  await db.run(sql`DROP TABLE \`_contact_page_v_version_stage_router_stages\`;`)
  await db.run(sql`DROP TABLE \`_contact_page_v_version_lead_form_badges\`;`)
  await db.run(sql`DROP TABLE \`_contact_page_v_version_contact_methods_badges\`;`)
  await db.run(sql`DROP TABLE \`_contact_page_v\`;`)
  await db.run(sql`DROP TABLE \`_schedule_a_call_page_v\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_industries\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`slug\` text NOT NULL,
  	\`label\` text NOT NULL,
  	\`icon\` text NOT NULL,
  	\`accent\` text NOT NULL,
  	\`blurb\` text NOT NULL,
  	\`description\` text NOT NULL,
  	\`stat\` text NOT NULL,
  	\`hero_image_id\` integer,
  	\`hero_video_id\` integer,
  	\`testimonial_quote\` text,
  	\`testimonial_name\` text,
  	\`testimonial_role\` text,
  	\`testimonial_company\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`hero_video_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_industries\`("id", "slug", "label", "icon", "accent", "blurb", "description", "stat", "hero_image_id", "hero_video_id", "testimonial_quote", "testimonial_name", "testimonial_role", "testimonial_company", "updated_at", "created_at") SELECT "id", "slug", "label", "icon", "accent", "blurb", "description", "stat", "hero_image_id", "hero_video_id", "testimonial_quote", "testimonial_name", "testimonial_role", "testimonial_company", "updated_at", "created_at" FROM \`industries\`;`)
  await db.run(sql`DROP TABLE \`industries\`;`)
  await db.run(sql`ALTER TABLE \`__new_industries\` RENAME TO \`industries\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE UNIQUE INDEX \`industries_slug_idx\` ON \`industries\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`industries_hero_image_idx\` ON \`industries\` (\`hero_image_id\`);`)
  await db.run(sql`CREATE INDEX \`industries_hero_video_idx\` ON \`industries\` (\`hero_video_id\`);`)
  await db.run(sql`CREATE INDEX \`industries_updated_at_idx\` ON \`industries\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`industries_created_at_idx\` ON \`industries\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`__new_portfolio_projects\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`category\` text NOT NULL,
  	\`company\` text NOT NULL,
  	\`poster_id\` integer NOT NULL,
  	\`copy\` text NOT NULL,
  	\`video_id\` integer,
  	\`video_vimeo_url\` text,
  	\`order\` numeric,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`poster_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`video_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_portfolio_projects\`("id", "title", "category", "company", "poster_id", "copy", "video_id", "video_vimeo_url", "order", "updated_at", "created_at") SELECT "id", "title", "category", "company", "poster_id", "copy", "video_id", "video_vimeo_url", "order", "updated_at", "created_at" FROM \`portfolio_projects\`;`)
  await db.run(sql`DROP TABLE \`portfolio_projects\`;`)
  await db.run(sql`ALTER TABLE \`__new_portfolio_projects\` RENAME TO \`portfolio_projects\`;`)
  await db.run(sql`CREATE INDEX \`portfolio_projects_poster_idx\` ON \`portfolio_projects\` (\`poster_id\`);`)
  await db.run(sql`CREATE INDEX \`portfolio_projects_video_idx\` ON \`portfolio_projects\` (\`video_id\`);`)
  await db.run(sql`CREATE INDEX \`portfolio_projects_updated_at_idx\` ON \`portfolio_projects\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`portfolio_projects_created_at_idx\` ON \`portfolio_projects\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`__new_journal_posts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`slug\` text NOT NULL,
  	\`title\` text NOT NULL,
  	\`excerpt\` text NOT NULL,
  	\`category\` text NOT NULL,
  	\`accent\` text NOT NULL,
  	\`date\` text NOT NULL,
  	\`read_time\` text NOT NULL,
  	\`cover_image_id\` integer NOT NULL,
  	\`author\` text NOT NULL,
  	\`content\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`cover_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_journal_posts\`("id", "slug", "title", "excerpt", "category", "accent", "date", "read_time", "cover_image_id", "author", "content", "updated_at", "created_at") SELECT "id", "slug", "title", "excerpt", "category", "accent", "date", "read_time", "cover_image_id", "author", "content", "updated_at", "created_at" FROM \`journal_posts\`;`)
  await db.run(sql`DROP TABLE \`journal_posts\`;`)
  await db.run(sql`ALTER TABLE \`__new_journal_posts\` RENAME TO \`journal_posts\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`journal_posts_slug_idx\` ON \`journal_posts\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`journal_posts_cover_image_idx\` ON \`journal_posts\` (\`cover_image_id\`);`)
  await db.run(sql`CREATE INDEX \`journal_posts_updated_at_idx\` ON \`journal_posts\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`journal_posts_created_at_idx\` ON \`journal_posts\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`__new_navigation\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`cta_button_label\` text DEFAULT 'Schedule Call' NOT NULL,
  	\`cta_button_href\` text DEFAULT '/schedule-a-call' NOT NULL,
  	\`client_portal_href\` text DEFAULT 'https://my.slatecinema.com/',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`INSERT INTO \`__new_navigation\`("id", "cta_button_label", "cta_button_href", "client_portal_href", "updated_at", "created_at") SELECT "id", "cta_button_label", "cta_button_href", "client_portal_href", "updated_at", "created_at" FROM \`navigation\`;`)
  await db.run(sql`DROP TABLE \`navigation\`;`)
  await db.run(sql`ALTER TABLE \`__new_navigation\` RENAME TO \`navigation\`;`)
  await db.run(sql`CREATE TABLE \`__new_footer\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`cta_heading\` text DEFAULT 'Ready to create?' NOT NULL,
  	\`cta_button_label\` text DEFAULT 'Get Started' NOT NULL,
  	\`cta_button_href\` text DEFAULT '/contact' NOT NULL,
  	\`newsletter_heading\` text DEFAULT 'Subscribe to our Newsletter' NOT NULL,
  	\`newsletter_sentence\` text DEFAULT 'Want to stay up to date on the latest AI trends, social media frenzies and the latest in media marketing tech? We share valuable tips straight into your inbox!' NOT NULL,
  	\`newsletter_placeholder\` text DEFAULT 'Your email address',
  	\`newsletter_button_label\` text DEFAULT 'Sign Up',
  	\`sitemap_column_heading\` text DEFAULT 'Studio',
  	\`bottom_bar_crafted_with_love_text\` text DEFAULT 'Crafted with love by Slate Cinema',
  	\`bottom_bar_privacy_href\` text DEFAULT '/privacy-policy',
  	\`bottom_bar_terms_href\` text DEFAULT '/terms-of-service',
  	\`bottom_bar_client_portal_href\` text DEFAULT 'https://my.slatecinema.com/',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`INSERT INTO \`__new_footer\`("id", "cta_heading", "cta_button_label", "cta_button_href", "newsletter_heading", "newsletter_sentence", "newsletter_placeholder", "newsletter_button_label", "sitemap_column_heading", "bottom_bar_crafted_with_love_text", "bottom_bar_privacy_href", "bottom_bar_terms_href", "bottom_bar_client_portal_href", "updated_at", "created_at") SELECT "id", "cta_heading", "cta_button_label", "cta_button_href", "newsletter_heading", "newsletter_sentence", "newsletter_placeholder", "newsletter_button_label", "sitemap_column_heading", "bottom_bar_crafted_with_love_text", "bottom_bar_privacy_href", "bottom_bar_terms_href", "bottom_bar_client_portal_href", "updated_at", "created_at" FROM \`footer\`;`)
  await db.run(sql`DROP TABLE \`footer\`;`)
  await db.run(sql`ALTER TABLE \`__new_footer\` RENAME TO \`footer\`;`)
  await db.run(sql`CREATE TABLE \`__new_site_settings\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`seo_title_template\` text DEFAULT '%s | Slate Cinema',
  	\`seo_default_title\` text DEFAULT 'Slate Cinema',
  	\`seo_default_description\` text DEFAULT 'From concept to campaign, we create cinematic content built to capture attention, tell stories, and drive engagement. Brooklyn, NY.',
  	\`seo_og_image_id\` integer,
  	\`contact_email\` text DEFAULT 'info@slatecinema.com' NOT NULL,
  	\`contact_phone\` text DEFAULT '+1 732 930 1934' NOT NULL,
  	\`contact_studio_name\` text DEFAULT 'Slate Cinema Studio',
  	\`contact_address_line\` text DEFAULT '132 32nd St',
  	\`contact_city\` text DEFAULT 'Brooklyn',
  	\`contact_state\` text DEFAULT 'NY',
  	\`contact_postal_code\` text DEFAULT '11232',
  	\`contact_hours\` text DEFAULT 'Mon–Fri · 9am – 7pm ET · On-location by appointment',
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`seo_og_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_site_settings\`("id", "seo_title_template", "seo_default_title", "seo_default_description", "seo_og_image_id", "contact_email", "contact_phone", "contact_studio_name", "contact_address_line", "contact_city", "contact_state", "contact_postal_code", "contact_hours", "updated_at", "created_at") SELECT "id", "seo_title_template", "seo_default_title", "seo_default_description", "seo_og_image_id", "contact_email", "contact_phone", "contact_studio_name", "contact_address_line", "contact_city", "contact_state", "contact_postal_code", "contact_hours", "updated_at", "created_at" FROM \`site_settings\`;`)
  await db.run(sql`DROP TABLE \`site_settings\`;`)
  await db.run(sql`ALTER TABLE \`__new_site_settings\` RENAME TO \`site_settings\`;`)
  await db.run(sql`CREATE INDEX \`site_settings_seo_seo_og_image_idx\` ON \`site_settings\` (\`seo_og_image_id\`);`)
  await db.run(sql`DROP INDEX \`pipeline__status_idx\`;`)
  await db.run(sql`ALTER TABLE \`pipeline\` DROP COLUMN \`_status\`;`)
  await db.run(sql`CREATE TABLE \`__new_final_cta\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`eyebrow\` text DEFAULT '// Ready To Scale?',
  	\`headline_line1\` text DEFAULT 'Your next era' NOT NULL,
  	\`headline_line2\` text DEFAULT 'starts here' NOT NULL,
  	\`description\` text DEFAULT 'Don''t let your brand fade into the background. Partner with Slate Cinema to engineer attention, drive engagement, and generate scalable ROI.' NOT NULL,
  	\`button_label\` text DEFAULT 'Get Started' NOT NULL,
  	\`button_href\` text DEFAULT '/contact' NOT NULL,
  	\`trust_note\` text DEFAULT 'Replies within minutes',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`INSERT INTO \`__new_final_cta\`("id", "eyebrow", "headline_line1", "headline_line2", "description", "button_label", "button_href", "trust_note", "updated_at", "created_at") SELECT "id", "eyebrow", "headline_line1", "headline_line2", "description", "button_label", "button_href", "trust_note", "updated_at", "created_at" FROM \`final_cta\`;`)
  await db.run(sql`DROP TABLE \`final_cta\`;`)
  await db.run(sql`ALTER TABLE \`__new_final_cta\` RENAME TO \`final_cta\`;`)
  await db.run(sql`CREATE TABLE \`__new_ready_to_talk\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`eyebrow\` text DEFAULT '// Ready to Talk',
  	\`headline\` text DEFAULT 'Book a time on our calendar' NOT NULL,
  	\`description\` text DEFAULT 'Prefer to talk it through live? Grab a 20-minute slot with our team — no pitch deck, no sales script, just an honest read on scope, timeline, and budget so you know exactly where you stand.' NOT NULL,
  	\`button_label\` text DEFAULT 'Schedule a Call',
  	\`button_href\` text DEFAULT '/schedule-a-call',
  	\`note\` text DEFAULT 'No commitment — reschedule or cancel anytime.',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`INSERT INTO \`__new_ready_to_talk\`("id", "eyebrow", "headline", "description", "button_label", "button_href", "note", "updated_at", "created_at") SELECT "id", "eyebrow", "headline", "description", "button_label", "button_href", "note", "updated_at", "created_at" FROM \`ready_to_talk\`;`)
  await db.run(sql`DROP TABLE \`ready_to_talk\`;`)
  await db.run(sql`ALTER TABLE \`__new_ready_to_talk\` RENAME TO \`ready_to_talk\`;`)
  await db.run(sql`CREATE TABLE \`__new_home_page\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`hero_wordmark_part1\` text DEFAULT 'SLATE' NOT NULL,
  	\`hero_wordmark_part2\` text DEFAULT 'CINEMA' NOT NULL,
  	\`hero_subtitle\` text DEFAULT 'Video Marketing At Your Fingertips' NOT NULL,
  	\`hero_cta_label\` text DEFAULT 'Get Started' NOT NULL,
  	\`hero_cta_href\` text DEFAULT '/contact' NOT NULL,
  	\`hero_secondary_cta_label\` text DEFAULT 'Watch Our Reel',
  	\`hero_secondary_cta_href\` text DEFAULT '#reel',
  	\`industry_standards_phase1_eyebrow\` text DEFAULT '// The Standard',
  	\`industry_standards_phase1_headline_line1\` text DEFAULT 'WE ENGINEER',
  	\`industry_standards_phase1_headline_line2\` text DEFAULT 'ATTENTION',
  	\`industry_standards_phase1_description\` text DEFAULT 'In a crowded digital landscape, being ''good enough'' means being invisible. We build content systems designed specifically to hijack feeds, halt thumbs, and demand viewer retention from the very first frame.',
  	\`industry_standards_phase2_eyebrow\` text DEFAULT '// The Execution',
  	\`industry_standards_phase2_headline\` text DEFAULT 'EVERY FRAME',
  	\`industry_standards_phase2_description\` text DEFAULT 'We don''t just shoot video. We engineer visual experiences designed to capture and hold attention in a world that never stops scrolling.',
  	\`industry_standards_phase3_eyebrow\` text DEFAULT '// The Result',
  	\`industry_standards_phase3_headline\` text DEFAULT 'DOMINATE YOUR MARKET',
  	\`industry_standards_phase3_description\` text DEFAULT 'The result is scalable, predictable growth. We turn passive viewers into active communities, and organic reach into tangible ROI.',
  	\`industry_standards_phase3_cta_label\` text DEFAULT 'Get Started',
  	\`industry_standards_phase3_cta_href\` text DEFAULT '/contact',
  	\`trust_section_eyebrow\` text DEFAULT 'Join the leaders working with Slate Cinema' NOT NULL,
  	\`trust_section_rating_text\` text DEFAULT '5.0/5 · 44 Google reviews',
  	\`trust_section_marquee_label\` text DEFAULT 'More collaborations & partnerships',
  	\`results_views_target\` numeric DEFAULT 120000000,
  	\`results_likes_target\` numeric DEFAULT 14352910,
  	\`results_comments_target\` numeric DEFAULT 1670823,
  	\`results_reach_percent\` text DEFAULT '98.2%',
  	\`results_description\` text DEFAULT 'Slate Cinema creates content built for the platforms where attention is won or lost in seconds. Every frame, hook, cut, and caption is meticulously shaped to make audiences stop scrolling.' NOT NULL,
  	\`results_cta_label\` text DEFAULT 'See Case Studies',
  	\`results_cta_href\` text DEFAULT '/portfolio',
  	\`reviews_eyebrow\` text DEFAULT 'Client Feedback',
  	\`reviews_headline_line1\` text DEFAULT 'Trusted by leaders',
  	\`reviews_headline_line2\` text DEFAULT 'across industries',
  	\`reviews_rating_text\` text DEFAULT '5.0/5 average · 44 Google reviews',
  	\`reviews_video_testimonials_label\` text DEFAULT 'Hear it from them, not us',
  	\`reviews_google_reviews_label\` text DEFAULT 'From Google reviews',
  	\`updated_at\` text,
  	\`created_at\` text
  );
  `)
  await db.run(sql`INSERT INTO \`__new_home_page\`("id", "hero_wordmark_part1", "hero_wordmark_part2", "hero_subtitle", "hero_cta_label", "hero_cta_href", "hero_secondary_cta_label", "hero_secondary_cta_href", "industry_standards_phase1_eyebrow", "industry_standards_phase1_headline_line1", "industry_standards_phase1_headline_line2", "industry_standards_phase1_description", "industry_standards_phase2_eyebrow", "industry_standards_phase2_headline", "industry_standards_phase2_description", "industry_standards_phase3_eyebrow", "industry_standards_phase3_headline", "industry_standards_phase3_description", "industry_standards_phase3_cta_label", "industry_standards_phase3_cta_href", "trust_section_eyebrow", "trust_section_rating_text", "trust_section_marquee_label", "results_views_target", "results_likes_target", "results_comments_target", "results_reach_percent", "results_description", "results_cta_label", "results_cta_href", "reviews_eyebrow", "reviews_headline_line1", "reviews_headline_line2", "reviews_rating_text", "reviews_video_testimonials_label", "reviews_google_reviews_label", "updated_at", "created_at") SELECT "id", "hero_wordmark_part1", "hero_wordmark_part2", "hero_subtitle", "hero_cta_label", "hero_cta_href", "hero_secondary_cta_label", "hero_secondary_cta_href", "industry_standards_phase1_eyebrow", "industry_standards_phase1_headline_line1", "industry_standards_phase1_headline_line2", "industry_standards_phase1_description", "industry_standards_phase2_eyebrow", "industry_standards_phase2_headline", "industry_standards_phase2_description", "industry_standards_phase3_eyebrow", "industry_standards_phase3_headline", "industry_standards_phase3_description", "industry_standards_phase3_cta_label", "industry_standards_phase3_cta_href", "trust_section_eyebrow", "trust_section_rating_text", "trust_section_marquee_label", "results_views_target", "results_likes_target", "results_comments_target", "results_reach_percent", "results_description", "results_cta_label", "results_cta_href", "reviews_eyebrow", "reviews_headline_line1", "reviews_headline_line2", "reviews_rating_text", "reviews_video_testimonials_label", "reviews_google_reviews_label", "updated_at", "created_at" FROM \`home_page\`;`)
  await db.run(sql`DROP TABLE \`home_page\`;`)
  await db.run(sql`ALTER TABLE \`__new_home_page\` RENAME TO \`home_page\`;`)
  await db.run(sql`DROP INDEX \`how_it_works_page__status_idx\`;`)
  await db.run(sql`ALTER TABLE \`how_it_works_page\` DROP COLUMN \`_status\`;`)
  await db.run(sql`DROP INDEX \`portfolio_index_page__status_idx\`;`)
  await db.run(sql`ALTER TABLE \`portfolio_index_page\` DROP COLUMN \`_status\`;`)
  await db.run(sql`DROP INDEX \`contact_page__status_idx\`;`)
  await db.run(sql`ALTER TABLE \`contact_page\` DROP COLUMN \`_status\`;`)
  await db.run(sql`DROP INDEX \`schedule_a_call_page__status_idx\`;`)
  await db.run(sql`ALTER TABLE \`schedule_a_call_page\` DROP COLUMN \`_status\`;`)
  await db.run(sql`CREATE TABLE \`__new_industries_gallery\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer NOT NULL,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`industries\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_industries_gallery\`("_order", "_parent_id", "id", "image_id") SELECT "_order", "_parent_id", "id", "image_id" FROM \`industries_gallery\`;`)
  await db.run(sql`DROP TABLE \`industries_gallery\`;`)
  await db.run(sql`ALTER TABLE \`__new_industries_gallery\` RENAME TO \`industries_gallery\`;`)
  await db.run(sql`CREATE INDEX \`industries_gallery_order_idx\` ON \`industries_gallery\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`industries_gallery_parent_id_idx\` ON \`industries_gallery\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`industries_gallery_image_idx\` ON \`industries_gallery\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_industries_stats\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` numeric NOT NULL,
  	\`suffix\` text,
  	\`label\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`industries\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_industries_stats\`("_order", "_parent_id", "id", "value", "suffix", "label") SELECT "_order", "_parent_id", "id", "value", "suffix", "label" FROM \`industries_stats\`;`)
  await db.run(sql`DROP TABLE \`industries_stats\`;`)
  await db.run(sql`ALTER TABLE \`__new_industries_stats\` RENAME TO \`industries_stats\`;`)
  await db.run(sql`CREATE INDEX \`industries_stats_order_idx\` ON \`industries_stats\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`industries_stats_parent_id_idx\` ON \`industries_stats\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_industries_services\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`industries\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_industries_services\`("_order", "_parent_id", "id", "name") SELECT "_order", "_parent_id", "id", "name" FROM \`industries_services\`;`)
  await db.run(sql`DROP TABLE \`industries_services\`;`)
  await db.run(sql`ALTER TABLE \`__new_industries_services\` RENAME TO \`industries_services\`;`)
  await db.run(sql`CREATE INDEX \`industries_services_order_idx\` ON \`industries_services\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`industries_services_parent_id_idx\` ON \`industries_services\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_industries_service_cards_deliverables\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`item\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`industries_service_cards\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_industries_service_cards_deliverables\`("_order", "_parent_id", "id", "item") SELECT "_order", "_parent_id", "id", "item" FROM \`industries_service_cards_deliverables\`;`)
  await db.run(sql`DROP TABLE \`industries_service_cards_deliverables\`;`)
  await db.run(sql`ALTER TABLE \`__new_industries_service_cards_deliverables\` RENAME TO \`industries_service_cards_deliverables\`;`)
  await db.run(sql`CREATE INDEX \`industries_service_cards_deliverables_order_idx\` ON \`industries_service_cards_deliverables\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`industries_service_cards_deliverables_parent_id_idx\` ON \`industries_service_cards_deliverables\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_industries_service_cards\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`description\` text NOT NULL,
  	\`outcome\` text NOT NULL,
  	\`meta\` text,
  	\`image_id\` integer,
  	\`video_id\` integer,
  	\`featured\` integer DEFAULT false,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`video_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`industries\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_industries_service_cards\`("_order", "_parent_id", "id", "title", "description", "outcome", "meta", "image_id", "video_id", "featured") SELECT "_order", "_parent_id", "id", "title", "description", "outcome", "meta", "image_id", "video_id", "featured" FROM \`industries_service_cards\`;`)
  await db.run(sql`DROP TABLE \`industries_service_cards\`;`)
  await db.run(sql`ALTER TABLE \`__new_industries_service_cards\` RENAME TO \`industries_service_cards\`;`)
  await db.run(sql`CREATE INDEX \`industries_service_cards_order_idx\` ON \`industries_service_cards\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`industries_service_cards_parent_id_idx\` ON \`industries_service_cards\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`industries_service_cards_image_idx\` ON \`industries_service_cards\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`industries_service_cards_video_idx\` ON \`industries_service_cards\` (\`video_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_industries_video_testimonials\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`quote\` text NOT NULL,
  	\`name\` text NOT NULL,
  	\`role\` text NOT NULL,
  	\`company\` text NOT NULL,
  	\`video_id\` integer NOT NULL,
  	\`outcome\` text NOT NULL,
  	\`poster_id\` integer,
  	\`logo_id\` integer,
  	FOREIGN KEY (\`video_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`poster_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`industries\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_industries_video_testimonials\`("_order", "_parent_id", "id", "quote", "name", "role", "company", "video_id", "outcome", "poster_id", "logo_id") SELECT "_order", "_parent_id", "id", "quote", "name", "role", "company", "video_id", "outcome", "poster_id", "logo_id" FROM \`industries_video_testimonials\`;`)
  await db.run(sql`DROP TABLE \`industries_video_testimonials\`;`)
  await db.run(sql`ALTER TABLE \`__new_industries_video_testimonials\` RENAME TO \`industries_video_testimonials\`;`)
  await db.run(sql`CREATE INDEX \`industries_video_testimonials_order_idx\` ON \`industries_video_testimonials\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`industries_video_testimonials_parent_id_idx\` ON \`industries_video_testimonials\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`industries_video_testimonials_video_idx\` ON \`industries_video_testimonials\` (\`video_id\`);`)
  await db.run(sql`CREATE INDEX \`industries_video_testimonials_poster_idx\` ON \`industries_video_testimonials\` (\`poster_id\`);`)
  await db.run(sql`CREATE INDEX \`industries_video_testimonials_logo_idx\` ON \`industries_video_testimonials\` (\`logo_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_industries_process\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`week\` text NOT NULL,
  	\`title\` text NOT NULL,
  	\`body\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`industries\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_industries_process\`("_order", "_parent_id", "id", "week", "title", "body") SELECT "_order", "_parent_id", "id", "week", "title", "body" FROM \`industries_process\`;`)
  await db.run(sql`DROP TABLE \`industries_process\`;`)
  await db.run(sql`ALTER TABLE \`__new_industries_process\` RENAME TO \`industries_process\`;`)
  await db.run(sql`CREATE INDEX \`industries_process_order_idx\` ON \`industries_process\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`industries_process_parent_id_idx\` ON \`industries_process\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_industries_faqs\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`question\` text NOT NULL,
  	\`answer\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`industries\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_industries_faqs\`("_order", "_parent_id", "id", "question", "answer") SELECT "_order", "_parent_id", "id", "question", "answer" FROM \`industries_faqs\`;`)
  await db.run(sql`DROP TABLE \`industries_faqs\`;`)
  await db.run(sql`ALTER TABLE \`__new_industries_faqs\` RENAME TO \`industries_faqs\`;`)
  await db.run(sql`CREATE INDEX \`industries_faqs_order_idx\` ON \`industries_faqs\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`industries_faqs_parent_id_idx\` ON \`industries_faqs\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_portfolio_projects_metrics\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`value\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`portfolio_projects\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_portfolio_projects_metrics\`("_order", "_parent_id", "id", "label", "value") SELECT "_order", "_parent_id", "id", "label", "value" FROM \`portfolio_projects_metrics\`;`)
  await db.run(sql`DROP TABLE \`portfolio_projects_metrics\`;`)
  await db.run(sql`ALTER TABLE \`__new_portfolio_projects_metrics\` RENAME TO \`portfolio_projects_metrics\`;`)
  await db.run(sql`CREATE INDEX \`portfolio_projects_metrics_order_idx\` ON \`portfolio_projects_metrics\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`portfolio_projects_metrics_parent_id_idx\` ON \`portfolio_projects_metrics\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_navigation_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`href\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`navigation\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_navigation_links\`("_order", "_parent_id", "id", "label", "href") SELECT "_order", "_parent_id", "id", "label", "href" FROM \`navigation_links\`;`)
  await db.run(sql`DROP TABLE \`navigation_links\`;`)
  await db.run(sql`ALTER TABLE \`__new_navigation_links\` RENAME TO \`navigation_links\`;`)
  await db.run(sql`CREATE INDEX \`navigation_links_order_idx\` ON \`navigation_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`navigation_links_parent_id_idx\` ON \`navigation_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_footer_marquee_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`footer\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_footer_marquee_items\`("_order", "_parent_id", "id", "text") SELECT "_order", "_parent_id", "id", "text" FROM \`footer_marquee_items\`;`)
  await db.run(sql`DROP TABLE \`footer_marquee_items\`;`)
  await db.run(sql`ALTER TABLE \`__new_footer_marquee_items\` RENAME TO \`footer_marquee_items\`;`)
  await db.run(sql`CREATE INDEX \`footer_marquee_items_order_idx\` ON \`footer_marquee_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`footer_marquee_items_parent_id_idx\` ON \`footer_marquee_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_footer_sitemap_column_links\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`href\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`footer\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_footer_sitemap_column_links\`("_order", "_parent_id", "id", "label", "href") SELECT "_order", "_parent_id", "id", "label", "href" FROM \`footer_sitemap_column_links\`;`)
  await db.run(sql`DROP TABLE \`footer_sitemap_column_links\`;`)
  await db.run(sql`ALTER TABLE \`__new_footer_sitemap_column_links\` RENAME TO \`footer_sitemap_column_links\`;`)
  await db.run(sql`CREATE INDEX \`footer_sitemap_column_links_order_idx\` ON \`footer_sitemap_column_links\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`footer_sitemap_column_links_parent_id_idx\` ON \`footer_sitemap_column_links\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_pipeline_categories_services_tags\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`tag\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pipeline_categories_services\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_pipeline_categories_services_tags\`("_order", "_parent_id", "id", "tag") SELECT "_order", "_parent_id", "id", "tag" FROM \`pipeline_categories_services_tags\`;`)
  await db.run(sql`DROP TABLE \`pipeline_categories_services_tags\`;`)
  await db.run(sql`ALTER TABLE \`__new_pipeline_categories_services_tags\` RENAME TO \`pipeline_categories_services_tags\`;`)
  await db.run(sql`CREATE INDEX \`pipeline_categories_services_tags_order_idx\` ON \`pipeline_categories_services_tags\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pipeline_categories_services_tags_parent_id_idx\` ON \`pipeline_categories_services_tags\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_pipeline_categories_services\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`desc\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pipeline_categories\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_pipeline_categories_services\`("_order", "_parent_id", "id", "name", "desc") SELECT "_order", "_parent_id", "id", "name", "desc" FROM \`pipeline_categories_services\`;`)
  await db.run(sql`DROP TABLE \`pipeline_categories_services\`;`)
  await db.run(sql`ALTER TABLE \`__new_pipeline_categories_services\` RENAME TO \`pipeline_categories_services\`;`)
  await db.run(sql`CREATE INDEX \`pipeline_categories_services_order_idx\` ON \`pipeline_categories_services\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pipeline_categories_services_parent_id_idx\` ON \`pipeline_categories_services\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_pipeline_categories\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`category_id\` text NOT NULL,
  	\`title\` text NOT NULL,
  	\`video_id\` integer NOT NULL,
  	\`color\` text NOT NULL,
  	FOREIGN KEY (\`video_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pipeline\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_pipeline_categories\`("_order", "_parent_id", "id", "category_id", "title", "video_id", "color") SELECT "_order", "_parent_id", "id", "category_id", "title", "video_id", "color" FROM \`pipeline_categories\`;`)
  await db.run(sql`DROP TABLE \`pipeline_categories\`;`)
  await db.run(sql`ALTER TABLE \`__new_pipeline_categories\` RENAME TO \`pipeline_categories\`;`)
  await db.run(sql`CREATE INDEX \`pipeline_categories_order_idx\` ON \`pipeline_categories\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pipeline_categories_parent_id_idx\` ON \`pipeline_categories\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pipeline_categories_video_idx\` ON \`pipeline_categories\` (\`video_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_ready_to_talk_badges\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon\` text NOT NULL,
  	\`label\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`ready_to_talk\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_ready_to_talk_badges\`("_order", "_parent_id", "id", "icon", "label") SELECT "_order", "_parent_id", "id", "icon", "label" FROM \`ready_to_talk_badges\`;`)
  await db.run(sql`DROP TABLE \`ready_to_talk_badges\`;`)
  await db.run(sql`ALTER TABLE \`__new_ready_to_talk_badges\` RENAME TO \`ready_to_talk_badges\`;`)
  await db.run(sql`CREATE INDEX \`ready_to_talk_badges_order_idx\` ON \`ready_to_talk_badges\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`ready_to_talk_badges_parent_id_idx\` ON \`ready_to_talk_badges\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_ready_to_talk_prep_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon\` text NOT NULL,
  	\`label\` text NOT NULL,
  	\`desc\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`ready_to_talk\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_ready_to_talk_prep_items\`("_order", "_parent_id", "id", "icon", "label", "desc") SELECT "_order", "_parent_id", "id", "icon", "label", "desc" FROM \`ready_to_talk_prep_items\`;`)
  await db.run(sql`DROP TABLE \`ready_to_talk_prep_items\`;`)
  await db.run(sql`ALTER TABLE \`__new_ready_to_talk_prep_items\` RENAME TO \`ready_to_talk_prep_items\`;`)
  await db.run(sql`CREATE INDEX \`ready_to_talk_prep_items_order_idx\` ON \`ready_to_talk_prep_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`ready_to_talk_prep_items_parent_id_idx\` ON \`ready_to_talk_prep_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_home_page_media_void_lines\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	\`color\` text DEFAULT '#ffffff' NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_home_page_media_void_lines\`("_order", "_parent_id", "id", "text", "color") SELECT "_order", "_parent_id", "id", "text", "color" FROM \`home_page_media_void_lines\`;`)
  await db.run(sql`DROP TABLE \`home_page_media_void_lines\`;`)
  await db.run(sql`ALTER TABLE \`__new_home_page_media_void_lines\` RENAME TO \`home_page_media_void_lines\`;`)
  await db.run(sql`CREATE INDEX \`home_page_media_void_lines_order_idx\` ON \`home_page_media_void_lines\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_page_media_void_lines_parent_id_idx\` ON \`home_page_media_void_lines\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_home_page_industry_standards_phase2_morph_words\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`word\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_home_page_industry_standards_phase2_morph_words\`("_order", "_parent_id", "id", "word") SELECT "_order", "_parent_id", "id", "word" FROM \`home_page_industry_standards_phase2_morph_words\`;`)
  await db.run(sql`DROP TABLE \`home_page_industry_standards_phase2_morph_words\`;`)
  await db.run(sql`ALTER TABLE \`__new_home_page_industry_standards_phase2_morph_words\` RENAME TO \`home_page_industry_standards_phase2_morph_words\`;`)
  await db.run(sql`CREATE INDEX \`home_page_industry_standards_phase2_morph_words_order_idx\` ON \`home_page_industry_standards_phase2_morph_words\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_page_industry_standards_phase2_morph_words_parent_id_idx\` ON \`home_page_industry_standards_phase2_morph_words\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_home_page_trust_section_flagship_logos\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`logo_id\` integer NOT NULL,
  	FOREIGN KEY (\`logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_home_page_trust_section_flagship_logos\`("_order", "_parent_id", "id", "name", "logo_id") SELECT "_order", "_parent_id", "id", "name", "logo_id" FROM \`home_page_trust_section_flagship_logos\`;`)
  await db.run(sql`DROP TABLE \`home_page_trust_section_flagship_logos\`;`)
  await db.run(sql`ALTER TABLE \`__new_home_page_trust_section_flagship_logos\` RENAME TO \`home_page_trust_section_flagship_logos\`;`)
  await db.run(sql`CREATE INDEX \`home_page_trust_section_flagship_logos_order_idx\` ON \`home_page_trust_section_flagship_logos\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_page_trust_section_flagship_logos_parent_id_idx\` ON \`home_page_trust_section_flagship_logos\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`home_page_trust_section_flagship_logos_logo_idx\` ON \`home_page_trust_section_flagship_logos\` (\`logo_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_home_page_trust_section_marquee_clients\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`logo_id\` integer NOT NULL,
  	FOREIGN KEY (\`logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_home_page_trust_section_marquee_clients\`("_order", "_parent_id", "id", "name", "logo_id") SELECT "_order", "_parent_id", "id", "name", "logo_id" FROM \`home_page_trust_section_marquee_clients\`;`)
  await db.run(sql`DROP TABLE \`home_page_trust_section_marquee_clients\`;`)
  await db.run(sql`ALTER TABLE \`__new_home_page_trust_section_marquee_clients\` RENAME TO \`home_page_trust_section_marquee_clients\`;`)
  await db.run(sql`CREATE INDEX \`home_page_trust_section_marquee_clients_order_idx\` ON \`home_page_trust_section_marquee_clients\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_page_trust_section_marquee_clients_parent_id_idx\` ON \`home_page_trust_section_marquee_clients\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`home_page_trust_section_marquee_clients_logo_idx\` ON \`home_page_trust_section_marquee_clients\` (\`logo_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_home_page_reviews_testimonials\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`quote\` text NOT NULL,
  	\`name\` text NOT NULL,
  	\`role\` text NOT NULL,
  	\`company\` text NOT NULL,
  	\`rating\` numeric DEFAULT 5,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`home_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_home_page_reviews_testimonials\`("_order", "_parent_id", "id", "quote", "name", "role", "company", "rating") SELECT "_order", "_parent_id", "id", "quote", "name", "role", "company", "rating" FROM \`home_page_reviews_testimonials\`;`)
  await db.run(sql`DROP TABLE \`home_page_reviews_testimonials\`;`)
  await db.run(sql`ALTER TABLE \`__new_home_page_reviews_testimonials\` RENAME TO \`home_page_reviews_testimonials\`;`)
  await db.run(sql`CREATE INDEX \`home_page_reviews_testimonials_order_idx\` ON \`home_page_reviews_testimonials\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`home_page_reviews_testimonials_parent_id_idx\` ON \`home_page_reviews_testimonials\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_how_it_works_page_process_overview_timeline_steps\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`color\` text NOT NULL,
  	\`line\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`how_it_works_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_how_it_works_page_process_overview_timeline_steps\`("_order", "_parent_id", "id", "title", "color", "line") SELECT "_order", "_parent_id", "id", "title", "color", "line" FROM \`how_it_works_page_process_overview_timeline_steps\`;`)
  await db.run(sql`DROP TABLE \`how_it_works_page_process_overview_timeline_steps\`;`)
  await db.run(sql`ALTER TABLE \`__new_how_it_works_page_process_overview_timeline_steps\` RENAME TO \`how_it_works_page_process_overview_timeline_steps\`;`)
  await db.run(sql`CREATE INDEX \`how_it_works_page_process_overview_timeline_steps_order_idx\` ON \`how_it_works_page_process_overview_timeline_steps\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`how_it_works_page_process_overview_timeline_steps_parent_id_idx\` ON \`how_it_works_page_process_overview_timeline_steps\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_how_it_works_page_behind_the_scenes_stills\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer NOT NULL,
  	\`label\` text NOT NULL,
  	\`desc\` text NOT NULL,
  	\`span\` text DEFAULT 'normal',
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`how_it_works_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_how_it_works_page_behind_the_scenes_stills\`("_order", "_parent_id", "id", "image_id", "label", "desc", "span") SELECT "_order", "_parent_id", "id", "image_id", "label", "desc", "span" FROM \`how_it_works_page_behind_the_scenes_stills\`;`)
  await db.run(sql`DROP TABLE \`how_it_works_page_behind_the_scenes_stills\`;`)
  await db.run(sql`ALTER TABLE \`__new_how_it_works_page_behind_the_scenes_stills\` RENAME TO \`how_it_works_page_behind_the_scenes_stills\`;`)
  await db.run(sql`CREATE INDEX \`how_it_works_page_behind_the_scenes_stills_order_idx\` ON \`how_it_works_page_behind_the_scenes_stills\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`how_it_works_page_behind_the_scenes_stills_parent_id_idx\` ON \`how_it_works_page_behind_the_scenes_stills\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`how_it_works_page_behind_the_scenes_stills_image_idx\` ON \`how_it_works_page_behind_the_scenes_stills\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_how_it_works_page_process_walkthrough_phases\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`color\` text NOT NULL,
  	\`video_id\` integer NOT NULL,
  	\`description\` text NOT NULL,
  	FOREIGN KEY (\`video_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`how_it_works_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_how_it_works_page_process_walkthrough_phases\`("_order", "_parent_id", "id", "title", "color", "video_id", "description") SELECT "_order", "_parent_id", "id", "title", "color", "video_id", "description" FROM \`how_it_works_page_process_walkthrough_phases\`;`)
  await db.run(sql`DROP TABLE \`how_it_works_page_process_walkthrough_phases\`;`)
  await db.run(sql`ALTER TABLE \`__new_how_it_works_page_process_walkthrough_phases\` RENAME TO \`how_it_works_page_process_walkthrough_phases\`;`)
  await db.run(sql`CREATE INDEX \`how_it_works_page_process_walkthrough_phases_order_idx\` ON \`how_it_works_page_process_walkthrough_phases\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`how_it_works_page_process_walkthrough_phases_parent_id_idx\` ON \`how_it_works_page_process_walkthrough_phases\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`how_it_works_page_process_walkthrough_phases_video_idx\` ON \`how_it_works_page_process_walkthrough_phases\` (\`video_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_how_it_works_page_stats_band\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`value\` numeric NOT NULL,
  	\`suffix\` text,
  	\`label\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`how_it_works_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_how_it_works_page_stats_band\`("_order", "_parent_id", "id", "value", "suffix", "label") SELECT "_order", "_parent_id", "id", "value", "suffix", "label" FROM \`how_it_works_page_stats_band\`;`)
  await db.run(sql`DROP TABLE \`how_it_works_page_stats_band\`;`)
  await db.run(sql`ALTER TABLE \`__new_how_it_works_page_stats_band\` RENAME TO \`how_it_works_page_stats_band\`;`)
  await db.run(sql`CREATE INDEX \`how_it_works_page_stats_band_order_idx\` ON \`how_it_works_page_stats_band\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`how_it_works_page_stats_band_parent_id_idx\` ON \`how_it_works_page_stats_band\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_how_it_works_page_guarantees\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon\` text NOT NULL,
  	\`title\` text NOT NULL,
  	\`desc\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`how_it_works_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_how_it_works_page_guarantees\`("_order", "_parent_id", "id", "icon", "title", "desc") SELECT "_order", "_parent_id", "id", "icon", "title", "desc" FROM \`how_it_works_page_guarantees\`;`)
  await db.run(sql`DROP TABLE \`how_it_works_page_guarantees\`;`)
  await db.run(sql`ALTER TABLE \`__new_how_it_works_page_guarantees\` RENAME TO \`how_it_works_page_guarantees\`;`)
  await db.run(sql`CREATE INDEX \`how_it_works_page_guarantees_order_idx\` ON \`how_it_works_page_guarantees\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`how_it_works_page_guarantees_parent_id_idx\` ON \`how_it_works_page_guarantees\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_portfolio_index_page_portfolio_filters\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`portfolio_index_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_portfolio_index_page_portfolio_filters\`("_order", "_parent_id", "id", "name") SELECT "_order", "_parent_id", "id", "name" FROM \`portfolio_index_page_portfolio_filters\`;`)
  await db.run(sql`DROP TABLE \`portfolio_index_page_portfolio_filters\`;`)
  await db.run(sql`ALTER TABLE \`__new_portfolio_index_page_portfolio_filters\` RENAME TO \`portfolio_index_page_portfolio_filters\`;`)
  await db.run(sql`CREATE INDEX \`portfolio_index_page_portfolio_filters_order_idx\` ON \`portfolio_index_page_portfolio_filters\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`portfolio_index_page_portfolio_filters_parent_id_idx\` ON \`portfolio_index_page_portfolio_filters\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_contact_page_what_happens_next_badges\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon\` text NOT NULL,
  	\`label\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`contact_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_contact_page_what_happens_next_badges\`("_order", "_parent_id", "id", "icon", "label") SELECT "_order", "_parent_id", "id", "icon", "label" FROM \`contact_page_what_happens_next_badges\`;`)
  await db.run(sql`DROP TABLE \`contact_page_what_happens_next_badges\`;`)
  await db.run(sql`ALTER TABLE \`__new_contact_page_what_happens_next_badges\` RENAME TO \`contact_page_what_happens_next_badges\`;`)
  await db.run(sql`CREATE INDEX \`contact_page_what_happens_next_badges_order_idx\` ON \`contact_page_what_happens_next_badges\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`contact_page_what_happens_next_badges_parent_id_idx\` ON \`contact_page_what_happens_next_badges\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_contact_page_what_happens_next_steps\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon\` text NOT NULL,
  	\`step\` text NOT NULL,
  	\`title\` text NOT NULL,
  	\`desc\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`contact_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_contact_page_what_happens_next_steps\`("_order", "_parent_id", "id", "icon", "step", "title", "desc") SELECT "_order", "_parent_id", "id", "icon", "step", "title", "desc" FROM \`contact_page_what_happens_next_steps\`;`)
  await db.run(sql`DROP TABLE \`contact_page_what_happens_next_steps\`;`)
  await db.run(sql`ALTER TABLE \`__new_contact_page_what_happens_next_steps\` RENAME TO \`contact_page_what_happens_next_steps\`;`)
  await db.run(sql`CREATE INDEX \`contact_page_what_happens_next_steps_order_idx\` ON \`contact_page_what_happens_next_steps\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`contact_page_what_happens_next_steps_parent_id_idx\` ON \`contact_page_what_happens_next_steps\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_contact_page_stage_router_stages\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon\` text NOT NULL,
  	\`step\` text NOT NULL,
  	\`title\` text NOT NULL,
  	\`desc\` text NOT NULL,
  	\`cta_label\` text NOT NULL,
  	\`href\` text NOT NULL,
  	\`accent\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`contact_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_contact_page_stage_router_stages\`("_order", "_parent_id", "id", "icon", "step", "title", "desc", "cta_label", "href", "accent") SELECT "_order", "_parent_id", "id", "icon", "step", "title", "desc", "cta_label", "href", "accent" FROM \`contact_page_stage_router_stages\`;`)
  await db.run(sql`DROP TABLE \`contact_page_stage_router_stages\`;`)
  await db.run(sql`ALTER TABLE \`__new_contact_page_stage_router_stages\` RENAME TO \`contact_page_stage_router_stages\`;`)
  await db.run(sql`CREATE INDEX \`contact_page_stage_router_stages_order_idx\` ON \`contact_page_stage_router_stages\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`contact_page_stage_router_stages_parent_id_idx\` ON \`contact_page_stage_router_stages\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_contact_page_lead_form_badges\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon\` text NOT NULL,
  	\`label\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`contact_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_contact_page_lead_form_badges\`("_order", "_parent_id", "id", "icon", "label") SELECT "_order", "_parent_id", "id", "icon", "label" FROM \`contact_page_lead_form_badges\`;`)
  await db.run(sql`DROP TABLE \`contact_page_lead_form_badges\`;`)
  await db.run(sql`ALTER TABLE \`__new_contact_page_lead_form_badges\` RENAME TO \`contact_page_lead_form_badges\`;`)
  await db.run(sql`CREATE INDEX \`contact_page_lead_form_badges_order_idx\` ON \`contact_page_lead_form_badges\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`contact_page_lead_form_badges_parent_id_idx\` ON \`contact_page_lead_form_badges\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_contact_page_contact_methods_badges\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`icon\` text NOT NULL,
  	\`label\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`contact_page\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_contact_page_contact_methods_badges\`("_order", "_parent_id", "id", "icon", "label") SELECT "_order", "_parent_id", "id", "icon", "label" FROM \`contact_page_contact_methods_badges\`;`)
  await db.run(sql`DROP TABLE \`contact_page_contact_methods_badges\`;`)
  await db.run(sql`ALTER TABLE \`__new_contact_page_contact_methods_badges\` RENAME TO \`contact_page_contact_methods_badges\`;`)
  await db.run(sql`CREATE INDEX \`contact_page_contact_methods_badges_order_idx\` ON \`contact_page_contact_methods_badges\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`contact_page_contact_methods_badges_parent_id_idx\` ON \`contact_page_contact_methods_badges\` (\`_parent_id\`);`)
}
