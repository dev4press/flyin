import Cookies from 'js-cookie';
import type { Flyin } from './Flyin';
import type { Settings } from './types/types';

export class Skin {
  protected skinCode = '';
  protected core: Flyin;
  protected cookieValue = 1;
  protected cookieUsed = false;
  protected cookiePosize: Record<string, any> = {};
  protected enabled = true;
  protected status = 'closed';
  protected statusModal = 'closed';
  protected htmlClass = '';
  protected mode = 'transition';
  protected lastActiveElement: HTMLElement | null = null;
  protected focusTrapListener: ((e: KeyboardEvent) => void) | null = null;
  protected animations: string[] = ['slit', 'slithor', 'bounce', 'roll'];
  protected effects: string[] = [
    'none',
    'fade',
    'scale',
    'zoomfade',
    'slideinright',
    'slideinleft',
    'slideintop',
    'slideinbottom',
    'newspaper',
    'fallcenter',
    'fallleft',
    'fallright',
    'fliphorleft',
    'fliphorright',
    'flipvertop',
    'flipverbottom',
    'flipsign',
    'flipsignfront',
    'slit',
    'slithor',
    'bounce',
    'roll',
    'rotatebottom',
    'rotatetop',
    'rotateleft',
    'rotateright',
  ];

  protected classes: Record<string, string> = {
    html: 'flyin-active',
    htmlEffectPrefix: 'flyin-effect-',
    overlay: 'flyin-overlay',
    overlayIDPrefix: 'flyin-overlay-',
    overlayActive: 'flyin-active',
    skinPrefix: 'flyin-skin-',
    titleIDPrefix: 'flyin-dialog-title-',
    dialog: 'flyin-dialog',
    dialogIDPrefix: 'flyin-dialog-',
    dialogEffectPrefix: 'flyin-effect-',
    dialogActive: 'flyin-active',
    dialogInactive: 'flyin-inactive',
    wrapper: 'flyin-wrapper',
    header: 'flyin-header',
    content: 'flyin-content',
    footer: 'flyin-footer',
    srOnly: 'flyin-sr-only',
    closeButton: 'flyin-button-close',
    drag: 'flyin-drag',
    grip: 'flyin-grip',
  };

  public settings: Settings = {
    role: 'dialog',
    modal: true,
    zIndex: 1000000,
    title: true,
    titleTag: 'h5',
    style: 'flyin-style-plain-white',
    containerSelector: 'body',
    extraClass: '',
    effect: 'random',
    effectSpeed: 0.7,
    onLoad: true,
    onLoadDelay: 500,
    onLeaveTop: false,
    onLeaveTopOffset: 3,
    onLeaveViewport: false,
    closeEscape: true,
    closeOverlay: true,
    closeAuto: false,
    closeAutoDelay: 0,
    overlayActive: true,
    overlayColor: '#ffffff',
    overlayOpacity: 0.7,
    overlaySpeed: 0.07,
    angle: 0,
    cWidth: 'auto',
    cHeight: 'auto',
    save: {},
    width: '40%',
    height: 'auto',
    positionX: 'center',
    positionY: 'center',
    offsetX: '10px',
    offsetY: '10px',
    minWidth: '200px',
    maxWidth: '95%',
    minHeight: null,
    maxHeight: null,
    header: true,
    headerContent: false,
    footer: true,
    footerContent: false,
    buttonX: true,
    buttonXContent: '&#x2716;',
    buttonXSVG: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M297.3722,319.9996l-175.9859,-175.9859c-6.2442,-6.2442 -6.2442,-16.3832 0,-22.6274c6.2442,-6.2442 16.3832,-6.2442 22.6274,0l175.9859,175.9859l175.9857,-175.9857c6.2442,-6.2442 16.3832,-6.2442 22.6274,-0c6.2442,6.2442 6.2442,16.3832 -0,22.6274l-175.9857,175.9857l175.9857,175.9857c6.2442,6.2442 6.2442,16.3832 0,22.6274c-6.2442,6.2442 -16.3832,6.2442 -22.6274,0l-175.9857,-175.9857l-175.9859,175.9859c-6.2442,6.2442 -16.3832,6.2442 -22.6274,-0c-6.2442,-6.2442 -6.2442,-16.3832 0,-22.6274l175.9859,-175.9859Z"/></svg>',
    buttonFooter: true,
    buttonFooterContent: 'Close',
    ariaCloseLabel: 'Close this dialog',
    cookieCode: 'flyin',
    cookiePosizeCode: 'flyin-posize',
    cookiePosizeExpiration: 365,
    autoShowLimit: false,
    autoShowCounter: 5,
    autoShowDelay: 7,
    attrWrapper: '',
    attrHeader: '',
    attrContent: '',
    attrFooter: '',
    xContentSize: false,
    savePosize: true,
    gripSVG: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path d="M424.9139,518.6134c-6.2444,6.2444 -16.3837,6.2444 -22.628,-0c-6.2444,-6.2444 -6.2444,-16.3837 0,-22.628l93.0923,-93.0923c6.2444,-6.2444 16.3837,-6.2444 22.628,-0c6.2444,6.2444 6.2444,16.3837 -0,22.628l-93.0923,93.0923Zm-93.6009,0.5566c-6.2442,6.2442 -16.3832,6.2442 -22.6274,-0c-6.2442,-6.2442 -6.2442,-16.3832 0,-22.6274l187.2995,-187.2995c6.2442,-6.2442 16.3832,-6.2442 22.6274,0c6.2442,6.2442 6.2442,16.3832 -0,22.6274l-187.2995,187.2995Zm-93.6484,-0.2911c-6.2447,6.2447 -16.3846,6.2447 -22.6293,-0c-6.2447,-6.2447 -6.2447,-16.3846 -0,-22.6293l281.2145,-281.2145c6.2447,-6.2447 16.3846,-6.2447 22.6293,0c6.2447,6.2447 6.2447,16.3846 -0,22.6293l-281.2145,281.2145Zm-93.6509,-0.266c-6.2442,6.2442 -16.3832,6.2442 -22.6274,-0c-6.2442,-6.2442 -6.2442,-16.3832 0,-22.6274l374.599,-374.599c6.2442,-6.2442 16.3832,-6.2442 22.6274,-0c6.2442,6.2442 6.2442,16.3832 -0,22.6274l-374.599,374.599Z"/></svg>',
  };

