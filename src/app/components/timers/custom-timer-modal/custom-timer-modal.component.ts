// src/app/components/timers/custom-timer-modal/custom-timer-modal.component.ts

import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  signal,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  CustomTimerDefinition,
  CustomTimerFormData,
  CUSTOM_TIMER_LIMITS,
  EventTimerCategory,
  TimerSchedule,
} from '../../../models';
import { CustomTimerService } from '../../../services';

type FormStep = 'type' | 'basic' | 'schedule' | 'review';

interface TimeSlot {
  hour: number;
  minute: number;
}

interface WeeklyTimeSlot extends TimeSlot {
  weekday: number;
}

@Component({
  selector: 'app-custom-timer-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './custom-timer-modal.component.html',
  styleUrls: ['./custom-timer-modal.component.scss'],
})
export class CustomTimerModalComponent implements OnInit, OnChanges {
  private readonly customTimerService = inject(CustomTimerService);
  @Input() isOpen = false;
  @Input() editingTimer?: CustomTimerDefinition;
  @Output() closeModal = new EventEmitter<void>();
  @Output() save = new EventEmitter<CustomTimerFormData>();

  // Expose limits to template
  readonly limits = CUSTOM_TIMER_LIMITS;

  // Detect user's UTC offset
  readonly userUtcOffset = signal<number>(this.getUserUtcOffset());

  // Form state
  readonly currentStep = signal<FormStep>('type');
  readonly formData = signal<Partial<CustomTimerFormData>>({});

  // Icon options (curated list of suitable Bootstrap icons)
  readonly iconOptions = [
    { value: 'bi-alarm', label: 'Alarm' },
    { value: 'bi-bell', label: 'Bell' },
    { value: 'bi-calendar-event', label: 'Calendar Event' },
    { value: 'bi-calendar-check', label: 'Calendar Check' },
    { value: 'bi-calendar-x', label: 'Calendar X' },
    { value: 'bi-clock', label: 'Clock' },
    { value: 'bi-clock-history', label: 'Clock History' },
    { value: 'bi-stopwatch', label: 'Stopwatch' },
    { value: 'bi-hourglass', label: 'Hourglass' },
    { value: 'bi-hourglass-split', label: 'Hourglass Split' },
    { value: 'bi-flag', label: 'Flag' },
    { value: 'bi-flag-fill', label: 'Flag Fill' },
    { value: 'bi-star', label: 'Star' },
    { value: 'bi-star-fill', label: 'Star Fill' },
    { value: 'bi-trophy', label: 'Trophy' },
    { value: 'bi-trophy-fill', label: 'Trophy Fill' },
    { value: 'bi-gem', label: 'Gem' },
    { value: 'bi-gift', label: 'Gift' },
    { value: 'bi-gift-fill', label: 'Gift Fill' },
    { value: 'bi-lightning', label: 'Lightning' },
    { value: 'bi-lightning-fill', label: 'Lightning Fill' },
    { value: 'bi-moon-stars', label: 'Moon & Stars' },
    { value: 'bi-moon-stars-fill', label: 'Moon & Stars Fill' },
    { value: 'bi-sunrise', label: 'Sunrise' },
    { value: 'bi-sunrise-fill', label: 'Sunrise Fill' },
    { value: 'bi-sunset', label: 'Sunset' },
    { value: 'bi-sunset-fill', label: 'Sunset Fill' },
    { value: 'bi-bookmark', label: 'Bookmark' },
    { value: 'bi-bookmark-fill', label: 'Bookmark Fill' },
    { value: 'bi-pin-angle', label: 'Pin' },
    { value: 'bi-pin-angle-fill', label: 'Pin Fill' },
    { value: 'bi-heart', label: 'Heart' },
    { value: 'bi-heart-fill', label: 'Heart Fill' },
    { value: 'bi-shield', label: 'Shield' },
    { value: 'bi-shield-fill', label: 'Shield Fill' },
    { value: 'bi-balloon', label: 'Balloon' },
    { value: 'bi-balloon-fill', label: 'Balloon Fill' },
    { value: 'bi-fire', label: 'Fire' },
    { value: 'bi-dice-6', label: 'Dice' },
    { value: 'bi-dice-6-fill', label: 'Dice Fill' },
  ];

