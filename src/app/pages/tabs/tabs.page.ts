import { Component, inject } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonBadge } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { list, addCircle, phonePortrait } from 'ionicons/icons';
import { ProductosService } from '../../services/productos.service';

@Component({
  selector: 'app-tabs',
  template: `
    <ion-tabs>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="productos">
          <ion-icon name="list"></ion-icon>
          <ion-label>Productos</ion-label>
          <ion-badge color="tertiary">{{ servicio.total() }}</ion-badge>
        </ion-tab-button>
        <ion-tab-button tab="registrar">
          <ion-icon name="add-circle"></ion-icon>
          <ion-label>Registrar</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="info">
          <ion-icon name="phone-portrait"></ion-icon>
          <ion-label>Mi celular</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonBadge],
})
export class TabsPage {
  servicio = inject(ProductosService);

  constructor() {
    addIcons({ list, addCircle, phonePortrait });
    this.servicio.cargar();
  }
}