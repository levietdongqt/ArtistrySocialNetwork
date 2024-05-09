import 'package:flutter_twitter_clone/helper/enum.dart';
import 'package:flutter_twitter_clone/myModel/MiniUser.dart';
import 'package:flutter_twitter_clone/myModel/myMessage.dart';

class MyConversation {
  String id;
  List<MiniUser> members;
  MyMessage? lastMessage;
  DateTime? updateAt;
  DateTime? createAt;
  List<MyMessage>? messages;
  String? name;
  ConversationType? type;

  MyConversation({
    required this.id,
    required this.members,
     this.lastMessage,
    this.updateAt,
    this.createAt,
    required this.messages,
    this.name,
    this.type,
     // this.type,
  });

  factory MyConversation.fromJson(Map<String, dynamic> json) {
    return MyConversation(
      id: json['id'],
      members:
          List<MiniUser>.from(json['members'].map((x) => MiniUser.fromJson(x))),
      lastMessage: json['lastMessage'] != null ? MyMessage.fromJson(json['lastMessage']) : null,
      updateAt:
          json['updatedAt'] != null ? DateTime.parse(json['updatedAt']) : null,
      createAt:
          json['createAt'] != null ? DateTime.parse(json['createAt']) : null,
      messages: json['messages'] != null
          ? List<MyMessage>.from(
              json['messages'].map((x) => MyMessage.fromJson(x)))
          : null,
      name: json['name'],
      type: _mapConversionType(json['type']),
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'members': List<dynamic>.from(members.map((x) => x.toJson())),
        'lastMessage': lastMessage?.toJson(),
        'updatedAt': updateAt?.toIso8601String(),
        'createAt': createAt?.toIso8601String(),
        'messages': List<dynamic>.from(messages!.map((x) => x.toJson())),
        'type' : type?.name,
      };

  static ConversationType? _mapConversionType(String? type){
      if(type == null){
        return null;
      }
      switch(type){
        case "PRIVATE":
          return ConversationType.PRIVATE;
        case "GROUP":
          return ConversationType.GROUP;
        case "HIDE":
          return ConversationType.HIDE;
      }
  }
}
