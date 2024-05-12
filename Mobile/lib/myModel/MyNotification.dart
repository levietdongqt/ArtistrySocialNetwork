import 'package:flutter_twitter_clone/myModel/myUser.dart';

class MyNotification {
    String? id;
    String? type;
    String? notificationType;
    String? createdDate;
    MyUser? userFrom;
    MyUser? userTo;
    String? link;
    String? message;
    bool? status;
    bool? delivered;

  MyNotification({
    required this.id,
    required this.type,
     this.notificationType,
    this.createdDate,
    this.userFrom,
    this.userTo,
    required this.link,
    this.message,
    this.status,
    this.delivered
  });

  factory MyNotification.fromJson(Map<String, dynamic> json) {
    return MyNotification(
      id: json['id'],
      type: json['type'],
      notificationType: json['notificationType'],
      createdDate: json['createdDate'],
      userFrom: json['userFrom']!= null? MyUser.fromJson(json['userFrom']) : null,
      userTo: json['userTo']!= null? MyUser.fromJson(json['userTo']) : null,
      link: json['link'],      
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'type': type,
    'notificationType': notificationType,
    'createdDate': createdDate,
    'userFrom': userFrom!= null? userFrom!.toJson() : null,
    'userTo': userTo!= null? userTo!.toJson() : null,
    'link': link,      
    'message': message,
    'status': status,
    'delivered': delivered,
    };

 
}
