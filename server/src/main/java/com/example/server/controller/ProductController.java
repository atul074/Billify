package com.example.server.controller;

import com.example.server.dto.ProductDTO;
import com.example.server.dto.Response;
import com.example.server.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


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
            @RequestParam(value = "location", required = false) String location
    )
    {
        ProductDTO productDTO=new ProductDTO();

        productDTO.setName(name);
        productDTO.setPrice(price);
        productDTO.setStockQuantity(stockQuantity);
        productDTO.setLocation(location);
        System.out.println(productDTO);
        return ResponseEntity.ok(productService.saveProduct(productDTO));
    }



    @PutMapping("/update")
    public ResponseEntity<Response> updateProduct(
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "price", required = false) BigDecimal price,
            @RequestParam(value = "stockQuantity", required = false) Integer stockQuantity,
            @RequestParam(value = "location", required = false) String location,
            @RequestParam("productId") Long productId
    ) {
        ProductDTO productDTO = new ProductDTO();
        productDTO.setName(name);
        productDTO.setPrice(price);
        productDTO.setProductId(productId);
        productDTO.setStockQuantity(stockQuantity);
        productDTO.setLocation(location);

        return ResponseEntity.ok(productService.updateProduct(productDTO));

    }


    @GetMapping("/all")
    public ResponseEntity<Response> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Response> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }


    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Response> deleteProduct(@PathVariable Long id) {
        return ResponseEntity.ok(productService.deleteProduct(id));
    }

    @GetMapping("/search")
    public ResponseEntity<Response> searchProduct(@RequestParam String input) {
        return ResponseEntity.ok(productService.searchProduct(input));
    }
}
