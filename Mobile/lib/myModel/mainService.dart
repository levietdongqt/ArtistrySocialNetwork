import 'package:flutter_twitter_clone/myModel/myUser.dart';

class MainService {
  final int id;
  final String name;
  final double price;
  final String priceType;
  final double duration;
  final double restTime;
  final List<String> imageUrls;
  final String description;
  final String? createBy;  // Chú ý: Java LocalDate tương đương với Dart DateTime
  final DateTime createDate;
  // final List<String> promotionDTO; // Model tương ứng trong Dart
  final MyUser provider; // Sử dụng tên model Dart cho UserDTO
  final bool status;
  final String type = "service"; // Đây là giá trị constant trong Dart

  MainService({
    required this.id,
    required this.name,
    required this.price,
    required this.priceType,
    required this.duration,
    required this.restTime,
    required this.imageUrls,
    required this.description,
    this.createBy,
    required this.createDate,
    // required this.promotionDTO,
    required this.provider,
    required this.status,
  });

  factory MainService.fromJson(Map<String, dynamic> json) {
    return MainService(
      id: json['id'],
      name: json['name'],
      price: json['price'],
      priceType: json['priceType'],
      duration: json['duration'].toDouble(), // Bảo đảm chuyển đổi từ float sang double
      restTime: json['restTime'].toDouble(),
      imageUrls: List<String>.from(json['imageUrls']),
      description: json['description'],
      createBy: json['createBy'],
      createDate: DateTime.parse(json['createDate']),
      // promotionDTO: List<String>.from(json['promotionDTO']),
      provider: MyUser.fromJson(json['provider']),
      status: json['status'],
    );
  }
}