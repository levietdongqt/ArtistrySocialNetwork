package com.mytech.mainservice.service.implement;

import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.json.jackson.JacksonJsonpMapper;
import co.elastic.clients.transport.ElasticsearchTransport;
import co.elastic.clients.transport.rest_client.RestClientTransport;
import com.mytech.mainservice.client.NotificationForeignClient;
import com.mytech.mainservice.config.ELSConfig;
import com.mytech.mainservice.dto.FriendDTO;
import com.mytech.mainservice.dto.MainServiceDTO;
import com.mytech.mainservice.exception.myException.NotFoundException;
import com.mytech.mainservice.model.elasticsearch.PostELS;
import com.mytech.mainservice.model.elasticsearch.ServiceELS;
import com.mytech.mainservice.model.elasticsearch.UserELS;
import com.mytech.mainservice.repository.*;
import com.mytech.mainservice.service.IELSService;
import com.mytech.mainservice.service.IFriendService;
import com.mytech.mainservice.service.IUserService;
import org.apache.http.HttpHost;
import org.elasticsearch.client.RestClient;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ELSService implements IELSService {

    @Autowired
    private PostELSRepository postELSRepository;

    @Autowired
    private ServiceELSRepository serviceELSRepository;

    @Autowired
    private UserELSRepository userELSRepository;
    @Autowired
    private IMainServiceRepository mainServiceRepository;


    @Autowired
    ELSConfig elsConfig;

    @Autowired
    private ModelMapper modelMapper;

    //Save service
    public void savePostELS(PostELS postELS) {
        postELSRepository.save(postELS);
    }

    public void saveServiceELS(ServiceELS serviceELS) {
        serviceELSRepository.save(serviceELS);
    }

    public void saveUserELS(UserELS userELS) {
        userELSRepository.save(userELS);
    }
    //Update service
    public void updatePostELS(PostELS postELS) {
        var updatedPostELSOptional = postELSRepository.findById(postELS.getId());
        if (updatedPostELSOptional.isPresent()) {
            var updatedPostELS = updatedPostELSOptional.get();
            updatedPostELS.setContent(postELS.getContent());
            postELSRepository.save(updatedPostELS);
            return;
        }
        throw  new NotFoundException("Not found postELS");
    }

    public void updateServiceELS(ServiceELS serviceELS) {
        var updatedServiceELSOptinal = serviceELSRepository.findById(serviceELS.getId());
        if (updatedServiceELSOptinal.isPresent()) {
            var updatedServiceELS = updatedServiceELSOptinal.get();
            updatedServiceELS.setName(serviceELS.getName());
            updatedServiceELS.setDescription(serviceELS.getDescription());
            serviceELSRepository.save(updatedServiceELS);
            return;
        }
        throw  new NotFoundException("Not found ServiceELS");
    }

    public void updateUserELS(UserELS userELS) {
        var userUserELSOptinal = userELSRepository.findById(userELS.getId());
        if (userUserELSOptinal.isPresent()) {
            var userServiceELS = userUserELSOptinal.get();
            userServiceELS.setEmail(userELS.getEmail());
            userServiceELS.setFullName(userELS.getFullName());
            userServiceELS.setRoles(userELS.getRoles());
            userServiceELS.setAvatar(userELS.getAvatar());
            userELSRepository.save(userServiceELS);
            return;
        }
        throw  new NotFoundException("Not found UserELS");
    }

    //Delete service
    public void deletePostELSById(String postELSId) {
        var postELSOptional = postELSRepository.findById(postELSId);
        if (postELSOptional.isPresent()) {
            var postELS = postELSOptional.get();
            postELSRepository.delete(postELS);
            return;
        }
        throw  new NotFoundException("Not found postELS");
    }

    public void deleteServiceELSById(Long serviceELSId) {
        var serivceELSOptional = serviceELSRepository.findById(serviceELSId);
        if (serivceELSOptional.isPresent()) {
            var serviceELS = serivceELSOptional.get();
            serviceELSRepository.delete(serviceELS);
            return;
        }
        throw  new NotFoundException("Not found serviceELS");
    }

    public void deleteUserELSById(String userELSId) {
        var userELSOptional = userELSRepository.findById(userELSId);
        if (userELSOptional.isPresent()) {
            var userELS = userELSOptional.get();
            userELSRepository.delete(userELS);
            return;
        }
        throw  new NotFoundException("Not found userELS");
    }




    public List<Object> suggestsKeyword(String searchText) {
        RestClient restClient = RestClient.builder(
                new HttpHost("34.87.190.66", 9200)).build();

        ElasticsearchTransport transport = new RestClientTransport(
                restClient, new JacksonJsonpMapper());

        var els =  elsConfig.elasticsearchClient(transport);
        SearchResponse<Object> search = null;
        try {
            search = els.search(s -> s
                            .index("user","post","service")
                            .query(q -> q.multiMatch(builder -> builder
                                    .query(searchText)
                                    .fields("name","fullName","description","roles","content")
                                    .fuzziness("1"))),
                    Object.class);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return search.hits().hits().stream().map(objectHit -> objectHit.source()).toList();
    }


    @Override
    public Set<MainServiceDTO> searchMainServiceByKeyword(List<Long> listIdsService) {
        Set<MainServiceDTO> results = new HashSet<>();
        listIdsService.forEach(id -> {
            var mainServiceOptional = mainServiceRepository.findById(id);
            if (mainServiceOptional.isPresent()) {
                var mainService = mainServiceOptional.get();
                results.add(modelMapper.map(mainService, MainServiceDTO.class));
            }
        });
        return results;

    }



}
