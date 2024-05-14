import 'dart:ffi';
import 'package:flutter_twitter_clone/myModel/MiniUser.dart';
import 'MediaObject.dart';

class myPost{
  String? id;
  MiniUser? user;
  String? content;
  String? createdAt;
  String? createdBy;
  String? updatedAt;
  List<MediaObject>? mediaUrl;
  bool? status;
  List<MiniUser>? tagUserPosts;
  List<MiniUser>? userPostLikes;
  int? userReplies;
  int? totalLikes;
  int? totalComments;
  int? totalShares;

  myPost({
    this.mediaUrl,
    this.updatedAt,
    this.createdBy,
    this.createdAt,
    this.status,
    this.user,
    this.id,
    this.content,
    this.tagUserPosts,
    this.totalComments,
    this.totalLikes,
    this.totalShares,
    this.userPostLikes,
    this.userReplies
  });

  Map<String, dynamic> toJson() {
    return {
      "id": id,
      "user": user?.toJson(),
      "content": content,
      "createdAt": createdAt,
      "createdBy": createdBy,
      "updatedAt": updatedAt,
      "mediaUrl": mediaUrl?.map((media) => media.toJson()).toList(),
      "status": status,
      "tagUserPosts": tagUserPosts?.map((user) => user.toJson()).toList(),
      "userPostLikes": userPostLikes?.map((like) => like.toJson()).toList(),
      "userReplies": userReplies,
      "totalLikes": totalLikes,
      "totalComments": totalComments,
      "totalShares": totalShares
    };
  }

  myPost.fromJson(Map<String, dynamic> json) {
    id = json['id'] as String?;
    user = json['user'] != null ? MiniUser.fromJson(json['user']) : null;
    content = json['content'] as String?;
    createdAt = json['createdAt'] as String?; // Corrected key
    createdBy = json['createdBy'] as String?; // Corrected key
    updatedAt = json['updatedAt'] as String?;

    // Kiểm tra xem trường 'mediaUrl' có tồn tại và khác null không trước khi sử dụng
    mediaUrl = json['mediaUrl'] != null
        ? List.from(json['mediaUrl']).map((media) => MediaObject.fromJson(media)).toList()
        : null;

    status = json['status'] as bool?;

    // Tương tự như trên, kiểm tra null cho 'tagUserPosts' và 'userPostLikes' trước khi chuyển đổi
    tagUserPosts = json['tagUserPosts'] != null
        ? List.from(json['tagUserPosts']).map((user) => MiniUser.fromJson(user)).toList()
        : null;

    userPostLikes = json['userPostLikes'] != null
        ? List.from(json['userPostLikes']).map((like) => MiniUser.fromJson(like)).toList()
        : null;

    userReplies = json['userReplies'] as int?;
    totalLikes = json['totalLikes'] as int?;
    totalComments = json['totalComments'] as int?;
    totalShares = json['totalShares'] as int?;
  }

  bool isValidTweet() {
    return user?.fullName?.isNotEmpty ?? false;
  }
}