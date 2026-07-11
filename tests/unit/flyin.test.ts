import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Flyin } from '../../src/scripts/Flyin';
import { Skin } from '../../src/scripts/Skin';
import { ResizableSkin } from '../../src/scripts/skins/ResizableSkin';
import pkg from '../../package.json';

describe('Flyin Class', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="test-element"></div>';
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  it('should instantiate correctly with a selector', () => {
    const flyin = new Flyin('#test-element');
    expect(flyin.element).not.toBeNull();
    expect(flyin.element?.id).toBe('test-element');
    expect(flyin.id).toBeGreaterThan(0);
  });

  it('should instantiate correctly with an HTMLElement', () => {
    const el = document.getElementById('test-element')!;
    const flyin = new Flyin(el);
    expect(flyin.element).toBe(el);
  });

  it('should increment ID for each instance', () => {
    const f1 = new Flyin(null);
    const f2 = new Flyin(null);
    expect(f2.id).toBe(f1.id + 1);
  });

  it('should load default skin', () => {
    const flyin = new Flyin(null);
    expect(flyin.skinInstance).toBeInstanceOf(Skin);
    expect(flyin.skinName).toBe('Base');
  });

  it('should load resizable skin', () => {
    const flyin = new Flyin(null, { skin: 'Resizable' });
    expect(flyin.skinInstance).toBeInstanceOf(ResizableSkin);
    expect(flyin.skinName).toBe('Resizable');
  });

  it('should select random element from array', () => {
    const flyin = new Flyin(null);
    const input = [1, 2, 3, 4, 5];
    const result = flyin.randomFromArray(input);
    expect(input).toContain(result);
  });
  
  it('should have version property matching package.json', () => {
    const flyin = new Flyin(null);
    expect(flyin.version).toBe(pkg.version);
  });
});
