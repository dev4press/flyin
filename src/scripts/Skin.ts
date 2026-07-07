import Cookies from 'js-cookie';
import { Base } from './Base';
import type { Flyin } from './Flyin';
import type { Settings, Position } from './types/types';

export class Skin extends Base implements Settings {
  $skinCode = '';
  $core: Flyin;
  $cookie = 1;
  $cookieUsed = false;
  $cookiePosize: Record<string, any> = {};
  $enabled = true;
  $status = 'closed';
  $statusModal = 'closed';
  $htmlClass = '';
  $mode = 'transition';
  $animation: string[] = ['slit', 'slithor', 'bounce', 'roll'];
  $effects: string[] = [
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

  $classes: Record<string, string> = {
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

  // Default Settings
  role = 'dialog';
  modal = true;
  zIndex = 1000000;
  title = true;
  titleTag = 'h5';
  style = 'flyin-style-plain-white';
  containerSelector = 'body';
  extraClass = '';
  effect = 'random';
  effectSpeed = 0.7;
  onLoad = true;
  onLoadDelay = 500;
  onLeaveTop = false;
  onLeaveTopOffset = 3;
  onLeaveViewport = false;
  closeEscape = true;
  closeOverlay = true;
  closeAuto = false;
  closeAutoDelay = 0;
  overlayActive = true;
  overlayColor = '#ffffff';
  overlayOpacity = 0.7;
  overlaySpeed = 0.07;
  angle = 0;
  cWidth: string | number = 'auto';
  cHeight: string | number = 'auto';
  save: Record<string, any> = {};
  width: string | number = '40%';
  height: string | number = 'auto';
  positionX: Position = 'center';
  positionY: Position = 'center';
  offsetX = '10px';
  offsetY = '10px';
  minWidth: string | null = '200px';
  maxWidth: string | null = '95%';
  minHeight: string | null = null;
  maxHeight: string | null = null;
  header = true;
  headerContent: string | boolean = false;
  footer = true;
  footerContent: string | boolean = false;
  buttonX = true;
  buttonXContent = '&#x2716;';
  buttonFooter = true;
  buttonFooterContent = 'Close';
  ariaCloseLabel = 'Close this dialog';
  cookieCode = 'flyin';
  cookiePosizeCode = 'flyin-posize';
  cookiePosizeExpiration = 365;
  autoShowLimit = false;
  autoShowCounter = 5;
  autoShowDelay = 7;
  attrWrapper = '';
  attrHeader = '';
  attrContent = '';
  attrFooter = '';
  xContentSize = false;
  savePosize = true;

  constructor(core: Flyin, options: Settings = {}) {
    super({}, options);
    this.$core = core;

    if (this.effect === 'random') {
      this.effect = this.$core.randomFromArray(this.$effects);
    }

    this._setMode();
    this._cookieInit();
    this._prepareDialog();

    this.callback(this.$core.callbacks.prepared, this.$core);

    if (this.overlayActive) {
      this.createOverlay();
      if (this.closeOverlay) {
        this._overlayClick();
      }
    } else {
      this.createModalay();
    }

    if (this.closeEscape) {
      this._escapeClick();
    }

    this.createDialog();

    if (this.onLoad) {
      this._onLoad();
    }

    if (this.onLeaveTop) {
      this._onLeaveTop();
    }

    if (this.onLeaveViewport) {
      this._onLeaveViewport();
    }

    window.addEventListener('resize', () => this._calculatePosition(false));
    window.addEventListener('orientationchange', () => this._calculatePosition(false));
  }

  css(index: string): string {
    return this.$classes[index];
  }

  w(): HTMLElement | null {
    return document.querySelector(`.${this.css('wrapper')}`);
  }

  _setMode(): void {
    this.$mode = this.$animation.includes(this.effect) ? 'animation' : 'transition';
  }

  _cookieInit(): void {
    if (this.$core.$useCookie && this.cookieCode) {
      const cookie = Cookies.get(this.cookieCode);
      if (cookie !== undefined) {
        this.$cookie = parseInt(cookie, 10);
      }
    }
  }

  protected _prepareDialog(): void {
    this._loadPosizeCookie();
  }

  createOverlay(): void {
    const overlay = document.createElement('div');
    overlay.className = `${this.css('overlay')} ${this.css('overlayIDPrefix')}${this.$core.$id}`;
    overlay.style.zIndex = (this.zIndex - 1).toString();
    overlay.style.backgroundColor = this.overlayColor;
    overlay.style.transition = `opacity ${this.overlaySpeed}s`;

    const container = document.querySelector(this.containerSelector) || document.body;
    container.appendChild(overlay);
    this.$core.$overlay = overlay;
  }

  createModalay(): void {
    // Logic for modalay if needed (placeholder)
  }

  _overlayClick(): void {
    if (this.$core.$overlay) {
      this.$core.$overlay.addEventListener('click', () => this.close());
    }
  }

  _escapeClick(): void {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.$status === 'opened') {
        this.close();
      }
    });
  }

  createDialog(): void {
    const dialog = document.createElement('div');
    dialog.className = `${this.css('dialog')} ${this.css('dialogIDPrefix')}${this.$core.$id} ${this.css('dialogEffectPrefix')}${this.effect} ${this.style} ${this.extraClass}`;
    dialog.style.zIndex = this.zIndex.toString();

    if (this.width) dialog.style.width = this._formatUnit(this.width);
    if (this.height) dialog.style.height = this._formatUnit(this.height);
    if (this.minWidth) dialog.style.minWidth = this._formatUnit(this.minWidth);
    if (this.maxWidth) dialog.style.maxWidth = this._formatUnit(this.maxWidth);
    if (this.minHeight) dialog.style.minHeight = this._formatUnit(this.minHeight);
    if (this.maxHeight) dialog.style.maxHeight = this._formatUnit(this.maxHeight);

    const wrapper = document.createElement('div');
    wrapper.className = this.css('wrapper');
    if (this.attrWrapper) this._setAttributes(wrapper, this.attrWrapper);

    // Header
    if (this.header) {
      const header = document.createElement('div');
      header.className = this.css('header');
      if (this.attrHeader) this._setAttributes(header, this.attrHeader);

      if (this.title) {
        const title = document.createElement(this.titleTag);
        title.id = `${this.css('titleIDPrefix')}${this.$core.$id}`;
        title.innerHTML = typeof this.headerContent === 'string' ? this.headerContent : '';
        header.appendChild(title);
      }
      wrapper.appendChild(header);
    }

    // Close button X
    if (this.buttonX) {
      const btnX = document.createElement('button');
      btnX.type = 'button';
      btnX.className = this.css('closeButton');
      btnX.innerHTML = this.buttonXContent;
      btnX.setAttribute('aria-label', this.ariaCloseLabel);
      btnX.addEventListener('click', () => this.close());
      wrapper.appendChild(btnX);
    }

    // Content
    const content = document.createElement('div');
    content.className = this.css('content');
    if (this.attrContent) this._setAttributes(content, this.attrContent);
    content.innerHTML = this.$core.$obj ? this.$core.$obj.innerHTML : '';
    wrapper.appendChild(content);

    // Footer
    if (this.footer) {
      const footer = document.createElement('div');
      footer.className = this.css('footer');
      if (this.attrFooter) this._setAttributes(footer, this.attrFooter);

      if (this.buttonFooter) {
        const btnFooter = document.createElement('button');
        btnFooter.type = 'button';
        btnFooter.innerHTML = this.buttonFooterContent;
        btnFooter.addEventListener('click', () => this.close());
        footer.appendChild(btnFooter);
      }

      if (typeof this.footerContent === 'string') {
        const footerText = document.createElement('div');
        footerText.innerHTML = this.footerContent;
        footer.appendChild(footerText);
      }
      wrapper.appendChild(footer);
    }

    dialog.appendChild(wrapper);
    const container = document.querySelector(this.containerSelector) || document.body;
    container.appendChild(dialog);
    this.$core.$dialog = dialog;

    this._calculatePosition(true);
    this.callback(this.$core.callbacks.ready, this.$core);
  }

  _formatUnit(value: string | number): string {
    return typeof value === 'number' ? `${value}px` : value;
  }

  _setAttributes(el: HTMLElement, attrStr: string): void {
    // Simple attribute parser
    const matches = attrStr.matchAll(/(\w+)="([^"]*)"/g);
    for (const match of matches) {
      el.setAttribute(match[1], match[2]);
    }
  }

  _onLoad(): void {
    setTimeout(() => {
      if (this.$enabled) this.open();
    }, this.onLoadDelay);
  }

  _onLeaveTop(): void {
    const handleLeave = (e: MouseEvent) => {
      if (e.clientY <= this.onLeaveTopOffset && this.$status === 'closed') {
        this.open();
      }
    };
    document.addEventListener('mouseleave', handleLeave);
  }

  _onLeaveViewport(): void {
    // TODO: Implement intersection observer or similar
  }

  _calculatePosition(_init = false): void {
    if (!this.$core.$dialog) return;

    const dialog = this.$core.$dialog;
    const rect = dialog.getBoundingClientRect();
    const winW = window.innerWidth;
    const winH = window.innerHeight;

    let x: number;
    let y: number;

    if (this.positionX === 'center') {
      x = (winW - rect.width) / 2;
    } else if (this.positionX === 'left') {
      x = 0;
    } else if (this.positionX === 'right') {
      x = winW - rect.width;
    } else {
      x = parseInt(this.positionX as string, 10);
    }

    if (this.positionY === 'center') {
      y = (winH - rect.height) / 2;
    } else if (this.positionY === 'top') {
      y = 0;
    } else if (this.positionY === 'bottom') {
      y = winH - rect.height;
    } else {
      y = parseInt(this.positionY as string, 10);
    }

    dialog.style.left = `${x}px`;
    dialog.style.top = `${y}px`;
  }

  open(): void {
    this._open();
  }

  _open(): void {
    if (this.$status === 'opened') return;

    this.callback(this.$core.callbacks.beforeOpen, this.$core);

    this.$status = 'opened';
    if (this.modal) document.documentElement.classList.add(this.css('html'));

    if (this.$core.$overlay) {
      this.$core.$overlay.classList.add(this.css('overlayActive'));
      this.$core.$overlay.style.opacity = this.overlayOpacity.toString();
    }

    if (this.$core.$dialog) {
      this.$core.$dialog.classList.remove(this.css('dialogInactive'));
      this.$core.$dialog.classList.add(this.css('dialogActive'));
    }

    setTimeout(() => {
      this.callback(this.$core.callbacks.afterOpen, this.$core);
    }, this.effectSpeed * 1000);
  }

  close(): void {
    this._close();
  }

  _close(): void {
    if (this.$status === 'closed') return;

    this.callback(this.$core.callbacks.beforeClose, this.$core);

    this.$status = 'closed';

    if (this.$core.$overlay) {
      this.$core.$overlay.style.opacity = '0';
      setTimeout(() => {
        if (this.$status === 'closed') {
          this.$core.$overlay?.classList.remove(this.css('overlayActive'));
        }
      }, this.overlaySpeed * 1000);
    }

    if (this.$core.$dialog) {
      this.$core.$dialog.classList.remove(this.css('dialogActive'));
      this.$core.$dialog.classList.add(this.css('dialogInactive'));
    }

    if (this.modal) document.documentElement.classList.remove(this.css('html'));

    setTimeout(() => {
      this.callback(this.$core.callbacks.afterClose, this.$core);
      this._finishDialog();
    }, this.effectSpeed * 1000);
  }

  public _save(): void {
    this._savePosizeCookie();
  }

  public _mod(_data: any): void {
    // Implementation for mod if needed
  }

  public _move(_location: any): void {
    // Implementation for move
  }

  public _resize(_size: any): void {
    // Implementation for resize
  }

  _finishDialog(): void {
    this._savePosizeCookie();
  }

  _loadPosizeCookie(): void {
    if (this.savePosize && this.$core.$useCookie) {
      const cookie = Cookies.get(this.cookiePosizeCode);
      if (cookie !== undefined) {
        try {
          this.$cookiePosize = JSON.parse(cookie);
          this.$cookieUsed = true;
          this._applyPosizeCookie();
        } catch {
          console.error('Failed to parse posize cookie');
        }
      }
    }
  }

  _applyPosizeCookie(): void {
    if (this.$cookieUsed) {
      Object.assign(this, this.$cookiePosize);
    }
  }

  protected _savePosizeCookie(): void {
    if (this.savePosize && this.$core.$useCookie) {
      const poSize = this._genPosizeCookie();
      Cookies.set(this.cookiePosizeCode, JSON.stringify(poSize), {
        expires: this.cookiePosizeExpiration,
        path: '/',
      });
    }
  }

  _genPosizeCookie(): Record<string, any> {
    return {
      positionX: this.positionX,
      positionY: this.positionY,
      offsetX: this.offsetX,
      offsetY: this.offsetY,
      width: this.width,
      height: this.height,
      modal: this.modal,
      onLoad: this.onLoad,
      onLoadDelay: this.onLoadDelay,
      save: this.save,
    };
  }
}
