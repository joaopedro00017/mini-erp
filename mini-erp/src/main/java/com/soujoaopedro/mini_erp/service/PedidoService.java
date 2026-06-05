package com.soujoaopedro.mini_erp.service;

import com.soujoaopedro.mini_erp.domain.*;
import com.soujoaopedro.mini_erp.dto.*;
import com.soujoaopedro.mini_erp.exception.BusinessException;
import com.soujoaopedro.mini_erp.exception.ResourceNotFoundException;
import com.soujoaopedro.mini_erp.repository.ClienteRepository;
import com.soujoaopedro.mini_erp.repository.PedidoRepository;
import com.soujoaopedro.mini_erp.repository.ProdutoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PedidoService {
    private  final PedidoRepository pedidoRepository;
    private final ClienteRepository clienteRepository;
    private final ProdutoRepository produtoRepository;

    // 1. O CONVERSOR: Totalmente ajustado para bater com a ordem e tipos dos seus Records!
    private PedidoResponseDTO converterParaResponseDTO(Pedido pedido) {

        // Ajuste 1: Passando os 5 campos corretos para o ItemPedidoResponseDTO
        List<ItemPedidoResponseDTO> itensDTO = pedido.getItens().stream()
                .map(item -> new ItemPedidoResponseDTO(
                        item.getId(),                       // 1. id do próprio item
                        item.getProduto().getId(),          // 2. produtoId
                        item.getProduto().getNome(),        // 3. nomeProduto
                        item.getQuantidade(),               // 4. quantidade
                        item.getPrecoUnitario()             // 5. precoUnitario
                ))
                .collect(Collectors.toList());

        // Ajuste 2: Montando o ClienteResponseDTO completo que o seu PedidoResponseDTO exige
        ClienteResponseDTO clienteDTO = new ClienteResponseDTO(
                pedido.getCliente().getId(),
                pedido.getCliente().getNome(),
                pedido.getCliente().getCpfCnpj(),
                pedido.getCliente().getEmail()
        );

        // Ajuste 3: Respeitando a ordem exata de parâmetros do seu PedidoResponseDTO:
        // (UUID id, LocalDate data, BigDecimal valorTotal, StatusPedido status, ClienteResponseDTO cliente, List<ItemPedidoResponseDTO> item)
        return new PedidoResponseDTO(
                pedido.getId(),
                pedido.getData(),
                pedido.getValorTotal(),
                pedido.getStatus(), // Passando o Enum puro, conforme esperado pelo record
                clienteDTO,         // Passando o objeto DTO do cliente completo
                itensDTO            // Lista de itens convertida
        );
    }

    @Transactional
    // 2. O CRIAR PEDIDO: Mantendo sua lógica impecável e amarrando com o conversor corrigido
    public PedidoResponseDTO criarPedido (PedidoRequestDTO request){
        UUID idDoCliente = request.clienteId();
        Cliente cliente = clienteRepository.findById(request.clienteId())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com o ID " + idDoCliente));

        Pedido novoPedido = new Pedido();
        novoPedido.setCliente(cliente);
        novoPedido.setData(LocalDate.now());
        novoPedido.setStatus(StatusPedido.RASCUNHO);

        BigDecimal valorTotal = BigDecimal.ZERO;

        for (ItemPedidoRequestDTO itemDto : request.itens()) {
            Produto produto = produtoRepository.findById(itemDto.produtoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado com o id " + itemDto.produtoId()));

            if (produto.getEstoque() < itemDto.quantidade()) {
                throw new BusinessException("Estoque Insuficiente para o produto " + produto.getNome());
            }

            produto.setEstoque(produto.getEstoque() - itemDto.quantidade());
            produtoRepository.save(produto);

            BigDecimal precoUnitario = produto.getPreco();
            BigDecimal subtotalItem = precoUnitario.multiply(BigDecimal.valueOf(itemDto.quantidade()));
            valorTotal = valorTotal.add(subtotalItem);

            ItemPedido novoItemPedido = new ItemPedido();
            novoItemPedido.setProduto(produto);
            novoItemPedido.setQuantidade(itemDto.quantidade());
            novoItemPedido.setPrecoUnitario(precoUnitario);
            novoItemPedido.setPedido(novoPedido);
            novoPedido.getItens().add(novoItemPedido);
        }

        novoPedido.setValorTotal(valorTotal);
        Pedido pedidoSalvo = pedidoRepository.save(novoPedido);

        return converterParaResponseDTO(pedidoSalvo);
    }

    @Transactional
    public PedidoResponseDTO pagarPedido(UUID id) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado com o ID " + id));
        if (pedido.getStatus() != StatusPedido.RASCUNHO) {
            throw new BusinessException("Apenas pedidos com status RASCUNHO podem ser pagos.");
        }
        pedido.setStatus(StatusPedido.PAGO);
        Pedido pedidoPago = pedidoRepository.save(pedido);
        return converterParaResponseDTO(pedidoPago);
    }

    @Transactional
    public PedidoResponseDTO cancelarPedido (UUID id){
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado com o ID " + id));
        if(pedido.getStatus() == StatusPedido.CANCELADO){
            throw new BusinessException("Seu Pedido já foi cancelado!");
        }
        for (ItemPedido item : pedido.getItens()){
            Produto produto = item.getProduto();
            Integer estoqueAtual = produto.getEstoque();
            Integer novoEstoque = estoqueAtual + (item.getQuantidade());
            produto.setEstoque(novoEstoque);
            produtoRepository.save(produto);
        }
        pedido.setStatus(StatusPedido.CANCELADO);
        Pedido pedidoCancelado = pedidoRepository.save(pedido);
        return converterParaResponseDTO(pedidoCancelado);
    }

    public PedidoResponseDTO buscarPeloId (UUID id){
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado com o ID " + id));
        return converterParaResponseDTO(pedido);
    }

    public List<PedidoResponseDTO>listarTodos(){
        return pedidoRepository.findAll().stream().map(this::converterParaResponseDTO).collect(Collectors.toList());
    }
}
