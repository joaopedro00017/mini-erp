package com.soujoaopedro.mini_erp.service;

import com.soujoaopedro.mini_erp.domain.Cliente;
import com.soujoaopedro.mini_erp.dto.ClienteRequestDTO;
import com.soujoaopedro.mini_erp.dto.ClienteResponseDTO;
import com.soujoaopedro.mini_erp.exception.ResourceNotFoundException;
import com.soujoaopedro.mini_erp.repository.ClienteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClienteService {
    private final ClienteRepository repository;

    //Tranforma as entidades do banco em resposta
    private ClienteResponseDTO converterParaResponseDTO(Cliente cliente){
        return new ClienteResponseDTO(
                cliente.getId(),
                cliente.getNome(),
                cliente.getCpfCnpj(),
                cliente.getEmail()
        );
    }

    //método publico para buscar e retornar uma unica identidade pelo id
    public ClienteResponseDTO buscarPorId (UUID id){
        Cliente cliente = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mensagem de Erro: Id não encontrado" + id));
        return converterParaResponseDTO(cliente);
    }

    // Método para listar todos os Clientes do banco
    public List<ClienteResponseDTO> listarTodas() {
        return repository.findAll().stream()
                .map(this::converterParaResponseDTO)
                .collect(Collectors.toList());
    }



    //Método para salvar um cliente
    public ClienteResponseDTO salvar(ClienteRequestDTO request){
        Cliente novoCliente = new Cliente();
        novoCliente.setNome(request.nome());
        novoCliente.setCpfCnpj(request.cpfCnpj());
        novoCliente.setEmail(request.email());

        Cliente ClienteSalvo = repository.save(novoCliente);
        return converterParaResponseDTO(ClienteSalvo);
    }

    // Método para deletar uma cliente do banco pelo ID
    public void deletar(UUID id) {
        // Verifica se o ID realmente existe no banco antes de tentar deletar
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Cliente não encontrado com o ID: " + id);
        }
        repository.deleteById(id);
    }

    // Método para atualizar um Cliente existente
    public ClienteResponseDTO atualizar(UUID id, ClienteRequestDTO request) {
        // Busca o cliente existente ou lança um erro caso não encontre
        Cliente clienteExistente = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com o ID: " + id));

        // Atualiza os campos com os novos dados vindos do DTO
        clienteExistente.setNome(request.nome());
        clienteExistente.setEmail(request.email());

        // Salva as alterações de volta no banco de dados
        Cliente clienteAtualizado = repository.save(clienteExistente);
        return converterParaResponseDTO(clienteAtualizado);
    }
}
