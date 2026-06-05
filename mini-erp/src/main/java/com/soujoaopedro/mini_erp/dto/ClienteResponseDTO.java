package com.soujoaopedro.mini_erp.dto;

import java.util.UUID;

public record ClienteResponseDTO(
        UUID id,
        String nome,
        String cpfCnpj,
        String email
)
{ }
