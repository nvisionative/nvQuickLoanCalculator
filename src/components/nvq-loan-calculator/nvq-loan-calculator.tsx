import { Component, Host, Prop, h, State } from '@stencil/core';

@Component({
  tag: 'nvq-loan-calculator',
  styleUrl: 'nvq-loan-calculator.scss',
  shadow: true,
})
export class NvqLoanCalculator {
  /**
   * The heading for lead copy
   */
  @Prop() heading: string;

  /**
   * The description for lead copy
   */
  @Prop() description: string;

  /**
   * The heading for EXAMPLES section
   */
  @Prop() examplesHeading: string;

  /**
   * Example 1 heading
   */
  @Prop() example1Heading: string;

  /**
   * Example 2 heading
   */
  @Prop() example2Heading: string;

  /**
   * The heading for CALCULATOR section
   */
  @Prop() calculatorHeading: string;

  /**
   * The Total Amount label
   */
  @Prop() totalAmountLabel: string;

  /**
   * The Down Payment label
   */
  @Prop() downPaymentLabel: string;

  /**
   * The Interest Rate label
   */
  @Prop() interestRateLabel: string;

  /**
   * The AmortizationPeriod label
   */
  @Prop() amortizationPeriodLabel: string;

  /**
   * The monthly payment label
   */
  @Prop() monthlyPaymentLabel: string;

  /**
  /**
   * The monthly payment footnote (optional)
   */
  @Prop() monthlyPaymentFootnote: string;

  /**
  /**
   * The interest rate footnote - used with Examples section (optional)
   */
  @Prop() interestRateFootnote: string;
  
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

  private getValidatedNumber(target: HTMLInputElement, digits: number): number {
    if (target.validity.valid) {
      const value = parseFloat(target.value);
      const roundedValue = this.roundTo(value, digits);
      target.dataset.lastValidValue = roundedValue.toString();
      return roundedValue;
    }
  
    if (target.dataset.lastValidValue === undefined) {
      target.dataset.lastValidValue = "0";
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
    const numberOfPayments = this.amortizationYears * 12;

    if (monthlyInterestRate === 0) {
      return (this.totalAmount - this.downPayment) / numberOfPayments;
    }

    const monthlyPayment = (this.totalAmount - this.downPayment) * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);


    if (isNaN(monthlyPayment)){
      return "";
    }

    return monthlyPayment.toFixed(2);
  }

  render() {
    return <Host>
      <h2>{this.heading}</h2>
      <p>{this.description}</p>
      <div class="container">
        <div class="examples">
          <h3>{this.examplesHeading}</h3>
          <div class="example">
            <h5>{this.example1Heading}</h5>
            <ul>
              <li><span>{this.totalAmountLabel}:</span> <span>$100,000</span></li>
              <li><span>{this.downPaymentLabel}:</span> <span>$0</span></li>
              <li><span>{this.interestRateLabel}:</span> <span>8.49%<sup>*</sup></span></li>
              <li><span>{this.amortizationPeriodLabel}:</span> <span>20 Years</span></li>
              <li><span>{this.monthlyPaymentLabel}<sup>*</sup>:</span> <span>$867.19</span></li>
            </ul>
          </div>
          <div class="example">
            <h5>{this.example2Heading}</h5>
            <ul>
              <li><span>{this.totalAmountLabel}:</span> <span>$100,000</span></li>
              <li><span>{this.downPaymentLabel}:</span> <span>$0</span></li>
              <li><span>{this.interestRateLabel}:</span> <span>9.24%<sup>*</sup></span></li>
              <li><span>{this.amortizationPeriodLabel}:</span> <span>30 Years</span></li>
              <li><span>{this.monthlyPaymentLabel}<sup>*</sup>:</span> <span>$821.95</span></li>
            </ul>
          </div>
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
                min={0}
                step={1}
                required
                value={this.amortizationYears}
                onKeyDown={e => this.onlyAllowNumbers(e)}
                onInput={e => this.amortizationYears = this.getValidatedNumber(e.target as HTMLInputElement, 0)}
                onBlur={e => this.displayErrorIfAny(e.target as HTMLInputElement)}
              />
              <div class="error"></div>
            </div>
          </div>
        </div>
        <div class="result">
          <h4 class="text-center">{this.monthlyPaymentLabel}<sup>‡</sup></h4>
          <span class="output">{this.calculatePayment()}$</span>
            <p class="disclaimer mb-4"><sup>‡</sup>{this.monthlyPaymentFootnote}</p>

        </div>
      </div>
      <p><small><sup>*</sup> {this.interestRateFootnote}</small></p>
    </Host>
  }
}