  // Event category options
  readonly categoryOptions: { value: EventTimerCategory; label: string }[] = [
    { value: 'battle-pass', label: 'Battle Pass' },
    { value: 'season', label: 'Season' },
    { value: 'gacha-standard', label: 'Gacha Banner' },
    { value: 'gacha-special', label: 'Special Gacha' },
    { value: 'limited-event', label: 'Limited Event' },
    { value: 'other', label: 'Other' },
  ];

  // Schedule type options
  readonly scheduleTypeOptions = [
    { value: 'daily', label: 'Daily - Single time each day', example: 'Daily Reset (21:00)' },
    {
      value: 'weekly',
      label: 'Weekly - Single time each week',
      example: 'Weekly Reset (Sun 21:00)',
    },
    {
      value: 'daily-multi',
      label: 'Daily Multiple - Multiple times per day',
      example: 'Arena 1v1 (10:00, 22:00)',
    },
    {
      value: 'weekly-multi',
      label: 'Weekly Multiple - Same time on multiple weekdays',
      example: 'Fireworks Show (Fri & Sat 20:30)',
    },
    {
      value: 'weekly-times',
      label: 'Weekly Times - Different times on different weekdays',
      example: 'Festival (Sat 12:30, Sun 00:30)',
    },
    {
      value: 'weekly-range',
      label: 'Weekly Range - Open/close window',
      example: 'Fireworks Bidding (Mon 01:00 - Fri 13:00)',
    },
  ];

  readonly weekdayOptions = [
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' },
    { value: 7, label: 'Sunday' },
  ];

  readonly hourOptions = Array.from({ length: 24 }, (_, i) => i);
  readonly minuteOptions = [0, 15, 30, 45];
  readonly isIconPickerExpanded = signal(false);

