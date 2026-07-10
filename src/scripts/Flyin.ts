import { Skin } from './Skin';
import { ResizableSkin } from './skins/ResizableSkin';
import type { Callbacks, MoveOptions, Options, ResizeOptions, Settings } from './types/types';

let flyinIDSequence = 1;

export class Flyin {
  public version: string = __APP_VERSION__;
  public skinInstance: Skin | null = null;
  public element: HTMLElement | null = null;
  public overlay: HTMLElement | null = null;
  public dialog: HTMLElement | null = null;
  public id: number;

  public skinName = 'Base';
  public settings: Options['settings'] = {};
  public callbacks: Callbacks = {};

  constructor(element: HTMLElement | string | null, options: Options = {}) {
    this.id = flyinIDSequence++;

    if (element) {
      if (typeof element === 'string') {
        this.element = document.querySelector(element);
      } else {
        const el = element as any;
        this.element = el.jquery && el.length > 0 ? el[0] : el;
      }
    }

    this.skinName = options.skin || 'Base';
    this.settings = options.settings || {};
    this.callbacks = options.callbacks || {};

    this.skinInstance = this.loadSkin(this.skinName, this.settings);

    this.callback(this.callbacks.ready, this);
  }

  open(): void {
    this.skinInstance?.open();
  }

  close(): void {
    this.skinInstance?.close();
  }

  save(): void {
    this.skinInstance?.save();
  }

  get(name: string): any {
    return this.skinInstance
      ? (this.skinInstance as Skin).settings[name as keyof Settings]
      : undefined;
  }

  skin(): Skin | null {
    return this.skinInstance;
  }

  mod(data: Partial<Settings>): void {
    this.skinInstance?.mod(data);
  }

  move(location: MoveOptions): void {
    this.callback(this.callbacks.beforeMove, this);

    this.skinInstance?.move(location);

    this.callback(this.callbacks.afterMove, this);
  }

  resize(size: ResizeOptions): void {
    this.callback(this.callbacks.beforeResize, this);

    this.skinInstance?.resize(size);

    this.callback(this.callbacks.afterResize, this);
  }

  setContent(content: string): void {
    this.skinInstance?.setContent(content);
  }

  randomFromArray(input: any[]): any {
    const idx = Math.floor(Math.random() * input.length);

    return input[idx];
  }

  private callback(method: ((...args: any[]) => void) | any, ...args: any[]): void {
    if (typeof method === 'function') {
      method.apply(this, args);
    }
  }

  private loadSkin(name: string, options: any): Skin {
    const skinName = name.toLowerCase();

    if (skinName === 'resizable' || skinName === 'free') {
      return new ResizableSkin(this, options);
    }

    return new Skin(this, options);
  }
}
