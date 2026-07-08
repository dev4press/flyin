import { Skin } from '../Skin';
import type { Flyin } from '../Flyin';
import type { Settings } from '../types/types';

export class ResizableSkin extends Skin {
  protected override skinCode = 'resizable';

  private moverState = {
    dr: null as HTMLElement | null,
    width: 0,
    height: 0,
    minLeft: 0,
    maxLeft: 0,
    minTop: 0,
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
    // Initialize ResizableSkin defaults if not provided in options
    this.settings.showGrip = options.showGrip ?? false;
    this.settings.sizeMinWidth = options.sizeMinWidth ?? 200;
    this.settings.sizeMinHeight = options.sizeMinHeight ?? 100;
    this.settings.resizeMargin = options.resizeMargin ?? 5;
  }

  protected override prepareDialog(): void {
    if (this.settings.savePositionSize) {
      const key = this.getPositionSizeStorageKey();
      const storage = key ? localStorage.getItem(key) : null;
      if (storage !== null) {
        try {
          const data = JSON.parse(storage);
          this.storagePositionSize = {
            left: 0,
            top: 0,
            width: 0,
            height: 0,
            cWidth: 0,
            cHeight: 0,
            ...data,
          };
          this.storageUsed = true;
        } catch {
          console.error('Failed to parse ResizableSkin position storage');
        }
      }
    }

    if (this.storageUsed) {
      if (this.storagePositionSize.cHeight === 0) {
        this.storagePositionSize.cHeight = this.storagePositionSize.height;
      }

      this.settings.positionX = this.storagePositionSize.left;
      this.settings.positionY = this.storagePositionSize.top;
      this.settings.width = `${this.storagePositionSize.width}px`;
      this.settings.height = `${this.storagePositionSize.height}px`;

      this.settings.cWidth = 'auto';
      this.settings.cHeight = 'auto';

      const dims = this.getContainerDimensions();
      const offsetX = this.parseOffset(this.settings.offsetX);
      const offsetY = this.parseOffset(this.settings.offsetY);

      if (dims.width < (this.settings.positionX as number) + this.storagePositionSize.width + offsetX) {
        this.settings.positionX = dims.width - this.storagePositionSize.width - offsetX;
      }
      if ((this.settings.positionX as number) < offsetX) {
        this.settings.positionX = offsetX;
      }

      if (dims.height < (this.settings.positionY as number) + this.storagePositionSize.height + offsetY) {
        this.settings.positionY = dims.height - this.storagePositionSize.height - offsetY;
      }
      if ((this.settings.positionY as number) < offsetY) {
        this.settings.positionY = offsetY;
      }
    }
  }

  public override createDialog(): void {
    super.createDialog();

    if (this.settings.showGrip) {
      const grip = document.createElement('div');
      grip.className = this.css('grip');
      grip.setAttribute('aria-hidden', 'true');
      grip.innerHTML = this.settings.gripSVG || '';
      this.core.dialog?.querySelector(`.${this.css('footer')}`)?.appendChild(grip);
    }

    this.setupMover();
  }

  private setupMover(): void {
    const wrapper = this.core.dialog?.querySelector(`.${this.css('wrapper')}`) as HTMLElement;
    const header = this.core.dialog?.querySelector(`.${this.css('header')}`) as HTMLElement;
    const grip = this.core.dialog?.querySelector(`.${this.css('grip')}`) as HTMLElement;

    if (grip) {
      grip.addEventListener('mousedown', (e) => this.mouseDownWrapper(e));
      grip.addEventListener('touchstart', (e) => this.mouseDownWrapper(e), { passive: false });
    }

    if (wrapper) {
      wrapper.addEventListener('mousedown', (e) => this.mouseDownWrapper(e));
      wrapper.addEventListener('touchstart', (e) => this.mouseDownWrapper(e), { passive: false });
    }

    if (header) {
      header.style.cursor = 'move';
      header.addEventListener('mousedown', (e) => this.mouseDown(e));
      header.addEventListener('touchstart', (e) => this.mouseDown(e), { passive: false });
    }

    document.addEventListener('mousemove', (e) => this.mouseMove(e));
    document.addEventListener('mouseup', (e) => this.mouseUp(e));
    document.addEventListener('touchmove', (e) => this.mouseMove(e), { passive: false });
    document.addEventListener('touchend', (e) => this.touchEnd(e));
  }

  private mousePos(e: MouseEvent | TouchEvent) {
    if ('clientX' in e) {
      return { pageX: e.clientX, pageY: e.clientY, touch: false };
    } else if (e.touches && e.touches.length > 0) {
      return { pageX: e.touches[0].clientX, pageY: e.touches[0].clientY, touch: true };
    }
    return null;
  }

