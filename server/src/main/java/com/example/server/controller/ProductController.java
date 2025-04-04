package com.example.server.controller;

import com.example.server.dto.ProductDTO;
import com.example.server.dto.Response;
import com.example.server.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;


import java.math.BigDecimal;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @PostMapping("/add")
    public ResponseEntity<Response> saveProduct(

            @RequestParam("name") String name,
            @RequestParam("price") BigDecimal price,
            @RequestParam("stockQuantity") Integer stockQuantity,
            @RequestParam(value = "description", required = false) String location
    )
    {
        ProductDTO productDTO=new ProductDTO();

        productDTO.setName(name);
        productDTO.setPrice(price);
        productDTO.setStockQuantity(stockQuantity);
        productDTO.setLocation(location);

        return ResponseEntity.ok(productService.saveProduct(productDTO));
    }
}
