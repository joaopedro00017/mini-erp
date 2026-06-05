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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash, Pen, AlertTriangle, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { produtosService, Produto, ProdutoRequest } from "@/services/produtos";
import { categoriasService, Categoria } from "@/services/categorias";
import { toast } from "sonner";

function EstoqueBadge({
  estoque,
  estoqueMinimo,
}: {
  estoque: number;
  estoqueMinimo: number;
}) {
  const isCritico = estoque <= estoqueMinimo;
  const isAtencao = !isCritico && estoque - estoqueMinimo <= 2;

  if (isCritico) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 dark:bg-red-950/40 dark:text-red-400">
        <AlertTriangle className="h-3 w-3" />
        {estoque}
      </span>
    );
  }

  if (isAtencao) {
    return (
      <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
        {estoque}
      </span>
    );
  }

  return <span className="text-slate-700 dark:text-zinc-300">{estoque}</span>;
}

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [isSalvando, setIsSalvando] = useState(false);

  const [filtro, setFiltro] = useState("");
  const produtosFiltrados = produtos.filter((p) =>
    p.nome.toLowerCase().includes(filtro.toLowerCase().trim()),
  );

  // Produto selecionado — compartilhado pelos modais de edição e exclusão
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(
    null,
  );

  // Modal de cadastro
  const [isModalCadastroAberto, setIsModalCadastroAberto] = useState(false);
  const [novoNome, setNovoNome] = useState("");
  const [novaCategoriaId, setNovaCategoriaId] = useState("");
  const [novoPreco, setNovoPreco] = useState("");
  const [novoEstoque, setNovoEstoque] = useState("");
  const [novoEstoqueMinimo, setNovoEstoqueMinimo] = useState("");

  // Modal de edição
  const [isModalEditarAberto, setIsModalEditarAberto] = useState(false);
  const [nomeEdicao, setNomeEdicao] = useState("");
  const [categoriaIdEdicao, setCategoriaIdEdicao] = useState("");
  const [precoEdicao, setPrecoEdicao] = useState("");
  const [estoqueEdicao, setEstoqueEdicao] = useState("");
  const [estoqueMinimoEdicao, setEstoqueMinimoEdicao] = useState("");

  // Modal de exclusão
  const [isModalDeletarAberto, setIsModalDeletarAberto] = useState(false);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [listaProdutos, listaCategorias] = await Promise.all([
          produtosService.listarTodos(),
          categoriasService.listarTodos(),
        ]);
        setProdutos(listaProdutos);
        setCategorias(listaCategorias);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        toast.error("Erro ao carregar produtos");
      } finally {
        setCarregando(false);
      }
    };
    carregarDados();
  }, []);

  const handleIniciarEdicao = (produto: Produto) => {
    setProdutoSelecionado(produto);
    setNomeEdicao(produto.nome);
    setCategoriaIdEdicao(
      String(produto.categoriaId || produto.categoria?.id || ""),
    );
    setPrecoEdicao(produto.preco.toString());
    setEstoqueEdicao(produto.estoque.toString());
    setEstoqueMinimoEdicao((produto.estoqueMinimo ?? 0).toString());
    setIsModalEditarAberto(true);
  };

  const handleSalvarEdicao = async () => {
    if (!produtoSelecionado) return;
    if (!nomeEdicao.trim()) {
      toast.error("O nome do produto é obrigatório.");
      return;
    }
    if (!categoriaIdEdicao) {
      toast.error("Selecione uma categoria.");
      return;
    }

    const preco = Number(precoEdicao);
    if (isNaN(preco) || preco <= 0) {
      toast.error("O preço deve ser maior que zero.");
      return;
    }

    const estoque = Number(estoqueEdicao);
    if (isNaN(estoque) || estoque < 0) {
      toast.error("O estoque não pode ser negativo.");
      return;
    }

    const payload: ProdutoRequest = {
      nome: nomeEdicao.trim(),
      categoriaId: categoriaIdEdicao,
      preco,
      estoque,
      estoqueMinimo: Number(estoqueMinimoEdicao) || 0,
    };

    setIsSalvando(true);
    try {
      const produtoAtualizado = await produtosService.atualizar(
        produtoSelecionado.id,
        payload,
      );
      setProdutos((preview) =>
        preview.map((pro) =>
          pro.id === produtoSelecionado.id ? produtoAtualizado : pro,
        ),
      );
      toast.success("Produto atualizado com sucesso");
      setIsModalEditarAberto(false);
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      toast.error("Erro ao salvar produto");
    } finally {
      setIsSalvando(false);
    }
  };

  const handleCadastrar = async () => {
    if (!novoNome.trim() || !novaCategoriaId) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    const preco = Number(novoPreco);
    if (isNaN(preco) || preco <= 0) {
      toast.error("O preço deve ser maior que zero.");
      return;
    }

    const estoque = Number(novoEstoque);
    if (isNaN(estoque) || estoque < 0) {
      toast.error("O estoque não pode ser negativo.");
      return;
    }

    const payload: ProdutoRequest = {
      nome: novoNome.trim(),
      categoriaId: novaCategoriaId,
      preco,
      estoque,
      estoqueMinimo: Number(novoEstoqueMinimo) || 0,
    };

    setIsSalvando(true);
    try {
      const novoProduto = await produtosService.salvar(payload);
      setProdutos((preview) => [...preview, novoProduto]);
      toast.success("Produto cadastrado com sucesso");
      setIsModalCadastroAberto(false);
      setNovoNome("");
      setNovaCategoriaId("");
      setNovoPreco("");
      setNovoEstoque("");
      setNovoEstoqueMinimo("");
    } catch (error) {
      console.error("Erro ao cadastrar produto:", error);
      toast.error("Erro ao cadastrar produto");
    } finally {
      setIsSalvando(false);
    }
  };

  const handleDeletar = async () => {
    if (!produtoSelecionado) return;
    try {
      await produtosService.deletar(produtoSelecionado.id);
      setProdutos((preview) =>
        preview.filter((pro) => pro.id !== produtoSelecionado.id),
      );
      toast.success("Produto deletado com sucesso");
      setIsModalDeletarAberto(false);
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      toast.error("Erro ao deletar produto");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-50">
          Produtos
        </h1>
        <p className="text-sm text-slate-500 dark:text-zinc-400">
          Catálogo de produtos disponíveis
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Lista de Produtos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
              <Input
                placeholder="Filtrar produtos por nome..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button onClick={() => setIsModalCadastroAberto(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Produto
            </Button>
          </div>

          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Estoque</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {carregando ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-slate-500 dark:text-zinc-400"
                    >
                      Carregando produtos...
                    </TableCell>
                  </TableRow>
                ) : produtosFiltrados.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-slate-500 dark:text-zinc-400"
                    >
                      Nenhum produto encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  produtosFiltrados.map((produto) => (
                    <TableRow key={produto.id}>
                      <TableCell className="font-medium text-slate-900 dark:text-zinc-100">
                        {produto.nome}
                      </TableCell>
                      <TableCell className="text-slate-600 dark:text-zinc-400">
                        {produto.categoria?.nome || "—"}
                      </TableCell>
                      <TableCell className="text-slate-700 dark:text-zinc-300">
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(produto.preco)}
                      </TableCell>
                      <TableCell>
                        <EstoqueBadge
                          estoque={produto.estoque}
                          estoqueMinimo={produto.estoqueMinimo ?? 0}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleIniciarEdicao(produto)}
                            className="text-slate-400 hover:text-slate-700 dark:text-zinc-500 dark:hover:text-zinc-200"
                          >
                            <Pen className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setProdutoSelecionado(produto);
                              setIsModalDeletarAberto(true);
                            }}
                            className="text-slate-400 hover:text-red-600 hover:bg-red-50 dark:text-zinc-500 dark:hover:text-red-400 dark:hover:bg-red-950/40"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modal de edição */}
      <Dialog open={isModalEditarAberto} onOpenChange={setIsModalEditarAberto}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar Produto</DialogTitle>
            <DialogDescription>
              Altere os dados e clique em &quot;Salvar&quot; para confirmar.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="nomeEdicao">Nome do Produto</Label>
              <Input
                id="nomeEdicao"
                value={nomeEdicao}
                onChange={(e) => setNomeEdicao(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Categoria</Label>
              <Select
                key={produtoSelecionado?.id}
                value={categoriaIdEdicao}
                onValueChange={(val) => setCategoriaIdEdicao(val ?? "")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione uma categoria...">
                    {categorias.find(
                      (cat) => String(cat.id) === categoriaIdEdicao,
                    )?.nome ||
                      produtoSelecionado?.categoria?.nome ||
                      "Selecione uma categoria..."}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((categoria) => (
                    <SelectItem
                      key={String(categoria.id)}
                      value={String(categoria.id)}
                    >
                      {categoria.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="precoEdicao">Preço</Label>
              <Input
                id="precoEdicao"
                type="number"
                step="0.01"
                value={precoEdicao}
                onChange={(e) => setPrecoEdicao(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="estoqueEdicao">Estoque</Label>
              <Input
                id="estoqueEdicao"
                type="number"
                value={estoqueEdicao}
                onChange={(e) => setEstoqueEdicao(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="estoqueMinimoEdicao">Estoque Mínimo</Label>
              <Input
                id="estoqueMinimoEdicao"
                type="number"
                placeholder="0"
                value={estoqueMinimoEdicao}
                onChange={(e) => setEstoqueMinimoEdicao(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsModalEditarAberto(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleSalvarEdicao} disabled={isSalvando}>
              {isSalvando ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de cadastro */}
      <Dialog
        open={isModalCadastroAberto}
        onOpenChange={setIsModalCadastroAberto}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Novo Produto</DialogTitle>
            <DialogDescription>
              Preencha os dados para adicionar o produto ao catálogo.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="novoNome">Nome do Produto</Label>
              <Input
                id="novoNome"
                value={novoNome}
                onChange={(e) => setNovoNome(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Categoria</Label>
              <Select
                value={novaCategoriaId}
                onValueChange={(v) => setNovaCategoriaId(v ?? "")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione uma categoria..." />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((categoria) => (
                    <SelectItem
                      key={String(categoria.id)}
                      value={String(categoria.id)}
                    >
                      {categoria.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="novoPreco">Preço</Label>
              <Input
                id="novoPreco"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={novoPreco}
                onChange={(e) => setNovoPreco(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="novoEstoque">Estoque</Label>
              <Input
                id="novoEstoque"
                type="number"
                placeholder="0"
                value={novoEstoque}
                onChange={(e) => setNovoEstoque(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="novoEstoqueMinimo">Estoque Mínimo</Label>
              <Input
                id="novoEstoqueMinimo"
                type="number"
                placeholder="0"
                value={novoEstoqueMinimo}
                onChange={(e) => setNovoEstoqueMinimo(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsModalCadastroAberto(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleCadastrar} disabled={isSalvando}>
              {isSalvando ? "Cadastrando..." : "Cadastrar Produto"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de exclusão */}
      <AlertDialog
        open={isModalDeletarAberto}
        onOpenChange={setIsModalDeletarAberto}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o produto &quot;
              {produtoSelecionado?.nome}&quot;? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDeletar}>
              Excluir Produto
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
