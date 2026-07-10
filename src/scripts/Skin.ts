import type { Flyin } from './Flyin';
import type { MoveOptions, ResizeOptions, Settings } from './types/types';
import { DEFAULT_CLASSES, DEFAULT_SETTINGS } from './utils/defaults';
import { DATA_ANIMATIONS, DATA_EFFECTS } from './utils/data';
import { tinykeys } from 'tinykeys';

export class Skin {
  protected core: Flyin;
  protected skinCode: string = '';
  protected storagePositionSize: Record<string, any> = {};
  protected enabled: boolean = true;
  protected mode: string = 'transition';
  protected lastActiveElement: HTMLElement | null = null;
  protected focusTrapListener: ((e: KeyboardEvent) => void) | null = null;

  protected animations: string[] = DATA_ANIMATIONS;
  protected effects: string[] = DATA_EFFECTS;
  protected classes: Record<string, string> = DEFAULT_CLASSES;

  public settings: Settings = DEFAULT_SETTINGS;
  public status: string = 'closed';
  public statusModal: string = 'closed';

  constructor(core: Flyin, options: Settings = {}) {
    this.core = core;
    this.setOptions(options);

    if (this.settings.effect === 'random') {
      this.settings.effect = this.core.randomFromArray(this.effects);
    }

    this.setMode();
    this.loadAttributes();
    this.loadStorage();
    this.prepareDialog();

    this.callback(this.core.callbacks.prepared, this);

    if (this.settings.overlayActive) {
      this.createOverlay();

      if (this.settings.closeOverlay) {
        this.overlayClick();
      }
    } else {
      this.createModalay();
    }

    if (this.settings.closeEscape) {
      this.escapeClick();
    }

    this.createDialog();

    if (this.settings.onLoad) {
      this.onLoad();
    }

    if (this.settings.onLeaveTop) {
      this.onLeaveTop();
    }

    if (this.settings.onLeaveViewport) {
      this.onLeaveViewport();
    }

    window.addEventListener('resize', () => this.calculatePosition());
    window.addEventListener('orientationchange', () => this.calculatePosition());

    this.tinykeysInit();
  }

  css(index: string): string {
    return this.classes[index];
  }

  w(): HTMLElement | null {
    return document.querySelector(`.${this.css('wrapper')}`);
  }

  protected prepareDialog(): void {}

  protected getElement(obj: any): HTMLElement | null {
    if (!obj) {
      return null;
    }

    if (obj instanceof HTMLElement || obj.nodeType === 1) {
      return obj as HTMLElement;
    }

    if (obj.jquery && obj.length > 0 && obj[0].nodeType === 1) {
      return obj[0] as HTMLElement;
    }

    return null;
  }

  protected ensureVisible(el: HTMLElement): void {
    if (el.style.display === 'none') {
      el.style.display = '';
    }

    if (window.getComputedStyle(el).display === 'none') {
      el.style.display = 'block';
    }
  }

  protected setMode(): void {
    this.mode = this.animations.includes(this.settings.effect || '') ? 'animation' : 'transition';
  }

  createOverlay(): void {
    const overlay = document.createElement('div');

    overlay.className = `${this.css('overlay')} ${this.css('overlayIDPrefix')}${this.core.id}`;
    overlay.setAttribute('aria-hidden', 'true');
    overlay.style.zIndex = ((this.settings.zIndex || 1000000) - 1).toString();
    overlay.style.backgroundColor = this.settings.overlayColor || '#ffffff';
    overlay.style.transition = `opacity ${this.settings.overlaySpeed}s`;

    const container = this.getContainer();

    if (container !== document.body) {
      overlay.style.position = 'absolute';
    }

    container.appendChild(overlay);

    this.core.overlay = overlay;
  }

  createModalay(): void {
    // Logic for modalay if needed (placeholder)
  }

  protected overlayClick(): void {
    if (this.core.overlay) {
      this.core.overlay.addEventListener('click', () => this.close());
    }
  }

