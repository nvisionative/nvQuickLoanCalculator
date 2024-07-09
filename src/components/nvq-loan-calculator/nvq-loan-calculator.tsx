import { Component, Host, Prop, h, State } from '@stencil/core';

/**
 * A loan calculator component.
 * @slot heading - Can be used to inject heading content on top of the calculator.
 * @slot examples - Can be used to inject examples content on the left side of the calculator.
 * @slot footnote - Can be used to inject footnote content below the calculator.
 * */
@Component({
  tag: 'nvq-loan-calculator',
  styleUrl: 'nvq-loan-calculator.scss',
  shadow: true,
})
export class NvqLoanCalculator {
  /** The heading for EXAMPLES section. */
  @Prop() examplesHeading?: string = "EXAMPLES";

  /** The heading for CALCULATOR section. */
  @Prop() calculatorHeading?: string = "CALCULATOR";

  /** The Total Amount label. */
  @Prop() totalAmountLabel?: string = "Total Amount";

  /** The Down Payment label. */
  @Prop() downPaymentLabel?: string = "Down Payment";

  /** The Interest Rate label. */
  @Prop() interestRateLabel?: string = "Interest Rate";

  /** The AmortizationPeriod label. */
  @Prop() amortizationPeriodLabel?: string = "Amortization Period";

  /** The monthly payment label. */
  @Prop() monthlyPaymentLabel?: string = "Monthly Payment";

  /** The monthly payment footnote. */
  @Prop() monthlyPaymentDisclaimer?: string = "estimated payment";
  
  @State() totalAmount: number;
  @State() downPayment: number;
  @State() interestRate: number;
  @State() amortizationYears: number;

  private onlyAllowNumbers(e: KeyboardEvent): void {
    const key = e.key;

    if (key === '-' || key === '+') {
      e.preventDefault();
      return;
    }

    // Allow control keys (backspace, delete, arrow keys, tab, etc.)
    if (
      key === 'Backspace' ||
      key === 'Delete' ||
      key === 'ArrowLeft' ||
      key === 'ArrowRight' ||
      key === 'ArrowUp' ||
      key === 'ArrowDown' ||
      key === 'Tab' ||
      key === "Home" ||
      key === "End"
    ) {
      return;
    }

    // Allow only numbers and decimal separator
    if (!/^\d$/.test(key) && key !== '.' && key !== ',') {
      e.preventDefault();
    }
  }

  private getValidatedNumber(target: HTMLInputElement, digits: number, defaultValue: number = 0): number {
    if (target.validity.valid) {
      const value = parseFloat(target.value);
      const roundedValue = this.roundTo(value, digits);
      target.dataset.lastValidValue = roundedValue.toString();
      return roundedValue;
    }
  
    if (target.dataset.lastValidValue === undefined) {
      target.dataset.lastValidValue = defaultValue.toString();
    }
  
    target.value = this.roundTo(parseFloat(target.dataset.lastValidValue), digits).toString();
    this.displayErrorIfAny(target);
    return this.roundTo(parseFloat(target.dataset.lastValidValue), digits);
  }

  private roundTo(value: number, digits: number): number {
    const factor = Math.pow(10, digits);
    return Math.round(value * factor) / factor;
  }

  private displayErrorIfAny(target: HTMLInputElement): void {
    var errorElement = target.parentNode.querySelector('.error');
    if (errorElement) {
      errorElement.textContent = '';
    }
    
    if (target.validity.valueMissing) {
      var labelElement = target.parentNode.querySelector('label');
      if (errorElement && labelElement) {
        errorElement.textContent = `${labelElement.textContent} is required.`;
        return;
      }

      if (errorElement) {
        errorElement.textContent = 'Please enter a valid value.';
        return;
      }

      target.reportValidity();
    }
  }

