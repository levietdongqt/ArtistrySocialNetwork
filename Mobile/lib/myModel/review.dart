import 'package:flutter_twitter_clone/myModel/myUser.dart';
import 'package:flutter_twitter_clone/myModel/reviewDetail.dart';

class Review {
  final int id;
  final MyUser customerUser;
  final MyUser providerUser;
  final ReviewDetails reviewDetails;

  Review({
    required this.id,
    required this.customerUser,
    required this.providerUser,
    required this.reviewDetails,
  });

  factory Review.fromJson(Map<String, dynamic> json) {
    return Review(
      id: json['id'] ?? -1, // Giả sử -1 là default value nếu null
      customerUser: MyUser.fromJson(json['customerUser']),
      providerUser: MyUser.fromJson(json['providerUser']),
      reviewDetails: ReviewDetails.fromJson(json['reviewDetails']),
    );
  }
}