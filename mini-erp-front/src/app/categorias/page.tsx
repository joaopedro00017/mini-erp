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
import { Pen, Plus, Search, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { Categoria, categoriasService } from "@/services/categorias";
import { toast } from "sonner";
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

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [isSalvando, setIsSalvando] = useState(false);

  const [isModalCadastroAberto, setIsModalCadastroAberto] = useState(false);
  const [novoNome, setNovoNome] = useState("");

  const [isModalDeletarAberto, setIsModalDeletarAberto] = useState(false);
  const [categoriaSelecionada, setCategoriaSelecionada] =
    useState<Categoria | null>(null);

  const [isModalEditarAberto, setIsModalEditarAberto] = useState(false);
  const [nomeEdicao, setNomeEdicao] = useState("");

  const [filtro, setFiltro] = useState<string>("");

  const categoriasFiltradas = categorias.filter((categoria) =>
    categoria.nome.toLowerCase().includes(filtro.toLowerCase().trim()),
  );

  useEffect(() => {
    const carregarCategorias = async () => {
      try {
        const listaCategorias = await categoriasService.listarTodos();
        setCategorias(listaCategorias);
      } catch (error) {
        console.error("Erro ao carregar categorias: ", error);
        toast.error("Erro ao carregar categorias");
      } finally {
        setCarregando(false);
      }
    };
    carregarCategorias();
  }, []);

  const handleSubmit = async () => {
    if (!novoNome.trim()) {
      toast.error("O nome da categoria é obrigatório");
      return;
    }
    setIsSalvando(true);
    try {
      const novaCategoria = await categoriasService.salvar({
        nome: novoNome.trim(),
      });
      setCategorias((prev) => [...prev, novaCategoria]);
      setIsModalCadastroAberto(false);
      setNovoNome("");
      toast.success("Categoria criada com sucesso!");
    } catch (error) {
      console.error("Erro ao criar categoria: ", error);
      toast.error("Erro ao criar categoria");
    } finally {
      setIsSalvando(false);
    }
  };

  const handleDeletar = async () => {
    if (!categoriaSelecionada) return;
    try {
      await categoriasService.deletar(categoriaSelecionada.id);
      setCategorias((prev) =>
        prev.filter((c) => c.id !== categoriaSelecionada.id),
      );
      setIsModalDeletarAberto(false);
      toast.success("Categoria deletada com sucesso");
    } catch (error) {
      console.error("Erro ao deletar categoria: ", error);
      toast.error(
        "Não foi possível deletar esta categoria. Tente novamente mais tarde!",
      );
    }
  };

  const handleEditar = async () => {
    if (!nomeEdicao.trim() || !categoriaSelecionada) {
      toast.error("O nome da categoria não pode estar vazio.");
      return;
    }
    setIsSalvando(true);
    try {
      await categoriasService.atualizar(categoriaSelecionada.id, {
        nome: nomeEdicao.trim(),
      });
      setCategorias((prev) =>
        prev.map((c) =>
          c.id === categoriaSelecionada.id
            ? { ...c, nome: nomeEdicao.trim() }
            : c,
        ),
      );
      toast.success("Categoria atualizada com sucesso!");
      setIsModalEditarAberto(false);
    } catch (error) {
      console.error("Erro ao atualizar categoria: ", error);
      toast.error("Erro ao atualizar categoria.");
    } finally {
      setIsSalvando(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-50">
          Categorias
        </h1>
        <p className="text-sm text-slate-500 dark:text-zinc-400">
          Categorias de produtos cadastradas
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Lista de Categorias</CardTitle>
        </CardHeader>
        <CardContent>
          {/*filtros de pesquisa + exibição */}
          <div className="mb-4 flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
              <Input
                placeholder="Filtrar categorias..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button onClick={() => setIsModalCadastroAberto(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Categoria
            </Button>
          </div>

          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {carregando ? (
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      className="text-center text-slate-500 dark:text-zinc-400"
                    >
                      Carregando categorias...
                    </TableCell>
                  </TableRow>
                ) : categoriasFiltradas.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      className="text-center text-slate-500 dark:text-zinc-400"
                    >
                      Nenhuma categoria encontrada.
                    </TableCell>
                  </TableRow>
                ) : (
                  categoriasFiltradas.map((categoria) => (
                    <TableRow key={categoria.id}>
                      <TableCell className="font-medium text-slate-900 dark:text-zinc-100">
                        {categoria.nome}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setCategoriaSelecionada(categoria);
                              setNomeEdicao(categoria.nome);
                              setIsModalEditarAberto(true);
                            }}
                            className="text-slate-400 hover:text-slate-700 dark:text-zinc-500 dark:hover:text-zinc-200"
                          >
                            <Pen className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setCategoriaSelecionada(categoria);
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

      {/* Modal de criação */}
      <Dialog
        open={isModalCadastroAberto}
        onOpenChange={setIsModalCadastroAberto}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nova Categoria</DialogTitle>
            <DialogDescription>
              Preencha os dados da nova categoria.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="nome">Nome*</Label>
              <Input
                id="nome"
                value={novoNome}
                onChange={(e) => setNovoNome(e.target.value)}
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
            <Button onClick={handleSubmit} disabled={isSalvando}>
              {isSalvando ? "Salvando..." : "Salvar"}
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
              Tem certeza que deseja excluir a categoria &quot;
              {categoriaSelecionada?.nome}&quot;? Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDeletar}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal de edição */}
      <Dialog open={isModalEditarAberto} onOpenChange={setIsModalEditarAberto}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Categoria</DialogTitle>
            <DialogDescription>
              Altere o nome da categoria selecionada.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="nomeEdicao">Nome*</Label>
              <Input
                id="nomeEdicao"
                value={nomeEdicao}
                onChange={(e) => setNomeEdicao(e.target.value)}
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
            <Button onClick={handleEditar} disabled={isSalvando}>
              {isSalvando ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
