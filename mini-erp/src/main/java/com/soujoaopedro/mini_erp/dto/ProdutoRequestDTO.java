package com.soujoaopedro.mini_erp.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record ProdutoRequestDTO(
        String nome,
        BigDecimal preco,
        Integer estoque,
        Integer estoqueMinimo,
        UUID categoriaId
) {
}