  private mouseDownWrapper(e: MouseEvent | TouchEvent): void {
    const pos = this.mousePos(e);
    if (!pos) return;

    this.updateRM(pos);
    if (this.moverState.rm === '') return;

    this.moverState.resizing = true;
    this.moverState.rmX = pos.pageX;
    this.moverState.rmY = pos.pageY;
    e.stopPropagation();
  }

  private updateRM(pos: { pageX: number; pageY: number; touch: boolean }): void {
    const dialog = this.core.dialog;
    if (!dialog) return;

    const rect = dialog.getBoundingClientRect();
    const mod = pos.touch ? 20 : 0;
    this.moverState.rm = '';
    this.moverState.resizeTop = false;
    this.moverState.resizeLeft = false;
    this.moverState.resizeBottom = false;
    this.moverState.resizeRight = false;

    let inGrip = false;
    const grip = dialog.querySelector(`.${this.css('grip')}`) as HTMLElement;
    if (this.settings.showGrip && grip) {
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
      if (pos.pageY >= rect.top && pos.pageY < rect.top + (this.settings.resizeMargin || 5)) {
        this.moverState.resizeTop = true;
        this.moverState.rm += 'n';
      }
      if (pos.pageY <= rect.bottom && pos.pageY > rect.bottom - (this.settings.resizeMargin || 5)) {
        this.moverState.resizeBottom = true;
        this.moverState.rm += 's';
      }
      if (pos.pageX >= rect.left && pos.pageX < rect.left + (this.settings.resizeMargin || 5)) {
        this.moverState.resizeLeft = true;
        this.moverState.rm += 'w';
      }
      if (pos.pageX <= rect.right && pos.pageX > rect.right - (this.settings.resizeMargin || 5)) {
        this.moverState.resizeRight = true;
        this.moverState.rm += 'e';
      }
    }
  }

  private mouseDown(e: MouseEvent | TouchEvent): void {
    if (this.moverState.rm !== '') return;
    const pos = this.mousePos(e);
    if (!pos) return;

    this.moverState.moving = true;
    e.stopPropagation();
    const dialog = this.core.dialog;
    if (!dialog) return;

    dialog.classList.add(this.css('drag'));
    this.moverState.dr = dialog;

    const rect = dialog.getBoundingClientRect();
    this.moverState.width = rect.width;
    this.moverState.height = rect.height;

    const containerRect = this.getContainer().getBoundingClientRect();
    const isBody = this.getContainer() === document.body;

    const currentLeft = isBody ? rect.left : rect.left - containerRect.left;
    const currentTop = isBody ? rect.top : rect.top - containerRect.top;

    dialog.style.left = `${currentLeft}px`;
    dialog.style.top = `${currentTop}px`;
    dialog.style.right = 'auto';
    dialog.style.bottom = 'auto';

    const dims = this.getContainerDimensions();
    const offsetX = this.parseOffset(this.settings.offsetX);
    const offsetY = this.parseOffset(this.settings.offsetY);

    this.moverState.minLeft = offsetX;
    this.moverState.maxLeft = dims.width - this.moverState.width - offsetX;
    this.moverState.minTop = offsetY;
    this.moverState.maxTop = dims.height - this.moverState.height - offsetY;

    this.moverState.posX = rect.left + this.moverState.width - pos.pageX;
    this.moverState.posY = rect.top + this.moverState.height - pos.pageY;
  }

