package com.soujoaopedro.mini_erp.controller;

import com.soujoaopedro.mini_erp.dto.ClienteRequestDTO;
import com.soujoaopedro.mini_erp.dto.ClienteResponseDTO;
import com.soujoaopedro.mini_erp.service.ClienteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/clientes")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ClienteController {
    private final ClienteService service;

    @GetMapping
    public ResponseEntity<List<ClienteResponseDTO>> listarTodos(){
        List<ClienteResponseDTO> lista = service.listarTodas();
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClienteResponseDTO> buscarPorId(@PathVariable UUID id){
        ClienteResponseDTO buscarId = service.buscarPorId(id);
        return ResponseEntity.ok(buscarId);
    }

    //Endpoint que cria um cliente atraves de (POST http://localhost:8080/api/cliente)
    @PostMapping
    public ResponseEntity<ClienteResponseDTO> salvar(@RequestBody ClienteRequestDTO request) {
        ClienteResponseDTO novoCliente = service.salvar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoCliente); // Retorna Status 201 Created
    }

    // Endpoint para deletar um cliente (DELETE http://localhost:8080/api/cliente/{id})
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable UUID id) {
        service.deletar(id);
        return ResponseEntity.noContent().build(); // Retorna o Status 204 já que não irá retornar dados
    }

    // Endpoint para atualizar um cliente (PUT http://localhost:8080/api/cliente/{id})
    @PutMapping("/{id}")
    public ResponseEntity<ClienteResponseDTO> atualizar(@PathVariable UUID id, @RequestBody ClienteRequestDTO request) {
        ClienteResponseDTO atualizada = service.atualizar(id, request);
        return ResponseEntity.ok(atualizada); // Retorna Status 200 OK com o objeto atualizado
    }
}
