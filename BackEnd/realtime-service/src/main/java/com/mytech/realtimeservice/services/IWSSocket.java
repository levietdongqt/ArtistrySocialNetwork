package com.mytech.realtimeservice.services;

import com.mytech.realtimeservice.models.Comments;

public interface IWSSocket {

    public void notifyFrontend(String message);
    public void notifyUser(final String id,String message);
    public void sendGlobalNotification();
    public void sendPrivateNotification(final String userId);
    void sendGlobalComment(final String postId, Comments comments);
}
