export interface Author {
  id?: string;
  name: string;
  avatar: string;
  bio?: string;
  email?: string;
  rol?: "Administrador" | "Editor" | "Autor" | "Lector";
  biografia?: string;
  foto_perfil?: string;
}

export interface Category {
  id: string;
  nombre: string;
  slug: string;
}

export interface Tag {
  id: string;
  nombre: string;
  slug: string;
}

export interface SEOMetadata {
  meta_titulo?: string;
  meta_descripcion?: string;
  palabra_clave_principal?: string;
}

export interface BlogPost {
  id: string;
  title: string; // Corresponds to 'titulo'
  slug?: string;
  summary: string; // Corresponds to 'resumen'
  content: string; // Corresponds to 'contenido' (HTML formatted)
  category: string; // Category name or ID
  categoryDetail?: Category;
  tags?: string[]; // Array of tag names or IDs
  tagsDetail?: Tag[];
  author: Author;
  authorUid?: string; // Corresponds to 'autor_id'
  estado?: "Borrador" | "Revisión" | "Publicado" | "Archivado"; // Corresponds to 'estado'
  imageUrl: string; // Corresponds to 'imagen_destacada'
  date: string;
  readTime: string;
  isAiGenerated: boolean;
  featured?: boolean;
  promptUsed?: string;
  createdAt?: any; // Corresponds to 'fecha_creacion'
  fecha_creacion?: string;
  updatedAt?: any; // Corresponds to 'fecha_actualizacion'
  fecha_actualizacion?: string;
  publishedAt?: any; // Corresponds to 'fecha_publicacion'
  fecha_publicacion?: string;
  
  // SEO fields
  meta_titulo?: string;
  meta_descripcion?: string;
  palabra_clave_principal?: string;
  seo?: SEOMetadata;
}

export interface CreatePostRequest {
  prompt: string;
  category?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
