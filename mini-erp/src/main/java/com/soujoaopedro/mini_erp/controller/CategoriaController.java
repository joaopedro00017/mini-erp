package com.soujoaopedro.mini_erp.controller;

import com.soujoaopedro.mini_erp.dto.CategoriaRequestDTO;
import com.soujoaopedro.mini_erp.dto.CategoriaResponseDTO;
import com.soujoaopedro.mini_erp.service.CategoriaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/categorias")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class CategoriaController {
    private final CategoriaService service;

    @GetMapping
    public ResponseEntity<List<CategoriaResponseDTO>> listarTodos(){
        List<CategoriaResponseDTO> lista = service.listarTodas();
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoriaResponseDTO> buscarPorId(@PathVariable UUID id){
        CategoriaResponseDTO buscarId = service.buscarPorId(id);
        return ResponseEntity.ok(buscarId);
    }

    //Endpoint que cria uma nova categoria atráves de (POST http://localhost:8080/api/categoria)
    @PostMapping
    public ResponseEntity<CategoriaResponseDTO> salvar(@RequestBody CategoriaRequestDTO request) {
        CategoriaResponseDTO novaCategoria = service.salvar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaCategoria); // Retorna Status 201 Created
    }

    // Endpoint para deletar uma categoria (DELETE http://localhost:8080/api/categoria/{id})
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable UUID id) {
        service.deletar(id);
        return ResponseEntity.noContent().build(); // Retorna o Status 204 já que não irá retornar dados
    }

    // Endpoint para atualizar uma categoria (PUT http://localhost:8080/api/categoria/{id})
    @PutMapping("/{id}")
    public ResponseEntity<CategoriaResponseDTO> atualizar(@PathVariable UUID id, @RequestBody CategoriaRequestDTO request) {
        CategoriaResponseDTO atualizada = service.atualizar(id, request);
        return ResponseEntity.ok(atualizada); // Retorna Status 200 OK com o objeto atualizado
    }
}
