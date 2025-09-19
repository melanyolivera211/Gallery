import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  Validator,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  standalone: false,
})
export class InputComponent implements ControlValueAccessor, Validator {
  @Input() public type: 'text' | 'email' | 'password' | 'number' | 'tel' =
    'text';
  @Input() public label: string = '';
  @Input() public placeholder: string = '';
  @Input() public icon: string = '';
  @Input() public clearable: boolean = false;
  @Input() public disabled: boolean = false;
  @Input() public required: boolean = false;
  @Input() public lines: 'full' | 'inset' | 'none' = 'full';
  @Input() public labelPosition: 'fixed' | 'stacked' | 'floating' = 'stacked';
  @Input() public errorMessage: string = '';
  @Input() public pattern: string = '';
  @Input() public minLength: number = 0;
  @Input() public maxLength: number = Infinity;

  @Output() public valueChange = new EventEmitter<string>();
  @Output() public inputBlur = new EventEmitter<void>();
  @Output() public inputFocus = new EventEmitter<void>();

  public value: string = '';
  public hasError: boolean = false;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  public onInputChange(event: any): void {
    this.value = event.detail.value;
    this.onChange(this.value);
    this.valueChange.emit(this.value);
    this.validateInput();
  }

  public onInputBlur(): void {
    this.onTouched();
    this.inputBlur.emit();
    this.validateInput();
  }

  public onInputFocus(): void {
    this.inputFocus.emit();
  }

  public writeValue(value: string): void {
    this.value = value || '';
  }

  public registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public validate(control: AbstractControl): ValidationErrors | null {
    return this.validateControl(control.value);
  }

  private validateInput(): void {
    this.hasError = this.validateControl(this.value) !== null;
  }

  private validateControl(value: string): ValidationErrors | null {
    if (this.required && (!value || value.trim() === '')) {
      return { required: true };
    }

    if (value && this.pattern) {
      const regex = new RegExp(this.pattern);

      if (!regex.test(value)) {
        return { pattern: true };
      }
    }

    if (value && this.minLength > 0 && value.length < this.minLength) {
      return { minlength: true };
    }

    if (value && this.maxLength < Infinity && value.length > this.maxLength) {
      return { maxlength: true };
    }

    return null;
  }
}
