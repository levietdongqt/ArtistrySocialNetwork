package com.mytech.mainservice.service;

import com.mytech.mainservice.dto.FriendDTO;
import com.mytech.mainservice.dto.MainServiceDTO;
import com.mytech.mainservice.model.elasticsearch.PostELS;
import com.mytech.mainservice.model.elasticsearch.ServiceELS;
import com.mytech.mainservice.model.elasticsearch.UserELS;

import java.util.List;
import java.util.Set;

public interface IELSService {

    public void savePostELS(PostELS postELS);
    public void saveServiceELS(ServiceELS serviceELS);
    public void saveUserELS(UserELS userELS);

    public void updatePostELS(PostELS postELS);

    public void updateServiceELS(ServiceELS serviceELS);

    public void updateUserELS(UserELS userELS);

    public void deletePostELSById(String postELSId);

    public void deleteServiceELSById(Long serviceELSId);

    public void deleteUserELSById(String userELSId);


    public List<Object> suggestsKeyword(String searchText);

    public List<FriendDTO> searchUserELS(String searchText, String userId);

    public Set<MainServiceDTO> searchMainServiceByKeyword(String keyword);

}
