import { GameAssetDefinition } from '../../models';
import { CURRENCY_ASSETS } from './game-assets.currency';
import { GATHERING_ASSETS } from './game-assets.gathering';
import { INNER_WAY_ASSETS } from './game-assets.inner_way';
import { ITEMS_ASSETS } from './game-assets.items';
import { MYSTIC_SKILL_ASSETS } from './game-assets.mystic_skill';
import { NAVIGATION_ASSETS } from './game-assets.navigation';
import { SECT_PATHS_ASSETS } from './game-assets.sect_paths';
import { SYSTEM_ASSETS } from './game-assets.system';

export const GAME_ASSETS: GameAssetDefinition[] = [
  ...CURRENCY_ASSETS,
  ...GATHERING_ASSETS,
  ...INNER_WAY_ASSETS,
  ...ITEMS_ASSETS,
  ...MYSTIC_SKILL_ASSETS,
  ...NAVIGATION_ASSETS,
  ...SECT_PATHS_ASSETS,
  ...SYSTEM_ASSETS,
];
