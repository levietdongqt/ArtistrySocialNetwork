import 'package:flutter/material.dart';
import 'package:carousel_slider/carousel_slider.dart';
import 'package:flutter_twitter_clone/myModel/myUser.dart';

import '../../myModel/mainService.dart'; // Đảm bảo bạn đã thêm 'carousel_slider' vào pubspec.yaml

class ServiceCard extends StatelessWidget {
  final MainService data; // Giả định MainService là model tương ứng

  ServiceCard({Key? key, required this.data}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final MyUser provider = data.provider; // Giả định đối tượng 'provider' thuộc về 'data'

    return Card( // Sử dụng widget Card để tạo khung bọc
      elevation: 4, // Thêm bóng mờ dưới Card
      margin: EdgeInsets.all(10), // Khoảng cách từ Card đến widget xung quanh
      shape: RoundedRectangleBorder( // Boder làm tròn các góc của Card
        borderRadius: BorderRadius.circular(10),
      ),
      child: InkWell(
        onTap: () {
          // Xử lý onTap
        },
        child: Column(
          mainAxisSize: MainAxisSize.min, // Loại bỏ khoảng trống không cần thiết
          children: <Widget>[
            CarouselSlider(
              options: CarouselOptions(
                autoPlay: true,
                aspectRatio: 2.0,
                enlargeCenterPage: true,
                viewportFraction: 1.0, // Để hình ảnh hiển thị chiếm hết không gian ngang
              ),
              items: data.imageUrls.map((imgUrl) {
                return Builder(
                  builder: (BuildContext context) {
                    return Container(
                      width: MediaQuery.of(context).size.width,
                      child: Image.network(imgUrl, fit: BoxFit.cover),
                    );
                  },
                );
              }).toList(),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 10.0, horizontal: 16.0),
              child: ListTile(
                leading: Tooltip(
                  message: '${provider.fullName}\n${provider.bio!.isNotEmpty ? provider.bio : ""}',
                  child: CircleAvatar(
                    backgroundImage: NetworkImage(provider.avatar!),
                  ),
                ),
                title: Text(
                  data.name,
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                subtitle: Text('Giá: ${data.price}'),
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 2.0, horizontal: 16.0),
              child: Text(
                data.description.length > 100 ? '${data.description.substring(0, 100)}...' : data.description,
                style: TextStyle(color: Colors.grey),
              ),
            ),
            // Thêm bất kỳ widget nào khác bạn muốn hiển thị
          ],
        ),
      ),
    );
  }
}