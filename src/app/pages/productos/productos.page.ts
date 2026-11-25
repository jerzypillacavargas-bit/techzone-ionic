import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonList,
  IonItem,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonLabel,
  IonBadge,
  IonIcon,
  IonFab,
  IonFabButton,
  IonRefresher,
  IonRefresherContent,
  IonNote,
  AlertController,
  ToastController,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { add, trash, cubeOutline, swapVertical } from 'ionicons/icons';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { ProductosService } from '../../services/productos.service';
import { CATEGORIAS, Producto } from '../../models/producto';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
  imports: [
    CurrencyPipe,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonSearchbar,
    IonSegment,
    IonSegmentButton,
    IonList,
    IonItem,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonLabel,
    IonBadge,
    IonIcon,
    IonFab,
    IonFabButton,
    IonRefresher,
    IonRefresherContent,
    IonNote,
  ],
})
export class ProductosPage {
  servicio = inject(ProductosService);
  private alertas = inject(AlertController);
  private toast = inject(ToastController);

  categorias = ['Todas', ...CATEGORIAS];
  texto = signal('');
  categoria = signal('Todas');
  orden = signal<'reciente' | 'precio' | 'nombre'>('reciente');

  filtrados = computed(() => {
    const q = this.texto().toLowerCase();
    const cat = this.categoria();
    const lista = this.servicio
      .productos()
      .filter((p) => {
        const coincideTexto =
          p.nombre.toLowerCase().includes(q) || p.marca.toLowerCase().includes(q);
        const coincideCat = cat === 'Todas' || p.categoria === cat;
        return coincideTexto && coincideCat;
      });

    if (this.orden() === 'precio') return [...lista].sort((a, b) => a.precio - b.precio);
    if (this.orden() === 'nombre') return [...lista].sort((a, b) => a.nombre.localeCompare(b.nombre));
    return lista;
  });

  constructor() {
    addIcons({ add, trash, cubeOutline, swapVertical });
    this.servicio.cargar();
  }

  alBuscar(evento: CustomEvent): void {
    this.texto.set(evento.detail.value ?? '');
  }

  alFiltrarCategoria(evento: CustomEvent): void {
    this.categoria.set(evento.detail.value ?? 'Todas');
  }

  async cambiarOrden(): Promise<void> {
    const siguiente =
      this.orden() === 'reciente' ? 'precio' : this.orden() === 'precio' ? 'nombre' : 'reciente';
    this.orden.set(siguiente);
    const etiqueta =
      siguiente === 'precio' ? 'Precio (menor a mayor)' : siguiente === 'nombre' ? 'Nombre (A-Z)' : 'Más recientes';
    (await this.toast.create({ message: `Orden: ${etiqueta}`, duration: 1200, color: 'dark' })).present();
  }

  async eliminar(p: Producto, fila: IonItemSliding): Promise<void> {
    await fila.close();
    const alerta = await this.alertas.create({
      header: '¿Eliminar producto?',
      message: `Se eliminará "${p.nombre}".`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Eliminar', role: 'destructive' },
      ],
    });
    await alerta.present();
    const { role } = await alerta.onDidDismiss();
    if (role !== 'destructive') return;

    await this.servicio.eliminar(p.id);
    await Haptics.impact({ style: ImpactStyle.Medium }).catch(() => {});
    console.log('Producto eliminado:', p);
    (
      await this.toast.create({
        message: `"${p.nombre}" eliminado`,
        duration: 1500,
        color: 'medium',
      })
    ).present();
  }

  async refrescar(evento: CustomEvent): Promise<void> {
    await new Promise((ok) => setTimeout(ok, 600));
    (evento.target as HTMLIonRefresherElement).complete();
  }
}