  constructor(core: Flyin, options: Settings = {}) {
    this.core = core;
    this.setOptions(options);

    if (this.settings.effect === 'random') {
      this.settings.effect = this.core.randomFromArray(this.effects);
    }

    this.setMode();
    this.cookieInit();
    this.prepareDialog();

    // Re-apply explicit options and data attributes to ensure they take precedence over cookie
    this.setOptions(options);
    this.processDataAttributes();

    this.callback(this.core.callbacks.prepared, this.core);

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

    window.addEventListener('resize', () => this.calculatePosition(false));
    window.addEventListener('orientationchange', () => this.calculatePosition(false));
  }

  css(index: string): string {
    return this.classes[index];
  }

  w(): HTMLElement | null {
    return document.querySelector(`.${this.css('wrapper')}`);
  }

  protected setMode(): void {
    this.mode = this.animations.includes(this.settings.effect || '') ? 'animation' : 'transition';
  }

  protected cookieInit(): void {
    if (this.core.useCookie && this.settings.cookieCode) {
      const cookie = Cookies.get(this.settings.cookieCode);
      if (cookie !== undefined) {
        this.cookieValue = parseInt(cookie, 10);
      }
    }
  }

  protected prepareDialog(): void {
    this.loadPosizeCookie();
  }

  protected processDataAttributes(): void {
    if (!this.core.element) return;

    const el = this.core.element;

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
  }

