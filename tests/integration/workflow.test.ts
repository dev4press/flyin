import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Flyin } from '../../src/scripts/Flyin';

describe('Flyin Workflow Integration', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.documentElement.className = '';
    vi.useFakeTimers();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    document.documentElement.className = '';
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('should open the popup and add classes', () => {
    const flyin = new Flyin(null, { settings: { effectSpeed: 0.1, overlaySpeed: 0.1 } });
    flyin.open();

    expect(flyin.skin()?.status).toBe('opened');
    expect(document.documentElement.classList.contains('flyin-active')).toBe(true);
    
    const dialog = flyin.dialog;
    expect(dialog).not.toBeNull();
    expect(dialog?.classList.contains('flyin-active')).toBe(true);
    
    const overlay = flyin.overlay;
    expect(overlay).not.toBeNull();
    expect(overlay?.classList.contains('flyin-active')).toBe(true);
  });

  it('should close the popup and remove classes', () => {
    const flyin = new Flyin(null, { settings: { effectSpeed: 0.1, overlaySpeed: 0.1 } });
    flyin.open();
    vi.runAllTimers();
    
    flyin.close();
    expect(flyin.skin()?.status).toBe('closed');
    expect(flyin.dialog?.classList.contains('flyin-active')).toBe(false);
    expect(flyin.dialog?.classList.contains('flyin-inactive')).toBe(true);
    
    vi.runAllTimers();
    // After timeout, modal overlay should be cleaned up
    expect(document.documentElement.classList.contains('flyin-active')).toBe(false);
  });

  it('should update content using setContent', () => {
    const flyin = new Flyin(null);
    flyin.setContent('New Content');
    
    const contentEl = flyin.dialog?.querySelector('.flyin-content');
    expect(contentEl?.innerHTML).toBe('New Content');
  });

  it('should trigger callbacks', () => {
    const readyCb = vi.fn();
    const beforeOpenCb = vi.fn();
    const afterOpenCb = vi.fn();
    
    const flyin = new Flyin(null, {
      callbacks: {
        ready: readyCb,
        beforeOpen: beforeOpenCb,
        afterOpen: afterOpenCb,
      },
      settings: { effectSpeed: 0.1 }
    });
    
    expect(readyCb).toHaveBeenCalled();
    
    flyin.open();
    expect(beforeOpenCb).toHaveBeenCalled();
    
    vi.runAllTimers();
    expect(afterOpenCb).toHaveBeenCalled();
  });
});
