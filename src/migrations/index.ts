import * as migration_20260819_203145_initial_schema_baseline from './20260819_203145_initial_schema_baseline';
import * as migration_20260819_203226_add_api_key_auth from './20260819_203226_add_api_key_auth';
import * as migration_20260819_231231_add_portfolio_video_vimeo_url from './20260819_231231_add_portfolio_video_vimeo_url';
import * as migration_20260820_233310_add_drafts_versions_live_preview from './20260820_233310_add_drafts_versions_live_preview';

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
    name: '20260820_233310_add_drafts_versions_live_preview'
  },
];
