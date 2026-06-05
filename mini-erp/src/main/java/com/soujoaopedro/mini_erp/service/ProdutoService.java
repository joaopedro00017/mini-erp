package com.soujoaopedro.mini_erp.service;

import com.soujoaopedro.mini_erp.domain.Categoria;
import com.soujoaopedro.mini_erp.domain.Produto;
import com.soujoaopedro.mini_erp.dto.ProdutoRequestDTO;
import com.soujoaopedro.mini_erp.dto.ProdutoResponseDTO;
import com.soujoaopedro.mini_erp.exception.ResourceNotFoundException;
import com.soujoaopedro.mini_erp.repository.CategoriaRepository;
import com.soujoaopedro.mini_erp.repository.ProdutoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProdutoService {
    private final ProdutoRepository produtoRepository;
    private final CategoriaService categoriaService;
    private final CategoriaRepository categoriaRepository;

    //Tranforma as entidades do banco em resposta
    private ProdutoResponseDTO converterParaResponseDTO(Produto produto){
        return new ProdutoResponseDTO(
                produto.getId(),
                produto.getNome(),
                produto.getPreco(),
                produto.getEstoque(),
                produto.getEstoqueMinimo(),
                categoriaService.buscarPorId(produto.getCategoria().getId())
        );
    }

    //método publico para buscar e retornar uma unica identidade pelo id
    public ProdutoResponseDTO buscarPorId (UUID id){
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mensagem de Erro: Id não encontrado" + id));
        return converterParaResponseDTO(produto);
    }

    //Método para salvar um produto
    public ProdutoResponseDTO salvar(ProdutoRequestDTO request){
        //consulta o banco checando se existe realmente a categoria
        Categoria categoria = categoriaRepository.findById(request.categoriaId())
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada"));

        Produto novoProduto = new Produto();
        novoProduto.setNome(request.nome());
        novoProduto.setPreco(request.preco());
        novoProduto.setEstoque(request.estoque());
        novoProduto.setEstoqueMinimo(request.estoqueMinimo() != null ? request.estoqueMinimo() : 0);
        novoProduto.setCategoria(categoria);

        Produto produtoSalvo = produtoRepository.save(novoProduto);
        return converterParaResponseDTO(produtoSalvo);
    }

    // Método para listar todos os produtos do banco
    public List<ProdutoResponseDTO> listarTodas() {
        return produtoRepository.findAll().stream()
                .map(this::converterParaResponseDTO)
                .collect(Collectors.toList());
    }

    // Método para deletar um produto do banco pelo ID
    public void deletar(UUID id) {
        // Verifica se o ID realmente existe no banco antes de tentar deletar
        if (!produtoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Produto não encontrado com o ID: " + id);
        }
        produtoRepository.deleteById(id);
    }

    // Método para atualizar um Cliente existente
    public ProdutoResponseDTO atualizar(UUID id, ProdutoRequestDTO request) {
        // Busca o cliente existente ou lança um erro caso não encontre
        Produto produtoExistente = produtoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado com o ID: " + id));

        // Atualiza os campos com os novos dados vindos do DTO
        produtoExistente.setNome(request.nome());
        produtoExistente.setPreco(request.preco());
        produtoExistente.setEstoque(request.estoque());
        produtoExistente.setEstoqueMinimo(request.estoqueMinimo() != null ? request.estoqueMinimo() : 0);

        Categoria categoria = categoriaRepository.findById(request.categoriaId())
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada"));
        produtoExistente.setCategoria(categoria);

        // Salva as alterações de volta no banco de dados
        Produto produtoAtualizado = produtoRepository.save(produtoExistente);
        return converterParaResponseDTO(produtoAtualizado);
    }
}
