import { Base } from './Base';
import { Skin } from './Skin';
import { FreeSkin } from './skins/FreeSkin';
import type { Options, Callbacks } from './types/types';

let flyinIDSequence = 1;

export class Flyin extends Base {
  $useCookie = true;
  $skin: Skin | null = null;
  $obj: HTMLElement | null = null;
  $overlay: HTMLElement | null = null;
  $dialog: HTMLElement | null = null;
  $id: number;

  skin = 'Base';
  settings = {};
  callbacks: Callbacks = {};

  constructor(element: HTMLElement | string, options: Options = {}) {
    super({}, options);

    this.$id = flyinIDSequence++;
    this.$obj = typeof element === 'string' ? document.querySelector(element) : element;

    this.$skin = this._loadSkin(this.skin, this.settings);
  }

  open(): void {
    this.$skin?.open();
  }

  close(): void {
    this.$skin?.close();
  }

  save(): void {
    this.$skin?._save();
  }

  get(name: string): any {
    if (name === 'cookie') {
      name = '$cookie';
    } else if (name === 'status') {
      name = '$status';
    }

    return this.$skin ? (this.$skin as any)[name] : undefined;
  }

  mod(data: any): void {
    this.$skin?._mod(data);
  }

  move(location: any): void {
    this.$skin?._move(location);
  }

  resize(size: any): void {
    this.$skin?._resize(size);
  }

  randomFromArray(input: any[]): any {
    const idx = Math.floor(Math.random() * input.length);
    return input[idx];
  }

  _loadSkin(name: string, options: any): Skin {
    if (name.toLowerCase() === 'free') {
      return new FreeSkin(this, options);
    }
    return new Skin(this, options);
  }
}
