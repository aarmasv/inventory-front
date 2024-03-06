import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../shared/services/category.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductService } from '../../shared/services/product.service';

export interface Category{
  description: string;
  id:number;
  name: string;
}

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrl: './new-product.component.css'
})
export class NewProductComponent implements OnInit {

  public productForm!: FormGroup;
  estadoFormulario: string = "Agregar";
  categories: Category []=[]; 
  selectedFile:any;
  nameImg: string="";
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  private dialogRef = inject(MatDialogRef);
  private data = inject(MAT_DIALOG_DATA);
  private productservice = inject(ProductService);

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      quantity: ['', Validators.required],
      category: ['', Validators.required],
      picture: ['', Validators.required]
    });
    this.estadoFormulario = "Agregar";
    this.getCategories();
    if(this.data != null){
      this.updateForm(this.data);
      this.estadoFormulario = "Actualizar";
    }
  }

  onSave(){
    let data= {
      name: this.productForm.get('name')?.value,
      price: this.productForm.get('price')?.value,
      quantity: this.productForm.get('quantity')?.value,
      category: this.productForm.get('category')?.value,
      picture: this.selectedFile
    }

    const uploadImageData=new FormData();
    uploadImageData.append('picture', data.picture, data.picture.name);
    uploadImageData.append('name', data.name);
    uploadImageData.append('price', data.price);
    uploadImageData.append('quantity', data.quantity);
    uploadImageData.append('categoryId', data.category);

    if(this.data != null){
      this.productservice.updateProduct(uploadImageData, this.data.id)
      .subscribe((data : any) => {
        console.log("datos actualizados: "+data);
        this.dialogRef.close(1)
      }, (error: any) => {
        this.dialogRef.close(2)
      })
    }else{
      this.productservice.saveProduct(uploadImageData)
      .subscribe((data : any) => {
        console.log("datos guardados: "+data);
        this.dialogRef.close(1)
      }, (error: any) => {
        this.dialogRef.close(2)
      })
    }

  }

  onCancel(){
    this.dialogRef.close(3);
  }

  getCategories() {
    this.categoryService.getCategories()
    .subscribe((data:any) =>{
      this.categories = data.categoryResponse.category;
    }, (error:any)=>
    console.log("Error al consultar categorías"))
  }

  onFileChange(event:any){
    this.selectedFile=event.target.files[0];
    console.log(this.selectedFile);
    this.nameImg=event.target.files[0].name;
  }

  updateForm(data: any){
    this.productForm = this.fb.group({
      name: [data.name, Validators.required],
      price: [data.price, Validators.required],
      quantity: [data.quantity, Validators.required],
      category: [data.category.id, Validators.required],
      picture: ['', Validators.required]
    });
  }

}
