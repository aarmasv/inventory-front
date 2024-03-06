import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ProductService } from '../../shared/services/product.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { NewProductComponent } from '../new-product/new-product.component';
import { ConfirmComponent } from '../../shared/components/confirm/confirm.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {
  private productService = inject(ProductService);
  public dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

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
       //element.category=element.category.name;
        element.picture='data:image/jpeg;base64,' + element.picture;
        dataProduct.push(element);
      });

      this.dataSource = new MatTableDataSource<ProductElement>(dataProduct);
      this.dataSource.paginator = this.paginator;
    }
  }

  openSnackBar(message: string, action: string): MatSnackBarRef<SimpleSnackBar>{
    return this.snackBar.open(message, action,{
      duration:2000
    })
  }

  openProductDialog(){
    const dialogRef = this.dialog.open(NewProductComponent, {
      width: '450px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result==1){
        this.openSnackBar("Producto Agregado", "Exito");
        this.getProducts();
      }else if (result == 2){
        this.openSnackBar("Error al Agregar Producto", "Error");
      }
    });
  }

  edit(id:number, name:string, price:number, quantity:number, category:any){
    const dialogRef = this.dialog.open(NewProductComponent, {
      width: '450px',
      data:{id:id, name:name, price:price, quantity:quantity, category:category}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result==1){
        this.openSnackBar("Producto Editado", "Exito");
        this.getProducts();
      }else if (result == 2){
        this.openSnackBar("Error al Ediatr Producto", "Error");
      }
    });
  }

  delete(id:any){
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '450px',
      data:{id:id, module:"product"}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result==1){
        this.openSnackBar("Producto eliminado", "Exito");
        this.getProducts();
      }else if (result == 2){
        this.openSnackBar("Error al eliminar Producto", "Error");
      }
    });
  }

  buscar(name:any){
    if(name.length===0){
      return this.getProducts();
    }
    this.productService.getProductsByName(name)
    .subscribe((resp:any)=>{
      this.processProductResponse(resp);
    })
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
