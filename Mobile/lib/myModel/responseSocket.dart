import 'package:flutter_twitter_clone/helper/enum.dart';

class ResponseSocket<T> {
  ResponseSocketType type;
  T? data;

  ResponseSocket({required this.type, this.data});

  // Tạo một constructor factory cho phép bạn phân tích dữ liệu từ JSON
  factory ResponseSocket.fromJson(Map<String, dynamic> json) {
    return ResponseSocket(type: _mapType(json['type']), data: json['data']);
  }

  static ResponseSocketType _mapType(String type) {
    switch (type) {
      case 'GET_CONVERSATION':
        return ResponseSocketType.GET_CONVERSATION;
      case 'SEEN_FLAG':
        return ResponseSocketType.SEEN_FLAG;
      case 'SEND_MESSAGE':
        return ResponseSocketType.SEND_MESSAGE;
      default:
        return ResponseSocketType.HEART_BEAT;
    }
  }
}