  private calculatePayment() {
    // Assuming monthly compounding.
    const monthlyInterestRate = this.interestRate / 100 / 12;
    if (this.amortizationYears === undefined){
      return "";
    }
    const numberOfPayments = this.amortizationYears * 12;

    if (monthlyInterestRate === 0) {
      return ((this.totalAmount - this.downPayment) / numberOfPayments).toFixed(2);
    }

    const monthlyPayment = (this.totalAmount - this.downPayment) * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);


    if (isNaN(monthlyPayment)){
      return "";
    }

    return monthlyPayment.toFixed(2);
  }

  render() {
    return <Host>
      <slot name="heading">
        <h2>Explore Your Scenario</h2>
        <p>
          Use our Monthly Payment Calculator to find your estimated monthly payment. Then contact one of our experienced and helpful loan representatives to discuss which program is best for you.
        </p>
      </slot>
      <div class="container">
        <div class="examples">
          <h3>{this.examplesHeading}</h3>
          <slot name="examples">
          </slot>
        </div>
        <div class="calculator">
          <h3 class="text-center">{this.calculatorHeading}</h3>
          <div class="inputs">
            <div class="input-wrapper dollars">
              <label>{this.totalAmountLabel}</label>
              <input
                type="number"
                placeholder={this.totalAmountLabel}
                min={0}
                step={.01}
                required
                value={this.totalAmount}
                onKeyDown={e => this.onlyAllowNumbers(e)}
                onInput={e => this.totalAmount = this.getValidatedNumber(e.target as HTMLInputElement, 2)}
                onBlur={e => this.displayErrorIfAny(e.target as HTMLInputElement)}
              />
              <div class="error"></div>
            </div>
            <div class="input-wrapper dollars">
              <label>{this.downPaymentLabel}</label>
              <input
                type="number"
                placeholder={this.downPaymentLabel}
                min={0}
                max={this.totalAmount}
                step={0.01}
                required
                value={this.downPayment}
                onKeyDown={e => this.onlyAllowNumbers(e)}
                onInput={e => this.downPayment = this.getValidatedNumber(e.target as HTMLInputElement, 2)}
                onBlur={e => this.displayErrorIfAny(e.target as HTMLInputElement)}
              />
              <div class="error"></div>
            </div>
            <div class="input-wrapper percent">
              <label>{this.interestRateLabel}</label>
              <input
                type="number"
                placeholder={this.interestRateLabel}
                min={0}
                max={100}
                step={0.01}
                required
                value={this.interestRate}
                onKeyDown={e => this.onlyAllowNumbers(e)}
                onInput={e => this.interestRate = this.getValidatedNumber(e.target as HTMLInputElement, 2)}
                onBlur={e => this.displayErrorIfAny(e.target as HTMLInputElement)}
              />
              <div class="error"></div>
            </div>
            <div class="input-wrapper years">
              <label>{this.amortizationPeriodLabel}</label>
              <input
                type="number"
                placeholder={this.amortizationPeriodLabel}
                min={1}
                step={1}
                required
                value={this.amortizationYears}
                onKeyDown={e => this.onlyAllowNumbers(e)}
                onInput={e => this.amortizationYears = this.getValidatedNumber(e.target as HTMLInputElement, 0, 1)}
                onBlur={e => this.displayErrorIfAny(e.target as HTMLInputElement)}
              />
              <div class="error"></div>
            </div>
          </div>
        </div>
        <div class="result">
          <h4 class="text-center">{this.monthlyPaymentLabel}<sup>‡</sup></h4>
          <span class="output">${this.calculatePayment()}</span>
            <p class="disclaimer"><sup>‡</sup>{this.monthlyPaymentDisclaimer}</p>
        </div>
      </div>
      <slot name="footnote">
        <hr />
        <p>
          <small>
            * Your APR and monthly payment may differ based on loan purpose, amount, term, and your credit profile. Subject to credit approval. Conditions and limitations apply. Advertised rates and terms are subject to change without notice. Exact interest rate determined by credit profile.
          </small>
        </p>
      </slot>
    </Host>
  }
}
