/**
 * Multi-Day One-Time Rewards Guide Configuration
 *
 * This file defines all activities that require multiple days of effort
 * to unlock permanent rewards (cosmetics, stats, etc.).
 * Extend this array to add new activities to the guide.
 */

export type MultiDayActivityId = 'bathhouse' | 'mirror' | 'well-of-heaven' | string;

export interface MultiDayStep {
  id: string;
  title: string;
  body: string;
  image: string;
  alt: string;
  caption?: string;
}

export interface MultiDayActivity {
  id: MultiDayActivityId;
  label: string;
  tabLabel: string;
  rewardSummary: string;
  location: string;
  requirement?: string;
  daysRequired: string;
  perDayLimit: string;
  consecutive: boolean;
  checklistId?: string;
  checklistLabel?: string;
  steps: MultiDayStep[];
}

const ASSETS_BASE = 'assets/guides/multi-day-one-time-rewards';

export const MULTI_DAY_ACTIVITIES: MultiDayActivity[] = [
  {
    id: 'bathhouse',
    label: 'Springwave Bathhouse Massages',
    tabLabel: 'Bathhouse Robe (Springwave Pavilion)',
    rewardSummary:
      '"Bathrobe: Golden Threads" cosmetic outfit, plus daily Coins, character XP, and Adventure Slips.',
    location: 'Springwave Pavilion (Kaifeng)',
    requirement: 'Online Mode enabled (multiplayer activity)',
    daysRequired: '10 consecutive days',
    perDayLimit: '1 massage given per day counts toward the achievement',
    consecutive: true,
    checklistId: 'daily-baths',
    checklistLabel: 'Visit Springwave Pavilion baths (Kaifeng).',
    steps: [
      {
        id: 'bathhouse-teleport',
        title: '1. Teleport to Springwave Pavilion',
        body: 'Open your map and navigate to Kaifeng. Teleport to the waypoint near the Springwave Pavilion. Note: This is a multiplayer activity, so you must be in Online Mode.',
        image: `${ASSETS_BASE}/massage-teleport-location.png`,
        alt: 'World map showing teleport location near Springwave Pavilion in Kaifeng',
        caption:
          'Teleport to this location in Kaifeng. Make sure Online Mode is enabled before proceeding.',
      },
      {
        id: 'bathhouse-location',
        title: '2. Find Springwave Pavilion',
        body: 'After teleporting, head toward the Springwave Pavilion building marked on your map.',
        image: `${ASSETS_BASE}/massage-location.png`,
        alt: 'Map view with Springwave Pavilion location highlighted',
        caption: 'Springwave Pavilion location on the map.',
      },
      {
        id: 'bathhouse-exterior',
        title: '3. Enter the building',
        body: 'Look for the entrance to Springwave Pavilion. The door will have a distinctive appearance.',
        image: `${ASSETS_BASE}/massage-location-view.png`,
        alt: 'Exterior view of Springwave Pavilion building entrance',
        caption: 'The entrance to Springwave Pavilion.',
      },
      {
        id: 'bathhouse-robes',
        title: '4. Change into a bathrobe',
        body: "Inside, you'll find two changing rooms with NPCs. The left (pink) room is for female characters, the right (blue) room is for male characters.",
        image: `${ASSETS_BASE}/massage-location-bathrobes.png`,
        alt: 'Interior showing two changing rooms with NPCs',
        caption: 'Left room (pink) for female, right room (blue) for male characters.',
      },
      {
        id: 'bathhouse-robes-interact',
        title: '5. Interact with the changing Object',
        body: 'Walk up to the appropriate Object and interact to change into a bathrobe.',
        image: `${ASSETS_BASE}/massage-location-bathrobes-female.png`,
        alt: 'Close-up of where to interact to change into bathrobe',
        caption: 'Interact here to change into your bathrobe.',
      },
      {
        id: 'bathhouse-teleported',
        title: '6. Bathhouse room',
        body: "After changing, you'll be teleported upstairs to the bathhouse room where massages take place.",
        image: `${ASSETS_BASE}/massage-location-bathrobes-teleported.png`,
        alt: 'The bathhouse room after being teleported upstairs',
        caption: 'The bathhouse room where you can give and receive massages.',
      },
      {
        id: 'bathhouse-receive',
        title: '7. Receiving a massage (does NOT count)',
        body: 'You can lie on a massage bed to receive a massage from another player. However, receiving massages does NOT advance your Golden Guest achievement progress.',
        image: `${ASSETS_BASE}/massage-receive.png`,
        alt: 'Character lying on a massage bed receiving a massage',
        caption: 'Receiving a massage – relaxing, but does not count toward the 10-day streak.',
      },
      {
        id: 'bathhouse-receive-tip',
        title: '8. Tipping after receiving',
        body: 'When you receive a massage, a chat message appears with a "Tip" button. Press it to tip the masseur.',
        image: `${ASSETS_BASE}/massage-receive-reward.png`,
        alt: 'Chat window showing Tip button after receiving massage',
        caption: 'Press "Tip" to reward the player who gave you a massage.',
      },
      {
        id: 'bathhouse-receive-complete',
        title: '9. Tip sent',
        body: "After pressing Tip, you'll see a confirmation in chat.",
        image: `${ASSETS_BASE}/massage-receive-reward-complete.png`,
        alt: 'Chat confirmation after tipping',
        caption: 'Tip successfully sent.',
      },
      {
        id: 'bathhouse-receive-progression',
        title: '10. Receiving does NOT advance the streak',
        body: 'Check your Golden Guest achievement – notice that receiving massages does not increment the day counter.',
        image: `${ASSETS_BASE}/massage-reward-receive-progression.png`,
        alt: 'Golden Guest achievement showing no progress increase from receiving',
        caption: 'Golden Guest achievement after receiving – the counter did NOT increase.',
      },
      {
        id: 'bathhouse-give',
        title: '11. Giving a massage (COUNTS!)',
        body: 'To give a massage, find another player lying on a bed and interact with them. This is what counts toward your 10-day streak.',
        image: `${ASSETS_BASE}/massage-give.png`,
        alt: 'Player giving a massage to another player',
        caption: 'Giving a massage to another player – THIS counts toward the 10-day streak.',
      },
      {
        id: 'bathhouse-give-reward',
        title: '12. Claiming your reward',
        body: 'After giving a massage, when the other player tips you, you\'ll see a "Claim Reward" button in chat.',
        image: `${ASSETS_BASE}/massage-give-reward.png`,
        alt: 'Chat window showing Claim Reward button after giving massage',
        caption: 'Press "Claim Reward" to receive your tip and daily rewards.',
      },
      {
        id: 'bathhouse-give-complete',
        title: '13. Reward claimed',
        body: 'After claiming, you receive Coins, XP, and Adventure Slips.',
        image: `${ASSETS_BASE}/massage-give-reward-complete.png`,
        alt: 'Chat confirmation after claiming reward',
        caption: 'Rewards successfully claimed.',
      },
      {
        id: 'bathhouse-give-progression',
        title: '14. Day counter increases',
        body: 'Check your Golden Guest achievement again – the counter has now increased. Complete this for 10 consecutive days to unlock the "Bathrobe: Golden Threads" outfit. Missing a single day will reset your progress!',
        image: `${ASSETS_BASE}/massage-reward-give-progression.png`,
        alt: 'Golden Guest achievement showing progress increased after giving massage',
        caption:
          'Golden Guest achievement after giving – the day counter increased! Keep the streak going for 10 days.',
      },
    ],
  },
  {
    id: 'mirror',
    label: 'Home Mirror Hair Combing',
    tabLabel: 'Mirror Hairstyles (Player Home)',
    rewardSummary: '~13 free hairstyles (2 per day); one-time unlock set.',
    location: 'Player home, bedroom mirror',
    daysRequired: '~7 days',
    perDayLimit: '2 hairstyles per day',
    consecutive: false,
    checklistId: 'daily-home-hair-combing',
    checklistLabel: 'Comb hair at your home mirror (free hairstyles).',
    steps: [
      {
        id: 'mirror-teleport',
        title: '1. Teleport to your house',
        body: "Open your map and look for the teleport marker near your character's home. The house should be visible on the map.",
        image: `${ASSETS_BASE}/comb-hair-teleport-location-and-marker.png`,
        alt: 'World map showing teleport location and marker for player home',
        caption: 'Teleport to the waypoint near your home and look for the house marker.',
      },
      {
        id: 'mirror-direction',
        title: '2. Find your house',
        body: 'After teleporting, orient yourself toward the marker on your minimap. Walk toward your house.',
        image: `${ASSETS_BASE}/comb-hair-view-location-of-the-marker.png`,
        alt: 'In-world view showing direction to the house marker',
        caption: 'Face this direction to find your home.',
      },
      {
        id: 'mirror-exterior',
        title: '3. Locate the house',
        body: 'Your house has a distinctive appearance. Walk up to it and enter.',
        image: `${ASSETS_BASE}/comb-hair-house-view.png`,
        alt: "Exterior view of the player's house",
        caption: "Your character's home – enter to access the mirror.",
      },
      {
        id: 'mirror-interact',
        title: '4. Interact with the golden mirror',
        body: "Inside your house, find the golden mirror in the bedroom. Interact with it to comb your hair and unlock 2 new hairstyles. You can do this once per day until you've unlocked all ~13 hairstyles (about 7 days of visits).",
        image: `${ASSETS_BASE}/comb-hair-mirror-to-interact-with.png`,
        alt: 'Close-up of the golden mirror to interact with',
        caption:
          'The golden mirror – interact daily to unlock 2 hairstyles at a time until you have them all.',
      },
    ],
  },
  {
    id: 'well-of-heaven',
    label: 'Well of Heaven Special Training',
    tabLabel: 'Well of Heaven (+10 Constitution)',
    rewardSummary: '+1 Constitution per day from Slogan Snatches (up to +10 total).',
    location: "Qinghe – West Heaven's Pier (Well of Heaven Special Training)",
    daysRequired: '10 days',
    perDayLimit: '+1 Constitution for completing 2 Slogan Snatches per day (Additional Rewards)',
    consecutive: false,
    checklistId: 'daily-well-of-heaven-training',
    checklistLabel: 'Well of Heaven Special Training (+1 Constitution).',
    steps: [
      {
        id: 'woh-entry',
        title: '1. Enter the event (Solo recommended)',
        body: 'You can start Well of Heaven Special Training either in the open world at West Heaven\'s Pier or via Wandering Paths → Casual Co-op → Adventure → "Well of Heaven Special Training". For farming Constitution, run it in Solo World so you do not compete with other players for the slogan snatch quick time event.',
        image: `${ASSETS_BASE}/well-of-heaven-special-training-casual-coop-adventure.png`,
        alt: 'Menu view with Well of Heaven Special Training highlighted',
        caption: 'Any entry works; Solo World is safest for consistent Slogan Snatches.',
      },
      {
        id: 'woh-spawn',
        title: '2. Spawn location and running line',
        body: "After entering you'll spawn by the training track at West Heaven's Pier. Follow the group and merge into the running line; the event is simply running laps while watching for slogan shout prompts.",
        image: `${ASSETS_BASE}/well-of-heaven-special-training-spawned-path.png`,
        alt: "Spawn point at West Heaven's Pier with runners lined up",
        caption: 'Join the running group and get ready for slogan shouts.',
      },
      {
        id: 'woh-objectives',
        title: '3. Basic objectives vs Additional Rewards',
        body: 'The HUD on the left shows the basic objectives (Training Laps and Slogan Shouts) and an "Additional Rewards" section for Slogan Snatches. Clearing only the basic objectives grants a one-time Constitution reward; the repeatable +10 Constitution comes specifically from Slogan Snatches.',
        image: `${ASSETS_BASE}/well-of-heaven-special-training-objectives.png`,
        alt: 'HUD with Special Training Goal and objectives listed',
        caption: 'Pay attention to the Additional Rewards → Slogan Snatches line.',
      },
      {
        id: 'woh-mode-guide',
        title: '4. Mode Guide: what gives Constitution',
        body: 'The Mode Guide explains the rules: run 2 laps and shout a slogan 4 times for normal rewards, and "lead the slogan shouting 2 times" to receive 1 Physique (Constitution), up to 10 times total. This is exactly what the Slogan Snatches objective tracks.',
        image: `${ASSETS_BASE}/well-of-heaven-special-training-extra-info.png`,
        alt: 'Mode Guide panel describing laps, shouts, and Physique reward',
        caption: 'Physique is tied to leading the slogan twice per day (Slogan Snatches).',
      },
      {
        id: 'woh-slogan-snatches',
        title: '5. Performing Slogan Snatches (0/2 → 2/2)',
        body: 'When the bottom prompt says "Next chant rush begins in Xs", get ready. Type your slogan into the text box and confirm as soon as the response window opens. Each time you successfully lead the chant it increments "Slogan Snatches" in the Additional Rewards section; you need 2/2 in a single run.',
        image: `${ASSETS_BASE}/well-of-heaven-special-training-slogan-snatches.png`,
        alt: 'On-screen prompt and HUD showing Slogan Snatches 1/2',
        caption: 'Type and send a slogan during the chant rush to count as a Slogan Snatch.',
      },
      {
        id: 'woh-slogan-snatches-reward',
        title: '6. Slogan Snatches reward screen',
        body: 'At the end of the run, the result screen will show "Additional Rewards → Slogan Snatches 2 time(s)" when you successfully led two chants. This is what grants +1 Constitution for that day.',
        image: `${ASSETS_BASE}/well-of-heaven-special-training-slogan-snatches-reward.png`,
        alt: 'Completion screen showing Slogan Snatches 2 times under Additional Rewards',
        caption:
          'Confirm that Slogan Snatches shows 2 time(s) to lock in the daily +1 Constitution.',
      },
      {
        id: 'woh-completion',
        title: '7. Track your progress to +10',
        body: 'Each day that you reach 2/2 Slogan Snatches you gain +1 Constitution, up to 10 times total. Days do not need to be consecutive; just repeat the activity on any 10 days, prioritising Solo World runs so you can reliably secure both Slogan Snatches. The Constitution shown here is always the misleading one-time reward that always shows at the end of the event.',
        image: `${ASSETS_BASE}/well-of-heaven-special-training-completion.png`,
        alt: 'Completion screen for Well of Heaven Special Training',
        caption:
          'Repeat on 10 separate days with 2/2 Slogan Snatches for the full +10 Constitution.',
      },
    ],
  },
];
