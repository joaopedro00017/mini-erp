package com.soujoaopedro.mini_erp.controller;


import com.soujoaopedro.mini_erp.dto.ProdutoRequestDTO;
import com.soujoaopedro.mini_erp.dto.ProdutoResponseDTO;
import com.soujoaopedro.mini_erp.service.ProdutoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/produtos")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ProdutoController {
    private final ProdutoService service;

    @GetMapping
    public ResponseEntity<List<ProdutoResponseDTO>> listarTodos(){
        List<ProdutoResponseDTO> lista = service.listarTodas();
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProdutoResponseDTO> buscarPorId(@PathVariable UUID id){
        ProdutoResponseDTO buscarId = service.buscarPorId(id);
        return ResponseEntity.ok(buscarId);
    }

    @PostMapping
    public ResponseEntity<ProdutoResponseDTO> salvar(@RequestBody ProdutoRequestDTO request){
        ProdutoResponseDTO novoCliente = service.salvar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoCliente);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProdutoResponseDTO> atualizar(@PathVariable UUID id, @RequestBody ProdutoRequestDTO request){
        ProdutoResponseDTO clienteAtualizado = service.atualizar(id,request);
        return ResponseEntity.ok(clienteAtualizado);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity <Void> deletar(@PathVariable UUID id){
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
