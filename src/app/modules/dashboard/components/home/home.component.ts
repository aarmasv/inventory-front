import { Component, Inject, OnInit, inject } from '@angular/core';
import { ProductService } from '../../../shared/services/product.service';
import { ProductElement } from '../../../product/product/product.component';
import { Chart } from 'chart.js/auto';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{

  chartBar: any;
  chartDoughnut: any;
  private productService= inject(ProductService);

  ngOnInit(): void {
    this.getProducts();
  }


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
    const nameProduct: String[] = [];
    const quantityProduct: number[] = [];

    if(resp.metadata[0].code == "00"){
      
      let listProducts = resp.product.products;
     
      listProducts.forEach((element: ProductElement) => {
        nameProduct.push(element.name);
        quantityProduct.push(element.quantity);
      });
    }

    this.chartBar = new Chart('canvas-bar',{
      type: 'bar',
      data: {
        labels: nameProduct,
        datasets: [{
            label: 'Productos',
            data: quantityProduct
        }]
      } 
    })

    this.chartDoughnut = new Chart('canvas-doughnut',{
      type: 'doughnut',
      data: {
        labels: nameProduct,
        datasets: [{
            label: 'Productos',
            data: quantityProduct
        }]
      } 
    }) 


  }


}
