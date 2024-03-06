import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ProductService } from '../../shared/services/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {
  private productService = inject(ProductService);

  ngOnInit(): void {
    this.getProducts();
  }

  displayedColumns: string[] = ['id', 'name', 'price', 'quantity', 'category', 'picture', 'actions'];
  dataSource = new MatTableDataSource<ProductElement>();

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  getProducts(){
    this.productService.getProducts()
    .subscribe((data:any)=>{
      console.log("Respuesta de productos:", data);
      this.processProductResponse(data);
    }, (error)=>{
      console.log("error de productos:", error);
    })

  }

  processProductResponse(resp:any){
    const dataProduct: ProductElement[] = [];

    if(resp.metadata[0].code == "00"){
      
      let listProducts = resp.product.products;
     
      listProducts.forEach((element: ProductElement) => {
        element.category=element.category.name;
        element.picture='data:image/jpeg;base64,' + element.picture;
        dataProduct.push(element);
      });

      this.dataSource = new MatTableDataSource<ProductElement>(dataProduct);
      this.dataSource.paginator = this.paginator;
    }
  }
}

export interface ProductElement{
  id:number;
  name:string;
  price: number;
  quantity: number;
  category:any;
  picture:any ;
}
