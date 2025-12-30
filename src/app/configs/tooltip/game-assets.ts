import { GameAssetDefinition } from '../../models';
import { CURRENCY_ASSETS } from './game-assets.currency';
import { GATHERING_ASSETS } from './game-assets.gathering';
import { GEAR_ENHANCE_ASSETS } from './game-assets.gear_enhance';
import { INNER_WAY_ASSETS } from './game-assets.inner_way';
import { ITEMS_ASSETS } from './game-assets.items';
import { MARTIAL_ARTS_ASSETS } from './game-assets.martial_arts';
import { MYSTIC_SKILL_ASSETS } from './game-assets.mystic_skill';
import { NAVIGATION_ASSETS } from './game-assets.navigation';
import { SECT_PATHS_ASSETS } from './game-assets.sect_paths';
import { SYSTEM_ASSETS } from './game-assets.system';

export const GAME_ASSETS: GameAssetDefinition[] = [
  ...CURRENCY_ASSETS,
  ...GATHERING_ASSETS,
  ...INNER_WAY_ASSETS,
  ...ITEMS_ASSETS,
  ...MARTIAL_ARTS_ASSETS,
  ...GEAR_ENHANCE_ASSETS,
  ...MYSTIC_SKILL_ASSETS,
  ...NAVIGATION_ASSETS,
  ...SECT_PATHS_ASSETS,
  ...SYSTEM_ASSETS,
];