  protected escapeClick(): void {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.status === 'opened') {
        this.close();
      }
    });
  }

  protected createDialog(): void {
    const dialog = document.createElement('div');
    const stylePrefix = this.css('stylePrefix');
    const styleClass = this.settings.style?.startsWith(stylePrefix)
      ? this.settings.style
      : stylePrefix + this.settings.style;

    const dialogClasses = [
      this.css('dialog'),
      `${this.css('dialogIDPrefix')}${this.core.id}`,
      `${this.css('dialogEffectPrefix')}${this.settings.effect}`,
      styleClass,
      this.settings.extraClass,
    ];

    if (this.skinCode) {
      dialogClasses.push(this.css('skinPrefix') + this.skinCode);
    }

    dialog.className = dialogClasses.filter(Boolean).join(' ');
    dialog.style.zIndex = (this.settings.zIndex || 1000000).toString();

    dialog.setAttribute('role', this.settings.role || 'dialog');
    if (this.settings.modal) {
      dialog.setAttribute('aria-modal', 'true');
    }

    if (this.settings.width) {
      dialog.style.width = this.formatUnit(this.settings.width);
    }

    if (this.settings.height) {
      dialog.style.height = this.formatUnit(this.settings.height);
    }

    if (this.settings.minWidth) {
      dialog.style.minWidth = this.formatUnit(this.settings.minWidth);
    }

    if (this.settings.maxWidth) {
      dialog.style.maxWidth = this.formatUnit(this.settings.maxWidth);
    }

    if (this.settings.minHeight) {
      dialog.style.minHeight = this.formatUnit(this.settings.minHeight);
    }

    if (this.settings.maxHeight) {
      dialog.style.maxHeight = this.formatUnit(this.settings.maxHeight);
    }

    const wrapper = document.createElement('div');

    wrapper.className = this.css('wrapper');

    if (this.settings.attrWrapper) {
      this.setAttributes(wrapper, this.settings.attrWrapper);
    }

    let btnX: HTMLButtonElement | null = null;

    if (this.settings.buttonX) {
      btnX = document.createElement('button');
      btnX.type = 'button';
      btnX.className = this.css('closeButton');
      btnX.innerHTML = this.settings.buttonXContent || this.settings.buttonXSVG || '&#x2716;';

      btnX.setAttribute('aria-label', this.settings.ariaCloseLabel || 'Close this dialog');
      btnX.addEventListener('click', (e) => {
        e.stopPropagation();
        this.close();
      });

      btnX.addEventListener('mousedown', (e) => e.stopPropagation());
    }

    if (this.settings.header) {
      const header = document.createElement('div');

      header.className = this.css('header');

      if (this.settings.attrHeader) {
        this.setAttributes(header, this.settings.attrHeader);
      }

      if (btnX) {
        header.appendChild(btnX);
      }

      if (this.settings.title) {
        const titleElement = document.createElement(this.settings.titleTag || 'h5');

        titleElement.id = `${this.css('titleIDPrefix')}${this.core.id}`;

        const headerContentEl = this.getElement(this.settings.headerContent);
        if (headerContentEl) {
          const el = this.settings.copy
            ? (headerContentEl.cloneNode(true) as HTMLElement)
            : headerContentEl;
          this.ensureVisible(el);
          titleElement.appendChild(el);
        } else {
          let titleText = '';

          if (typeof this.settings.headerContent === 'string') {
            titleText = this.settings.headerContent;
          } else if (typeof this.settings.title === 'string') {
            titleText = this.settings.title;
          }

          titleElement.innerHTML = titleText;
        }

        header.appendChild(titleElement);
        dialog.setAttribute('aria-labelledby', titleElement.id);
      }
      wrapper.appendChild(header);
    } else if (btnX) {
      wrapper.appendChild(btnX);
    }

    const content = document.createElement('div');

    content.className = this.css('content');

    if (this.settings.attrContent) {
      this.setAttributes(content, this.settings.attrContent);
    }

    const coreElement = this.getElement(this.core.element);
    const settingsContentEl = this.getElement(this.settings.content);

    if (coreElement) {
      const el = this.settings.copy ? (coreElement.cloneNode(true) as HTMLElement) : coreElement;
      this.ensureVisible(el);
      content.appendChild(el);
    } else if (settingsContentEl) {
      const el = this.settings.copy
        ? (settingsContentEl.cloneNode(true) as HTMLElement)
        : settingsContentEl;
      this.ensureVisible(el);
      content.appendChild(el);
    } else {
      content.innerHTML = typeof this.settings.content === 'string' ? this.settings.content : '';
    }

    wrapper.appendChild(content);

    if (this.settings.footer) {
      const footer = document.createElement('div');

      footer.className = this.css('footer');

      if (this.settings.attrFooter) {
        this.setAttributes(footer, this.settings.attrFooter);
      }

      if (this.settings.buttonFooter) {
        const btnFooter = document.createElement('button');

        btnFooter.type = 'button';
        btnFooter.innerHTML = this.settings.buttonFooterContent || 'Close';
        btnFooter.setAttribute('aria-label', this.settings.buttonFooterContent || 'Close');
        btnFooter.addEventListener('click', () => {
          if (typeof this.settings.buttonAction === 'function') {
            this.settings.buttonAction.call(this, this.core);
          } else {
            this.close();
          }
        });
        footer.appendChild(btnFooter);
      }

      const footerContentEl = this.getElement(this.settings.footerContent);
      if (footerContentEl) {
        const el = this.settings.copy
          ? (footerContentEl.cloneNode(true) as HTMLElement)
          : footerContentEl;
        this.ensureVisible(el);
        footer.appendChild(el);
      } else if (typeof this.settings.footerContent === 'string') {
        const footerText = document.createElement('div');

        footerText.innerHTML = this.settings.footerContent;
        footer.appendChild(footerText);
      }

      wrapper.appendChild(footer);
    }

    dialog.appendChild(wrapper);

    const container = this.getContainer();

    if (container !== document.body) {
      dialog.style.position = 'absolute';
    }

    container.appendChild(dialog);

    this.core.dialog = dialog;

    this.calculatePosition();
  }

  protected tinykeysInit(): void {
    const { keysOpen, keysClose } = this.settings;

    if (keysOpen || keysClose) {
      const keybindings: Record<string, (event: KeyboardEvent) => void> = {};

      if (keysOpen === keysClose && typeof keysOpen === 'string') {
        keybindings[keysOpen] = (event: KeyboardEvent) => {
          if (this.status === 'closed') {
            event.preventDefault();
            this.open();
          } else if (this.status === 'opened') {
            event.preventDefault();
            this.close();
          }
        };
      } else {
        if (keysOpen && typeof keysOpen === 'string') {
          keybindings[keysOpen] = (event: KeyboardEvent) => {
            if (this.status === 'closed') {
              event.preventDefault();
              this.open();
            }
          };
        }

        if (keysClose && typeof keysClose === 'string') {
          keybindings[keysClose] = (event: KeyboardEvent) => {
            if (this.status === 'opened') {
              event.preventDefault();
              this.close();
            }
          };
        }
      }

      if (Object.keys(keybindings).length > 0) {
        tinykeys(window, keybindings);
      }
    }
  }

  protected formatUnit(value: string | number): string {
    return typeof value === 'number' ? `${value}px` : value;
  }

  protected getFocusableElements(): HTMLElement[] {
    if (!this.core.dialog) {
      return [];
    }

    const focusableSelectors =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

    return Array.from(this.core.dialog.querySelectorAll(focusableSelectors)) as HTMLElement[];
  }

  protected setAttributes(el: HTMLElement, attrStr: string): void {
    const matches = attrStr.matchAll(/(\w+)="([^"]*)"/g);

    for (const match of matches) {
      el.setAttribute(match[1], match[2]);
    }
  }

  protected onLoad(): void {
    setTimeout(() => {
      if (this.enabled) {
        this.open();
      }
    }, this.settings.onLoadDelay);
  }

  protected onLeaveTop(): void {
    const handleLeave = (e: MouseEvent) => {
      if (e.clientY <= (this.settings.onLeaveTopOffset || 3) && this.status === 'closed') {
        this.open();
      }
    };

    document.addEventListener('mouseleave', handleLeave);
  }

  protected onLeaveViewport(): void {
    document.addEventListener('mouseleave', () => {
      if (this.status === 'closed' && this.enabled) {
        this.open();
        this.enabled = false;
      }
    });
  }

  protected getContainer(): HTMLElement {
    return (document.querySelector(this.settings.containerSelector || 'body') ||
      document.body) as HTMLElement;
  }

  protected getContainerDimensions(): { width: number; height: number } {
    const container = this.getContainer();
    const isBody = container === document.body;

    return {
      width: isBody ? document.documentElement.clientWidth : container.clientWidth,
      height: isBody ? document.documentElement.clientHeight : container.clientHeight,
    };
  }

  protected parseOffset(value: string | number | undefined): number {
    if (typeof value === 'number') {
      return value;
    }

    if (typeof value === 'string') {
      return parseInt(value, 10) || 0;
    }

    return 0;
  }

  protected calculatePosition(): void {
    if (!this.core.dialog) {
      return;
    }

    const dialog = this.core.dialog;
    const rect = dialog.getBoundingClientRect();
    const dims = this.getContainerDimensions();
    const offsetX = this.parseOffset(this.settings.offsetX);
    const offsetY = this.parseOffset(this.settings.offsetY);

    if (this.settings.positionX === 'center') {
      let x = (dims.width - rect.width) / 2;
      x = Math.max(offsetX, Math.min(x, dims.width - rect.width - offsetX));
      dialog.style.left = `${x}px`;
      dialog.style.right = '';
    } else if (this.settings.positionX === 'left') {
      dialog.style.left = this.formatUnit(this.settings.offsetX || 0);
      dialog.style.right = '';
    } else if (this.settings.positionX === 'right') {
      dialog.style.right = this.formatUnit(this.settings.offsetX || 0);
      dialog.style.left = '';
    } else {
      let x =
        typeof this.settings.positionX === 'number'
          ? this.settings.positionX
          : parseInt(this.settings.positionX as string, 10);
      x = Math.max(offsetX, Math.min(x, dims.width - rect.width - offsetX));
      dialog.style.left = `${x}px`;
      dialog.style.right = '';
    }

    if (this.settings.positionY === 'center') {
      let y = (dims.height - rect.height) / 2;
      y = Math.max(offsetY, Math.min(y, dims.height - rect.height - offsetY));
      dialog.style.top = `${y}px`;
      dialog.style.bottom = '';
    } else if (this.settings.positionY === 'top') {
      dialog.style.top = this.formatUnit(this.settings.offsetY || 0);
      dialog.style.bottom = '';
    } else if (this.settings.positionY === 'bottom') {
      dialog.style.bottom = this.formatUnit(this.settings.offsetY || 0);
      dialog.style.top = '';
    } else {
      let y =
        typeof this.settings.positionY === 'number'
          ? this.settings.positionY
          : parseInt(this.settings.positionY as string, 10);
      y = Math.max(offsetY, Math.min(y, dims.height - rect.height - offsetY));
      dialog.style.top = `${y}px`;
      dialog.style.bottom = '';
    }
  }

  protected setOptions(options: Settings): void {
    this.settings = { ...this.settings, ...options };
  }

  protected callback(method: ((...args: any[]) => void) | any, ...args: any[]): void {
    if (typeof method === 'function') {
      method.apply(this, args);
    }
  }

  protected showModalOverlay(): void {
    if (this.settings.modal && this.statusModal === 'closed') {
      document.documentElement.classList.add(this.css('html'));

      if (this.core.overlay) {
        this.core.overlay.classList.add(this.css('overlayActive'));
        this.core.overlay.style.opacity = (this.settings.overlayOpacity || 0.7).toString();
      }

      this.statusModal = 'opened';
    }
  }

  protected hideModalOverlay(force = false): void {
    if ((this.settings.modal || force) && this.statusModal === 'opened') {
      document.documentElement.classList.remove(this.css('html'));

      if (this.core.overlay) {
        this.core.overlay.style.opacity = '0';

        setTimeout(
          () => {
            if (this.statusModal === 'closed' || force) {
              this.core.overlay?.classList.remove(this.css('overlayActive'));
            }
          },
          (this.settings.overlaySpeed || 0.07) * 1000,
        );
      }

      this.statusModal = 'closed';
    }
  }

  public open(): void {
    if (this.status === 'opened') {
      return;
    }

    this.callback(this.core.callbacks.beforeOpen, this);

    this.lastActiveElement = document.activeElement as HTMLElement;

    this.status = 'opened';
    this.showModalOverlay();

    if (this.core.dialog) {
      this.core.dialog.classList.remove(this.css('dialogInactive'));
      this.core.dialog.classList.add(this.css('dialogActive'));

      const focusable = this.getFocusableElements();
      if (focusable.length > 0) {
        focusable[0].focus();
      } else {
        this.core.dialog.setAttribute('tabindex', '-1');
        this.core.dialog.focus();
      }

      if (this.settings.modal) {
        this.focusTrapListener = (e: KeyboardEvent) => {
          if (e.key === 'Tab') {
            const focusableElements = this.getFocusableElements();
            if (focusableElements.length === 0) {
              e.preventDefault();
              return;
            }
            const first = focusableElements[0];
            const last = focusableElements[focusableElements.length - 1];

            if (e.shiftKey) {
              if (document.activeElement === first) {
                last.focus();
                e.preventDefault();
              }
            } else {
              if (document.activeElement === last) {
                first.focus();
                e.preventDefault();
              }
            }
          }
        };

        window.addEventListener('keydown', this.focusTrapListener);
      }
    }

    setTimeout(
      () => {
        this.callback(this.core.callbacks.afterOpen, this);
      },
      (this.settings.effectSpeed || 0.7) * 1000,
    );

    if (this.settings.closeAuto && (this.settings.closeAutoDelay || 0) > 0) {
      setTimeout(() => {
        if (this.status === 'opened') {
          this.close();
        }
      }, this.settings.closeAutoDelay || 0);
    }
  }

  public close(): void {
    if (this.status === 'closed') {
      return;
    }

    this.callback(this.core.callbacks.beforeClose, this);

    this.status = 'closed';

    if (this.focusTrapListener) {
      window.removeEventListener('keydown', this.focusTrapListener);
      this.focusTrapListener = null;
    }

    this.hideModalOverlay();

    if (this.core.dialog) {
      this.core.dialog.classList.remove(this.css('dialogActive'));
      this.core.dialog.classList.add(this.css('dialogInactive'));
    }

    setTimeout(
      () => {
        this.callback(this.core.callbacks.afterClose, this);
        if (this.lastActiveElement) {
          this.lastActiveElement.focus();
        }
        this.finishDialog();
      },
      (this.settings.effectSpeed || 0.7) * 1000,
    );
  }

  public save(): void {
    if (this.settings.savePositionSize) {
      const key = this.getPositionSizeStorageKey();

      if (key) {
        const poSize = this.genPositionSizeStorage();

        localStorage.setItem(key, JSON.stringify(poSize));
      }
    }
  }

  public mod(data: Partial<Settings>): void {
    for (const key in data) {
      if (key in this.settings) {
        (this.settings as any)[key] = (data as any)[key];
      }
    }

    if (data.modal !== undefined) {
      if (data.modal) {
        this.showModalOverlay();
      } else {
        this.hideModalOverlay(true);
      }
    }
  }

  public move(location: MoveOptions): void {
    if (location.positionX !== undefined) {
      this.settings.positionX = location.positionX;
    }

    if (location.positionY !== undefined) {
      this.settings.positionY = location.positionY;
    }

    if (location.offsetX !== undefined) {
      this.settings.offsetX = location.offsetX;
    }

    if (location.offsetY !== undefined) {
      this.settings.offsetY = location.offsetY;
    }

    this.calculatePosition();
  }

  public resize(size: ResizeOptions): void {
    if (size.width !== undefined) {
      this.settings.width = size.width;
    }

    if (size.height !== undefined) {
      this.settings.height = size.height;
    }

    if (this.core.dialog) {
      if (size.width !== undefined) {
        this.core.dialog.style.width = this.formatUnit(size.width);
      }

      if (size.height !== undefined) {
        this.core.dialog.style.height = this.formatUnit(size.height);
      }
    }

    this.calculatePosition();
  }

  public setContent(content: string): void {
    this.settings.content = content;

    if (this.core.dialog) {
      const contentEl = this.core.dialog.querySelector(`.${this.css('content')}`);

      if (contentEl) {
        contentEl.innerHTML = content;

        this.calculatePosition();
      }
    }
  }

  protected finishDialog(): void {
    this.save();
  }

  protected loadAttributes(): void {
    const el = this.getElement(this.core.element);

    if (!el) {
      return;
    }

    if (el.dataset.title !== undefined) {
      this.settings.headerContent = el.dataset.title;
      this.settings.title = true;
    }

    if (el.dataset.titleTag !== undefined) {
      this.settings.titleTag = el.dataset.titleTag;
    }

    if (el.dataset.modal !== undefined) {
      this.settings.modal = el.dataset.modal !== 'false' && el.dataset.modal !== '0';
    }

    if (el.dataset.onLoad !== undefined) {
      this.settings.onLoad = el.dataset.onLoad !== 'false' && el.dataset.onLoad !== '0';
    }

    if (el.dataset.onLoadDelay !== undefined) {
      this.settings.onLoadDelay = parseInt(el.dataset.onLoadDelay, 10);
    }

    if (el.dataset.copy !== undefined) {
      this.settings.copy = el.dataset.copy !== 'false' && el.dataset.copy !== '0';
    }
  }

  protected loadStorage(): void {
    if (this.settings.savePositionSize) {
      const key = this.getPositionSizeStorageKey();

      if (key) {
        const storage = localStorage.getItem(key);

        if (storage !== null) {
          try {
            this.storagePositionSize = JSON.parse(storage);

            Object.assign(this.settings, this.storagePositionSize);
          } catch {
            console.error('Failed to parse position storage');
          }
        }
      }
    }
  }

  protected getPositionSizeStorageKey(): string | null {
    if (!this.settings.storeCode) {
      return null;
    }

    return `${this.settings.storePositionSizeCode || 'flyin-position-size'}-${this.settings.storeCode}`;
  }

  protected genPositionSizeStorage(): Record<string, any> {
    return {
      positionX: this.settings.positionX,
      positionY: this.settings.positionY,
      offsetX: this.settings.offsetX,
      offsetY: this.settings.offsetY,
      width: this.settings.width,
      height: this.settings.height,
      modal: this.settings.modal,
      save: this.settings.save,
    };
  }
}
