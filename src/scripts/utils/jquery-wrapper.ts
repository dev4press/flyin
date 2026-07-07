import { Core } from '../core/Core';

/**
 * Initializes the jQuery wrapper for Smart Animated Popup.
 * This ensures backward compatibility for projects using jQuery.
 *
 * @param $ The jQuery instance
 */
export function initJQueryWrapper($: any): void {
  if (!$) return;

  $.fn.smartAniPopup = function (option: any, name: string) {
    if (option === undefined || typeof option === 'object') {
      return this.each(function (this: HTMLElement) {
        const $elem = $(this);
        // Avoid double initialization
        if ($elem.data('smp-plugin')) return;

        const plugin = new Core(this, option);
        $elem.data('smp-plugin', plugin);
      });
    } else if (typeof option === 'string') {
      if (option === 'get') {
        const values: any[] = [];
        this.each(function (this: HTMLElement) {
          const data = $(this).data('smp-plugin');
          if (data) {
            values.push(data.get(name));
          }
        });

        return values.length === 1 ? values[0] : values;
      } else {
        return this.each(function (this: HTMLElement) {
          const data = $(this).data('smp-plugin');
          if (data && typeof data[option] === 'function') {
            data[option](name);
          }
        });
      }
    }
  };
}
