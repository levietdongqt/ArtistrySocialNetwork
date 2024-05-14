import 'package:flutter_twitter_clone/myModel/MediaObject.dart';
import 'package:flutter_twitter_clone/myModel/MiniUser.dart';

class myComment {
  String? id;
  String? content;
  String? sentDate;
  String? updatedDate;
  List<MediaObject>? mediaUrl;
  String? postId;
  String? parentCommentId;
  MiniUser? byUser;
  List<MiniUser>? commentsLikes;
  List<MiniUser>? tagUserComments;
  int? totalLikes;
  int? totalReply;

  myComment({
    this.id,
    this.content,
    this.mediaUrl,
    this.postId,
    this.byUser,
    this.totalLikes,
    this.commentsLikes,
    this.parentCommentId,
    this.sentDate,
    this.tagUserComments,
    this.totalReply,
    this.updatedDate,
  });

  Map<String, dynamic> toJson() {
    return {
      "id": id,
      "content": content,
      "sentDate": sentDate,
      "updatedDate": updatedDate,
      "mediaUrl": mediaUrl?.map((e) => e.toJson()).toList(),
      "postId": postId,
      "parentCommentId": parentCommentId,
      "byUser": byUser?.toJson(),
      "commentsLikes": commentsLikes?.map((e) => e.toJson()).toList(),
      "tagUserComments": tagUserComments?.map((e) => e.toJson()).toList(),
      "totalLikes": totalLikes,
      "totalReply": totalReply,
    };
  }

  myComment.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    content = json['content'];
    sentDate = json['sentDate'];
    updatedDate = json['updatedDate'];
    if (json['mediaUrl'] != null) {
      mediaUrl = List.from(json['mediaUrl']).map((e) => MediaObject.fromJson(e)).toList();
    }
    postId = json['postId'];
    parentCommentId = json['parentCommentId'];
    byUser = json['byUser'] != null ? MiniUser.fromJson(json['byUser']) : null;
    if (json['commentsLikes'] != null) {
      commentsLikes = List.from(json['commentsLikes']).map((e) => MiniUser.fromJson(e)).toList();
    }
    if (json['tagUserComments'] != null) {
      tagUserComments = List.from(json['tagUserComments']).map((e) => MiniUser.fromJson(e)).toList();
    }
    totalLikes = json['totalLikes'];
    totalReply = json['totalReply'];
  }
}