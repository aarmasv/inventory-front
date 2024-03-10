import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CategoryService } from '../../../shared/services/category.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { NewCategoryComponent } from '../new-category/new-category.component';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { ConfirmComponent } from '../../../shared/components/confirm/confirm.component';
import { MatPaginator } from '@angular/material/paginator';
import { UtilService } from '../../../shared/services/util.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})

export class CategoryComponent implements OnInit{

  private categoryService = inject(CategoryService);
  public dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private util = inject(UtilService);
  isAdmin: any;

  ngOnInit(): void {
    this.getCategories();
    console.log(this.util.getRoles());
    this.isAdmin = this.util.isAdmin();
  }

  displayedColumns: string[] = ['id', 'name', 'description', 'actions'];
  dataSource = new MatTableDataSource<CategoryElement>();

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  
  getCategories(): void { 
    this.categoryService.getCategories()
    .subscribe((data:any) => {
      console.log("respuesta categories:", data);
      this.processCategoriesResponse(data);

    }, (error:any) => {
      console.log("error: ", error);
    }) 
  }

  processCategoriesResponse(resp: any){
    const dataCategory: CategoryElement[] = [];
    
    if(resp.metadata[0].code == "00"){
      
      let listCategory = resp.categoryResponse.category;
     
      listCategory.forEach((element: CategoryElement) => {
        dataCategory.push(element);
      });

      this.dataSource = new MatTableDataSource<CategoryElement>(dataCategory);
      this.dataSource.paginator = this.paginator;
    }
  }

  openCategoryDialog(){
    const dialogRef = this.dialog.open(NewCategoryComponent, {
      width: '450px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result==1){
        this.openSnackBar("Categoría Agregada", "Exitosa");
        this.getCategories();
      }else if (result == 2){
        this.openSnackBar("Error al Agregar Categoría", "Error");
      }
    });
  }

  openSnackBar(message: string, action: string): MatSnackBarRef<SimpleSnackBar>{
    return this.snackBar.open(message, action,{
      duration:2000
    })
  }

  edit(id:number, name: string, description: string){
    const dialogRef = this.dialog.open(NewCategoryComponent, {
      width: '450px',
      data: {id: id, name: name, description: description},
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result==1){
        this.openSnackBar("Categoría Actualizada", "Exitosa");
        this.getCategories();
      }else if (result == 2){
        this.openSnackBar("Error al Actualizar Categoría", "Error");
      }
    });
  }

  delete(id:any){

    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '450px',
      data: {id: id, module:"category"},
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result==1){
        this.openSnackBar("Categoría Eliminada", "Exitosa");
        this.getCategories();
      }else if (result == 2){
        this.openSnackBar("Error al Actualizar Categoría", "Error");
      }
    });

  }

  buscar(termino: string){
    if(termino.length === 0){
      return this.getCategories();
    }

    this.categoryService.getCategoryById(termino).
      subscribe((resp:any) => {
        this.processCategoriesResponse(resp);
      })
  }

  exportExcel(){
    this.categoryService.exportCategories()
        .subscribe( (data: any) => {
          let file = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
          let fileUrl = URL.createObjectURL(file);
          var anchor = document.createElement("a");
          anchor.download = "categories.xlsx";
          anchor.href = fileUrl;
          anchor.click();

          this.openSnackBar("Archivo exportado correctamente", "Exitosa");
        }, (error: any) =>{
          this.openSnackBar("No se pudo exportar el archivo", "Error");
        })
  }
}

export interface CategoryElement {
  description: string;
  id:number;
  name: string;
}