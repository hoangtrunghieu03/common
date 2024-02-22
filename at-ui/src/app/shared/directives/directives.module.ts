import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConvertNullPipe } from "./conver-null.pipe";
import { DragDirective } from "./drag-image.derective";
import { MultiFilterPipe } from "./filter-multi.pipe";
import { FilterWidthProNamePipe } from "./filter-with-name.pipe";
import { FormatNumberDirective } from "./formar-number.directive";
import { FormatPhoneNumberDirective } from "./formar-phone-number.directive";
import { CurrencyInputDirective } from "./format-currency.derective";
import { FormatMoney } from "./format-money.directive";
import { ToggleFullscreenDirective } from "./fullscreen.directive";
import { NumbersOnly } from "./input-number.directive";
import { MatchWidthDirective } from "./max-width-dropdown.derective";
import { RegexNumber } from "./regex-number.directive";
import { FilterPipe } from "./search.pipe";
import { CurrencyPipe, DecimalPipe } from '@angular/common';

@NgModule({
  declarations: [
    ConvertNullPipe,
    DragDirective,
    MultiFilterPipe,
    FilterWidthProNamePipe,
    FormatNumberDirective,
    FormatPhoneNumberDirective,
    CurrencyInputDirective,
    FormatMoney,
    ToggleFullscreenDirective,
    NumbersOnly,
    MatchWidthDirective,
    RegexNumber,
    FilterPipe
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    ConvertNullPipe,
    DragDirective,
    MultiFilterPipe,
    FilterWidthProNamePipe,
    FormatNumberDirective,
    FormatPhoneNumberDirective,
    CurrencyInputDirective,
    FormatMoney,
    ToggleFullscreenDirective,
    NumbersOnly,
    MatchWidthDirective,
    RegexNumber,
    FilterPipe
  ],
  providers: [
    CurrencyPipe, 
    DecimalPipe
  ]
})
export class ATDirectivesModule { }
