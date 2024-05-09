import 'package:flutter_twitter_clone/helper/enum.dart';

class MiniUser {
  String? id;
  String? fullName;
  String nickname;
  String? avatar;
  String? coverImage;
  bool? verified;
  bool? isGroupOwner;
  bool? notSeen;

  MiniUser({
    this.id,
    this.fullName,
    this.avatar,
    this.coverImage,
    this.verified,
    this.nickname = "",
    this.isGroupOwner = false,
    this.notSeen = false,
  });
  factory MiniUser.fromJson(Map<String, dynamic> json) {
    return MiniUser(
      id: json['id'],
      fullName: json['fullName'],
      avatar: json['avatar'],
      coverImage: json['coverImage'],
      verified: json['verified'],
      nickname: json['nickname'],
      isGroupOwner: json['isGroupOwner'],
      notSeen: json['notSeen'],
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
    };
  }


  @override
  String toString() {
    return 'User {id: $id, fullName: $fullName '
        'avatar: $avatar, coverImage: $coverImage,'
        'verified: $verified';
  }
}
