package com.soujoaopedro.mini_erp.repository;

import com.soujoaopedro.mini_erp.domain.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;
@Repository
public interface PedidoRepository extends JpaRepository<Pedido, UUID> {
}
