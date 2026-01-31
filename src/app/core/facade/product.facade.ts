import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, distinctUntilChanged, finalize, map, Observable, tap } from 'rxjs';
import { productService } from '../services/product.service';
import { ProductModel } from '../models/product.model';
import { CacheService } from '../services/cache.service';
import { NotificationService } from '../services/notification.service';

interface productState {
  dataList: ProductModel[];
  loading: boolean;
  pagination: {
    page: number;
    total: number;
    total_pages: number;
  };
}

@Injectable({ providedIn: 'root' })
export class ProductFacade {
  private readonly _productService = inject(productService);
  private notification = inject(NotificationService);
  private _store = new BehaviorSubject<productState>({
    dataList: [],
    loading: false,
    pagination: { page: 0, total: 0, total_pages: 0 },
  });

  loading$ = this._store.pipe(
    map((s) => s.loading),
    distinctUntilChanged()
  );
  dataList$ = this._store.pipe(map((s) => s.dataList));
  pagination$ = this._store.pipe(
    map((s) => s.pagination),
    distinctUntilChanged()
  );
  searchId$ = this._productService.searchId$;
  filteredProducts$ = this.dataList$;

  loadProducts(page: number, searchId?: string) {
    this._store.next({ ...this._store.value, loading: true });
    this._productService.getProducts(page, searchId).subscribe((res) => {
      this._store.next({
        dataList: res.products,
        pagination: {
          page: res.page,
          total: res.total,
          total_pages: res.total_pages,
        },
        loading: false,
      });
    });
  }

  updateSearchCriteria(id: string) {
    this._productService.updateSearchId(id);
  }

  getproductById(id: number): Observable<any> {
    return this._productService.getproductById(id);
  }

  addProduct(productData: any, file?: File | null): Observable<any> {
    this._store.next({ ...this._store.value, loading: true });
    return this._productService.addProduct(productData).pipe(
      tap((newProduct) => {
        this.notification.showSuccess('Product added successfully! 🎉');
        const currentState = this._store.value;
        this._store.next({
          ...currentState,
          dataList: [newProduct, ...currentState.dataList],
          loading: false
        });
        inject(CacheService).invalidate('products');
      }),
      catchError((err) => {
        this.notification.showError('Failed to add product.');
        this._store.next({ ...this._store.value, loading: false });
        throw err;
      })
    );
  }

  updateproduct(id: number, productData: any, file?: File | null): Observable<any> {
    return this._productService.updateProduct(id, productData).pipe(
      tap(() => {
        this.notification.showSuccess('Product updated successfully! ✅');
      }),
      catchError(err => {
        this.notification.showError('Update failed. Please try again.');
        throw err;
      })
    );
  }

  deleteProduct(id: number): void {
  this._store.next({ ...this._store.value, loading: true });

  this._productService.deleteProduct(id).subscribe({
    next: () => {
      const currentState = this._store.value;
      const updatedList = currentState.dataList.filter(p => p.id !== id);
      
      this._store.next({
        ...currentState,
        dataList: updatedList,
        loading: false
      });
      
      this.notification.showSuccess('Product deleted successfully!');
    },
    error: (err) => {
      this._store.next({ ...this._store.value, loading: false });
      this.notification.showError('Failed to delete product.');
    }
  });
}
}
