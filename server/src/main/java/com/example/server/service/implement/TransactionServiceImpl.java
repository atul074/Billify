package com.example.server.service.implement;

import com.example.server.dto.Response;
import com.example.server.dto.TransactionDTO;
import com.example.server.dto.TransactionRequest;
import com.example.server.model.Product;
import com.example.server.model.Transaction;
import com.example.server.model.TransactionType;
import com.example.server.model.Users;
import com.example.server.repo.ProductRepo;
import com.example.server.repo.TransactionRepo;
import com.example.server.service.TransactionService;
import com.example.server.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;


@Service
@Slf4j
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepo transactionRepository;
    private final ProductRepo productRepository;
    private final UserService userService;
    private final ModelMapper modelMapper;

    @Override
    public Response purchase(TransactionRequest transactionRequest)
    {
        List<Long> productId = transactionRequest.getProductId();
        List<Integer> quantity = transactionRequest.getQuantity();
        String email=transactionRequest.getEmail();
        List<Product> product=new ArrayList<>();
        for(Long pid:productId)
        {
            Product p=productRepository.findById(pid)
                    .orElseThrow(() -> new NotFoundException("Product Not Found"));
            product.add(p);
        }
        Users user=userService.getUserByEmail(email);
        BigDecimal totalPrice = BigDecimal.ZERO;
        Integer totalQuantity=0;
        for (int i = 0; i < product.size(); i++)
        {
            product.get(i).setStockQuantity(product.get(i).getStockQuantity()+quantity.get(i));
            productRepository.save(product.get(i));

            totalPrice=totalPrice.add(product.get(i).getPrice().multiply(BigDecimal.valueOf(quantity.get(i))));
            totalQuantity+=quantity.get(i);
        }
        Transaction transaction=Transaction.builder()
                .transactionType(TransactionType.PURCHASE)
                .product(product)
                .user(user)
                .totalProducts(totalQuantity)
                .totalPrice(totalPrice)
                .note(transactionRequest.getNote())
                .quantity(quantity)
                .build();
        transactionRepository.save(transaction);

        return Response.builder()
                .status(200)
                .message("All purchases made successfully. Total Price: "+ totalPrice)
                .build();

    }



    @Override
    public Response sell(TransactionRequest transactionRequest)
    {
        List<Long> productId = transactionRequest.getProductId();
        List<Integer> quantity = transactionRequest.getQuantity();
        String email=transactionRequest.getEmail();
        List<Product> product=new ArrayList<>();
        for(Long pid:productId)
        {
            Product p=productRepository.findById(pid)
                    .orElseThrow(() -> new NotFoundException("Product Not Found"));
            product.add(p);
        }
        Users user=userService.getUserByEmail(email);
        BigDecimal totalPrice = BigDecimal.ZERO;
        Integer totalQuantity=0;
        for (int i = 0; i < product.size(); i++)
        {
            product.get(i).setStockQuantity(product.get(i).getStockQuantity()+quantity.get(i));
            productRepository.save(product.get(i));

            totalPrice=totalPrice.add(product.get(i).getPrice().multiply(BigDecimal.valueOf(quantity.get(i))));
            totalQuantity+=quantity.get(i);
        }
        Transaction transaction=Transaction.builder()
                .transactionType(TransactionType.SALE)
                .product(product)
                .user(user)
                .totalProducts(totalQuantity)
                .totalPrice(totalPrice)
                .buyerName(transactionRequest.getBuyerName())
                .buyerPhoneNo(transactionRequest.getBuyerPhoneNo())
                .note(transactionRequest.getNote())
                .quantity(quantity)
                .build();
        transactionRepository.save(transaction);

        return Response.builder()
                .status(200)
                .message("Product Sale successfully made")
                .build();

    }

    @Override
    public Response getAllTransactions() {

        // Fetch all transactions sorted by id descending
        List<Transaction> transactions = transactionRepository.findAll(Sort.by(Sort.Direction.DESC, "id"));

        // Map to DTOs
        List<TransactionDTO> transactionDTOS = modelMapper.map(transactions, new TypeToken() {
        }.getType());

        // Nullify nested objects to keep response clean
        transactionDTOS.forEach(transactionDTO -> {
            transactionDTO.setUser(null);
            transactionDTO.setProduct(null);
        });

        return Response.builder()
                .status(200)
                .message("success")
                .transactions(transactionDTOS)
                .build();
    }


    @Override
    public Response getAllTransactionById(Long id) {

        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Transaction Not Found"));

        TransactionDTO transactionDTO = modelMapper.map(transaction, TransactionDTO.class);

        transactionDTO.getUser().setTransactions(null);

        return Response.builder()
                .status(200)
                .message("success")
                .transaction(transactionDTO)
                .build();
    }


    @Override
    public Response getAllTransactionByMonthAndYear(int month, int year) {
        List<Transaction> transactions = transactionRepository.findAll(TransactionFilter.byMonthAndYear(month, year));

        List<TransactionDTO> transactionDTOS = modelMapper.map(transactions, new TypeToken<List<TransactionDTO>>() {
        }.getType());

        transactionDTOS.forEach(transactionDTO -> {
            transactionDTO.setUser(null);
            transactionDTO.setProduct(null);
        });

        return Response.builder()
                .status(200)
                .message("success")
                .transactions(transactionDTOS)
                .build();
    }


}
