import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customCurrency'
})
export class CustomCurrencyPipe implements PipeTransform {

  transform(value: number, currency: string): any {

    switch(currency){
      case 'USD':
        return "$".concat(" "+value);
      default:
        return currency.concat(" "+value);
    }
  }

  

}
