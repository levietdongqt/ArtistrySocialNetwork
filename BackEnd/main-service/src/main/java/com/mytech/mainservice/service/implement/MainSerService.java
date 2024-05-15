package com.mytech.mainservice.service.implement;

import com.mytech.mainservice.dto.ExtraServiceDTO;
import com.mytech.mainservice.dto.MainServiceDTO;
import com.mytech.mainservice.dto.PromotionDTO;
import com.mytech.mainservice.dto.SaveServiceDTO;
import com.mytech.mainservice.enums.PromotionType;
import com.mytech.mainservice.exception.myException.InvalidPropertyException;
import com.mytech.mainservice.exception.myException.NotFoundException;
import com.mytech.mainservice.helper.JwtTokenHolder;
import com.mytech.mainservice.model.ExtraService;
import com.mytech.mainservice.model.MainService;
import com.mytech.mainservice.model.Promotion;
import com.mytech.mainservice.model.User;
import com.mytech.mainservice.model.elasticsearch.ServiceELS;
import com.mytech.mainservice.repository.IExtraServiceRepository;
import com.mytech.mainservice.repository.IMainServiceRepository;
import com.mytech.mainservice.repository.IPromotionRepository;
import com.mytech.mainservice.repository.IUserRepository;
import com.mytech.mainservice.service.IELSService;
import com.mytech.mainservice.service.IMainSerService;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class MainSerService implements IMainSerService {
    @Autowired
    private IMainServiceRepository mainServiceRepo;
    @Autowired
    private IUserRepository userRepo;
    @Autowired
    private IPromotionRepository promotionRepo;
    @Autowired
    private IExtraServiceRepository extraServiceRepo;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private JwtTokenHolder jwtTokenHolder;

    @Autowired
    private IELSService elsService;

    @Override
    public Set<MainServiceDTO> getMainServices(String userId) {
        return mainServiceRepo.findMainServiceByProvider_Id(userId).stream()
                .map(mainService -> modelMapper.map(mainService, MainServiceDTO.class))
                .collect(Collectors.toSet());
    }

    @Override
    public MainServiceDTO getById(long serviceId) {
        var mainService = mainServiceRepo.findById(serviceId);
        if (mainService.isEmpty()) {
            throw new NotFoundException("Not found main service ");
        }
        if (!mainService.get().isStatus()) {
            throw new InvalidPropertyException("This service has deleted before");
        }
        return modelMapper.map(mainService, MainServiceDTO.class);
    }
    @Override
    public void saveMainService(SaveServiceDTO saveServiceDTO){
        Optional<MainService> mainService = mainServiceRepo.findById(saveServiceDTO.getMainServiceId());
        Optional<User> user = userRepo.findById(saveServiceDTO.getUserId());
        if(mainService.isEmpty() || user.isEmpty()){
            throw new NotFoundException("Not found main service or user");
        }
        Long exist = mainServiceRepo.existsByIdAndUserId(saveServiceDTO.getMainServiceId(), saveServiceDTO.getUserId());
        if(exist > 0){
            MainService getMainService = mainService.get();
            User getUser = user.get();
            getUser.getSavedMainServices().remove(getMainService);
            getMainService.getSavedByUser().remove(getUser);
            mainServiceRepo.save(getMainService);
            userRepo.save(getUser);
            return;
        }
        MainService getMainService = mainService.get();
        User getUser = user.get();

        getUser.getSavedMainServices().add(getMainService);
        getMainService.getSavedByUser().add(getUser);

        userRepo.save(getUser);
        mainServiceRepo.save(getMainService);
    }


    @Override
    public List<MainServiceDTO> findMainServiceSavedByUserId(String userId,int limit,int pageIndex){
        Sort sort = Sort.by(Sort.Direction.DESC, "createDate");
        Pageable pageable = PageRequest.of(pageIndex, limit, sort);
        Page<MainService> pageService = mainServiceRepo.findMainServiceByUserId(userId,pageable);
        List<MainService> listMainService = pageService.getContent();
        return listMainService.stream().map(mainService -> modelMapper.map(mainService, MainServiceDTO.class)).collect(Collectors.toList());
    }
    @Transactional
    public void deleteAllSaved(String userId){
        mainServiceRepo.deleteSavedByUserId(userId);
    }
    @Override
    public void createMainService(MainServiceDTO mainServiceDTO) {
        MainService mainService = modelMapper.map(mainServiceDTO, MainService.class);

        List<ExtraService> extraServices = checkValidExtraServiceIds(mainServiceDTO.getExtraServiceDTOs());
        Promotion promotion = checkValidPromotion(mainServiceDTO.getPromotionDTO());
        mainService.setPromotionDTO(promotion);
        mainService.setStatus(true);
        mainService.setCreateDate(LocalDateTime.now());
        mainService.setExtraServiceDTOs(extraServices);
        var createdMainService =  mainServiceRepo.save(mainService);
        //Lưu vào ELS Search
        ServiceELS serviceELS = modelMapper.map(createdMainService,ServiceELS.class);
        elsService.saveServiceELS(serviceELS);
    }

    @Override
    public void deleteService(Long serviceId) {
        Optional<MainService> mainService = mainServiceRepo.findById(serviceId);
        if (mainService.isEmpty()) {
            throw new NotFoundException("Not found main service ");
        }
        if (jwtTokenHolder.isValidUserId(mainService.get().getProvider().getId())) {
//            mainService.get().setStatus(false);
            if (mainService.get().isStatus() ) {
                mainService.get().setStatus(false);
                mainServiceRepo.save(mainService.get());

            } else {
                mainService.get().setStatus(true);
                mainServiceRepo.save(mainService.get());
            }

//            mainServiceRepo.save(mainService.get());
            //Xóa khỏi els search
            elsService.deleteServiceELSById(mainService.get().getId());
            return;
        }
        throw new InvalidPropertyException("You are not the owner of this service");
    }

    @Override
    public void updateService(MainServiceDTO mainServiceDTO) {
        MainService mainService = modelMapper.map(mainServiceDTO, MainService.class);
        mainServiceRepo.save(mainService);
        //Update the mainService ELS
        ServiceELS serviceELS = modelMapper.map(mainService,ServiceELS.class);
        elsService.updateServiceELS(serviceELS);
    }

    @Override
    public List<MainServiceDTO> findTrendMainService() {
        Pageable topTen = PageRequest.of(0, 10);
        List<MainService> mainServiceList = mainServiceRepo.findTrendMainService(topTen);
        return mainServiceList.stream().map(mainService -> modelMapper.map(mainService, MainServiceDTO.class)).collect(Collectors.toList());
    }

    private boolean isValidUser(String userId) {
        return jwtTokenHolder.getUserId().equals(userId);
    }

    private Promotion checkValidPromotion(PromotionDTO promotionDTO) {
        if (promotionDTO == null) {
            return null;
        }
        Optional<Promotion> promotion = promotionRepo.findById(promotionDTO.getId());
        if (promotion.isEmpty()) {
            throw new NotFoundException("Not found promotion ");
        }
        if (promotion.get().getType() != PromotionType.FOR_SERVICE) {
            throw new InvalidPropertyException("This promotion is not for service");
        }
        return promotion.get();

    }

    private List<ExtraService> checkValidExtraServiceIds(List<ExtraServiceDTO> extraServiceDTOs) {
        if (extraServiceDTOs == null) {
            return List.of();
        }
        List<Long> extraServiceIds = extraServiceDTOs.stream().map(ExtraServiceDTO::getId).toList();
        List<ExtraService> extraServices = extraServiceRepo.findByIdList(extraServiceIds);
        if (extraServices.size() != extraServiceDTOs.size()) {
            throw new NotFoundException("Not found extra service ");
        }
        return extraServices;
    }
}
