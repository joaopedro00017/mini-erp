import api from "./api";

export interface Categoria {
  id: string;
  nome: string;
  // TODO: adicionar demais campos conforme o DTO do backend
}

export interface CategoriaRequest {
  nome: string;
}

const BASE = "/api/categorias";

export const categoriasService = {
  listarTodos: () => api.get<Categoria[]>(BASE).then((r) => r.data),

  buscarPorId: (id: string) =>
    api.get<Categoria>(`${BASE}/${id}`).then((r) => r.data),

  salvar: (data: CategoriaRequest) =>
    api.post<Categoria>(BASE, data).then((r) => r.data),

  atualizar: (id: string, data: CategoriaRequest) =>
    api.put<Categoria>(`${BASE}/${id}`, data).then((r) => r.data),

  deletar: (id: string) => api.delete(`${BASE}/${id}`),
};
