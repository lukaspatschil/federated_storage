import { AbstractControl, ValidationErrors } from '@angular/forms';

export function requiredFileType() {
  return (control: AbstractControl): ValidationErrors | null => {
    return !!control.value &&
      (control.value?.mimetype === 'image/jpeg' ||
        control.value?.mimetype === 'image/png' ||
        control.value?.mimetype === undefined)
      ? null
      : { wrongType: true };
  };
}