  // Temporary arrays for multi-time schedules
  dailyMultiSlots = signal<TimeSlot[]>([{ hour: 0, minute: 0 }]);
  weeklyTimeSlots = signal<WeeklyTimeSlot[]>([{ weekday: 1, hour: 0, minute: 0 }]);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']) {
      if (this.isOpen) {
        // Modal opened - lock scroll and load form
        this.lockScroll();
        if (this.editingTimer) {
          // Load existing timer for editing
          this.loadExistingTimer(this.editingTimer);
        } else {
          // Create new timer - reset form
          this.resetForm();
        }
      } else {
        // Modal closed - unlock scroll
        this.unlockScroll();
      }
    }

    // Also handle editingTimer changes when modal is already open
    if (changes['editingTimer'] && this.isOpen && this.editingTimer) {
      this.loadExistingTimer(this.editingTimer);
    }
  }

  ngOnInit(): void {
    if (this.editingTimer) {
      this.loadExistingTimer(this.editingTimer);
    } else {
      this.resetForm();
    }
  }

  private getUserUtcOffset(): number {
    // Get user's timezone offset in minutes, then convert to hours
    const offsetMinutes = new Date().getTimezoneOffset();
    // Note: getTimezoneOffset returns offset as UTC - local, so we negate it
    return -offsetMinutes / 60;
  }

  private generateShortLabel(label: string): string {
    // Remove extra whitespace and trim
    const cleaned = label.trim().replace(/\s+/g, ' ');

    // If it's already short enough, return as-is (no spaces)
    if (cleaned.length <= CUSTOM_TIMER_LIMITS.SHORT_LABEL_MAX_LENGTH) {
      return cleaned.replace(/\s/g, '');
    }

    // Try to create an acronym from words
    const words = cleaned.split(' ');
    if (words.length > 1) {
      const acronym = words
        .map((w) => w[0])
        .join('')
        .toUpperCase();
      if (acronym.length <= CUSTOM_TIMER_LIMITS.SHORT_LABEL_MAX_LENGTH) {
        return acronym;
      }
    }

    // Fall back to truncating and removing spaces
    return cleaned.replace(/\s/g, '').substring(0, CUSTOM_TIMER_LIMITS.SHORT_LABEL_MAX_LENGTH);
  }

  private checkDuplicateLabel(): string | null {
    const currentLabel = this.formData().label?.trim().toLowerCase();
    if (!currentLabel) return null;

    const existingTimers = this.customTimerService.getAll();
    const editing = this.editingTimer;

    const duplicate = existingTimers.find(
      (t) => t.label.trim().toLowerCase() === currentLabel && t.id !== editing?.id,
    );

    if (duplicate) {
      return `A timer named "${duplicate.label}" already exists. Please choose a different name.`;
    }

    return null;
  }

  getDuplicateLabelError(): string | null {
    return this.checkDuplicateLabel();
  }

  private lockScroll(): void {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
  }

  private unlockScroll(): void {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  }

  toggleIconPicker(): void {
    this.isIconPickerExpanded.update((v) => !v);
  }

  // Step navigation
  goToStep(step: FormStep): void {
    this.currentStep.set(step);
  }

  getSelectedIconLabel(): string {
    const selected = this.iconOptions.find((opt) => opt.value === this.formData().icon);
    return selected?.label || 'Select Icon';
  }

  convertLocalToUtc(localHour: number, localMinute: number): { hour: number; minute: number } {
    const now = new Date();
    now.setHours(localHour, localMinute, 0, 0);

    return {
      hour: now.getUTCHours(),
      minute: now.getUTCMinutes(),
    };
  }

  convertUtcToLocal(utcHour: number, utcMinute: number): { hour: number; minute: number } {
    const now = new Date();
    now.setUTCHours(utcHour, utcMinute, 0, 0);

    return {
      hour: now.getHours(),
      minute: now.getMinutes(),
    };
  }

  canProceedFromType(): boolean {
    return !!this.formData().type;
  }

  canProceedFromBasic(): boolean {
    const data = this.formData();
    return (
      !!data.label &&
      data.label.length >= this.limits.LABEL_MIN_LENGTH &&
      data.label.length <= this.limits.LABEL_MAX_LENGTH &&
      !!data.icon &&
      (!data.summary || data.summary.length <= this.limits.SUMMARY_MAX_LENGTH) &&
      !this.checkDuplicateLabel() // Add duplicate check
    );
  }

  canProceedFromSchedule(): boolean {
    const data = this.formData();

    if (data.type === 'event') {
      return !!data.eventEndsAt && !!data.eventCategory && data.eventEndsAt > new Date();
    }

    if (data.type === 'recurring') {
      const isValid = !!data.scheduleType && this.validateScheduleData(data);

      // Additional validation for daily-multi with windows
      if (data.scheduleType === 'daily-multi' && isValid) {
        return !this.checkDailyMultiOverlap();
      }

      return isValid;
    }

    return false;
  }

  getLocalTimeExample(): string {
    // Show what 21:00 UTC is in user's local time as an example
    const utcDate = new Date();
    utcDate.setUTCHours(21, 0, 0, 0);

    const localHour = utcDate.getHours();
    const localMinute = utcDate.getMinutes();

    const hourStr = localHour < 10 ? '0' + localHour : localHour;
    const minStr = localMinute < 10 ? '0' + localMinute : localMinute;

    return `21:00 UTC = ${hourStr}:${minStr} local`;
  }

  private validateScheduleData(data: Partial<CustomTimerFormData>): boolean {
    switch (data.scheduleType) {
      case 'daily':
        return data.dailyHour !== undefined && data.dailyMinute !== undefined;
      case 'weekly':
        return (
          data.weeklyWeekday !== undefined &&
          data.weeklyHour !== undefined &&
          data.weeklyMinute !== undefined
        );
      case 'daily-multi':
        // ← CHANGE: Check the signal directly, not formData
        return this.dailyMultiSlots().length > 0;
      case 'weekly-multi':
        return (
          !!data.weeklyMultiWeekdays &&
          data.weeklyMultiWeekdays.length > 0 &&
          data.weeklyMultiHour !== undefined &&
          data.weeklyMultiMinute !== undefined
        );
      case 'weekly-times':
        // ← CHANGE: Check the signal directly, not formData
        return this.weeklyTimeSlots().length > 0;
      case 'weekly-range':
        return (
          data.weeklyRangeOpenWeekday !== undefined &&
          data.weeklyRangeOpenHour !== undefined &&
          data.weeklyRangeOpenMinute !== undefined &&
          data.weeklyRangeCloseWeekday !== undefined &&
          data.weeklyRangeCloseHour !== undefined &&
          data.weeklyRangeCloseMinute !== undefined &&
          this.validateWeeklyRange(data)
        );
      default:
        return false;
    }
  }

  // Multi-slot management
  addDailyMultiSlot(): void {
    if (this.dailyMultiSlots().length < this.limits.MAX_DAILY_MULTI_TIMES) {
      this.dailyMultiSlots.update((slots) => [...slots, { hour: 0, minute: 0 }]);
    }
  }

  removeDailyMultiSlot(index: number): void {
    if (this.dailyMultiSlots().length > 1) {
      this.dailyMultiSlots.update((slots) => slots.filter((_, i) => i !== index));
    }
  }

  addWeeklyTimeSlot(): void {
    if (this.weeklyTimeSlots().length < this.limits.MAX_WEEKLY_TIMES) {
      this.weeklyTimeSlots.update((slots) => [...slots, { weekday: 1, hour: 0, minute: 0 }]);
    }
  }

  removeWeeklyTimeSlot(index: number): void {
    if (this.weeklyTimeSlots().length > 1) {
      this.weeklyTimeSlots.update((slots) => slots.filter((_, i) => i !== index));
    }
  }

  // Form submission
  onSubmit(): void {
    const data = this.formData();

    if (!this.editingTimer || !data.shortLabel) {
      data.shortLabel = this.generateShortLabel(data.label || '');
    }

    // Convert recurring schedules from local inputs to UTC before saving
    if (data.type === 'recurring' && data.scheduleType) {
      switch (data.scheduleType) {
        case 'daily': {
          const h = data.dailyHour ?? 0;
          const m = data.dailyMinute ?? 0;
          const utc = this.convertLocalToUtc(h, m);
          data.dailyHour = utc.hour;
          data.dailyMinute = utc.minute;
          break;
        }
        case 'weekly': {
          const h = data.weeklyHour ?? 0;
          const m = data.weeklyMinute ?? 0;
          const utc = this.convertLocalToUtc(h, m);
          data.weeklyHour = utc.hour;
          data.weeklyMinute = utc.minute;
          break;
        }
        case 'daily-multi': {
          const slots = this.dailyMultiSlots();
          data.dailyMultiTimes = slots.map((s) => {
            const utc = this.convertLocalToUtc(s.hour, s.minute);
            return { hour: utc.hour, minute: utc.minute };
          });
          break;
        }
        case 'weekly-multi': {
          const h = data.weeklyMultiHour ?? 0;
          const m = data.weeklyMultiMinute ?? 0;
          const utc = this.convertLocalToUtc(h, m);
          data.weeklyMultiHour = utc.hour;
          data.weeklyMultiMinute = utc.minute;
          break;
        }
        case 'weekly-times': {
          const slots = this.weeklyTimeSlots();
          data.weeklyTimeSlots = slots.map((s) => {
            const utc = this.convertLocalToUtc(s.hour, s.minute);
            return { weekday: s.weekday, hour: utc.hour, minute: utc.minute };
          });
          break;
        }
        case 'weekly-range': {
          const oh = data.weeklyRangeOpenHour ?? 0;
          const om = data.weeklyRangeOpenMinute ?? 0;
          const oUtc = this.convertLocalToUtc(oh, om);
          data.weeklyRangeOpenHour = oUtc.hour;
          data.weeklyRangeOpenMinute = oUtc.minute;
          const ch = data.weeklyRangeCloseHour ?? 0;
          const cm = data.weeklyRangeCloseMinute ?? 0;
          const cUtc = this.convertLocalToUtc(ch, cm);
          data.weeklyRangeCloseHour = cUtc.hour;
          data.weeklyRangeCloseMinute = cUtc.minute;
          break;
        }
      }
    }

    // Event timer: data.eventEndsAt is already a local Date
    // Service will convert it to UTC when saving
    // No conversion needed here - keep it local

    this.save.emit(data as CustomTimerFormData);
    this.onClose();
  }

  onClose(): void {
    this.resetForm();
    this.closeModal.emit();
  }

  private resetForm(): void {
    this.formData.set({
      type: undefined, // ← ADD THIS - clear the timer type
      scheduleType: undefined, // ← ADD THIS - clear schedule type
      icon: 'bi-alarm',
      dailyHour: 21,
      dailyMinute: 0,
      weeklyWeekday: 1,
      weeklyHour: 21,
      weeklyMinute: 0,
      weeklyMultiHour: 20,
      weeklyMultiMinute: 30,
      weeklyMultiWeekdays: [], // ← ADD THIS - clear selected weekdays
      weeklyRangeOpenWeekday: 1,
      weeklyRangeOpenHour: 0,
      weeklyRangeOpenMinute: 0,
      weeklyRangeCloseWeekday: 5,
      weeklyRangeCloseHour: 23,
      weeklyRangeCloseMinute: 59,
      eventCategory: 'other',
      eventEndsAt: null, // ← ADD THIS - clear event date
      label: '', // ← ADD THIS - clear label
      shortLabel: '', // ← ADD THIS - clear short label
      summary: '', // ← ADD THIS - clear summary
    });
    this.dailyMultiSlots.set([{ hour: 0, minute: 0 }]);
    this.weeklyTimeSlots.set([{ weekday: 1, hour: 0, minute: 0 }]);
    this.currentStep.set('type');
  }

  private loadExistingTimer(timer: CustomTimerDefinition): void {
    const data: Partial<CustomTimerFormData> = {
      type: timer.type,
      label: timer.label,
      shortLabel: timer.shortLabel,
      icon: timer.icon,
      summary: timer.summary,
    };

    if (timer.type === 'recurring' && timer.schedule) {
      this.loadScheduleData(timer.schedule, data);
    } else if (timer.type === 'event' && timer.endsAt) {
      // Convert stored UTC ISO string back to local Date for editing
      data.eventEndsAt = new Date(timer.endsAt);
      data.eventCategory = timer.category;
    }

    this.formData.set(data);
    // Skip Type step when editing - go straight to Basic Info
    this.currentStep.set('basic');
  }

  private loadScheduleData(schedule: TimerSchedule, data: Partial<CustomTimerFormData>): void {
    data.scheduleType = schedule.type;

    switch (schedule.type) {
      case 'daily': {
        const local = this.convertUtcToLocal(schedule.hour, schedule.minute);
        data.dailyHour = local.hour;
        data.dailyMinute = local.minute;
        break;
      }
      case 'weekly': {
        const local = this.convertUtcToLocal(schedule.hour, schedule.minute);
        data.weeklyWeekday = schedule.weekday;
        data.weeklyHour = local.hour;
        data.weeklyMinute = local.minute;
        break;
      }
      case 'daily-multi': {
        const localSlots = (schedule.times || []).map((t) => {
          const local = this.convertUtcToLocal(t.hour, t.minute);
          return { hour: local.hour, minute: local.minute };
        });
        this.dailyMultiSlots.set(localSlots);
        data.dailyMultiWindowHours = schedule.windowHours;
        break;
      }
      case 'weekly-multi': {
        const local = this.convertUtcToLocal(schedule.hour, schedule.minute);
        data.weeklyMultiWeekdays = schedule.weekdays;
        data.weeklyMultiHour = local.hour;
        data.weeklyMultiMinute = local.minute;
        break;
      }
      case 'weekly-times': {
        const localSlots = (schedule.times || []).map((t) => {
          const local = this.convertUtcToLocal(t.hour, t.minute);
          return { weekday: t.weekday, hour: local.hour, minute: local.minute };
        });
        this.weeklyTimeSlots.set(localSlots);
        break;
      }
      case 'weekly-range': {
        const openLocal = this.convertUtcToLocal(schedule.openHour, schedule.openMinute);
        const closeLocal = this.convertUtcToLocal(schedule.closeHour, schedule.closeMinute);
        data.weeklyRangeOpenWeekday = schedule.openWeekday;
        data.weeklyRangeOpenHour = openLocal.hour;
        data.weeklyRangeOpenMinute = openLocal.minute;
        data.weeklyRangeCloseWeekday = schedule.closeWeekday;
        data.weeklyRangeCloseHour = closeLocal.hour;
        data.weeklyRangeCloseMinute = closeLocal.minute;
        break;
      }
    }
  }

  // Helper for template
  updateFormData(updates: Partial<CustomTimerFormData>): void {
    this.formData.update((data) => ({ ...data, ...updates }));
  }

  toggleWeekday(weekday: number): void {
    const current = this.formData().weeklyMultiWeekdays || [];
    const updated = current.includes(weekday)
      ? current.filter((w) => w !== weekday)
      : [...current, weekday].sort();

    this.updateFormData({ weeklyMultiWeekdays: updated });
  }

  isWeekdaySelected(weekday: number): boolean {
    return this.formData().weeklyMultiWeekdays?.includes(weekday) ?? false;
  }

  // Add to custom-timer-modal.component.ts

  getScheduleTypeExample(): string {
    const option = this.scheduleTypeOptions.find((o) => o.value === this.formData().scheduleType);
    return option?.example || '';
  }

  getScheduleTypeLabel(): string {
    const option = this.scheduleTypeOptions.find((o) => o.value === this.formData().scheduleType);
    return option?.label || '';
  }

  getCategoryLabel(): string {
    const option = this.categoryOptions.find((o) => o.value === this.formData().eventCategory);
    return option?.label || '';
  }

  updateDailyMultiSlotHour(index: number, value: string): void {
    this.dailyMultiSlots.update((slots) => {
      const updated = [...slots];
      updated[index].hour = +value;
      return updated;
    });
  }

  updateDailyMultiSlotMinute(index: number, value: string): void {
    this.dailyMultiSlots.update((slots) => {
      const updated = [...slots];
      updated[index].minute = +value;
      return updated;
    });
  }

  updateWeeklyTimeSlotWeekday(index: number, value: string): void {
    this.weeklyTimeSlots.update((slots) => {
      const updated = [...slots];
      updated[index].weekday = +value;
      return updated;
    });
  }

  updateWeeklyTimeSlotHour(index: number, value: string): void {
    this.weeklyTimeSlots.update((slots) => {
      const updated = [...slots];
      updated[index].hour = +value;
      return updated;
    });
  }

  updateWeeklyTimeSlotMinute(index: number, value: string): void {
    this.weeklyTimeSlots.update((slots) => {
      const updated = [...slots];
      updated[index].minute = +value;
      return updated;
    });
  }

  updateEventEndsAt(value: string): void {
    this.updateFormData({
      eventEndsAt: value ? new Date(value) : null,
    });
  }

  // Add helper to format schedule for review
  // Update getScheduleSummary() to NOT convert - just display the local values as-is
  getScheduleSummary(): string {
    const d = this.formData();
    if (!d.scheduleType) return '';

    const formatTime = (h: number, m: number) => {
      const hours = h < 10 ? '0' + h : h;
      const mins = m < 10 ? '0' + m : m;
      return `${hours}:${mins}`;
    };

    switch (d.scheduleType) {
      case 'daily': {
        const h = d.dailyHour ?? 21;
        const m = d.dailyMinute ?? 0;
        return `${formatTime(h, m)} (local time)`;
      }
      case 'weekly': {
        const day = this.weekdayOptions.find((x) => x.value === d.weeklyWeekday)?.label || '';
        const h = d.weeklyHour ?? 21;
        const m = d.weeklyMinute ?? 0;
        return `${day} ${formatTime(h, m)} (local time)`;
      }
      case 'daily-multi': {
        const slots = this.dailyMultiSlots();
        const windowHours = d.dailyMultiWindowHours ?? 0;

        if (windowHours === 0) {
          const times = slots.map((s) => formatTime(s.hour, s.minute)).join(', ');
          return `${times} (local time)`;
        } else {
          const ranges = slots
            .map((s) => this.formatTimeRange(s.hour, s.minute, windowHours))
            .join(', ');
          return `${ranges} (local time, ${windowHours}h window)`;
        }
      }
      case 'weekly-multi': {
        const days = (d.weeklyMultiWeekdays ?? [])
          .map((w) => this.weekdayOptions.find((x) => x.value === w)?.label.substring(0, 3))
          .join(', ');
        const h = d.weeklyMultiHour ?? 20;
        const m = d.weeklyMultiMinute ?? 30;
        return `${days} ${formatTime(h, m)} (local time)`;
      }
      case 'weekly-times': {
        const slots = this.weeklyTimeSlots();
        const times = slots
          .map((s) => {
            const day = this.weekdayOptions
              .find((x) => x.value === s.weekday)
              ?.label.substring(0, 3);
            return `${day} ${formatTime(s.hour, s.minute)}`;
          })
          .join(', ');
        return `${times} (local time)`;
      }
      case 'weekly-range': {
        const od = this.weekdayOptions
          .find((x) => x.value === d.weeklyRangeOpenWeekday)
          ?.label.substring(0, 3);
        const cd = this.weekdayOptions
          .find((x) => x.value === d.weeklyRangeCloseWeekday)
          ?.label.substring(0, 3);
        const oh = d.weeklyRangeOpenHour ?? 0;
        const om = d.weeklyRangeOpenMinute ?? 0;
        const ch = d.weeklyRangeCloseHour ?? 23;
        const cm = d.weeklyRangeCloseMinute ?? 59;
        return `${od} ${formatTime(oh, om)} - ${cd} ${formatTime(ch, cm)} (local time)`;
      }
      default:
        return '';
    }
  }

  getEventEndsAtDisplay(): string {
    const date = this.formData().eventEndsAt;
    if (!date) return '';
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  }

  // Check if daily-multi time slots overlap considering window duration
  private checkDailyMultiOverlap(): boolean {
    const slots = this.dailyMultiSlots();
    const windowHours = this.formData().dailyMultiWindowHours ?? 0;

    if (windowHours === 0 || slots.length < 2) return false;

    // Convert slots to minutes for easier comparison
    const ranges = slots.map((s) => {
      const startMinutes = s.hour * 60 + s.minute;
      const endMinutes = startMinutes + windowHours * 60;
      return { start: startMinutes, end: endMinutes };
    });

    // Sort by start time
    ranges.sort((a, b) => a.start - b.start);

    // Check for overlaps
    for (let i = 0; i < ranges.length - 1; i++) {
      if (ranges[i].end > ranges[i + 1].start) {
        return true; // Overlap detected
      }
    }

    return false;
  }

  getDailyMultiOverlapError(): string | null {
    if (this.checkDailyMultiOverlap()) {
      const windowHours = this.formData().dailyMultiWindowHours ?? 0;
      return `Time slots overlap with ${windowHours}h window. Please adjust times or reduce window duration.`;
    }
    return null;
  }

  private formatTimeRange(hour: number, minute: number, windowHours: number): string {
    const formatTime = (h: number, m: number) => {
      const hours = h < 10 ? '0' + h : h;
      const mins = m < 10 ? '0' + m : m;
      return `${hours}:${mins}`;
    };

    if (windowHours === 0) {
      return formatTime(hour, minute);
    }

    const startTime = formatTime(hour, minute);
    const endMinutes = hour * 60 + minute + windowHours * 60;
    const endHour = Math.floor(endMinutes / 60) % 24;
    const endMinute = endMinutes % 60;
    const endTime = formatTime(endHour, endMinute);

    return `${startTime}-${endTime}`;
  }

  formatLocalDateTimeForInput(date: Date | null): string {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  updateDailyHourLocal(hour: number): void {
    const minute = this.formData().dailyMinute ?? 0;
    const utc = this.convertLocalToUtc(hour, minute);
    this.updateFormData({ dailyHour: utc.hour, dailyMinute: utc.minute });
  }

  updateDailyMinuteLocal(minute: number): void {
    const hour = this.formData().dailyHour ?? 21;
    const local = this.convertUtcToLocal(hour, this.formData().dailyMinute ?? 0);
    const utc = this.convertLocalToUtc(local.hour, minute);
    this.updateFormData({ dailyHour: utc.hour, dailyMinute: utc.minute });
  }

  private validateWeeklyRange(data: Partial<CustomTimerFormData>): boolean {
    const openDay = data.weeklyRangeOpenWeekday!;
    const openMins = data.weeklyRangeOpenHour! * 60 + data.weeklyRangeOpenMinute!;
    const closeDay = data.weeklyRangeCloseWeekday!;
    const closeMins = data.weeklyRangeCloseHour! * 60 + data.weeklyRangeCloseMinute!;

    const openWeekMins = (openDay - 1) * 1440 + openMins;
    const closeWeekMins = (closeDay - 1) * 1440 + closeMins;

    return closeWeekMins > openWeekMins;
  }

  getWeeklyRangeError(): string | null {
    const d = this.formData();
    if (d.scheduleType === 'weekly-range' && !this.validateWeeklyRange(d)) {
      return 'Closing time must be after opening time in the same week.';
    }
    return null;
  }
}
