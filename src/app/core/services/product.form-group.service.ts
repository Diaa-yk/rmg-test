import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export class ProductFormGroup {
  static create(fb: FormBuilder): FormGroup {
    return fb.group({
      id: [{ value: null, disabled: true }],
      title: ['', [Validators.required, Validators.minLength(3)]],
      category: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0.1)]],
      description: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  
  static getPayload(form: FormGroup) {
    const data = form.getRawValue();
    if (!data.id) {
      delete data.id;
    }
    return data;
  }
}