import { Component, inject, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MaterialModule } from '../../shared/material.module';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductFacade } from '../../core/facade/product.facade';
import { listAnimation } from '../../shared/animations/animations';

@Component({
  selector: 'app-product-list',
  standalone: true,
  animations: [listAnimation],
  imports: [MaterialModule, RouterLink, CommonModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  private productFacade = inject(ProductFacade);
  products$ = this.productFacade.filteredProducts$;
  loading$ = this.productFacade.loading$;
  pagination$ = this.productFacade.pagination$;

  ngOnInit(): void {
    this.productFacade.loadProducts(1);
  }

  onPageChange(event: PageEvent): void {
    this.productFacade.loadProducts(event.pageIndex + 1);
  }

  deleteProduct(event: Event, id: number): void {
  event.stopPropagation(); // لمنع الانتقال لصفحة التفاصيل عند الضغط على الحذف
  if (confirm('Are you sure you want to delete this product?')) {
    this.productFacade.deleteProduct(id);
  }
}
}