package com.soujoaopedro.mini_erp.controller;

import com.soujoaopedro.mini_erp.dto.PedidoRequestDTO;
import com.soujoaopedro.mini_erp.dto.PedidoResponseDTO;
import com.soujoaopedro.mini_erp.service.PedidoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/pedidos")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class PedidoController {
    private final PedidoService service;

    @GetMapping
    public ResponseEntity<List<PedidoResponseDTO>> listarTodos(){
        List<PedidoResponseDTO> lista = service.listarTodos();
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PedidoResponseDTO> buscarPorId(@PathVariable UUID id){
        PedidoResponseDTO buscarId = service.buscarPeloId(id);
        return ResponseEntity.ok(buscarId);
    }

    @PostMapping
    public ResponseEntity<PedidoResponseDTO> salvar (@RequestBody PedidoRequestDTO request){
        PedidoResponseDTO salvarPedido = service.criarPedido(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(salvarPedido);
    }

    @PutMapping("/{id}/pagar")
    public ResponseEntity<PedidoResponseDTO> pagar(@PathVariable UUID id) {
        PedidoResponseDTO pedidoPago = service.pagarPedido(id);
        return ResponseEntity.ok(pedidoPago);
    }

    @PutMapping("/{id}/cancelar")
    public ResponseEntity<PedidoResponseDTO> cancelar (@PathVariable UUID id){
        PedidoResponseDTO cancelarPedido = service.cancelarPedido(id);
        return ResponseEntity.ok(cancelarPedido);
    }
}
