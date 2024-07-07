# nvq-loan-calculator



<!-- Auto Generated Below -->


## Overview

A loan calculator component.

## Properties

| Property                   | Attribute                    | Description                         | Type     | Default                 |
| -------------------------- | ---------------------------- | ----------------------------------- | -------- | ----------------------- |
| `amortizationPeriodLabel`  | `amortization-period-label`  | The AmortizationPeriod label.       | `string` | `"Amortization Period"` |
| `calculatorHeading`        | `calculator-heading`         | The heading for CALCULATOR section. | `string` | `"CALCULATOR"`          |
| `downPaymentLabel`         | `down-payment-label`         | The Down Payment label.             | `string` | `"Down Payment"`        |
| `examplesHeading`          | `examples-heading`           | The heading for EXAMPLES section.   | `string` | `"EXAMPLES"`            |
| `interestRateLabel`        | `interest-rate-label`        | The Interest Rate label.            | `string` | `"Interest Rate"`       |
| `monthlyPaymentDisclaimer` | `monthly-payment-disclaimer` | The monthly payment footnote.       | `string` | `"estimated payment"`   |
| `monthlyPaymentLabel`      | `monthly-payment-label`      | The monthly payment label.          | `string` | `"Monthly Payment"`     |
| `totalAmountLabel`         | `total-amount-label`         | The Total Amount label.             | `string` | `"Total Amount"`        |


## Slots

| Slot         | Description                                                                |
| ------------ | -------------------------------------------------------------------------- |
| `"examples"` | Can be used to inject examples content on the left side of the calculator. |
| `"footnote"` | Can be used to inject footnote content below the calculator.               |
| `"heading"`  | Can be used to inject heading content on top of the calculator.            |


## CSS Custom Properties

| Name                             | Description                                                                     |
| -------------------------------- | ------------------------------------------------------------------------------- |
| `--background-color-contrast`    | A color that contrasts well with the overall background gradient.               |
| `--background-color-top`         | Defines the top color of the gradient that covers the component background.     |
| `--calculator-background-bottom` | Defines the bottom color of the gradient that covers the calculator background. |
| `--calculator-background-top`    | Defines the top color of the gradient that covers the calculator background.    |
| `--calculator-color-contrast`    | A color that contrasts well with the calculator background gradient.            |
| `--calculator-header-background` | The background color of the calculator header.                                  |
| `--calculator-header-foreground` | The color of the text in the calculator header.                                 |
| `--currency-label`               | The label for the currency input.                                               |
| `--error-color`                  | The color of the error text.                                                    |
| `--shadow-color`                 | The color of the shadow that surrounds the calculator, examples and result.     |
| `--years-label`                  | The label for the years input.                                                  |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
