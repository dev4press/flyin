import Cookies from 'js-cookie';
import { Skin } from '../Skin';
import type { Flyin } from '../Flyin';
import type { Settings } from '../types/types';

export class FreeSkin extends Skin {
  $skinCode = 'free';

  showGrip = false;
  sizeMinWidth = 90;
  sizeMinHeight = 60;
  resizeMargin = 5;

  private moverState = {
    dr: null as HTMLElement | null,
    width: 0,
    height: 0,
    maxLeft: 0,
    maxTop: 0,
    posX: 0,
    posY: 0,
    moving: false,
    resizing: false,
    resizeTop: false,
    resizeBottom: false,
    resizeLeft: false,
    resizeRight: false,
    rmX: 0,
    rmY: 0,
    rm: '',
  };

  constructor(core: Flyin, options: Settings = {}) {
    super(core, options);
  }

  protected override _prepareDialog(): void {
    if (this.savePosize) {
      const cookie = Cookies.get(this.cookiePosizeCode);
      if (cookie !== undefined) {
        try {
          const data = JSON.parse(cookie);
          this.$cookiePosize = {
            left: 0,
            top: 0,
            width: 0,
            height: 0,
            cWidth: 0,
            cHeight: 0,
            ...data,
          };
          this.$cookieUsed = true;
        } catch {
          console.error('Failed to parse FreeSkin posize cookie');
        }
      }
    }

    if (this.$cookieUsed) {
      if (this.$cookiePosize.cHeight === 0) {
        this.$cookiePosize.cHeight = this.$cookiePosize.height;
      }

      this.positionX = this.$cookiePosize.left;
      this.positionY = this.$cookiePosize.top;
      this.width = `${this.$cookiePosize.width}px`;
      this.cHeight = `${this.$cookiePosize.cHeight}px`;

      this.height = 'auto';
      this.cWidth = 'auto';

      if (window.innerWidth < (this.positionX as number) + this.$cookiePosize.width) {
        this.positionX = window.innerWidth - this.$cookiePosize.width;
      }

      if (window.innerHeight < (this.positionY as number) + this.$cookiePosize.height) {
        this.positionY = window.innerHeight - this.$cookiePosize.height;
      }
    }
  }

  public override createDialog(): void {
    super.createDialog();

    if (this.showGrip) {
      const grip = document.createElement('div');
      grip.className = this.css('grip');
      this.$core.$dialog?.querySelector(`.${this.css('footer')}`)?.appendChild(grip);
    }

    this._setupMover();
  }

  private _setupMover(): void {
    const wrapper = this.$core.$dialog?.querySelector(`.${this.css('wrapper')}`) as HTMLElement;
    const header = this.$core.$dialog?.querySelector(`.${this.css('header')}`) as HTMLElement;
    const grip = this.$core.$dialog?.querySelector(`.${this.css('grip')}`) as HTMLElement;

    if (grip) {
      grip.addEventListener('mousedown', (e) => this._mouseDownWrapper(e));
      grip.addEventListener('touchstart', (e) => this._mouseDownWrapper(e), { passive: false });
    }

    if (wrapper) {
      wrapper.addEventListener('mousedown', (e) => this._mouseDownWrapper(e));
      wrapper.addEventListener('touchstart', (e) => this._mouseDownWrapper(e), { passive: false });
    }

    if (header) {
      header.addEventListener('mousedown', (e) => this._mouseDown(e));
      header.addEventListener('touchstart', (e) => this._mouseDown(e), { passive: false });
    }

    document.addEventListener('mousemove', (e) => this._mouseMove(e));
    document.addEventListener('mouseup', (e) => this._mouseUp(e));
    document.addEventListener('touchmove', (e) => this._mouseMove(e), { passive: false });
    document.addEventListener('touchend', (e) => this._touchEnd(e));
  }

  private _mousePos(e: MouseEvent | TouchEvent) {
    if ('clientX' in e) {
      return { pageX: e.clientX, pageY: e.clientY, touch: false };
    } else if (e.touches && e.touches.length > 0) {
      return { pageX: e.touches[0].clientX, pageY: e.touches[0].clientY, touch: true };
    }
    return null;
  }

  private _mouseDownWrapper(e: MouseEvent | TouchEvent): void {
    if (this.moverState.rm === '') return;
    const pos = this._mousePos(e);
    if (!pos) return;

    this.moverState.resizing = true;
    this.moverState.rmX = pos.pageX;
    this.moverState.rmY = pos.pageY;
  }

  private _mouseDown(e: MouseEvent | TouchEvent): void {
    if (this.moverState.rm !== '') return;
    const pos = this._mousePos(e);
    if (!pos) return;

    this.moverState.moving = true;
    const dialog = this.$core.$dialog;
    if (!dialog) return;

    dialog.classList.add(this.css('drag'));
    this.moverState.dr = dialog;

    const rect = dialog.getBoundingClientRect();
    this.moverState.width = rect.width;
    this.moverState.height = rect.height;

    this.moverState.maxLeft = window.innerWidth - this.moverState.width;
    this.moverState.maxTop = window.innerHeight - this.moverState.height;

    this.moverState.posX = rect.left + this.moverState.width - pos.pageX;
    this.moverState.posY = rect.top + this.moverState.height - pos.pageY;
  }

