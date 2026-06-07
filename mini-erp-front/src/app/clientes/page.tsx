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
import { Pen, Plus, Search, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { Cliente, clientesService } from "@/services/clientes";
import { toast } from "sonner";

function formatarCpfCnpj(valor: string): string {
  const digits = valor.replace(/\D/g, "");
  if (digits.length === 11) {
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }
  if (digits.length === 14) {
    return digits.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      "$1.$2.$3/$4-$5",
    );
  }
  return valor;
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [isSalvando, setIsSalvando] = useState(false);

  const [filtro, setFiltro] = useState<string>("");
  const clientesFiltrados = clientes.filter((cliente) => {
    const texto = filtro.toLowerCase().trim();
    return (
      cliente.nome.toLowerCase().includes(texto) ||
      cliente.cpfCnpj.toLowerCase().includes(texto)
    );
  });

  const [isModalCadastroAberto, setIsModalCadastroAberto] = useState(false);
  const [novoNome, setNovoNome] = useState("");
  const [novoEmail, setNovoEmail] = useState("");
  const [novoCpfCnpj, setNovoCpfCnpj] = useState("");

  const [isModalDeletarAberto, setIsModalDeletarAberto] = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(
    null,
  );

  const [isModalEditarAberto, setIsModalEditarAberto] = useState(false);
  const [nomeEdicao, setNomeEdicao] = useState("");
  const [emailEdicao, setEmailEdicao] = useState("");
  const [cpfCnpjEdicao, setCpfCnpjEdicao] = useState("");

  useEffect(() => {
    const carregarClientes = async () => {
      try {
        const listaClientes = await clientesService.listarTodos();
        setClientes(listaClientes);
      } catch (error) {
        console.error("Erro ao carregar clientes: ", error);
        toast.error("Erro ao carregar clientes");
      } finally {
        setCarregando(false);
      }
    };
    carregarClientes();
  }, []);

  const handleSubmit = async () => {
    if (!novoNome.trim() || !novoEmail.trim() || !novoCpfCnpj.trim()) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }
    setIsSalvando(true);
    try {
      const novoCliente = await clientesService.salvar({
        nome: novoNome.trim(),
        email: novoEmail.trim(),
        cpfCnpj: novoCpfCnpj.trim(),
      });
      setClientes((prev) => [...prev, novoCliente]);
      toast.success("Cliente cadastrado com sucesso!");
      setIsModalCadastroAberto(false);
      setNovoNome("");
      setNovoEmail("");
      setNovoCpfCnpj("");
    } catch (error) {
      console.error("Erro ao cadastrar cliente: ", error);
      toast.error("Erro ao cadastrar cliente.");
    } finally {
      setIsSalvando(false);
    }
  };

  const handleDeletar = async () => {
    if (!clienteSelecionado) return;
    try {
      await clientesService.deletar(clienteSelecionado.id);
      setClientes((prev) => prev.filter((c) => c.id !== clienteSelecionado.id));
      setIsModalDeletarAberto(false);
      toast.success("Cliente deletado com sucesso");
    } catch (error) {
      console.error("Erro ao deletar cliente:", error);
      toast.error("Erro ao deletar cliente, tente novamente mais tarde!");
    }
  };

  const handleEditar = async () => {
    if (
      !clienteSelecionado ||
      !nomeEdicao.trim() ||
      !emailEdicao.trim() ||
      !cpfCnpjEdicao.trim()
    ) {
      toast.error("Por favor, preencha todos os campos para editar.");
      return;
    }
    setIsSalvando(true);
    try {
      await clientesService.atualizar(clienteSelecionado.id, {
        nome: nomeEdicao.trim(),
        email: emailEdicao.trim(),
        cpfCnpj: cpfCnpjEdicao.trim(),
      });
      setClientes((prev) =>
        prev.map((cli) =>
          cli.id === clienteSelecionado.id
            ? {
                ...cli,
                nome: nomeEdicao.trim(),
                email: emailEdicao.trim(),
                cpfCnpj: cpfCnpjEdicao.trim(),
              }
            : cli,
        ),
      );
      toast.success("Cliente atualizado com sucesso!");
      setIsModalEditarAberto(false);
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      toast.error("Erro ao atualizar cliente, tente novamente.");
    } finally {
      setIsSalvando(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-50">
          Clientes
        </h1>
        <p className="text-sm text-slate-500 dark:text-zinc-400">
          Base de clientes cadastrados
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Lista de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          {/*filtros de pesquisa + exibição */}
          <div className="mb-4 flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
              <Input
                placeholder="Buscar por nome ou documento..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button onClick={() => setIsModalCadastroAberto(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Cliente
            </Button>
          </div>

          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>CPF/CNPJ</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {carregando ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-slate-500 dark:text-zinc-400"
                    >
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : clientesFiltrados.length > 0 ? (
                  clientesFiltrados.map((cliente) => (
                    <TableRow key={cliente.id}>
                      <TableCell className="font-medium text-slate-900 dark:text-zinc-100">
                        {cliente.nome}
                      </TableCell>
                      <TableCell className="text-slate-600 dark:text-zinc-400">
                        {cliente.email}
                      </TableCell>
                      <TableCell className="font-mono text-sm text-slate-600 dark:text-zinc-400">
                        {formatarCpfCnpj(cliente.cpfCnpj)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setClienteSelecionado(cliente);
                              setNomeEdicao(cliente.nome);
                              setEmailEdicao(cliente.email);
                              setCpfCnpjEdicao(cliente.cpfCnpj);
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
                              setClienteSelecionado(cliente);
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
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-slate-500 dark:text-zinc-400"
                    >
                      Nenhum cliente encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modal de cadastro */}
      <Dialog
        open={isModalCadastroAberto}
        onOpenChange={setIsModalCadastroAberto}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Novo Cliente</DialogTitle>
            <DialogDescription>
              Preencha os dados cadastrais do novo cliente.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="nome">Nome Completo*</Label>
              <Input
                id="nome"
                value={novoNome}
                onChange={(e) => setNovoNome(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">E-mail*</Label>
              <Input
                id="email"
                type="email"
                value={novoEmail}
                onChange={(e) => setNovoEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cpfCnpj">CPF ou CNPJ*</Label>
              <Input
                id="cpfCnpj"
                value={novoCpfCnpj}
                onChange={(e) => setNovoCpfCnpj(e.target.value)}
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
              {isSalvando ? "Salvando..." : "Salvar Cliente"}
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
              Tem certeza que deseja excluir o cliente &quot;
              {clienteSelecionado?.nome}&quot;? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDeletar}>
              Excluir Cliente
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal de edição */}
      <Dialog open={isModalEditarAberto} onOpenChange={setIsModalEditarAberto}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
            <DialogDescription>
              Altere os dados cadastrais do cliente selecionado.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="nomeEdicao">Nome Completo*</Label>
              <Input
                id="nomeEdicao"
                value={nomeEdicao}
                onChange={(e) => setNomeEdicao(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="emailEdicao">E-mail*</Label>
              <Input
                id="emailEdicao"
                type="email"
                value={emailEdicao}
                onChange={(e) => setEmailEdicao(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cpfCnpjEdicao">CPF ou CNPJ*</Label>
              <Input
                id="cpfCnpjEdicao"
                value={cpfCnpjEdicao}
                onChange={(e) => setCpfCnpjEdicao(e.target.value)}
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
