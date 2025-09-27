// types/pixel.d.ts
declare module 'react-meta-pixel' {
    export type StandardEvents =
      | 'ViewContent'
      | 'AddToCart'
      | 'Purchase'
      | 'Lead'
      | 'CompleteRegistration'
      | string; // Allow custom events
  
    export interface PurchaseParameters {
      value: number;
      currency: string;
      content_name?: string;
      content_type?: string;
      content_ids?: string[];
    }
  
    // Extend the original declaration
    const ReactPixel: {
      init: (pixelId: string, advancedMatching?: object, options?: object) => void;
      pageView: () => void;
      track: (event: StandardEvents, data?: object) => void;
      trackCustom: (event: string, data?: object) => void;
    };
  
    export = ReactPixel;
  }