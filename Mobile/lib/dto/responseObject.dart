class ResponseObject<T> {
  int status;
  String message;
  T? data;

  ResponseObject({required this.status, required this.message, this.data});

  // Tạo một constructor factory cho phép bạn phân tích dữ liệu từ JSON
  factory ResponseObject.fromJson(
      Map<String, dynamic> json, T Function(Object? json)? fromJsonT) {
    return ResponseObject(
        status: json['status'],
        message: json['message'],
        data: fromJsonT == null ? json['data'] : fromJsonT(json['data']));
  }
}
