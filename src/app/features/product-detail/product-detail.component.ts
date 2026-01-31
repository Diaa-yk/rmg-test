import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MaterialModule } from '../../shared/material.module';
import { ProductFacade } from '../../core/facade/product.facade';
import { fadeIn } from '../../shared/animations/animations';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { map, of, switchMap, tap } from 'rxjs';
import { ProductFormGroup } from '../../core/services/product.form-group.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  animations: [fadeIn],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  private productFacade = inject(ProductFacade);
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  
  productForm: FormGroup = ProductFormGroup.create(this.fb);

  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  isAddMode: boolean = false;

  product$ = this.route.paramMap.pipe(
    map(params => params.get('id')),
    switchMap(id => {
      if (this.isAddMode) {
        return of({ data: null });
      }
      return this.productFacade.getproductById(+id!);
    }),
    map(res => res.data),
    tap(product => {
      if (product && !this.isAddMode) {
        this.productForm.patchValue(product);
      }
    })
  );

  loading$ = this.productFacade.loading$;

  constructor() {
    this.productForm = this.fb.group({
      id: [{ value: '', disabled: true }],
      title: ['', [Validators.required]],
      category: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0)]],
      description: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
  const id = this.route.snapshot.paramMap.get('id');
  this.isAddMode = !id;

  if (!this.isAddMode) {
    this.productFacade.getproductById(+id!)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        if (res.data) {
          this.productForm.patchValue(res.data);
          this.imagePreview = res.data.images?.[0];
        }
      });
  }
}

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => (this.imagePreview = reader.result);
      reader.readAsDataURL(file);
    }
  }

  saveproduct(): void {
    if (this.productForm.invalid) return;

    const payload = ProductFormGroup.getPayload(this.productForm);

    if (this.isAddMode) {
      this.productFacade.addProduct( payload, this.selectedFile).subscribe({
        next: (res) => console.log('Added!', res)
      });
    } else {
      const productId = +(this.route.snapshot.paramMap.get('id') || 0);
      this.productFacade.updateproduct(productId, payload, this.selectedFile).subscribe({
        next: (res) => console.log('Updated!', res)
      });
    }
  }

  goBack(): void {
    this.location.back();
  }
}