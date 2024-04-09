package com.mytech.mainservice.service.implement;

import com.mytech.mainservice.dto.ReviewDTO;
import com.mytech.mainservice.dto.UserDTO;
import com.mytech.mainservice.enums.ReviewDetailKey;
import com.mytech.mainservice.exception.myException.NotFoundException;
import com.mytech.mainservice.model.Review;
import com.mytech.mainservice.model.Session;
import com.mytech.mainservice.model.User;
import com.mytech.mainservice.repository.IReviewRepository;
import com.mytech.mainservice.repository.IUserRepository;
import com.mytech.mainservice.service.IReviewService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service

public class ReviewService implements IReviewService {
    @Autowired
    private IReviewRepository reviewRepo;
    @Autowired
    private ModelMapper mapper;
    @Autowired
    private IUserRepository userRepo;

    @Override
    public void createReview(ReviewDTO reviewDTO) {
        Review review = mapper.map(reviewDTO, Review.class);
        User providerUser = checkIsValidProvider(reviewDTO.getProviderUser());
        User customerUser = checkIsValidCustomer(reviewDTO.getCustomerUser());
        Set<Session> sessions = providerUser.getSessions();
        review.setProviderUser(providerUser);
        review.setCustomerUser(customerUser);
        review.getReviewDetails().put(ReviewDetailKey.CREATE_DATE, LocalDateTime.now().toString());
        reviewRepo.save(review);

    }

    @Override
    public List<ReviewDTO> getReviewsByUserId(String userId) {
        Set<Review> reviews = reviewRepo.findByProviderUser_Id(userId);
        return reviews.stream()
                .sorted(Comparator.comparing(review ->
                        LocalDateTime.parse(review.getReviewDetails().get(ReviewDetailKey.CREATE_DATE).toString())))
                .map(review -> mapper.map(review, ReviewDTO.class)).toList();
    }

    private User checkIsValidCustomer(UserDTO customerUser) {
        if (customerUser == null) {
            throw new NotFoundException("Customer can't be null");
        }
        Optional<User> customer = userRepo.findById(customerUser.getId());
        if (customer.isEmpty()) {
            throw new NotFoundException("Customer is not found");
        }
        return customer.get();
    }

    private User checkIsValidProvider(UserDTO providerUser) {
        if (providerUser == null) {
            throw new NotFoundException("Provider can't be null");
        }
        Optional<User> provider = userRepo.findById(providerUser.getId());
        if (provider.isEmpty()) {
            throw new NotFoundException("Provider is not found");
        }
        return provider.get();
    }
}