  private _mouseMove(e: MouseEvent | TouchEvent): void {
    const pos = this._mousePos(e);
    if (!pos) return;

    if (this.moverState.dr) {
      if (e.cancelable) e.preventDefault();

      let left = pos.pageX + this.moverState.posX - this.moverState.width;
      let top = pos.pageY + this.moverState.posY - this.moverState.height;

      left = Math.max(0, Math.min(left, this.moverState.maxLeft));
      top = Math.max(0, Math.min(top, this.moverState.maxTop));

      this.moverState.dr.style.left = `${left}px`;
      this.moverState.dr.style.top = `${top}px`;

      this.positionX = left;
      this.positionY = top;
    }

    if (this.$status === 'opened') {
      const dialog = this.$core.$dialog;
      if (!dialog) return;

      const rect = dialog.getBoundingClientRect();
      const wrapper = dialog.querySelector(`.${this.css('wrapper')}`) as HTMLElement;

      if (!this.moverState.resizing) {
        const mod = pos.touch ? 20 : 0;
        this.moverState.rm = '';
        this.moverState.resizeTop = false;
        this.moverState.resizeLeft = false;
        this.moverState.resizeBottom = false;
        this.moverState.resizeRight = false;

        let inGrip = false;
        const grip = dialog.querySelector(`.${this.css('grip')}`) as HTMLElement;
        if (this.showGrip && grip) {
          const gRect = grip.getBoundingClientRect();
          if (
            pos.pageY >= gRect.top - mod &&
            pos.pageY <= gRect.bottom &&
            pos.pageX >= gRect.left - mod &&
            pos.pageX <= gRect.right
          ) {
            this.moverState.rm = 'se';
            this.moverState.resizeBottom = true;
            this.moverState.resizeRight = true;
            inGrip = true;
          }
        }

        if (!inGrip) {
          if (pos.pageY >= rect.top && pos.pageY < rect.top + this.resizeMargin) {
            this.moverState.resizeTop = true;
            this.moverState.rm += 'n';
          }
          if (pos.pageY <= rect.bottom && pos.pageY > rect.bottom - this.resizeMargin) {
            this.moverState.resizeBottom = true;
            this.moverState.rm += 's';
          }
          if (pos.pageX >= rect.left && pos.pageX < rect.left + this.resizeMargin) {
            this.moverState.resizeLeft = true;
            this.moverState.rm += 'w';
          }
          if (pos.pageX <= rect.right && pos.pageX > rect.right - this.resizeMargin) {
            this.moverState.resizeRight = true;
            this.moverState.rm += 'e';
          }
        }

        if (this.moverState.rm !== '') {
          let cs = '';
          switch (this.moverState.rm) {
            case 'n':
            case 's':
              cs = 'ns-resize';
              break;
            case 'e':
            case 'w':
              cs = 'ew-resize';
              break;
            case 'ne':
            case 'sw':
              cs = 'nesw-resize';
              break;
            case 'nw':
            case 'se':
              cs = 'nwse-resize';
              break;
          }
          wrapper.style.cursor = cs;
        } else {
          wrapper.style.cursor = '';
        }
      } else {
        if (e.cancelable) e.preventDefault();

        const relX = pos.pageX - this.moverState.rmX;
        const relY = pos.pageY - this.moverState.rmY;
        const content = dialog.querySelector(`.${this.css('content')}`) as HTMLElement;

        this.moverState.rmX = pos.pageX;
        this.moverState.rmY = pos.pageY;

        const cRect = content.getBoundingClientRect();
        const dRect = dialog.getBoundingClientRect();

        if (relY !== 0) {
          if (this.moverState.resizeTop) {
            if (cRect.height - relY > this.sizeMinHeight) {
              content.style.height = `${cRect.height - relY}px`;
              dialog.style.top = `${dRect.top + relY}px`;
            }
          }
          if (this.moverState.resizeBottom) {
            if (cRect.height + relY > this.sizeMinHeight) {
              content.style.height = `${cRect.height + relY}px`;
            }
          }
        }

        if (relX !== 0) {
          if (this.moverState.resizeLeft) {
            if (cRect.width - relX > this.sizeMinWidth) {
              dialog.style.width = `${dRect.width - relX}px`;
              dialog.style.left = `${dRect.left + relX}px`;
            }
          }
          if (this.moverState.resizeRight) {
            if (cRect.width + relX > this.sizeMinWidth) {
              dialog.style.width = `${dRect.width + relX}px`;
            }
          }
        }

        if (relX !== 0 || relY !== 0) {
          this._savePosizeCookie();
        }
      }
    }
  }

  private _mouseUp(_e?: MouseEvent | TouchEvent): void {
    if (this.moverState.resizing) {
      this.moverState.rm = '';
      this.moverState.resizing = false;
      const wrapper = this.$core.$dialog?.querySelector(`.${this.css('wrapper')}`) as HTMLElement;
      if (wrapper) wrapper.style.cursor = '';
    }

    if (this.moverState.dr) {
      this.moverState.moving = false;
      this.moverState.dr.classList.remove(this.css('drag'));
      this.moverState.dr = null;
      this._savePosizeCookie();
    }
  }

  private _touchEnd(e: TouchEvent): void {
    if (e.touches.length === 0) {
      this._mouseUp(e);
    }
  }

  protected override _savePosizeCookie(): void {
    if (this.savePosize && this.$core.$useCookie) {
      const dialog = this.$core.$dialog;
      const content = dialog?.querySelector(`.${this.css('content')}`) as HTMLElement;
      if (!dialog || !content) return;

      const rect = dialog.getBoundingClientRect();
      const cRect = content.getBoundingClientRect();

      const poSize = {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        cWidth: cRect.width,
        cHeight: cRect.height,
      };

      Cookies.set(this.cookiePosizeCode, JSON.stringify(poSize), {
        expires: this.cookiePosizeExpiration,
        path: '/',
      });
    }
  }
}
