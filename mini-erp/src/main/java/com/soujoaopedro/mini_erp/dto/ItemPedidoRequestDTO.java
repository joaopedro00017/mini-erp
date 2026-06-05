package com.soujoaopedro.mini_erp.dto;

import java.util.UUID;

public record ItemPedidoRequestDTO(
        UUID produtoId,
        Integer quantidade
) {
}
