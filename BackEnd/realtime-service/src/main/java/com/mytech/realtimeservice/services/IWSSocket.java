package com.mytech.realtimeservice.services;

import com.mytech.realtimeservice.models.Comments;
import com.mytech.realtimeservice.models.Notification;

public interface IWSSocket {
    public void sendGlobalNotification();
    void sendGlobalComment(final String postId, Comments comments);
    public void sendPrivateNotification(final String userId,Notification notification);
}
