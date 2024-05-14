import 'dart:ffi';

import 'package:flutter_twitter_clone/helper/enum.dart';

class MiniUser {
  String? id;
  String? fullName;
  String? nickname;
  String? avatar;
  String? coverImage;
  bool? verified;
  bool? isGroupOwner;
  bool? notSeen;
   String? bio;
  MiniUser({
    this.id,
    this.fullName,
    this.avatar,
    this.coverImage,
    this.verified = false,
    this.nickname = "",
    this.isGroupOwner = false,
    this.notSeen = false,
    this.bio,
  });
  factory MiniUser.fromJson(Map<String, dynamic> json) {
    return MiniUser(
      id: json['id'] as String?,
      fullName: json['fullName'] as String?,
      avatar: json['avatar'] as String?,
      coverImage: json['coverImage'] as String?,
      verified: json['verified'],
      nickname: json['nickname'],
      isGroupOwner: json['isGroupOwner'],
      notSeen: json['notSeen'],
      bio: json['bio'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'fullName': fullName,
      'avatar': avatar,
      'coverImage': coverImage,
      'verified': verified,
      'nickname': nickname,
      'isGroupOwner': isGroupOwner,
      'notSeen': notSeen,
      'bio': bio,
    };
  }


  @override
  String toString() {
    return 'User {id: $id, fullName: $fullName '
        'avatar: $avatar, coverImage: $coverImage,'
        'verified: $verified';
  }
}
