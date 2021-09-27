import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customCurrency'
})
export class CustomCurrencyPipe implements PipeTransform {

  transform(value: number, currency: string): any {

    switch(currency){
      case 'USD':
        return "$".concat(" "+value); 
      case 'CAD':
        return "CA$".concat(" "+value); 
      case 'EUR':
        return "€".concat(" "+value); 
      case 'AFN':
        return "Af".concat(" "+value); 
      case 'ARS':
        return "AR$".concat(" "+value); 
      case 'AUD':
        return "AU$".concat(" "+value); 
      case 'AZN':
        return "man.".concat(" "+value); 
      case 'BAM':
        return "KM".concat(" "+value); 
      case 'BDT':
        return "Tk".concat(" "+value); 
      case 'BHD':
        return "BD".concat(" "+value); 
      case 'BIF':
        return "FBu".concat(" "+value); 
      case 'BND':
        return "BN$".concat(" "+value); 
      case 'BOB':
        return "Bs".concat(" "+value); 
      case 'BRL':
        return "R$".concat(" "+value); 
      case 'BYN':
        return "Br".concat(" "+value); 
      case 'BZD':
        return "BZ$".concat(" "+value); 
      case 'CLP':
        return "CL$".concat(" "+value); 
      case 'CNY':
        return "CN¥".concat(" "+value); 
      case 'COP':
        return "CO$".concat(" "+value); 
      case 'CRC':
        return "₡".concat(" "+value); 
      case 'CVE':
        return "CV$".concat(" "+value); 
      case 'CZK':
        return "Kč".concat(" "+value); 
      case 'DJF':
        return "Fdj".concat(" "+value); 
      case 'DKK':
        return "Dkr".concat(" "+value); 
      case 'DOP':
        return "RD$".concat(" "+value); 
      case 'DZD':
        return "DA".concat(" "+value); 
      case 'EEK':
        return "Ekr".concat(" "+value); 
      case 'ERN':
        return "Nfk".concat(" "+value);
      case 'ETB':
        return "Br".concat(" "+value); 
      case 'GBP':
        return "£".concat(" "+value); 
      case 'GHS':
        return "GH₵".concat(" "+value);  
      case 'GNF':
        return "FG".concat(" "+value); 
      case 'HKD':
        return "HK$".concat(" "+value); 
      case 'HRK':
        return "kn".concat(" "+value); 
      case 'HUF':
        return "Ft".concat(" "+value);  
      case 'IDR':
        return "Rp".concat(" "+value);  
      case 'ILS':
        return "₪".concat(" "+value);  
      case 'INR':
        return "Rs".concat(" "+value);  
      case 'INR':
        return "Rs".concat(" "+value);
      case 'ISK':
        return "Ikr".concat(" "+value);
      case 'JMD':
        return "J$".concat(" "+value);
      case 'JOD':
        return "JD".concat(" "+value);
      case 'JPY':
        return "¥".concat(" "+value);
      case 'KES':
        return "Ksh".concat(" "+value);
      case 'KMF':
        return "CF".concat(" "+value);
      case 'KRW':
        return "₩".concat(" "+value);
      case 'KWD':
        return "KD".concat(" "+value);
      case 'LBP':
        return "LB£".concat(" "+value);
      case 'LKR':
        return "SLRs".concat(" "+value);
      case 'LTL':
        return "Lt".concat(" "+value);
      case 'LVL':
        return "Ls".concat(" "+value);
      case 'LYD':
        return "LD".concat(" "+value);
      case 'MOP':
        return "MOP$".concat(" "+value);
      case 'MUR':
        return "MURs".concat(" "+value);
      case 'MXN':
        return "MX$".concat(" "+value);
      case 'MYR':
        return "RM".concat(" "+value);
      case 'MZN':
        return "MTn".concat(" "+value);
      case 'NAD':
        return "N$".concat(" "+value);
      case 'NGN':
        return "₦".concat(" "+value);
      case 'NIO':
        return "C$".concat(" "+value);
      case 'NOK':
        return "Nkr".concat(" "+value);
      case 'NPR':
        return "NPRs".concat(" "+value);
      case 'NZD':
        return "NZ$".concat(" "+value);
      case 'PAB':
        return "B/.".concat(" "+value);
      case 'PEN':
        return "S/.".concat(" "+value);
      case 'PHP':
        return "₱".concat(" "+value);
      case 'PKR':
        return "PKRs".concat(" "+value);
      case 'PLN':
        return "zł".concat(" "+value);
      case 'PYG':
        return "₲".concat(" "+value);
      case 'QAR':
        return "QR".concat(" "+value);
      case 'RSD':
        return "din.".concat(" "+value);
      case 'RUB':
        return "RUB".concat(" "+value);
      case 'SAR':
        return "SR".concat(" "+value);
      case 'SEK':
        return "Skr".concat(" "+value);
      case 'SGD':
        return "S$".concat(" "+value);
      case 'SOS':
        return "Ssh".concat(" "+value);
      case 'SYP':
        return "SY£".concat(" "+value);
      case 'THB':
        return "฿".concat(" "+value);
      case 'TND':
        return "DT".concat(" "+value);
      case 'TOP':
        return "T$".concat(" "+value);
      case 'TRY':
        return "TL".concat(" "+value);
      case 'TTD':
        return "TT$".concat(" "+value);
      case 'TWD':
        return "NT$".concat(" "+value);
      case 'TZS':
        return "TSh".concat(" "+value);
      case 'UAH':
        return "₴".concat(" "+value);
      case 'UGX':
        return "USh".concat(" "+value);
      case 'UYU':
        return "$U".concat(" "+value);
      case 'UZS':
        return  "UZS".concat(" "+value);
      case 'VEF':
        return  "Bs.F.".concat(" "+value);
      case 'VND':
        return  "₫".concat(" "+value);
      case 'XAF':
        return  "FCFA".concat(" "+value);
      case 'XOF':
        return  "CFA".concat(" "+value);
      case 'YER':
        return  "YR".concat(" "+value);
      case 'ZAR':
          return  "R".concat(" "+value);
      case 'ZMK':
        return  "ZK".concat(" "+value);
      case 'ZWL':
        return  "ZWL$".concat(" "+value);
      default:
        return currency.concat(" "+value);
    }
  }

}
