import api from './api'

// Usado em PedidoRequest para montar um novo pedido
export interface ItemPedido {
  produtoId: string
  quantidade: number
}

// Recebido dentro do PedidoResponseDTO — já traz nome e preço do produto
export interface ItemPedidoResponse {
  id: string
  produtoId: string
  nomeProduto: string
  quantidade: number
  precoUnitario: number
}

// Subconjunto do ClienteResponseDTO aninhado no PedidoResponseDTO
export interface ClientePedido {
  id: string
  nome: string
  cpfCnpj: string
  email: string
}

export interface PedidoRequest {
  clienteId: string
  itens: ItemPedido[]
}

export interface Pedido {
  id: string
  data: string
  valorTotal: number
  status: 'RASCUNHO' | 'PAGO' | 'CANCELADO'
  cliente: ClientePedido
  item: ItemPedidoResponse[]
}

const BASE = '/api/pedidos'

export const pedidosService = {
  listarTodos: () =>
    api.get<Pedido[]>(BASE).then((r) => r.data),

  buscarPeloId: (id: string) =>
    api.get<Pedido>(`${BASE}/${id}`).then((r) => r.data),

  criarPedido: (data: PedidoRequest) =>
    api.post<Pedido>(BASE, data).then((r) => r.data),

  cancelarPedido: (id: string) =>
    api.put<Pedido>(`${BASE}/${id}/cancelar`).then((r) => r.data),

  pagarPedido: (id: string) =>
    api.put<Pedido>(`${BASE}/${id}/pagar`).then((r) => r.data),
}
