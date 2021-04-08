import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customCurrency'
})
export class CustomCurrencyPipe implements PipeTransform {

  transform(value: number, currency: string): any {

    switch(currency){
      case 'USD':
        return "$".concat(" "+value);
      case 'EUR':
        return "€".concat(" "+value);
      case 'GBP':
        return "£".concat(" "+value);
      case 'JPY':
          return "¥".concat(" "+value);
      case 'CNY':
        return "¥".concat(" "+value);
      case 'RUB':
        return "₽".concat(" "+value); 
      case 'ZAR':
        return "R".concat(" "+value); 
      case 'KES':
        return "Ksh".concat(" "+value); 
      default:
        return currency.concat(" "+value);
    }
  }

}
