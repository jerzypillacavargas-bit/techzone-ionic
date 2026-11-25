import { Component, OnInit, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonIcon,
  NavController,
  ToastController,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { save } from 'ionicons/icons';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { ProductosService } from '../../services/productos.service';
import { CATEGORIAS, ProductoNuevo } from '../../models/producto';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  imports: [
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonIcon,
  ],
})
export class RegistrarPage implements OnInit {
  private servicio = inject(ProductosService);
  private nav = inject(NavController);
  private toast = inject(ToastController);

  id = input<string>();
  categorias = CATEGORIAS;
  datos: ProductoNuevo = this.vacio();

  get editando(): boolean {
    return !!this.id();
  }

  constructor() {
    addIcons({ save });
  }

  async ngOnInit(): Promise<void> {
    await this.servicio.cargar();
    const p = this.editando ? this.servicio.buscar(Number(this.id())) : undefined;
    if (p) {
      this.datos = {
        nombre: p.nombre,
        marca: p.marca,
        categoria: p.categoria,
        precio: p.precio,
        stock: p.stock,
      };
    }
  }

  async guardar(): Promise<void> {
    const datos: ProductoNuevo = {
      ...this.datos,
      precio: Number(this.datos.precio),
      stock: Number(this.datos.stock),
    };

    const error = this.editando
      ? await this.servicio.actualizar(Number(this.id()), datos)
      : await this.servicio.registrar(datos);

    if (error) {
      (await this.toast.create({ message: error, duration: 2000, color: 'warning' })).present();
      return;
    }

    if (!this.editando && datos.stock < 5) {
      await Haptics.impact({ style: ImpactStyle.Heavy }).catch(() => {});
    }

    (
      await this.toast.create({
        message: this.editando ? 'Cambios guardados' : 'Producto registrado',
        duration: 1500,
        color: 'success',
      })
    ).present();

    this.datos = this.vacio();
    this.nav.navigateRoot('/tabs/productos');
  }

  private vacio(): ProductoNuevo {
    return { nombre: '', marca: '', categoria: 'Teclados', precio: 0, stock: 0 };
  }
}