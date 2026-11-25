export interface Producto {
  id: number;
  nombre: string;
  marca: string;
  categoria: Categoria;
  precio: number;
  stock: number;
  creadoEn: string;
}

export type Categoria = 'Teclados' | 'Mouse' | 'Audio' | 'Componentes' | 'Accesorios';

export const CATEGORIAS: Categoria[] = ['Teclados', 'Mouse', 'Audio', 'Componentes', 'Accesorios'];

export type ProductoNuevo = Omit<Producto, 'id' | 'creadoEn'>;