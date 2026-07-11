import { describe, it, expect } from 'vitest';
import { DEFAULT_SETTINGS, DEFAULT_CLASSES } from '../../src/scripts/utils/defaults';

describe('Defaults', () => {
  it('should have correct DEFAULT_SETTINGS', () => {
    expect(DEFAULT_SETTINGS).toBeDefined();
    expect(DEFAULT_SETTINGS.modal).toBe(true);
    expect(DEFAULT_SETTINGS.zIndex).toBe(1000000);
    expect(DEFAULT_SETTINGS.style).toBe('plain-white');
    expect(DEFAULT_SETTINGS.effect).toBe('random');
  });

  it('should have correct DEFAULT_CLASSES', () => {
    expect(DEFAULT_CLASSES).toBeDefined();
    expect(DEFAULT_CLASSES.html).toBe('flyin-active');
    expect(DEFAULT_CLASSES.dialog).toBe('flyin-dialog');
    expect(DEFAULT_CLASSES.overlay).toBe('flyin-overlay');
  });
});
