class MyMessage {
  String? key;
  String senderId;
  String conversationId;
  List<String>? receiverIds;
  String? content;
  String type;
  bool seen;
  DateTime? sendTime;
  String? timeStamp;

  MyMessage({
    this.key,
    required this.senderId,
    required this.conversationId,
    this.receiverIds,
    required this.content,
    required this.type,
    required this.seen,
    required this.sendTime,
  });

  factory MyMessage.fromJson(Map<dynamic, dynamic> json) => MyMessage(
    key: json["id"],
    senderId: json["senderId"],
    conversationId: json["conversationId"],
    receiverIds: json["receiverIds"],
    content: json["content"],
    sendTime: DateTime.parse(json["sendTime"]),
    type: json["type"],
    seen: json["seen"],
  );

  Map<String, dynamic> toJson() => {
    "id": key,
    "senderId": senderId,
    "conversationId": conversationId,
    "receiverIds": receiverIds,
    "sendTime": sendTime!.toIso8601String(),
    "content": content,
    "type": type,
    "seen": seen,
  };
}