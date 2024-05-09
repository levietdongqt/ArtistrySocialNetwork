package com.mytech.realtimeservice.enums;

public enum UserRole {
    ROLE_USER("ROLE_USER"),
    ROLE_ADMIN("ROLE_ADMIN"),
    ROLE_PROVIDER("ROLE_PROVIDER"),
    ROLE_STUDIO("ROLE_STUDIO"),
    ROLE_MAKEUP("ROLE_MAKEUP"),
    ROLE_PHOTO("ROLE_PHOTO"),
    ROLE_MODEL("ROLE_MODEL");

    @Override
    public String toString() {
        return roleName;
    }
    private final String roleName;

    UserRole(String roleName) {
        this.roleName = roleName;
    }
}
