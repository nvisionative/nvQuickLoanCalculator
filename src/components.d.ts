/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
export namespace Components {
    interface NvqLoanCalculator {
        /**
          * The description for lead copy
         */
        "description": string;
        /**
          * The heading for lead copy
         */
        "heading": string;
    }
}
declare global {
    interface HTMLNvqLoanCalculatorElement extends Components.NvqLoanCalculator, HTMLStencilElement {
    }
    var HTMLNvqLoanCalculatorElement: {
        prototype: HTMLNvqLoanCalculatorElement;
        new (): HTMLNvqLoanCalculatorElement;
    };
    interface HTMLElementTagNameMap {
        "nvq-loan-calculator": HTMLNvqLoanCalculatorElement;
    }
}
declare namespace LocalJSX {
    interface NvqLoanCalculator {
        /**
          * The description for lead copy
         */
        "description"?: string;
        /**
          * The heading for lead copy
         */
        "heading"?: string;
    }
    interface IntrinsicElements {
        "nvq-loan-calculator": NvqLoanCalculator;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "nvq-loan-calculator": LocalJSX.NvqLoanCalculator & JSXBase.HTMLAttributes<HTMLNvqLoanCalculatorElement>;
        }
    }
}
