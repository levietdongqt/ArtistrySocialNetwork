import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
// Vui lòng thêm package flutter_rating_bar vào pubspec.yaml nếu chưa thêm
import 'package:flutter_rating_bar/flutter_rating_bar.dart';

import '../../myModel/review.dart';

class ReviewCard extends StatelessWidget {
  final Review review; // Định nghĩa lớp Review của bạn ở đây

  ReviewCard({required this.review});

  @override
  Widget build(BuildContext context) {
    String formattedDate = DateFormat('MMM dd, yyyy').format(DateTime.parse(review.reviewDetails.createDate)); // Cần format ngày tháng phù hợp
    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: Material(
        color: Colors.white,
        elevation: 10,
        borderRadius: BorderRadius.circular(10),
        child: InkWell(
          onTap: () {}, // Bạn có thể thêm hành động khi nhấn vào card
          child: Container(
            padding: EdgeInsets.all(20),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(10),
              boxShadow: [
                BoxShadow(
                  color: Colors.grey.withOpacity(0.5),
                  spreadRadius: 5,
                  blurRadius: 7,
                  offset: Offset(0, 3),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                ListTile(
                  leading: CircleAvatar( // Thay thế UserAvatar bằng CircleAvatar
                    backgroundImage: NetworkImage(review.customerUser.avatar!),
                  ),
                  title: Text(review.customerUser.fullName!),
                  subtitle: RatingBarIndicator(
                    rating: review.reviewDetails.star.toDouble(),
                    itemBuilder: (context, index) => Icon(
                      Icons.star,
                      color: Colors.amber,
                    ),
                    itemCount: 5,
                    itemSize: 20.0,
                    direction: Axis.horizontal,
                  ),
                ),
                SizedBox(height: 8),
                Text('Service used: ${review.reviewDetails.serviceName}'),
                SizedBox(height: 8),
                Text(review.reviewDetails.content, style: TextStyle(color: Colors.grey[800])),
                if (review.reviewDetails.additionalContent.isNotEmpty)
                  Padding(
                    padding: const EdgeInsets.only(top: 4.0),
                    child: Text(
                      review.reviewDetails.additionalContent,
                      style: TextStyle(color: Colors.grey[500], fontSize: 12),
                    ),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}