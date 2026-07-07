import './styles/main.scss';
import { initJQueryWrapper } from './scripts/utils/jquery-wrapper';

export { Core as SmartAniPopup } from './scripts/core/Core';
export { Skin } from './scripts/core/Skin';
export { FreeSkin } from './scripts/skins/FreeSkin';
export * from './scripts/core/types';
export { initJQueryWrapper };

// Auto-initialize jQuery wrapper if jQuery is present
if (typeof window !== 'undefined' && (window as any).jQuery) {
  initJQueryWrapper((window as any).jQuery);
}
