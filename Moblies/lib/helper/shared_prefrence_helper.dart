import 'package:flutter_twitter_clone/model/link_media_info.dart';
import 'package:flutter_twitter_clone/myModel/myUser.dart';
import 'dart:convert';
import 'package:flutter_twitter_clone/model/user.dart';
import 'package:shared_preferences/shared_preferences.dart';

class SharedPreferenceHelper {
  SharedPreferenceHelper._internal();

  static final SharedPreferenceHelper _singleton =
      SharedPreferenceHelper._internal();

  factory SharedPreferenceHelper() {
    return _singleton;
  }

  Future<String?> getUserName() async {
    return (await SharedPreferences.getInstance())
        .getString(UserPreferenceKey.UserName.toString());
  }

  Future clearPreferenceValues() async {
    (await SharedPreferences.getInstance()).clear();
  }

  Future<bool> saveUserProfile(MyUser user) async {
    return (await SharedPreferences.getInstance()).setString(
        UserPreferenceKey.UserProfile.toString(), json.encode(user.toJson()));
  }

  Future<MyUser?> getUserProfile() async {
    final String? jsonString = (await SharedPreferences.getInstance())
        .getString(UserPreferenceKey.UserProfile.toString());
    if (jsonString == null) return null;
    return MyUser.fromJson(json.decode(jsonString));
  }

  Future<bool> saveLinkMediaInfo(String key, LinkMediaInfo model) async {
    return (await SharedPreferences.getInstance())
        .setString(key, json.encode(model.toJson()));
  }

  Future<LinkMediaInfo?> getLinkMediaInfo(String key) async {
    final String? jsonString =
        (await SharedPreferences.getInstance()).getString(key);
    if (jsonString == null) {
      return null;
    }
    return LinkMediaInfo.fromJson(json.decode(jsonString));
  }

  Future<String?> getAccessToken() async {
    return (await SharedPreferences.getInstance())
        .getString(UserPreferenceKey.AccessToken.toString());
  }

  Future<void> saveAccessToken(String accessToken) async {
    (await SharedPreferences.getInstance())
        .setString(UserPreferenceKey.AccessToken.toString(), accessToken);
  }

  Future<String?> getRefreshToken() async {
    return (await SharedPreferences.getInstance())
        .getString(UserPreferenceKey.RefreshToken.toString());
  }
  Future<void> saveRefreshToken(String refreshToken) async {
    (await SharedPreferences.getInstance())
        .setString(UserPreferenceKey.RefreshToken.toString(), refreshToken);
  }
}

enum UserPreferenceKey {
  AccessToken,
  RefreshToken,
  UserProfile,
  UserName,
  IsFirstTimeApp
}
