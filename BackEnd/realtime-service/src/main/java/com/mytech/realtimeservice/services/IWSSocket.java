package com.mytech.realtimeservice.services;

import com.mytech.realtimeservice.models.Notification;

public interface IWSSocket {
    public void sendGlobalNotification();
    public void sendPrivateNotification(final String userId,Notification notification);
}
