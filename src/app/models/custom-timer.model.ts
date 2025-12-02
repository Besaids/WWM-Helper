// src/app/models/custom-timer.model.ts

import { TimerSchedule } from './timer-definition.model';
import { EventTimerCategory } from './event-timer.model';

/**
 * Type of custom timer - determines which form fields to show
 */
export type CustomTimerType = 'recurring' | 'event';

/**
 * User-created custom timer definition
 */
export interface CustomTimerDefinition {
  id: string; // UUID generated on creation
  type: CustomTimerType;
  label: string;
  shortLabel: string;
  icon: string;
  summary?: string; // Optional user description

  // For recurring timers
  schedule?: TimerSchedule;

  // For event timers
  endsAt?: string; // ISO date string
  category?: EventTimerCategory;

  // Metadata
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  isCustom: true; // Flag to identify custom timers
}

/**
 * Storage structure for custom timers
 */
export interface CustomTimersStorage {
  version: number;
  timers: CustomTimerDefinition[];
}

/**
 * Form data for creating/editing custom timers
 */
export interface CustomTimerFormData {
  type: CustomTimerType;
  label: string;
  shortLabel: string;
  icon: string;
  summary?: string;

  // Recurring timer fields
  scheduleType?:
    | 'daily'
    | 'weekly'
    | 'daily-multi'
    | 'weekly-multi'
    | 'weekly-times'
    | 'weekly-range';

  // Daily schedule
  dailyHour?: number;
  dailyMinute?: number;

  // Weekly schedule
  weeklyWeekday?: number;
  weeklyHour?: number;
  weeklyMinute?: number;

  // Daily-multi schedule
  dailyMultiTimes?: { hour: number; minute: number }[];
  dailyMultiWindowHours?: number;

  // Weekly-multi schedule
  weeklyMultiWeekdays?: number[];
  weeklyMultiHour?: number;
  weeklyMultiMinute?: number;

  // Weekly-times schedule
  weeklyTimeSlots?: { weekday: number; hour: number; minute: number }[];

  // Weekly-range schedule
  weeklyRangeOpenWeekday?: number;
  weeklyRangeOpenHour?: number;
  weeklyRangeOpenMinute?: number;
  weeklyRangeCloseWeekday?: number;
  weeklyRangeCloseHour?: number;
  weeklyRangeCloseMinute?: number;

  // Event timer fields
  eventEndsAt?: Date | null;
  eventCategory?: EventTimerCategory;
}

/**
 * Validation limits to prevent UI breaking
 */
export const CUSTOM_TIMER_LIMITS = {
  LABEL_MAX_LENGTH: 40, // Based on "Fireworks – Festival (Red Envelopes)" = 39 chars
  LABEL_MIN_LENGTH: 3,
  SHORT_LABEL_MAX_LENGTH: 15,
  SHORT_LABEL_MIN_LENGTH: 2,
  SUMMARY_MAX_LENGTH: 250,
  MAX_DAILY_MULTI_TIMES: 6,
  MAX_WEEKLY_TIMES: 7,
} as const;
