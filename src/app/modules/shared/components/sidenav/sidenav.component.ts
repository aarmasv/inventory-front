import { MediaMatcher } from '@angular/cdk/layout';
import { Component, OnInit, inject } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent implements OnInit{

  mobileQuery: MediaQueryList;
  private keycloakService = inject(KeycloakService);
  username: any;
  menuNav = [
    {name : "Home", route: "home", icon: "home"},
    {name : "Categorias", route: "category", icon: "category"},
    {name : "Productos", route: "product", icon: "production_quantity_limits"}
  ]

  constructor(media: MediaMatcher){
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
  }
  ngOnInit(): void {
    this.username = this.keycloakService.getUsername();
  }

  logout(){
    this.keycloakService.logout();
  }

}
