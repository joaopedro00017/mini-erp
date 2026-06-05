"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Plus, X, Eye, Check, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Pedido, pedidosService } from "@/services/pedidos";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const configuracaoEstados = {
  PAGO: {
    label: "Pago",
    className:
      "inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  },
  CANCELADO: {
    label: "Cancelado",
    className:
      "inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500 dark:bg-zinc-800 dark:text-zinc-400",
  },
  RASCUNHO: {
    label: "Rascunho",
    className:
      "inline-flex items-center rounded-full bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200 dark:bg-zinc-800/60 dark:text-zinc-400 dark:ring-zinc-700",
  },
} satisfies Record<Pedido["status"], { label: string; className: string }>;

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [filtro, setFiltro] = useState<string>("");

  const pedidosFiltrados = pedidos.filter((pedido) =>
    pedido.cliente.nome.toLowerCase().includes(filtro.toLowerCase().trim()),
  );

  const [isModalDetalhesAberto, setIsModalDetalhesAberto] = useState(false);
  const [isModalCancelarAberto, setIsModalCancelarAberto] = useState(false);
  const [pedidoSelecionado, setPedidoSelecionado] = useState<Pedido | null>(
    null,
  );

  useEffect(() => {
    const carregarPedidos = async () => {
      try {
        const listaPedidos = await pedidosService.listarTodos();
        setPedidos(listaPedidos);
      } catch (error) {
        console.error("Erro ao carregar pedidos: ", error);
        toast.error("Erro ao carregar pedidos. Tente novamente mais tarde.");
      } finally {
        setCarregando(false);
      }
    };
    carregarPedidos();
  }, []);

  const handlePagar = async (pedido: Pedido) => {
    try {
      const pedidoAtualizado = await pedidosService.pagarPedido(pedido.id);
      setPedidos((prev) =>
        prev.map((p) => (p.id === pedido.id ? pedidoAtualizado : p)),
      );
      toast.success("Pagamento confirmado com sucesso.");
    } catch (error) {
      console.error("Erro ao confirmar pagamento:", error);
      toast.error(
        error instanceof Error ? error.message : "Erro ao confirmar pagamento.",
      );
    }
  };

  const handleCancelar = async () => {
    if (!pedidoSelecionado) return;
    try {
      const pedidoAtualizado = await pedidosService.cancelarPedido(
        pedidoSelecionado.id,
      );
      setPedidos((prev) =>
        prev.map((p) => (p.id === pedidoSelecionado.id ? pedidoAtualizado : p)),
      );
      toast.success("Pedido cancelado com sucesso.");
      setIsModalCancelarAberto(false);
    } catch (error) {
      console.error("Erro ao cancelar pedido:", error);
      toast.error("Erro ao cancelar pedido. Tente novamente mais tarde.");
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-50">
          Pedidos
        </h1>
        <p className="text-sm text-slate-500 dark:text-zinc-400">
          Gerencie os pedidos do sistema
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Lista de Pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filtros de Pesquisa + Exibição */}
          <div className="mb-4 flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
              <Input
                placeholder="Buscar pelo nome do cliente..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className="pl-9"
              />
            </div>
            <Link href="/pedidos/novo" passHref>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Pedido
              </Button>
            </Link>
          </div>

          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Itens</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {carregando ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-slate-500 dark:text-zinc-400"
                    >
                      Carregando pedidos...
                    </TableCell>
                  </TableRow>
                ) : pedidosFiltrados.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-slate-500 dark:text-zinc-400"
                    >
                      Nenhum pedido encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  pedidosFiltrados.map((pedido) => {
                    const cfg = configuracaoEstados[pedido.status];
                    return (
                      <TableRow key={pedido.id}>
                        <TableCell className="font-mono text-xs text-slate-500 dark:text-zinc-400">
                          #{pedido.id.substring(0, 8)}
                        </TableCell>
                        <TableCell className="font-medium text-slate-900 dark:text-zinc-100">
                          {pedido.cliente.nome}
                        </TableCell>
                        <TableCell className="text-slate-600 dark:text-zinc-400">
                          {pedido.item?.length || 0}
                        </TableCell>
                        <TableCell className="font-medium text-slate-700 dark:text-zinc-300">
                          {formatCurrency(pedido.valorTotal)}
                        </TableCell>
                        <TableCell>
                          <span className={cfg.className}>{cfg.label}</span>
                        </TableCell>
                        <TableCell className="text-slate-600 dark:text-zinc-400">
                          {new Date(pedido.data).toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Tooltip>
                              <TooltipTrigger>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setPedidoSelecionado(pedido);
                                    setIsModalDetalhesAberto(true);
                                  }}
                                  className="text-slate-400 hover:text-slate-700 dark:text-zinc-500 dark:hover:text-zinc-200"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Ver Detalhes</TooltipContent>
                            </Tooltip>

                            {pedido.status === "RASCUNHO" && (
                              <Tooltip>
                                <TooltipTrigger>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handlePagar(pedido)}
                                    className="text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:text-zinc-500 dark:hover:text-emerald-400 dark:hover:bg-emerald-950/40"
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  Confirmar Pagamento
                                </TooltipContent>
                              </Tooltip>
                            )}

                            {pedido.status !== "CANCELADO" &&
                              pedido.status !== "PAGO" && (
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => {
                                        setPedidoSelecionado(pedido);
                                        setIsModalCancelarAberto(true);
                                      }}
                                      className="text-slate-400 hover:text-red-600 hover:bg-red-50 dark:text-zinc-500 dark:hover:text-red-400 dark:hover:bg-red-950/40"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    Cancelar Pedido
                                  </TooltipContent>
                                </Tooltip>
                              )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Detalhes */}
      <Dialog
        open={isModalDetalhesAberto}
        onOpenChange={setIsModalDetalhesAberto}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Pedido{" "}
              <span className="font-mono text-slate-500 dark:text-zinc-400">
                #{pedidoSelecionado?.id.substring(0, 8)}
              </span>
              {pedidoSelecionado && (
                <span
                  className={
                    configuracaoEstados[pedidoSelecionado.status].className
                  }
                >
                  {configuracaoEstados[pedidoSelecionado.status].label}
                </span>
              )}
            </DialogTitle>
            <DialogDescription>
              Detalhamento completo dos produtos, cliente e valores do pedido.
            </DialogDescription>
          </DialogHeader>

          {pedidoSelecionado && (
            <div className="space-y-6 py-2">
              <div className="grid grid-cols-2 gap-2 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm dark:border-zinc-800 dark:bg-zinc-800/40">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-zinc-500">
                    Cliente
                  </p>
                  <p className="mt-0.5 font-medium text-slate-900 dark:text-zinc-100">
                    {pedidoSelecionado.cliente.nome}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-zinc-500">
                    Data de Criação
                  </p>
                  <p className="mt-0.5 font-medium text-slate-900 dark:text-zinc-100">
                    {new Date(pedidoSelecionado.data).toLocaleDateString(
                      "pt-BR",
                    )}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-zinc-100">
                  Produtos do Pedido
                </h3>

                {/* Mobile: cards compactos por item */}
                <div className="grid grid-cols-1 gap-2 md:hidden">
                  {pedidoSelecionado.item?.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start justify-between rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-zinc-800 dark:bg-zinc-800/40"
                    >
                      <div className="min-w-0 space-y-0.5">
                        <p className="text-sm font-medium text-slate-900 dark:text-zinc-100">
                          {item.nomeProduto}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-zinc-400">
                          {item.quantidade}x ·{" "}
                          {formatCurrency(item.precoUnitario)}
                        </p>
                      </div>
                      <p className="ml-3 shrink-0 text-sm font-semibold text-slate-900 dark:text-zinc-100">
                        {formatCurrency(item.precoUnitario * item.quantidade)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Desktop: tabela completa */}
                <div className="hidden overflow-x-auto rounded-lg border border-slate-200 dark:border-zinc-800 md:block">
                  <Table>
                    <TableHeader className="bg-slate-50 dark:bg-zinc-800/40">
                      <TableRow>
                        <TableHead>Produto</TableHead>
                        <TableHead className="text-center">Qtd</TableHead>
                        <TableHead className="text-right">
                          Preço Unitário
                        </TableHead>
                        <TableHead className="text-right">Subtotal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pedidoSelecionado.item?.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium text-slate-900 dark:text-zinc-100">
                            {item.nomeProduto}
                          </TableCell>
                          <TableCell className="text-center text-slate-600 dark:text-zinc-400">
                            {item.quantidade}
                          </TableCell>
                          <TableCell className="text-right text-slate-600 dark:text-zinc-400">
                            {formatCurrency(item.precoUnitario)}
                          </TableCell>
                          <TableCell className="text-right font-medium text-slate-900 dark:text-zinc-100">
                            {formatCurrency(
                              item.precoUnitario * item.quantidade,
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="flex justify-end border-t border-slate-200 pt-4 dark:border-zinc-800">
                <div className="space-y-0.5 text-right">
                  <span className="block text-sm text-slate-500 dark:text-zinc-400">
                    Valor Total do Pedido
                  </span>
                  <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                    {formatCurrency(pedidoSelecionado.valorTotal)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de cancelamento */}
      <AlertDialog
        open={isModalCancelarAberto}
        onOpenChange={setIsModalCancelarAberto}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Cancelamento</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja cancelar o pedido #
              {pedidoSelecionado?.id.substring(0, 8)}? Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleCancelar}>
              Confirmar Cancelamento
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
