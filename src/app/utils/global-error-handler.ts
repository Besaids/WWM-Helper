import { ErrorHandler } from '@angular/core';

export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: unknown): void {
    // Normalize and log; keep behavior minimal and non-intrusive
    const normalized =
      error instanceof Error
        ? error
        : new Error(typeof error === 'string' ? error : JSON.stringify(error));

    // Consolidated logging point (could be extended to send to telemetry)
    console.error('Unhandled application error:', normalized);
  }
}
