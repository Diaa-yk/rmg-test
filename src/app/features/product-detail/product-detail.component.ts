import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MaterialModule } from '../../shared/material.module';
import { ProductFacade } from '../../core/facade/product.facade';
import { fadeIn } from '../../shared/animations/animations';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { map, Observable, of, switchMap, tap } from 'rxjs';
import { ProductFormGroup } from '../../core/services/product.form-group.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  animations: [fadeIn],
  imports: [CommonModule, RouterModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  private productFacade = inject(ProductFacade);
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private fb = inject(FormBuilder);

  productForm: FormGroup = ProductFormGroup.create(this.fb);
  
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  isAddMode: boolean = true;

  product$: Observable<any> = this.route.paramMap.pipe(
    map(params => params.get('id')),
    tap(id => this.isAddMode = !id),
    switchMap(id => {
      if (this.isAddMode) return of(null);
      return this.productFacade.getProductById(+id!).pipe(map(res => res.data));
    }),
    tap(product => {
      if (product) {
        this.productForm.patchValue(product);
        this.imagePreview = product.images?.[0] || null;
      }
    })
  );

  loading$ = this.productFacade.loading$;

  ngOnInit(): void {
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

  saveProduct(): void {
  if (this.productForm.invalid) {
    this.productForm.markAllAsTouched();
    return;
  }

  if (this.isAddMode) {
    const payload = ProductFormGroup.getPayload(this.productForm);
    this.productFacade.addProduct(payload, this.selectedFile).subscribe(() => this.goBack());
  } else {
    const dirtyPayload = ProductFormGroup.getDirtyValues(this.productForm);
    const productId = this.productForm.getRawValue().id;

    if (Object.keys(dirtyPayload).length === 0 && !this.selectedFile) {
      this.goBack();
      return;
    }

    this.productFacade.updateProduct(productId, dirtyPayload, this.selectedFile)
      .subscribe(() => this.goBack());
  }
}

  goBack(): void {
    this.location.back();
  }
}