import api from "./api";

export interface Categoria {
  id: string;
  nome: string;
}

export interface Produto {
  id: string;
  nome: string;
  preco: number;
  estoque: number;
  estoqueMinimo: number | null;
  categoriaId: string;
  categoria?: Categoria;
}

export interface ProdutoRequest {
  nome: string;
  preco: number;
  estoque: number;
  estoqueMinimo: number;
  categoriaId: string;
}

const BASE = "/api/produtos";

export const produtosService = {
  listarTodos: () => api.get<Produto[]>(BASE).then((r) => r.data),

  buscarPorId: (id: string) =>
    api.get<Produto>(`${BASE}/${id}`).then((r) => r.data),

  salvar: (data: ProdutoRequest) =>
    api.post<Produto>(BASE, data).then((r) => r.data),

  atualizar: (id: string, data: ProdutoRequest) =>
    api.put<Produto>(`${BASE}/${id}`, data).then((r) => r.data),

  deletar: (id: string) => api.delete(`${BASE}/${id}`),
};
