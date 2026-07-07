export type Position = 'center' | 'left' | 'right' | 'top' | 'bottom' | string | number;

export interface Settings {
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
  angle?: number;
  cWidth?: string | number;
  cHeight?: string | number;
  save?: Record<string, any>;
  width?: string | number;
  height?: string | number;
  positionX?: Position;
  positionY?: Position;
  offsetX?: string;
  offsetY?: string;
  minWidth?: string | null;
  maxWidth?: string | null;
  minHeight?: string | null;
  maxHeight?: string | null;
  header?: boolean;
  headerContent?: string | boolean;
  footer?: boolean;
  footerContent?: string | boolean;
  buttonX?: boolean;
  buttonXContent?: string;
  buttonFooter?: boolean;
  buttonFooterContent?: string;
  ariaCloseLabel?: string;
  cookieCode?: string;
  cookiePosizeCode?: string;
  cookiePosizeExpiration?: number;
  autoShowLimit?: boolean;
  autoShowCounter?: number;
  autoShowDelay?: number;
  attrWrapper?: string;
  attrHeader?: string;
  attrContent?: string;
  attrFooter?: string;
  xContentSize?: boolean;
  savePosize?: boolean;
  showGrip?: boolean;
  sizeMinWidth?: number;
  sizeMinHeight?: number;
  resizeMargin?: number;
}

export interface Callbacks {
  prepared?: (this: any, core: any) => void;
  ready?: (this: any, core: any) => void;
  beforeOpen?: (this: any, core: any) => void;
  afterOpen?: (this: any, core: any) => void;
  beforeClose?: (this: any, core: any) => void;
  afterClose?: (this: any, core: any) => void;
}

export interface Options {
  skin?: string;
  settings?: Settings;
  callbacks?: Callbacks;
}
