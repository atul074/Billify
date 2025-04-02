package com.example.server.dto;

import com.example.server.model.TransactionType;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class TransactionDTO {


    private Long id;

    private Integer totalProducts;

    private BigDecimal totalPrice;
    private List<Integer> quantity;
    private TransactionType transactionType; // purchase, sale, return




    private String buyerName;
    private String buyerPhoneNo;
    private String note;

    private LocalDateTime createdAt;
    private LocalDateTime updateAt;

    private List<ProductDTO> product;

    private UserDTO user;



}
