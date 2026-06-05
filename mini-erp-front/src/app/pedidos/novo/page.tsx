"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  pedidosService,
  type ItemPedido,
  type PedidoRequest,
} from "@/services/pedidos";
import { clientesService, type Cliente } from "@/services/clientes";
import { produtosService, type Produto } from "@/services/produtos";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";

export default function NovoPedidoPage() {
  const router = useRouter();

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [isSalvando, setIsSalvando] = useState(false);

  const [clienteSelecionado, setClienteSelecionado] = useState<string | null>(
    null,
  );
  const [listaItensTemporaria, setListaItensTemporaria] = useState<
    ItemPedido[]
  >([]);
  const [produtoAtual, setProdutoAtual] = useState<{
    produtoId: string | null;
    quantidade: number;
  }>({ produtoId: null, quantidade: 1 });

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [listaClientes, listaProdutos] = await Promise.all([
          clientesService.listarTodos(),
          produtosService.listarTodos(),
        ]);
        setClientes(listaClientes);
        setProdutos(listaProdutos);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        toast.error("Erro ao carregar dados. Tente novamente.");
      } finally {
        setCarregando(false);
      }
    };
    carregarDados();
  }, []);

  const obterNomeProduto = (produtoId: string) =>
    produtos.find((pro) => String(pro.id) === String(produtoId))?.nome ||
    "Produto não encontrado";

  const obterPrecoProduto = (produtoId: string) =>
    produtos.find((pro) => String(pro.id) === String(produtoId))?.preco || 0;

  const totalTemporario = listaItensTemporaria.reduce(
    (acc, item) => acc + obterPrecoProduto(item.produtoId) * item.quantidade,
    0,
  );

  function handleAdicionarItem() {
    if (
      !produtoAtual.produtoId ||
      produtoAtual.produtoId.trim() === "" ||
      produtoAtual.quantidade < 1
    ) {
      toast.error("Selecione um produto e informe a quantidade.");
      return;
    }
    const produtoId = produtoAtual.produtoId;
    setListaItensTemporaria((preview) => {
      const existente = preview.find((i) => i.produtoId === produtoId);
      if (existente) {
        return preview.map((i) =>
          i.produtoId === produtoId
            ? { ...i, quantidade: i.quantidade + produtoAtual.quantidade }
            : i,
        );
      }
      return [...preview, { produtoId, quantidade: produtoAtual.quantidade }];
    });
    setProdutoAtual({ produtoId: null, quantidade: 1 });
  }

  function handleRemoverItem(produtoId: string) {
    setListaItensTemporaria((preview) =>
      preview.filter((i) => i.produtoId !== produtoId),
    );
  }

  async function handleFinalizarPedido() {
    if (!clienteSelecionado || clienteSelecionado.trim() === "") {
      toast.error("Selecione um cliente antes de finalizar.");
      return;
    }
    if (listaItensTemporaria.length === 0) {
      toast.error("Adicione ao menos um produto ao pedido.");
      return;
    }

    const payload: PedidoRequest = {
      clienteId: clienteSelecionado,
      itens: listaItensTemporaria,
    };

    setIsSalvando(true);
    try {
      await pedidosService.criarPedido(payload);
      toast.success("Pedido criado com sucesso!");
      router.push("/pedidos");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao criar pedido.",
      );
    } finally {
      setIsSalvando(false);
    }
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-50">
          Novo Pedido
        </h1>
        <p className="text-sm text-slate-500 dark:text-zinc-400">
          Preencha os dados para criar um novo pedido
        </p>
      </div>

      {/* 1. Seleção de Cliente */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base text-slate-900 dark:text-zinc-100">
            1. Cliente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <Label htmlFor="cliente" className="text-sm font-medium">
              Selecione o cliente
            </Label>
            <Select
              value={clienteSelecionado}
              onValueChange={setClienteSelecionado}
              disabled={carregando}
            >
              <SelectTrigger id="cliente" className="w-full">
                <SelectValue placeholder="Selecione um cliente..." />
              </SelectTrigger>
              <SelectContent>
                {clientes.map((cliente) => (
                  <SelectItem key={cliente.id} value={cliente.id}>
                    {cliente.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 2. Adição de Produtos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base text-slate-900 dark:text-zinc-100">
            2. Produtos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Label htmlFor="produto" className="text-sm font-medium">
                Produto
              </Label>
              <Select
                value={produtoAtual.produtoId}
                onValueChange={(valor) =>
                  setProdutoAtual((preview) => ({
                    ...preview,
                    produtoId: valor,
                  }))
                }
                disabled={carregando}
              >
                <SelectTrigger id="produto" className="mt-1 w-full">
                  <SelectValue placeholder="Selecione um produto..." />
                </SelectTrigger>
                <SelectContent>
                  {produtos.map((produto) => (
                    <SelectItem key={produto.id} value={produto.id}>
                      {produto.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-28">
              <Label htmlFor="quantidade" className="text-sm font-medium">
                Quantidade
              </Label>
              <Input
                id="quantidade"
                type="number"
                min={1}
                className="mt-1"
                value={produtoAtual.quantidade}
                onChange={(e) =>
                  setProdutoAtual((preview) => ({
                    ...preview,
                    quantidade: Number(e.target.value),
                  }))
                }
              />
            </div>
            <Button
              type="button"
              size="icon"
              onClick={handleAdicionarItem}
              className="shrink-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {listaItensTemporaria.length > 0 && (
            <div className="rounded-lg border border-slate-200 dark:border-zinc-800">
              {/* Mobile: cards compactos por item */}
              <div className="md:hidden">
                {listaItensTemporaria.map((item) => {
                  const precoUnitario = obterPrecoProduto(item.produtoId);
                  const subtotal = precoUnitario * item.quantidade;
                  return (
                    <div
                      key={item.produtoId}
                      className="flex items-center gap-3 border-b border-slate-200 p-3 last:border-b-0 dark:border-zinc-800"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-900 dark:text-zinc-100">
                          {obterNomeProduto(item.produtoId)}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500 dark:text-zinc-400">
                          {item.quantidade}x · {formatCurrency(precoUnitario)}
                        </p>
                        <p className="mt-0.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                          {formatCurrency(subtotal)}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoverItem(item.produtoId)}
                        className="shrink-0 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:text-zinc-500 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>

              {/* Desktop: tabela completa */}
              <div className="hidden overflow-x-auto md:block">
                <Table>
                  <TableHeader className="bg-slate-50 dark:bg-zinc-800/40">
                    <TableRow>
                      <TableHead>Produto</TableHead>
                      <TableHead className="text-center">Qtd</TableHead>
                      <TableHead className="text-right">Preço Unit.</TableHead>
                      <TableHead className="text-right">Subtotal</TableHead>
                      <TableHead />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {listaItensTemporaria.map((item) => {
                      const precoUnitario = obterPrecoProduto(item.produtoId);
                      const subtotal = precoUnitario * item.quantidade;
                      return (
                        <TableRow key={item.produtoId}>
                          <TableCell className="font-medium text-slate-900 dark:text-zinc-100">
                            {obterNomeProduto(item.produtoId)}
                          </TableCell>
                          <TableCell className="text-center text-slate-600 dark:text-zinc-400">
                            {item.quantidade}
                          </TableCell>
                          <TableCell className="text-right text-slate-600 dark:text-zinc-400">
                            {formatCurrency(precoUnitario)}
                          </TableCell>
                          <TableCell className="text-right font-medium text-slate-900 dark:text-zinc-100">
                            {formatCurrency(subtotal)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoverItem(item.produtoId)}
                              className="text-slate-400 hover:bg-red-50 hover:text-red-600 dark:text-zinc-500 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Total estimado — sempre visível */}
              <div className="flex justify-end border-t border-slate-200 px-4 py-3 dark:border-zinc-800">
                <div className="text-right">
                  <span className="block text-xs text-slate-500 dark:text-zinc-400">
                    Total estimado
                  </span>
                  <span className="text-base font-bold text-indigo-600 dark:text-indigo-400">
                    {formatCurrency(totalTemporario)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ação final */}
      <div className="flex justify-end">
        <Button size="lg" onClick={handleFinalizarPedido} disabled={isSalvando}>
          {isSalvando ? "Enviando pedido..." : "Finalizar Pedido"}
        </Button>
      </div>
    </div>
  );
}
