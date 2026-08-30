declare module "h5p-standalone" {
  export interface H5POptions {
    h5pJsonPath: string;
    frameJs?: string;
    frameCss?: string;
  }

  export class H5P {
    constructor(element: HTMLElement, options: H5POptions);
  }
}
