package com.mytech.mainservice.service.implement;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;
import co.elastic.clients.json.jackson.JacksonJsonpMapper;
import co.elastic.clients.transport.ElasticsearchTransport;
import co.elastic.clients.transport.rest_client.RestClientTransport;
import com.mytech.mainservice.config.ELSConfig;
import com.mytech.mainservice.enums.FriendShipStatus;
import com.mytech.mainservice.exception.myException.NotFoundException;
import com.mytech.mainservice.model.elasticsearch.PostELS;
import com.mytech.mainservice.model.elasticsearch.ServiceELS;
import com.mytech.mainservice.model.elasticsearch.UserELS;
import com.mytech.mainservice.repository.PostELSRepository;
import com.mytech.mainservice.repository.ServiceELSRepository;
import com.mytech.mainservice.repository.UserELSRepository;
import com.mytech.mainservice.service.IELSService;
import org.apache.http.HttpHost;
import org.apache.http.auth.AuthScope;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.client.CredentialsProvider;
import org.apache.http.entity.ContentType;
import org.apache.http.impl.client.BasicCredentialsProvider;
import org.apache.http.nio.entity.NStringEntity;
import org.apache.http.util.EntityUtils;
import org.elasticsearch.client.Request;
import org.elasticsearch.client.Response;
import org.elasticsearch.client.RestClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.elasticsearch.client.ClientConfiguration;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class ELSService implements IELSService {

    @Autowired
    private PostELSRepository postELSRepository;

    @Autowired
    private ServiceELSRepository serviceELSRepository;

    @Autowired
    private UserELSRepository userELSRepository;

    @Autowired
    ELSConfig elsConfig;

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
            userServiceELS.setFull_name(userELS.getFull_name());
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

    public List<Object> searchAllWithFuzziness(String search){
        List<Object> searchResult = new ArrayList<Object>();
        var userELSList = userELSRepository.getUserELS(search);
        var serviceELSList = serviceELSRepository.getServiceELS(search);
        var postELSList = postELSRepository.getPostELS(search);


        searchResult.addAll(userELSList);
        searchResult.addAll(serviceELSList);
        searchResult.addAll(postELSList);
        if (searchResult.size()>10){
            return searchResult.subList(0,9);
        }
        return searchResult;
    }

    public List<Object> suggestsKeyword(String searchText) {
        RestClient restClient = RestClient.builder(
                new HttpHost("localhost", 9200)).build();

// Create the transport with a Jackson mapper
        ElasticsearchTransport transport = new RestClientTransport(
                restClient, new JacksonJsonpMapper());

// And create the API client

        var els =  elsConfig.elasticsearchClient(transport);
        SearchResponse<Object> search = null;
        try {
            search = els.search(s -> s
                            .index("user","post","service")
                            .query(q -> q.multiMatch(builder -> builder
                                    .query(searchText)
                                    .fields("name","full_name","description","roles","content","email")
                                    .fuzziness("1"))),
                    Object.class);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return search.hits().hits().stream().map(objectHit -> objectHit.source()).toList();



    }

}
