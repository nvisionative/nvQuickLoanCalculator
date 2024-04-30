import { Component, Host, Prop, h } from '@stencil/core';

@Component({
  tag: 'nvq-loan-calculator',
  styleUrl: 'nvq-loan-calculator.css',
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

  render() {
    return <Host>
      <h2>{this.heading}</h2>
      <p>{this.description}</p>
      <div class="container calculator">
        <div class="row justify-content-center">
          <div class="col-lg-3 bg-gradient my-3 d-flex flex-column text-white">
            <h3 class="text-center">{this.examplesHeading}</h3>
            <h5 class="mt-2">{this.example1Heading}</h5>
            <ul>
              <li><span>{this.totalAmountLabel}:</span> <span>$100,000</span></li>
              <li><span>{this.downPaymentLabel}:</span> <span>$0</span></li>
              <li><span>{this.interestRateLabel}:</span> <span>8.49%<sup>*</sup></span></li>
              <li><span>{this.amortizationPeriodLabel}:</span> <span>20 Years</span></li>
              <li><span>{this.monthlyPaymentLabel}<sup>*</sup>:</span> <span>$867.19</span></li>
            </ul>
            <h5 class="mt-4">{this.example2Heading}</h5>
            <ul>
              <li><span>{this.totalAmountLabel}:</span> <span>$100,000</span></li>
              <li><span>{this.downPaymentLabel}:</span> <span>$0</span></li>
              <li><span>{this.interestRateLabel}:</span> <span>9.24%<sup>*</sup></span></li>
              <li><span>{this.amortizationPeriodLabel}:</span> <span>30 Years</span></li>
              <li><span>{this.monthlyPaymentLabel}<sup>*</sup>:</span> <span>$821.95</span></li>
            </ul></div>
          <div class="col-lg-4 bg-gray calculator-form d-flex flex-column">
            <div class="row">
              <div class="col bg-dark text-white p-3">
                <h3 class="text-center">{this.calculatorHeading}</h3>
              </div></div>
            <div class="row align-items-center box">
              <div class="col py-5">
                <div class="rmcp-input">
                  <label>{this.totalAmountLabel}</label>
                  <input type="text" class="rmcp-input-text" placeholder={this.totalAmountLabel} value="" />
                  <span class="rmcp-error"></span>
                </div>
                <div class="rmcp-input">
                  <label>{this.downPaymentLabel}</label>
                  <input type="text" class="rmcp-input-text " placeholder={this.downPaymentLabel} value="" />
                  <span class="rmcp-error"></span>
                </div>
                <div class="rmcp-input">
                  <label>{this.interestRateLabel}</label>
                  <input type="text" class="rmcp-input-text " placeholder={this.interestRateLabel} value="" />
                  <span class="rmcp-error"></span>
                </div>
                <div class="rmcp-input">
                  <label>{this.amortizationPeriodLabel}</label>
                  <input type="text" class="rmcp-input-text " placeholder={this.amortizationPeriodLabel} value="" />
                  <span class="rmcp-error"></span>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-3  bg-gradient my-3 d-flex flex-column text-white p-4 align-items-center justify-content-between">
            <div class="d-flex flex-column justify-content-center">
              <h4 class="text-center">{this.monthlyPaymentLabel}<sup>‡</sup></h4>
              <div class="d-flex justify-content-center">
                <span class="output">$</span>
                <div class="rmcp-results rmcp-results-6">
                  <div class="rmcp-results-detailed"></div>
                </div>
              </div>
            </div>
            <div class="text-center">
              <p class="disclaimer mb-4"><sup>‡</sup>{this.monthlyPaymentFootnote}</p>
            </div>
          </div>
          <p></p>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <p><small><sup>*</sup> {this.interestRateFootnote}</small></p>
        </div>
      </div>
    </Host>
  }
}
