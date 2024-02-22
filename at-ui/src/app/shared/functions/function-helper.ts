import { DatePipe } from "@angular/common";
import { Component, Injectable } from "@angular/core";
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from "@angular/forms";
import { Observable, of, timer } from "rxjs";
import { switchMap } from "rxjs/operators";

export const 
formatCurentcy = (val) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(val);
}

export const 
validateForm = (form, fieldName):boolean => {
  let formControl = form?.controls[fieldName]
  return formControl?.invalid && (formControl?.dirty || formControl?.touched)
}

export const 
validateAllFormFields = (form: FormGroup) => {
  Object.keys(form.controls).forEach(field => {
    const control = form.get(field);
    if (control instanceof FormControl) {
      control.markAsTouched({ onlySelf: true });
    } else if (control instanceof FormGroup) {
      validateAllFormFields(control);    }
  });
}

/**
 *
 * function scroll to field unvalid
 */
export const 
scrollToFirstInvalidControl = (form: FormGroup) => {
  let firstControlsInvalid = Object.keys(form.controls).find(field=> form.get(field).invalid);
  document.getElementById(firstControlsInvalid)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  document.getElementById(firstControlsInvalid)?.focus();
}

export const
checkIsArray = (param):boolean => {
  return Array.isArray(param);
}

/**
 * function format currency to number
 */
export const
formatCurrencyNumber = (value):number => {
  return Number(value?.toString()?.replace(/[^0-9]+/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ''));
}

/**
 * function format currency to number
 */
export const
formatPhoneNumber = (value): number => {
  if (!value || value.length == 0) {
    value = '';
  } else if (value.length <= 3) {
    value = value.replace(/^(\d{0,4})/, '$1');
  } else if (value.length <= 6) {
    value = value.replace(/^(\d{0,4})(\d{0,3})/, '$1 $2');
  } else {
    value = value.replace(/^(\d{0,4})(\d{0,3})(.*)/, '$1 $2 $3');
  }
  return value;
}

/**
 * function check valid email & tel
 */
export const
regexEmail = (form, fieldName):boolean => {
  let formControl = form?.controls[fieldName];
  return  formControl?.hasError('pattern') && (formControl?.dirty || formControl?.touched);
}

export const
regexFormEmail = Validators.pattern(/^(\d{10}|\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3}))$/);

export const
regexFormTel = Validators.pattern(/^\d{4}\s\d{3}\s\d{3}$/);

export const
isEmpty = (value) => {
  return (value == null || (typeof value === "string" && value.trim().length === 0));
}
/**
 * hidden modal
 */
export const
hiddenModal = (action: boolean) => {
  let modalBackdrop: HTMLElement = document.querySelectorAll('.modal-backdrop')[0] as HTMLElement;
  let modalWindow: HTMLElement = document.querySelectorAll('.modal')[0] as HTMLElement;

  if (!modalBackdrop || !modalWindow) return;
  if (action) {
    modalBackdrop?.classList.add('d-none');
    modalWindow.style.opacity = '0';
    return;
  }
  modalBackdrop.classList.remove('d-none');
  modalWindow.style.opacity = null;
}

/**
 * check valid date
 */
export const
isValidDate = (control: AbstractControl):Observable<ValidationErrors | null> => {
  let value:string = control.value;
  var dateFormat = /(^\d{1,4}[\.|\\/|-]\d{1,2}[\.|\\/|-]\d{1,4})(\s*(?:0?[1-9]:[0-5]|1(?=[012])\d:[0-5])\d\s*[ap]m)?$/;;

  if (toString.call(value) === '[object Date]') {
    return of({ invalidDate: true });
  }
  if (typeof value?.replace === 'function') {
      value.replace(/^\s+|\s+$/gm, '');
  }

  let result = dateFormat.test(value) ?  null : { invalidDate: true };
  console.log(result);

  return timer(500).pipe(
    switchMap( () => of(result))
  )
}
/**
 * format text lating
 */
export const
formatTextLating = (str: string) => {
  str = str?.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  // Some system encode vietnamese combining accent as individual utf-8 characters
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng 
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
  return str;
}

/**
 * format date yyyy-MM-dd
 */

@Injectable()
export class FormatDateComponent {
  constructor(
    private datePipe: DatePipe
  ) { }

  formatDate = (date: string, type: string): string | null => {
    if (!date) return null;
    var dateArray = date.split('-' || '/');
    var convertedDate = new Date(dateArray[1] + '-' + dateArray[0] + '-' + dateArray[2]);
    if (/Mobi|iPad|iPhone|iPod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
      convertedDate = new Date(dateArray[2] + '/' + dateArray[1] + '/' + dateArray[0]);
    }
    return this.datePipe.transform(convertedDate, type);
  }
}