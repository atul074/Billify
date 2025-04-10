package com.example.server.dto;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class TransactionRequest {

    @Positive(message = "product id is required")
    private List<Long> productId;

    @Positive(message = "quantity id is required")
    private List<Integer> quantity;



    private String buyerName;
    private String buyerPhoneNo;
    private String email;

    private String note;
}
