package com.example.server.service.implement;

import com.example.server.dto.ProductDTO;
import com.example.server.dto.Response;
import com.example.server.model.Product;
import com.example.server.repo.ProductRepo;
import com.example.server.service.ProductService;

import lombok.Builder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductServiceImpl implements ProductService {

    @Autowired
    private final ProductRepo productRepo;

    @Override
    public Response saveProduct(ProductDTO productDTO)
    {

        //map our dto to product entity
        Product productToSave = Product.builder()
                .name(productDTO.getName())
                .price(productDTO.getPrice())
                .stockQuantity(productDTO.getStockQuantity())
                .location(productDTO.getLocation())
                .build();

        //save the product entity
        productRepo.save(productToSave);

        return Response.builder()
                .status(200)
                .message("Product successfully saved")
                .build();
    }


}
