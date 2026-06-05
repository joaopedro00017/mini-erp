package com.soujoaopedro.mini_erp.dto;
import java.math.BigDecimal;
import java.util.UUID;

public record ProdutoResponseDTO(
        UUID id,
        String nome,
        BigDecimal preco,
        Integer estoque,
        Integer estoqueMinimo,
        CategoriaResponseDTO categoria
) {
}
