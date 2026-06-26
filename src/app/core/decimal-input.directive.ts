import { Directive, HostListener, ElementRef, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appDecimal]',
  standalone: true
})
export class DecimalInputDirective {
  @Input() maxLimit: number = 10;

  constructor(private el: ElementRef, private control: NgControl) { }

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let textValue = input.value;

    // 1. Substitui vírgula por ponto e arranca fora qualquer letra
    textValue = textValue.replace(/,/g, '.').replace(/[^0-9.]/g, '');

    // 2. Impede que o usuário digite múltiplos pontos (ex: 8.5.2 vira 8.52)
    const parts = textValue.split('.');
    if (parts.length > 2) {
      textValue = parts[0] + '.' + parts.slice(1).join('');
    }

    // 3. Extrai o número para a matemática
    let numericValue = parseFloat(textValue);

    // 4. Trava no limite máximo (ex: 10 ou 0.5)
    if (!isNaN(numericValue) && numericValue > this.maxLimit) {
      numericValue = this.maxLimit;
      textValue = this.maxLimit.toString();
    }

    // 5. Define o valor que vai pro Signal (nulo se estiver vazio ou for só ".")
    const valueToEmit = isNaN(numericValue) ? null : numericValue;

    // 6. Atualiza o Angular (Isso garante que a média final continue calculando!)
    this.control.control?.setValue(valueToEmit);

    // 7. O PULO DO GATO:
    // O setValue acima faz o Angular reescrever a tela e engolir o ponto final.
    // Usamos o setTimeout (uma macro-task) para forçar o DOM a manter a string
    // original digitada ("8." ou ".") no próximo ciclo do Event Loop.
    setTimeout(() => {
      input.value = textValue;
    });
  }
}