  createOverlay(): void {
    const overlay = document.createElement('div');
    overlay.className = `${this.css('overlay')} ${this.css('overlayIDPrefix')}${this.core.id}`;
    overlay.setAttribute('aria-hidden', 'true');
    overlay.style.zIndex = ((this.settings.zIndex || 1000000) - 1).toString();
    overlay.style.backgroundColor = this.settings.overlayColor || '#ffffff';
    overlay.style.transition = `opacity ${this.settings.overlaySpeed}s`;

    const container = document.querySelector(this.settings.containerSelector || 'body') || document.body;
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

  createDialog(): void {
    const dialog = document.createElement('div');
    dialog.className = `${this.css('dialog')} ${this.css('dialogIDPrefix')}${this.core.id} ${this.css('dialogEffectPrefix')}${this.settings.effect} ${this.settings.style} ${this.settings.extraClass} ${this.skinCode ? this.css('skinPrefix') + this.skinCode : ''}`.trim();
    dialog.style.zIndex = (this.settings.zIndex || 1000000).toString();

    dialog.setAttribute('role', this.settings.role || 'dialog');
    if (this.settings.modal) {
      dialog.setAttribute('aria-modal', 'true');
    }

    if (this.settings.width) dialog.style.width = this.formatUnit(this.settings.width);
    if (this.settings.height) dialog.style.height = this.formatUnit(this.settings.height);
    if (this.settings.minWidth) dialog.style.minWidth = this.formatUnit(this.settings.minWidth);
    if (this.settings.maxWidth) dialog.style.maxWidth = this.formatUnit(this.settings.maxWidth);
    if (this.settings.minHeight) dialog.style.minHeight = this.formatUnit(this.settings.minHeight);
    if (this.settings.maxHeight) dialog.style.maxHeight = this.formatUnit(this.settings.maxHeight);

    const wrapper = document.createElement('div');
    wrapper.className = this.css('wrapper');
    if (this.settings.attrWrapper) this.setAttributes(wrapper, this.settings.attrWrapper);

    // Close button X
    let btnX: HTMLButtonElement | null = null;
    if (this.settings.buttonX) {
      btnX = document.createElement('button');
      btnX.type = 'button';
      btnX.className = this.css('closeButton');
      btnX.innerHTML = this.settings.buttonXSVG || this.settings.buttonXContent || '&#x2716;';
      btnX.setAttribute('aria-label', this.settings.ariaCloseLabel || 'Close this dialog');
      btnX.addEventListener('click', (e) => {
        e.stopPropagation();
        this.close();
      });
      btnX.addEventListener('mousedown', (e) => e.stopPropagation());
    }

    // Header
    if (this.settings.header) {
      const header = document.createElement('div');
      header.className = this.css('header');
      if (this.settings.attrHeader) this.setAttributes(header, this.settings.attrHeader);

      if (btnX) {
        header.appendChild(btnX);
      }

      if (this.settings.title) {
        const titleElement = document.createElement(this.settings.titleTag || 'h5');
        titleElement.id = `${this.css('titleIDPrefix')}${this.core.id}`;
        let titleText = '';
        if (typeof this.settings.headerContent === 'string') {
          titleText = this.settings.headerContent;
        } else if (typeof this.settings.title === 'string') {
          titleText = this.settings.title;
        }
        titleElement.innerHTML = titleText;
        header.appendChild(titleElement);
        dialog.setAttribute('aria-labelledby', titleElement.id);
      }
      wrapper.appendChild(header);
    } else if (btnX) {
      wrapper.appendChild(btnX);
    }

    // Content
    const content = document.createElement('div');
    content.className = this.css('content');
    if (this.settings.attrContent) this.setAttributes(content, this.settings.attrContent);
    content.innerHTML = this.core.element ? this.core.element.innerHTML : '';
    wrapper.appendChild(content);

    // Footer
    if (this.settings.footer) {
      const footer = document.createElement('div');
      footer.className = this.css('footer');
      if (this.settings.attrFooter) this.setAttributes(footer, this.settings.attrFooter);

      if (this.settings.buttonFooter) {
        const btnFooter = document.createElement('button');
        btnFooter.type = 'button';
        btnFooter.innerHTML = this.settings.buttonFooterContent || 'Close';
        btnFooter.setAttribute('aria-label', this.settings.buttonFooterContent || 'Close');
        btnFooter.addEventListener('click', () => this.close());
        footer.appendChild(btnFooter);
      }

      if (typeof this.settings.footerContent === 'string') {
        const footerText = document.createElement('div');
        footerText.innerHTML = this.settings.footerContent;
        footer.appendChild(footerText);
      }
      wrapper.appendChild(footer);
    }

    dialog.appendChild(wrapper);
    const container = document.querySelector(this.settings.containerSelector || 'body') || document.body;
    container.appendChild(dialog);
    this.core.dialog = dialog;

    this.calculatePosition(true);
    this.callback(this.core.callbacks.ready, this.core);
  }

  protected formatUnit(value: string | number): string {
    return typeof value === 'number' ? `${value}px` : value;
  }

  protected getFocusableElements(): HTMLElement[] {
    if (!this.core.dialog) return [];
    const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    return Array.from(this.core.dialog.querySelectorAll(focusableSelectors)) as HTMLElement[];
  }

  protected setAttributes(el: HTMLElement, attrStr: string): void {
    // Simple attribute parser
    const matches = attrStr.matchAll(/(\w+)="([^"]*)"/g);
    for (const match of matches) {
      el.setAttribute(match[1], match[2]);
    }
  }

