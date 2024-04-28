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

  render() {
    return <Host>
      <h2>{this.heading}</h2>
      <p>{this.description}</p>
    </Host>
  }
}
