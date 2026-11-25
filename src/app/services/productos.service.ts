import { Injectable, computed, signal } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Producto, ProductoNuevo } from '../models/producto';

const CLAVE = 'techzone.productos';

const EJEMPLOS: Producto[] = [
  { id: 1, nombre: 'Teclado Mecánico DN-K104', marca: 'Seisa', categoria: 'Teclados', precio: 129.9, stock: 8, creadoEn: new Date().toISOString() },
  { id: 2, nombre: 'Mouse Gamer G203 Lightsync', marca: 'Logitech', categoria: 'Mouse', precio: 99.0, stock: 14, creadoEn: new Date().toISOString() },
  { id: 3, nombre: 'Audífonos Cloud Stinger 2', marca: 'HyperX', categoria: 'Audio', precio: 185.0, stock: 3, creadoEn: new Date().toISOString() },
  { id: 4, nombre: 'SSD NVMe 1TB PCIe 4.0', marca: 'Kingston', categoria: 'Componentes', precio: 249.5, stock: 4, creadoEn: new Date().toISOString() },
];

@Injectable({ providedIn: 'root' })
export class ProductosService {
  private readonly _productos = signal<Producto[]>([]);
  readonly productos = this._productos.asReadonly();

  readonly total = computed(() => this._productos().length);
  readonly unidades = computed(() => this._productos().reduce((suma, p) => suma + p.stock, 0));
  readonly valorInventario = computed(() => this._productos().reduce((suma, p) => suma + p.precio * p.stock, 0));
  readonly stockBajo = computed(() => this._productos().filter((p) => p.stock < 5).length);

  private cargado = false;

  async cargar(): Promise<void> {
    if (this.cargado) return;
    const { value } = await Preferences.get({ key: CLAVE });
    this._productos.set(value ? JSON.parse(value) : EJEMPLOS);
    this.cargado = true;
  }

  buscar(id: number): Producto | undefined {
    return this._productos().find((p) => p.id === id);
  }

  async registrar(datos: ProductoNuevo): Promise<string | null> {
    const error = this.validar(datos);
    if (error) return error;

    const nuevoId = Math.max(0, ...this._productos().map((p) => p.id)) + 1;
    const nuevo: Producto = {
      ...datos,
      nombre: datos.nombre.trim(),
      marca: datos.marca.trim(),
      id: nuevoId,
      creadoEn: new Date().toISOString(),
    };
    this._productos.update((lista) => [nuevo, ...lista]);
    await this.guardar();
    return null;
  }

  async actualizar(id: number, datos: ProductoNuevo): Promise<string | null> {
    const error = this.validar(datos);
    if (error) return error;

    this._productos.update((lista) =>
      lista.map((p) =>
        p.id === id ? { ...p, ...datos, nombre: datos.nombre.trim(), marca: datos.marca.trim() } : p
      )
    );
    await this.guardar();
    return null;
  }

  async eliminar(id: number): Promise<void> {
    this._productos.update((lista) => lista.filter((p) => p.id !== id));
    await this.guardar();
  }

  private validar(d: ProductoNuevo): string | null {
    if (!d.nombre || d.nombre.trim().length < 3) return 'El nombre debe tener al menos 3 letras.';
    if (!d.marca || d.marca.trim().length < 2) return 'La marca debe tener al menos 2 letras.';
    if (!(d.precio > 0)) return 'El precio debe ser mayor que 0.';
    if (!Number.isInteger(d.stock) || d.stock < 0) return 'El stock debe ser un número entero, 0 o más.';
    return null;
  }

  private async guardar(): Promise<void> {
    await Preferences.set({ key: CLAVE, value: JSON.stringify(this._productos()) });
  }
}