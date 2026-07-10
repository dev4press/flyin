export type Position = 'center' | 'left' | 'right' | 'top' | 'bottom' | string | number;

export interface Settings {
  name?: string | null;
  role?: string;
  modal?: boolean;
  zIndex?: number;
  title?: boolean | string;
  titleTag?: string;
  style?: string;
  containerSelector?: string;
  extraClass?: string;
  effect?: string;
  effectSpeed?: number;
  onLoad?: boolean;
  onLoadDelay?: number;
  onLeaveTop?: boolean;
  onLeaveTopOffset?: number;
  onLeaveViewport?: boolean;
  closeEscape?: boolean;
  closeOverlay?: boolean;
  closeAuto?: boolean;
  closeAutoDelay?: number;
  overlayActive?: boolean;
  overlayColor?: string;
  overlayOpacity?: number;
  overlaySpeed?: number;
  save?: Record<string, any>;
  width?: string | number;
  height?: string | number;
  positionX?: Position;
  positionY?: Position;
  offsetX?: string | number;
  offsetY?: string | number;
  minWidth?: string | null;
  maxWidth?: string | null;
  minHeight?: string | null;
  maxHeight?: string | null;
  header?: boolean;
  headerContent?: string | boolean | HTMLElement;
  footer?: boolean;
  footerContent?: string | boolean | HTMLElement;
  buttonX?: boolean;
  buttonXContent?: string | null;
  buttonXSVG?: string;
  buttonFooter?: boolean;
  buttonFooterContent?: string;
  buttonAction?: (this: any, core: any) => void;
  ariaCloseLabel?: string;
  storeCode?: string;
  storePositionSizeCode?: string;
  storePositionSizeExpiration?: number;
  autoShowLimit?: boolean;
  autoShowCounter?: number;
  autoShowDelay?: number;
  attrWrapper?: string;
  attrHeader?: string;
  attrContent?: string;
  attrFooter?: string;
  savePositionSize?: boolean;
  copy?: boolean;
  showGrip?: boolean;
  gripSVG?: string;
  sizeMinWidth?: number;
  sizeMinHeight?: number;
  resizeMargin?: number;
  keysOpen?: string | null;
  keysClose?: string | null;
  content?: string | HTMLElement;
}

export interface MoveOptions {
  positionX?: Position;
  positionY?: Position;
  offsetX?: string | number;
  offsetY?: string | number;
}

export interface ResizeOptions {
  width?: string | number;
  height?: string | number;
}

export interface Callbacks {
  prepared?: (this: any, core: any) => void;
  ready?: (this: any, core: any) => void;
  beforeOpen?: (this: any, core: any) => void;
  afterOpen?: (this: any, core: any) => void;
  beforeClose?: (this: any, core: any) => void;
  afterClose?: (this: any, core: any) => void;
  beforeMove?: (this: any, core: any) => void;
  afterMove?: (this: any, core: any) => void;
  beforeResize?: (this: any, core: any) => void;
  afterResize?: (this: any, core: any) => void;
}

export interface Options {
  skin?: string;
  settings?: Settings;
  callbacks?: Callbacks;
}
