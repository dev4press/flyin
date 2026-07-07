import { Skin } from './Skin';
import { FreeSkin } from './skins/FreeSkin';
import type { Options, Callbacks } from './types/types';

let flyinIDSequence = 1;

export class Flyin {
  public useCookie = true;
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
      this.element = typeof element === 'string' ? document.querySelector(element) : element;
    }

    this.skinName = options.skin || 'Base';
    this.settings = options.settings || {};
    this.callbacks = options.callbacks || {};

    this.skinInstance = this.loadSkin(this.skinName, this.settings);
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
    if (name === 'cookie') {
      name = 'cookieValue';
    } else if (name === 'status') {
      name = 'status';
    }

    return this.skinInstance ? (this.skinInstance as any)[name] : undefined;
  }

  mod(data: any): void {
    this.skinInstance?.mod(data);
  }

  move(location: any): void {
    this.skinInstance?.move(location);
  }

  resize(size: any): void {
    this.skinInstance?.resize(size);
  }

  setContent(content: string): void {
    this.skinInstance?.setContent(content);
  }

  randomFromArray(input: any[]): any {
    const idx = Math.floor(Math.random() * input.length);
    return input[idx];
  }

  private loadSkin(name: string, options: any): Skin {
    if (name.toLowerCase() === 'free') {
      return new FreeSkin(this, options);
    }
    return new Skin(this, options);
  }
}
