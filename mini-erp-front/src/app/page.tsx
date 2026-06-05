"use client";

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
  DollarSign,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Produto, produtosService } from "@/services/produtos";
import { pedidosService } from "@/services/pedidos";

function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconClass,
  iconBgClass,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
  iconClass: string;
  iconBgClass: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-600 dark:text-zinc-400">
          {title}
        </CardTitle>
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconBgClass}`}
        >
          <Icon className={`h-4 w-4 ${iconClass}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-900 dark:text-zinc-50">
          {value}
        </div>
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
          {subtitle}
        </p>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const [faturamentoTotal, setFaturamentoTotal] = useState<number>(0);
  const [volumePedidos, setVolumePedidos] = useState<number>(0);
  const [ticketMedio, setTicketMedio] = useState<number>(0);
  const [alertas, setAlertas] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);

  useEffect(() => {
    const carregarDashboard = async () => {
      try {
        const [listaPedidos, listaProdutos] = await Promise.all([
          pedidosService.listarTodos(),
          produtosService.listarTodos(),
        ]);

        const pedidosValidos = listaPedidos.filter(
          (pedido) => pedido.status === "PAGO",
        );

        const faturamentoCalculado = pedidosValidos.reduce(
          (acumulador, pedido) => acumulador + pedido.valorTotal,
          0,
        );

        const volumeCalculado = pedidosValidos.length;
        const ticketMedioCalculado =
          volumeCalculado > 0 ? faturamentoCalculado / volumeCalculado : 0;

        const produtosComEstoqueBaixo = listaProdutos.filter((produto) => {
          const minimo = produto.estoqueMinimo ?? 0;
          return produto.estoque <= minimo || produto.estoque - minimo <= 2;
        });

        setFaturamentoTotal(faturamentoCalculado);
        setVolumePedidos(volumeCalculado);
        setTicketMedio(ticketMedioCalculado);
        setAlertas(produtosComEstoqueBaixo);
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
      } finally {
        setCarregando(false);
      }
    };
    carregarDashboard();
  }, []);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-50">
          Dashboard
        </h1>
        <p className="text-sm text-slate-500 dark:text-zinc-400">
          Visão geral do seu negócio
        </p>
      </div>

      {/* Grid de Métricas */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard
          title="Faturamento Total"
          value={carregando ? "—" : formatCurrency(faturamentoTotal)}
          subtitle="Pedidos aprovados"
          icon={DollarSign}
          iconBgClass="bg-indigo-50 dark:bg-indigo-950/40"
          iconClass="text-indigo-600 dark:text-indigo-400"
        />
        <MetricCard
          title="Volume de Pedidos"
          value={carregando ? "—" : String(volumePedidos)}
          subtitle="Pedidos pagos"
          icon={ShoppingCart}
          iconBgClass="bg-emerald-50 dark:bg-emerald-950/40"
          iconClass="text-emerald-600 dark:text-emerald-400"
        />
        <MetricCard
          title="Ticket Médio"
          value={carregando ? "—" : formatCurrency(ticketMedio)}
          subtitle="Por pedido"
          icon={TrendingUp}
          iconBgClass="bg-amber-50 dark:bg-amber-950/40"
          iconClass="text-amber-600 dark:text-amber-400"
        />
      </div>

      {/* Alertas de Reposição */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-2 pb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/40">
            <AlertTriangle className="h-4 w-4 text-amber-500 dark:text-amber-400" />
          </div>
          <CardTitle className="text-base">Alertas de Reposição</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Estoque Atual</TableHead>
                  <TableHead>Estoque Mínimo</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alertas.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-slate-500 dark:text-zinc-400"
                    >
                      Nenhum alerta de reposição no momento
                    </TableCell>
                  </TableRow>
                ) : (
                  alertas.map((produto) => {
                    const minimo = produto.estoqueMinimo ?? 0;
                    const isCritico = produto.estoque <= minimo;
                    return (
                      <TableRow key={produto.id}>
                        <TableCell className="font-medium">
                          {produto.nome}
                        </TableCell>
                        <TableCell>{produto.estoque}</TableCell>
                        <TableCell>{minimo}</TableCell>
                        <TableCell>
                          {isCritico ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 dark:bg-red-950/40 dark:text-red-400">
                              <AlertTriangle className="h-3 w-3" />
                              Crítico
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
                              Atenção
                            </span>
                          )}
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
    </div>
  );
}
