import api from "./api";

export interface Cliente {
  id: string;
  nome: string;
  email: string;
  cpfCnpj: string;
  // TODO: adicionar demais campos conforme o DTO do backend
}

export interface ClienteRequest {
  nome: string;
  email: string;
  cpfCnpj: string;
}

const BASE = "/api/clientes";

export const clientesService = {
  listarTodos: () => api.get<Cliente[]>(BASE).then((r) => r.data),

  buscarPorId: (id: string) =>
    api.get<Cliente>(`${BASE}/${id}`).then((r) => r.data),

  salvar: (data: ClienteRequest) =>
    api.post<Cliente>(BASE, data).then((r) => r.data),

  atualizar: (id: string, data: ClienteRequest) =>
    api.put<Cliente>(`${BASE}/${id}`, data).then((r) => r.data),

  deletar: (id: string) => api.delete(`${BASE}/${id}`),
};
