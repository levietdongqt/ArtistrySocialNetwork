import {User} from "@models/user";

export type  AuthResponse = {
    accessToken  : string,
    refreshToken  : string,
    user : User
}