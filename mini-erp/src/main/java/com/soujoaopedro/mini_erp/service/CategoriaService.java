package com.soujoaopedro.mini_erp.service;

import com.soujoaopedro.mini_erp.domain.Categoria;
import com.soujoaopedro.mini_erp.dto.CategoriaRequestDTO;
import com.soujoaopedro.mini_erp.dto.CategoriaResponseDTO;
import com.soujoaopedro.mini_erp.exception.ResourceNotFoundException;
import com.soujoaopedro.mini_erp.repository.CategoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoriaService {
    private final CategoriaRepository repository;

    //Tranforma as entidades do banco em resposta
    private CategoriaResponseDTO converterParaResponseDTO(Categoria categoria){
        return new CategoriaResponseDTO(
                categoria.getId(),
                categoria.getNome()
        );
    }

    //método publico para buscar e retornar uma unica identidade pelo id
    public CategoriaResponseDTO buscarPorId (UUID id){
        Categoria categoria = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mensagem de Erro: Id não encontrado" + id));
        return converterParaResponseDTO(categoria);
    }

    // Método para listar todas as categorias do banco
    public List<CategoriaResponseDTO> listarTodas() {
        return repository.findAll().stream()
                .map(this::converterParaResponseDTO)
                .collect(Collectors.toList());
    }

    //Método para salvar uma categoria
    public CategoriaResponseDTO salvar(CategoriaRequestDTO request){
        Categoria novaCategoria = new Categoria();
        novaCategoria.setNome(request.nome());

        Categoria CategoriaSalva = repository.save(novaCategoria);
        return converterParaResponseDTO(CategoriaSalva);
    }

    // Método para deletar uma categoria do banco pelo ID
    public void deletar(UUID id) {
        // Verifica se o ID realmente existe no banco antes de tentar deletar
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Categoria não encontrada com o ID: " + id);
        }
        repository.deleteById(id);
    }

    // Método para atualizar uma Categoria existente
    public CategoriaResponseDTO atualizar(UUID id, CategoriaRequestDTO request) {
        // Busca a categoria existente ou lança um erro caso não encontre
        Categoria categoriaExistente = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada com o ID: " + id));

        // Atualiza os campos com os novos dados vindos do DTO
        categoriaExistente.setNome(request.nome());

        // Salva as alterações de volta no banco de dados
        Categoria categoriaAtualizada = repository.save(categoriaExistente);
        return converterParaResponseDTO(categoriaAtualizada);
    }
}
