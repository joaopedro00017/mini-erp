package com.soujoaopedro.mini_erp.dto;

import com.soujoaopedro.mini_erp.domain.Cliente;
import com.soujoaopedro.mini_erp.domain.ItemPedido;
import com.soujoaopedro.mini_erp.domain.StatusPedido;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record PedidoResponseDTO(
        UUID id,
        LocalDate data,
        BigDecimal valorTotal,
        StatusPedido status,
        ClienteResponseDTO cliente,
        List<ItemPedidoResponseDTO> item
) {
}