  protected onLoad(): void {
    setTimeout(() => {
      if (this.enabled) this.open();
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
    // TODO: Implement intersection observer or similar
  }

  protected calculatePosition(_init = false): void {
    if (!this.core.dialog) return;

    const dialog = this.core.dialog;
    const rect = dialog.getBoundingClientRect();
    const winW = window.innerWidth;
    const winH = window.innerHeight;

    let x: number;
    let y: number;

    if (this.settings.positionX === 'center') {
      x = (winW - rect.width) / 2;
    } else if (this.settings.positionX === 'left') {
      x = 0;
    } else if (this.settings.positionX === 'right') {
      x = winW - rect.width;
    } else {
      x = parseInt(this.settings.positionX as string, 10);
    }

    if (this.settings.positionY === 'center') {
      y = (winH - rect.height) / 2;
    } else if (this.settings.positionY === 'top') {
      y = 0;
    } else if (this.settings.positionY === 'bottom') {
      y = winH - rect.height;
    } else {
      y = parseInt(this.settings.positionY as string, 10);
    }

    dialog.style.left = `${x}px`;
    dialog.style.top = `${y}px`;
  }

  setOptions(options: Settings): void {
    this.settings = { ...this.settings, ...options };
  }

  callback(method: ((...args: any[]) => void) | any, ...args: any[]): void {
    if (typeof method === 'function') {
      method.apply(this, args);
    }
  }

  open(): void {
    if (this.status === 'opened') return;

    this.callback(this.core.callbacks.beforeOpen, this.core);

    this.lastActiveElement = document.activeElement as HTMLElement;

    this.status = 'opened';
    if (this.settings.modal) document.documentElement.classList.add(this.css('html'));

    if (this.core.overlay) {
      this.core.overlay.classList.add(this.css('overlayActive'));
      this.core.overlay.style.opacity = (this.settings.overlayOpacity || 0.7).toString();
    }

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

    setTimeout(() => {
      this.callback(this.core.callbacks.afterOpen, this.core);
    }, (this.settings.effectSpeed || 0.7) * 1000);
  }

  close(): void {
    if (this.status === 'closed') return;

    this.callback(this.core.callbacks.beforeClose, this.core);

    this.status = 'closed';

    if (this.focusTrapListener) {
      window.removeEventListener('keydown', this.focusTrapListener);
      this.focusTrapListener = null;
    }

    if (this.core.overlay) {
      this.core.overlay.style.opacity = '0';
      setTimeout(() => {
        if (this.status === 'closed') {
          this.core.overlay?.classList.remove(this.css('overlayActive'));
        }
      }, (this.settings.overlaySpeed || 0.07) * 1000);
    }

    if (this.core.dialog) {
      this.core.dialog.classList.remove(this.css('dialogActive'));
      this.core.dialog.classList.add(this.css('dialogInactive'));
    }

    if (this.settings.modal) document.documentElement.classList.remove(this.css('html'));

    setTimeout(() => {
      this.callback(this.core.callbacks.afterClose, this.core);
      if (this.lastActiveElement) {
        this.lastActiveElement.focus();
      }
      this.finishDialog();
    }, (this.settings.effectSpeed || 0.7) * 1000);
  }

  public save(): void {
    if (this.settings.savePosize && this.core.useCookie) {
      const poSize = this.genPosizeCookie();
      Cookies.set(this.settings.cookiePosizeCode || 'flyin-posize', JSON.stringify(poSize), {
        expires: this.settings.cookiePosizeExpiration,
        path: '/',
      });
    }
  }

  public mod(_data: any): void {
    // Implementation for mod if needed
  }

  public move(_location: any): void {
    // Implementation for move
  }

  public resize(_size: any): void {
    // Implementation for resize
  }

  protected finishDialog(): void {
    this.save();
  }

  protected loadPosizeCookie(): void {
    if (this.settings.savePosize && this.core.useCookie) {
      const cookie = Cookies.get(this.settings.cookiePosizeCode || 'flyin-posize');
      if (cookie !== undefined) {
        try {
          this.cookiePosize = JSON.parse(cookie);
          this.cookieUsed = true;
          this.applyPosizeCookie();
        } catch {
          console.error('Failed to parse posize cookie');
        }
      }
    }
  }

  protected applyPosizeCookie(): void {
    if (this.cookieUsed) {
      Object.assign(this.settings, this.cookiePosize);
    }
  }


  protected genPosizeCookie(): Record<string, any> {
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