  private mouseMove(e: MouseEvent | TouchEvent): void {
    const pos = this.mousePos(e);
    if (!pos) return;

    if (this.moverState.dr) {
      if (e.cancelable) e.preventDefault();

      const containerRect = this.getContainer().getBoundingClientRect();
      const isBody = this.getContainer() === document.body;

      let left = pos.pageX + this.moverState.posX - this.moverState.width;
      let top = pos.pageY + this.moverState.posY - this.moverState.height;

      if (!isBody) {
        left -= containerRect.left;
        top -= containerRect.top;
      }

      left = Math.max(this.moverState.minLeft, Math.min(left, this.moverState.maxLeft));
      top = Math.max(this.moverState.minTop, Math.min(top, this.moverState.maxTop));

      this.moverState.dr.style.left = `${left}px`;
      this.moverState.dr.style.top = `${top}px`;

      this.settings.positionX = left;
      this.settings.positionY = top;
    }

    if (this.status === 'opened') {
      const dialog = this.core.dialog;
      if (!dialog) return;

      const wrapper = dialog.querySelector(`.${this.css('wrapper')}`) as HTMLElement;
      const header = dialog.querySelector(`.${this.css('header')}`) as HTMLElement;

      if (!this.moverState.resizing) {
        this.updateRM(pos);

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
          if (header) header.style.cursor = cs;
        } else {
          wrapper.style.cursor = '';
          if (header) header.style.cursor = 'move';
        }
      } else {
        if (e.cancelable) e.preventDefault();

        const relX = pos.pageX - this.moverState.rmX;
        const relY = pos.pageY - this.moverState.rmY;

        this.moverState.rmX = pos.pageX;
        this.moverState.rmY = pos.pageY;

        const dRect = dialog.getBoundingClientRect();
        const containerRect = this.getContainer().getBoundingClientRect();
        const isBody = this.getContainer() === document.body;

        const offsetX = this.parseOffset(this.settings.offsetX);
        const offsetY = this.parseOffset(this.settings.offsetY);

        if (relY !== 0) {
          if (this.moverState.resizeTop) {
            let actualRelY = relY;
            const topLimit = (isBody ? 0 : containerRect.top) + offsetY;
            if (dRect.top + actualRelY < topLimit) actualRelY = topLimit - dRect.top;
            if (dRect.height - actualRelY > (this.settings.sizeMinHeight || 100)) {
              dialog.style.height = `${dRect.height - actualRelY}px`;
              dialog.style.top = `${(isBody ? dRect.top : dRect.top - containerRect.top) + actualRelY}px`;
            }
          }
          if (this.moverState.resizeBottom) {
            let actualRelY = relY;
            const dims = this.getContainerDimensions();
            const bottomLimit = (isBody ? dims.height : containerRect.bottom) - offsetY;
            if (dRect.bottom + actualRelY > bottomLimit) actualRelY = bottomLimit - dRect.bottom;
            if (dRect.height + actualRelY > (this.settings.sizeMinHeight || 100)) {
              dialog.style.height = `${dRect.height + actualRelY}px`;
            }
          }
        }

        if (relX !== 0) {
          if (this.moverState.resizeLeft) {
            let actualRelX = relX;
            const leftLimit = (isBody ? 0 : containerRect.left) + offsetX;
            if (dRect.left + actualRelX < leftLimit) actualRelX = leftLimit - dRect.left;
            if (dRect.width - actualRelX > (this.settings.sizeMinWidth || 90)) {
              dialog.style.width = `${dRect.width - actualRelX}px`;
              dialog.style.left = `${(isBody ? dRect.left : dRect.left - containerRect.left) + actualRelX}px`;
            }
          }
          if (this.moverState.resizeRight) {
            let actualRelX = relX;
            const dims = this.getContainerDimensions();
            const rightLimit = (isBody ? dims.width : containerRect.right) - offsetX;
            if (dRect.right + actualRelX > rightLimit) actualRelX = rightLimit - dRect.right;
            if (dRect.width + actualRelX > (this.settings.sizeMinWidth || 90)) {
              dialog.style.width = `${dRect.width + actualRelX}px`;
            }
          }
        }

        if (relX !== 0 || relY !== 0) {
          this.save();
        }
      }
    }
  }

  private mouseUp(_e?: MouseEvent | TouchEvent): void {
    if (this.moverState.resizing) {
      this.moverState.rm = '';
      this.moverState.resizing = false;
      const dialog = this.core.dialog;
      const wrapper = dialog?.querySelector(`.${this.css('wrapper')}`) as HTMLElement;
      const header = dialog?.querySelector(`.${this.css('header')}`) as HTMLElement;
      if (wrapper) wrapper.style.cursor = '';
      if (header) header.style.cursor = 'move';
    }

    if (this.moverState.dr) {
      this.moverState.moving = false;
      this.moverState.dr.classList.remove(this.css('drag'));
      this.moverState.dr = null;
      this.save();
    }
  }

  private touchEnd(e: TouchEvent): void {
    if (e.touches.length === 0) {
      this.mouseUp(e);
    }
  }

  protected override genPositionSizeStorage(): Record<string, any> {
    const dialog = this.core.dialog;
    const content = dialog?.querySelector(`.${this.css('content')}`) as HTMLElement;
    if (!dialog || !content) return {};

    const rect = dialog.getBoundingClientRect();
    const cRect = content.getBoundingClientRect();
    const containerRect = this.getContainer().getBoundingClientRect();
    const isBody = this.getContainer() === document.body;

    return {
      left: isBody ? rect.left : rect.left - containerRect.left,
      top: isBody ? rect.top : rect.top - containerRect.top,
      width: rect.width,
      height: rect.height,
      cWidth: cRect.width,
      cHeight: cRect.height,
    };
  }
}
