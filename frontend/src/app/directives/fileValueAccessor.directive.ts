// es
import { Directive, ElementRef, HostListener, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { PictureDto, Replica } from '../dtos/Picture.dto';
import { Base64Service } from '../services/base64.service';

@Directive({
  selector: 'input[type=file]',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileValueAccessorDirective),
      multi: true
    }
  ]
})
export class FileValueAccessorDirective implements ControlValueAccessor {
  private file: PictureDto | null = null;
  onChange: (file: PictureDto) => void;
  onTouched: () => void;

  @HostListener('change', ['$event.target.files']) async _handleInput(
    event: FileList
  ) {
    const file = event.item(0);

    if (file) {
      const result = await this.base64Service
        .getFileAsBase64(file)
        .catch((e) => Error(String(e)));
      if (result instanceof Error) {
        console.log('Error!');
        return;
      }
      const data = result.split(',');
      this.file = new PictureDto('', data[1], file.type + '', '', Replica.OK);
      this.onChange(this.file);
      this.onTouched();
    }
  }

  constructor(
    private element: ElementRef,
    private base64Service: Base64Service
  ) {}

  writeValue(value: PictureDto): void {
    this.element.nativeElement.value = '';
    this.file = value;
  }

  registerOnChange(fn: (file: PictureDto) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
