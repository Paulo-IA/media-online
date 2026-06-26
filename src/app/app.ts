import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalInputDirective } from './core/decimal-input.directive';

@Component({
  selector: 'app-root',
  imports: [FormsModule, DecimalInputDirective],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  // Notas das avaliações
  pt1 = signal<number | null>(null);
  pt2 = signal<number | null>(null);
  pi1 = signal<number | null>(null);
  pi2 = signal<number | null>(null);
  nci = signal<number | null>(null);
  npaeg = signal<number | null>(null);
  pontoExtra = signal<number | null>(null);

  mediaFinal = computed(() => {
    const vPT1 = this.pt1() || 0;
    const vPT2 = this.pt2() || 0;
    const vPI1 = this.pi1() || 0;
    const vPI2 = this.pi2() || 0;
    const vNCI = this.nci() || 0;
    const vNPAEG = this.npaeg() || 0;
    const vExtra = this.pontoExtra() || 0;

    const baseCalc =
      (((vPT1 + vPT2) / 2) * 0.25) +
      (((vPI1 + vPI2) / 2) * 0.65) +
      ((vNCI * 0.05) + (vNPAEG * 0.05));

    const final = Math.min(baseCalc + vExtra, 10);

    return final.toFixed(2);
  });
}
