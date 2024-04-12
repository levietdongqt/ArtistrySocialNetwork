package com.mytech.realtimeservice.services;

public interface IWSSocket {

    public void notifyFrontend(String message);
    public void notifyUser(final String id,String message);
    public void sendGlobalNotification();
    public void sendPrivateNotification(final String userId);
}
