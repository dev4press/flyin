export class Base {
  [key: string]: any;

  constructor(defaults: any = {}, options: any = {}) {
    this.setOptions({ ...defaults, ...options });
  }

  setOption(index: string, value: any): void {
    this[index] = value;
  }

  getOption(index: string): any {
    return this[index] !== undefined ? this[index] : false;
  }

  setOptions(options: any): void {
    for (const key in options) {
      if (Object.prototype.hasOwnProperty.call(options, key)) {
        this.setOption(key, options[key]);
      }
    }
  }

  getOptions(): any {
    return this;
  }

  callback(method: ((...args: any[]) => void) | any, ...args: any[]): void {
    if (typeof method === 'function') {
      method.apply(this, args);
    }
  }
}
