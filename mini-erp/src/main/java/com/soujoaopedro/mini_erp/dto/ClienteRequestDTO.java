package com.soujoaopedro.mini_erp.dto;


public record ClienteRequestDTO(
        String nome,
        String cpfCnpj,
        String email) { }
