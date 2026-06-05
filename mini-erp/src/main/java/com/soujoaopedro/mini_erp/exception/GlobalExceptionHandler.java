package com.soujoaopedro.mini_erp.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 1. RECURSO NÃO ENCONTRADO (404)
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<StandardError> resourceNotFound(ResourceNotFoundException e, HttpServletRequest request) {
        HttpStatus status = HttpStatus.NOT_FOUND;
        StandardError err = new StandardError(Instant.now(), status.value(), "Não Encontrado", e.getMessage(), request.getRequestURI());
        return ResponseEntity.status(status).body(err);
    }

    // 2. REGRA DE NEGÓCIO VIOLADA (422) - Ex: Estoque Insuficiente
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<StandardError> businessError(BusinessException e, HttpServletRequest request) {
        HttpStatus status = HttpStatus.UNPROCESSABLE_ENTITY; // 422 é perfeito para regras de negócio
        StandardError err = new StandardError(Instant.now(), status.value(), "Regra de Negócio Violada", e.getMessage(), request.getRequestURI());
        return ResponseEntity.status(status).body(err);
    }

    // 3. VALIDAÇÃO DE CAMPOS DO DTO (400) - Capta @NotBlank, @Positive, etc.
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<StandardError> validationError(MethodArgumentNotValidException e, HttpServletRequest request) {
        HttpStatus status = HttpStatus.BAD_REQUEST;

        // Pega todos os erros de campos e junta numa String legível
        String mensagensDeErro = e.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining(", "));

        StandardError err = new StandardError(Instant.now(), status.value(), "Erro de Validação", mensagensDeErro, request.getRequestURI());
        return ResponseEntity.status(status).body(err);
    }

    // 4. INTEGRIDADE DO BANCO DE DADOS (400) - Ex: Deletar Categoria com produtos vinculados
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<StandardError> dataIntegrity(DataIntegrityViolationException e, HttpServletRequest request) {
        HttpStatus status = HttpStatus.BAD_REQUEST;
        // Evita mandar a mensagem gigante do SQL e manda uma amigável
        String msg = "Não é possível realizar essa operação pois este registro está vinculado a outros dados no sistema.";
        StandardError err = new StandardError(Instant.now(), status.value(), "Erro de Integridade de Dados", msg, request.getRequestURI());
        return ResponseEntity.status(status).body(err);
    }

    // 5. ERRO GENÉRICO DO SERVIDOR (500) - O "Server Broke" fallback
    @ExceptionHandler(Exception.class)
    public ResponseEntity<StandardError> genericError(Exception e, HttpServletRequest request) {
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
        StandardError err = new StandardError(Instant.now(), status.value(), "Erro Interno no Servidor", "Ocorreu um erro inesperado no sistema. Tente novamente mais tarde.", request.getRequestURI());
        return ResponseEntity.status(status).body(err);
    }
}