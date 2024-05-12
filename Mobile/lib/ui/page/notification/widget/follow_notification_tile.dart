import 'package:flutter/material.dart';
import 'package:flutter_twitter_clone/helper/utility.dart';
import 'package:flutter_twitter_clone/model/notificationModel.dart';
import 'package:flutter_twitter_clone/model/user.dart';
import 'package:flutter_twitter_clone/myModel/MyNotification.dart';
import 'package:flutter_twitter_clone/myModel/myUser.dart';
import 'package:flutter_twitter_clone/ui/page/profile/profilePage.dart';
import 'package:flutter_twitter_clone/ui/page/profile/widgets/circular_image.dart';
import 'package:flutter_twitter_clone/ui/theme/theme.dart';
import 'package:flutter_twitter_clone/widgets/customWidgets.dart';
import 'package:flutter_twitter_clone/widgets/url_text/customUrlText.dart';

class FollowNotificationTile extends StatelessWidget {
  final MyNotification model;
  const FollowNotificationTile({Key? key, required this.model})
      : super(key: key);
  
  @override
  Widget build(BuildContext context) {
    var g = "";
    switch(model.notificationType){
      case "FOLLOWING":
        g = "đang theo dõi tôi";
        break;
      case "LIKE":
        g = "đã like bài viết của bạn";
        break;
      case "NORMAL":
        g = "đã đăng bài viết mới";
        break;
      case "TAG":
        g = "đã gắn bạn vào bài viết của họ";
        break;
      case "COMMENT":
        g = "đã bình luận bài viết của họ";
        break;
      case "FRIEND":
        g = "đã gửi lời mời kết bạn";
        break;
      case "ACCEPT_FRIEND":
        g = "đã chấp nhận lời mời kết bạn";
        break;  
    }
    return Column(
      children: [
        Container(
          color: TwitterColor.white,
          // padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 26),
          child: Column(
            children: [
              Row(
                children: [
                  _UserCard(user: model.userTo!),
                  Text(g, style: TextStyles.subtitleStyle),
                  // customIcon(context, icon: AppIcon.profile, isEnable: true),
                  // const SizedBox(width: 10),
                  // Text(
                  //   model.userFrom?.fullName as String,
                  //   style: TextStyles.titleStyle.copyWith(fontSize: 14),
                  // ), 
                ],
              ),
            ],
          ),
        ),
        const Divider(height: 0, thickness: .6)
      ],
    );
  }
}

class _UserCard extends StatelessWidget {
  final MyUser user;
  const _UserCard({Key? key, required this.user}) : super(key: key);
  String getBio(String bio) {
    if (bio == "Edit profile to update bio") {
      return "No bio available";
    } else {
      return bio.takeOnly(100);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
        padding: const EdgeInsets.only(left: 30, top: 10, bottom: 8),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 16),
          decoration: BoxDecoration(
            border: Border.all(color: AppColor.extraLightGrey, width: .5),
            borderRadius: const BorderRadius.all(Radius.circular(15)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              CircularImage(path: user.avatar!, height: 40),
              const SizedBox(height: 10),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 10),
                child: Row(
                  children: <Widget>[
                    UrlText(
                      text: user.fullName!,
                      style: const TextStyle(
                        color: Colors.black,
                        fontSize: 16,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    const SizedBox(width: 3),
                  ],
                ),
              ),
              const SizedBox(height: 10),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 9),
                child: customText(
                  '${user.fullName!}',
                  style: TextStyles.subtitleStyle.copyWith(fontSize: 13),
                ),
              ),
            ],
          ),
        ).ripple(() {
          Navigator.push(
              context, ProfilePage.getRoute(profileId: user.id!));
        }, borderRadius: BorderRadius.circular(15)));
  }
}
