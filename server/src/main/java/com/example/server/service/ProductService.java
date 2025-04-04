package com.example.server.service;

import com.example.server.dto.ProductDTO;
import com.example.server.dto.Response;

public interface ProductService {
    Response saveProduct(ProductDTO productDTO);
}
