import { categories } from '@/lib/pipeline-data'

/*
  Single source of truth for the hero's scroll geography — the orchestrator
  (master GSAP timeline), the 3D stage (object choreography), and the ring
  HUD (lit segment) all read from here, so they cannot drift out of sync.
  Units are GSAP timeline duration units; TOTAL_UNITS spans the whole
  runway (RANGE_MULTIPLIER viewports of scroll).
*/

export const RANGE_MULTIPLIER = 6
export const TOTAL_UNITS = 13.5
export const INTRO_EXIT = 0.8
export const SCENE_ENTERS = [1.8, 4.2, 6.8, 9.4]
export const SCENE_EXITS = [4.4, 7.0, 9.6, 11.8]
export const CTA_ENTER = 11.9

export const SCENE_CLASSES = ['sb-scene-pre', 'sb-scene-prod', 'sb-scene-post', 'sb-scene-dist']

export const SCENES = categories.map((c, i) => ({
  cls: SCENE_CLASSES[i],
  number: String(i + 1).padStart(2, '0'),
  title: c.title,
  line: c.services[0]?.tags?.[0] ?? c.services[0]?.desc ?? '',
  color: c.color,
}))

/*
  The six shipped models — all downloaded by the user from Sketchfab under
  CC Attribution (except where noted), then draco+webp compressed via
  gltf-transform (69 MB of source -> ~4 MB shipped). Credits are rendered
  in the site footer; keep MODEL_CREDITS in sync if a model is swapped.
*/
export const MODELS = {
  corkboard: '/models/corkboard.glb', // 5 parts (board, paper, photo, pin, sticky note) — the mood board, hero of Pre-Production
  clapperboard: '/models/clapperboard.glb', // 11 parts + authored clap animation — hero of Production
  studio: '/models/studio.glb', // 463 parts, dim Production backdrop
  workstation: '/models/workstation.glb', // 685 parts — the big staggered assemble
  phone: '/models/phone.glb', // 13 parts
}

export const MODEL_CREDITS =
  '3D models: "Corkboard" by XIN, "Black film slate or clapperboard" by Bendar Multimedia, "Studio Setup" by Render Blue, "Gaming Desktop PC" by Yolala3D, "Smartphone Highpoly" by OrbArts — via Sketchfab, CC Attribution 4.0'
