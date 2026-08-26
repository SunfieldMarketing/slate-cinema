import * as migration_20260819_203145_initial_schema_baseline from './20260819_203145_initial_schema_baseline';
import * as migration_20260819_203226_add_api_key_auth from './20260819_203226_add_api_key_auth';
import * as migration_20260819_231231_add_portfolio_video_vimeo_url from './20260819_231231_add_portfolio_video_vimeo_url';
import * as migration_20260820_233310_add_drafts_versions_live_preview from './20260820_233310_add_drafts_versions_live_preview';
import * as migration_20260821_214210_add_s3_media_prefix from './20260821_214210_add_s3_media_prefix';
import * as migration_20260822_062619_add_vimeo_hookups from './20260822_062619_add_vimeo_hookups';
import * as migration_20260824_000000_add_trust_banner from './20260824_000000_add_trust_banner';
import * as migration_20260826_130000_add_privacy_terms_thankyou_smm_pages from './20260826_130000_add_privacy_terms_thankyou_smm_pages';
import * as migration_20260826_140000_publish_new_pages from './20260826_140000_publish_new_pages';

export const migrations = [
  {
    up: migration_20260819_203145_initial_schema_baseline.up,
    down: migration_20260819_203145_initial_schema_baseline.down,
    name: '20260819_203145_initial_schema_baseline',
  },
  {
    up: migration_20260819_203226_add_api_key_auth.up,
    down: migration_20260819_203226_add_api_key_auth.down,
    name: '20260819_203226_add_api_key_auth',
  },
  {
    up: migration_20260819_231231_add_portfolio_video_vimeo_url.up,
    down: migration_20260819_231231_add_portfolio_video_vimeo_url.down,
    name: '20260819_231231_add_portfolio_video_vimeo_url',
  },
  {
    up: migration_20260820_233310_add_drafts_versions_live_preview.up,
    down: migration_20260820_233310_add_drafts_versions_live_preview.down,
    name: '20260820_233310_add_drafts_versions_live_preview',
  },
  {
    up: migration_20260821_214210_add_s3_media_prefix.up,
    down: migration_20260821_214210_add_s3_media_prefix.down,
    name: '20260821_214210_add_s3_media_prefix',
  },
  {
    up: migration_20260822_062619_add_vimeo_hookups.up,
    down: migration_20260822_062619_add_vimeo_hookups.down,
    name: '20260822_062619_add_vimeo_hookups'
  },
  {
    up: migration_20260824_000000_add_trust_banner.up,
    down: migration_20260824_000000_add_trust_banner.down,
    name: '20260824_000000_add_trust_banner',
  },
  {
    up: migration_20260826_130000_add_privacy_terms_thankyou_smm_pages.up,
    down: migration_20260826_130000_add_privacy_terms_thankyou_smm_pages.down,
    name: '20260826_130000_add_privacy_terms_thankyou_smm_pages',
  },
  {
    up: migration_20260826_140000_publish_new_pages.up,
    down: migration_20260826_140000_publish_new_pages.down,
    name: '20260826_140000_publish_new_pages',
  },
];
