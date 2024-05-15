
import 'package:equatable/equatable.dart';

class MediaObject extends Equatable {
  late String id;
  late String src;
  late String alt;

  MediaObject({required this.id, required this.src, required this.alt});

  factory MediaObject.fromJson(Map<String, dynamic> json) {
    return MediaObject(
      id: json['id'] as String,
      src: json['src'] as String,
      alt: json['alt'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'src': src,
      'alt': alt,
    };
  }

  @override
  // TODO: implement props
  List<Object?> get props => [
    id,
    src,
    alt,
  ];
}