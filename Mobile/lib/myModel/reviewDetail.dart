class ReviewDetails {
  final int star;
  final String content;
  final String additionalContent;
  final String createDate;
  final int mainServiceId;
  final String serviceName;
  final int likeNumber;
  final bool isHaveOrder;

  ReviewDetails({
    required this.star,
    required this.content,
    required this.additionalContent,
    required this.createDate,
    required this.mainServiceId,
    required this.serviceName,
    required this.likeNumber,
    required this.isHaveOrder,
  });

  factory ReviewDetails.fromJson(Map<String, dynamic> json) {
    return ReviewDetails(
      star: json['STAR'],
      content: json['CONTENT'],
      additionalContent: json['ADDITIONAL_CONTENT'],
      createDate: json['CREATE_DATE'],
      mainServiceId: json['MAIN_SERVICE_ID'] ?? -1, // Giả sử -1 là default value nếu null
      serviceName: json['SERVICE_NAME'],
      likeNumber: json['LIKE_NUMBER'],
      isHaveOrder: json['IS_HAVE_ORDER'],
    );
  }
}