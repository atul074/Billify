package com.example.server.service;

import com.example.server.dto.ProductDTO;
import com.example.server.dto.Response;

public interface ProductService {
    Response saveProduct(ProductDTO productDTO);

    Response updateProduct(ProductDTO productDTO);

    Response getAllProducts();

    Response getProductById(Long id);

    Response deleteProduct(Long id);

    Response searchProduct(String input);
}
