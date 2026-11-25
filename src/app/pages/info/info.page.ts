import { Component, inject, signal } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Device, DeviceInfo } from '@capacitor/device';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonNote,
  IonButton,
  IonIcon,
  IonChip,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { phonePortrait, pulse, bug } from 'ionicons/icons';
import { ProductosService } from '../../services/productos.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonNote,
    IonButton,
    IonIcon,
    IonChip,
  ],
})
export class InfoPage {
  servicio = inject(ProductosService);
  plataforma = Capacitor.getPlatform();
  nativo = Capacitor.isNativePlatform();
  info = signal<DeviceInfo | null>(null);
  bateria = signal<number | null>(null);

  constructor() {
    addIcons({ phonePortrait, pulse, bug });
  }

  async ionViewWillEnter(): Promise<void> {
    this.info.set(await Device.getInfo());
    const b = await Device.getBatteryInfo();
    this.bateria.set(b.batteryLevel != null ? Math.round(b.batteryLevel * 100) : null);
  }

  async vibrar(): Promise<void> {
    await Haptics.impact({ style: ImpactStyle.Heavy }).catch(() => {});
  }

  probarConsola(): void {
    console.log('Hola desde', this.info()?.model, 'productos:', this.servicio.productos());
  }
}