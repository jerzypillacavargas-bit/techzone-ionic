import { Component, computed, inject, input } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonNote,
  AlertController,
  NavController,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { create, trash } from 'ionicons/icons';
import { ProductosService } from '../../services/productos.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  imports: [
    CurrencyPipe,
    DatePipe,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonButton,
    IonIcon,
    IonNote,
  ],
})
export class DetallePage {
  private servicio = inject(ProductosService);
  private alertas = inject(AlertController);
  private nav = inject(NavController);

  id = input.required<string>();

  producto = computed(() =>
    this.servicio.productos().find((p) => p.id === Number(this.id()))
  );

  constructor() {
    addIcons({ create, trash });
    this.servicio.cargar();
  }

  async eliminar(): Promise<void> {
    const p = this.producto();
    if (!p) return;

    const alerta = await this.alertas.create({
      header: '¿Eliminar producto?',
      message: `Se eliminará "${p.nombre}".`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Eliminar', role: 'destructive' },
      ],
    });
    await alerta.present();
    if ((await alerta.onDidDismiss()).role !== 'destructive') return;

    await this.servicio.eliminar(p.id);
    this.nav.navigateBack('/tabs/productos');
  }
}