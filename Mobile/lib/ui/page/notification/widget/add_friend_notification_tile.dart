import 'package:flutter/material.dart';
import 'package:flutter_twitter_clone/myModel/MyNotification.dart';
import 'package:flutter_twitter_clone/myModel/myUser.dart';
import 'package:flutter_twitter_clone/ui/page/profile/profilePage.dart';
import 'package:flutter_twitter_clone/ui/page/profile/widgets/circular_image.dart';
import 'package:flutter_twitter_clone/ui/theme/theme.dart';
import 'package:flutter_twitter_clone/widgets/customWidgets.dart';
import 'package:flutter_twitter_clone/widgets/url_text/customUrlText.dart';

class AddFriendNotificationTile extends StatelessWidget {
  final MyNotification model;
  final Function Myfunction;
  final Function acceptFunction;
  final Function unAcceptFunction;
  const AddFriendNotificationTile({Key? key, required this.model,required this.Myfunction,required this.acceptFunction,required this.unAcceptFunction})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
   
    return Column(
      children: [
        Container(
          color: TwitterColor.white,
          padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 5),
          child: Column(
            children: [
              Row(
                children: [
                  _UserCard(
                    user: model.userTo!,
                    Myfunction: Myfunction,
                    acceptFunction: acceptFunction,
                    unAcceptFunction: unAcceptFunction,
                  ),
                  IconButton(
                      icon: Icon(Icons.disabled_visible_outlined),
                      onPressed: () {
                        Myfunction();
                      },
                    ),
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
  final Function Myfunction;
  final Function acceptFunction;
  final Function unAcceptFunction;
  const _UserCard({Key? key, required this.user,required this.Myfunction,required this.acceptFunction,required this.unAcceptFunction})
      : super(key: key);
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
                    Text(" đã gửi lời mời kết bạn", style: TextStyles.subtitleStyle),
                    
                  ],
                ),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 10),
                child: Row(
                  children: <Widget>[
                    ElevatedButton(onPressed: () => {
                      acceptFunction(),
                      Myfunction()
                    },
                    child: Text('Kết bạn'),),
                    ElevatedButton(onPressed: () => {
                      unAcceptFunction(),
                      Myfunction(),
                    },
                    child: Text('Từ chối'),)
                  ],
                )
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
        ));
  }
}
