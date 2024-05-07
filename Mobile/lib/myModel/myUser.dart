import 'package:flutter_twitter_clone/helper/enum.dart';

class MyUser {
  String? id;
  String? fullName;
  String? email;
  String? phoneNumber;
  bool? gender;
  DateTime? dateOfBirth;
  UserStatus? status;
  String? avatar;
  String? coverImage;
  Map<String, Object>? userDetails;
  String? password;
  List<String>? roles;
  AccentType? accent;
  ThemeType? theme;
  String? bio;
  bool? verified;
  DateTime? createDate;
  DateTime? updatedAt;

  MyUser({
    this.id,
    this.fullName,
    this.email,
    this.phoneNumber,
    this.gender,
    this.dateOfBirth,
    this.status,
    this.avatar,
    this.coverImage,
    this.userDetails,
    this.password,
    this.roles,
    this.accent,
    this.theme,
    this.bio,
    this.verified,
    this.createDate,
    this.updatedAt,
  });
  factory MyUser.fromJson(Map<String, dynamic> json) {
    print("FROM MYUSER: ${json}");
    return MyUser(
      id: json['id'],
      fullName: json['fullName'],
      email: json['email'],
      phoneNumber: json['phoneNumber'],
      gender: json['gender'],
      dateOfBirth: json['dateOfBirth'] != null
          ? DateTime.parse(json['dateOfBirth'])
          : null,
      status: json['status'] != null
          ? _mapStringToUserStatus(json['status'])
          : null,
      avatar: json['avatar'],
      coverImage: json['coverImage'],
      userDetails: json['userDetails'],
      password: json['password'],
      roles: json['roles'] != null ? List<String>.from(json['roles']) : null,
      accent: json['accent'] != null
          ? _mapStringToAccentType(json['accent'])
          : null,
      theme: json['theme'] != null ? _mapStringToTheme(json['theme']) : null,
      bio: json['bio'],
      verified: json['verified'],
      createDate: json['createDate'] != null
          ? DateTime.parse(json['createDate'])
          : null,
      updatedAt:
          json['updateAt'] != null ? DateTime.parse(json['updateAt']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'fullName': fullName,
      'email': email,
      'phoneNumber': phoneNumber,
      'gender': gender,
      'dateOfBirth': dateOfBirth?.toIso8601String(),
      'status': _enumToString(status),
      'avatar': avatar,
      'coverImage': coverImage,
      'userDetails': userDetails,
      'password': password,
      'roles': roles,
      'accent': _enumToString(accent),
      'theme': _enumToString(theme),
      'bio': bio,
      'verified': verified,
      'createDate': createDate?.toIso8601String(),
      'updatedAt': updatedAt?.toIso8601String(),
    };
  }

  static String _enumToString(Object? enumValue) {
    return enumValue.toString().split('.').last;
  }

  // Hàm chuyển đổi map các enum thành String
  static Map<String, String> _mapEnumToString(Map<String, Object?>? enumMap) {
    if (enumMap == null) return {};
    return enumMap.map((key, value) => MapEntry(key, _enumToString(value)));
  }

  static AccentType? _mapStringToAccentType(String accentString) {
    switch (accentString) {
      case 'BLUE':
        return AccentType.BLUE;
      case 'YELLOW':
        return AccentType.YELLOW;
      case 'PINK':
        return AccentType.PINK;
      case 'PURPLE':
        return AccentType.PURPLE;
      case 'ORANGE':
        return AccentType.ORANGE;
      case 'GREEN':
        return AccentType.GREEN;
      default:
        return null;
    }
  }

  static ThemeType? _mapStringToTheme(String themeString) {
    switch (themeString) {
      case 'LIGHT':
        return ThemeType.LIGHT;
      case 'DARK':
        return ThemeType.DARK;
      case 'DIM':
        return ThemeType.DIM;
      default:
        return null;
    }
  }

  static UserStatus? _mapStringToUserStatus(String themeString) {
    switch (themeString) {
      case 'ACTIVED':
        return UserStatus.ACTIVED;
      case 'BLOCKED':
        return UserStatus.BLOCKED;
      case 'PENDING':
        return UserStatus.PENDING;
      default:
        return null;
    }
  }

  @override
  String toString() {
    return 'User {id: $id, fullName: $fullName, email: $email, phoneNumber: $phoneNumber, '
        'gender: $gender, dateOfBirth: $dateOfBirth, status: $status, '
        'avatar: $avatar, coverImage: $coverImage, userDetails: $userDetails, '
        'password: $password, roles: $roles, accent: $accent, '
        'theme: $theme, bio: $bio, verified: $verified, createDate: $createDate, '
        'updatedAt: $updatedAt}';
  }
}
