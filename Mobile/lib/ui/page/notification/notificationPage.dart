import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_twitter_clone/helper/utility.dart';
import 'package:flutter_twitter_clone/myModel/MyNotification.dart';
import 'package:flutter_twitter_clone/state/WebSocketState.dart';
import 'package:flutter_twitter_clone/state/authState.dart';
import 'package:flutter_twitter_clone/state/notificationState.dart';
import 'package:flutter_twitter_clone/ui/page/notification/widget/add_friend_notification_tile.dart';
import 'package:flutter_twitter_clone/ui/page/notification/widget/follow_notification_tile.dart';

import 'package:flutter_twitter_clone/ui/theme/theme.dart';
import 'package:flutter_twitter_clone/widgets/customAppBar.dart';
import 'package:flutter_twitter_clone/widgets/customWidgets.dart';
import 'package:flutter_twitter_clone/widgets/newWidget/emptyList.dart';
import 'package:provider/provider.dart';


class NotificationPage extends StatefulWidget {
  const NotificationPage({Key? key, required this.scaffoldKey})
      : super(key: key);

  /// scaffoldKey used to open sidebar drawer
  final GlobalKey<ScaffoldState> scaffoldKey;

  @override
  _NotificationPageState createState() => _NotificationPageState();
}

class _NotificationPageState extends State<NotificationPage> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      var state = Provider.of<NotificationState>(context, listen: false);
      var authState = Provider.of<AuthState>(context, listen: false);
      state.getListNotification(authState.userId,context);
    });    
  }

  void onSettingIconPressed() {
    Navigator.pushNamed(context, '/NotificationPage');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: TwitterColor.white,
      appBar: CustomAppBar(
        scaffoldKey: widget.scaffoldKey,
        title: customTitleText(
          'Notifications',
        ),
        icon: AppIcon.settings,
        onActionPressed: onSettingIconPressed,
      ),
      body: const NotificationPageBody(),
    );
  }
}

class NotificationPageBody extends StatelessWidget {
  const NotificationPageBody({Key? key}) : super(key: key);

  Widget _notificationRow(BuildContext context, MyNotification model) {
      var state = Provider.of<NotificationState>(context, listen: true);
      final body = jsonEncode({
      'userId': model.userFrom?.id,
      'friendId': model.userTo?.id,
    });
      if (model.notificationType == "FRIEND"){
        return AddFriendNotificationTile(model: model, Myfunction: () {
          state.removeMyNotifications(model.id!, context);
        },acceptFunction: () {
          state.acceptFriendMyNotifications(body, context);
        },
        unAcceptFunction: () {
          state.unAcceptFriendMyNotifications(body, context);
        },
        );
      }
      return FollowNotificationTile(
        model: model,
        Myfunction: () {
        state.removeMyNotifications(model.id!, context);
      },
      );
  }

  @override
  Widget build(BuildContext context) {
    var socketState =  Provider.of<WebSocketState>(context, listen: true);
    var list = socketState.myNotifications;
    if (list == null || list.isEmpty) {
      return const Padding(
        padding: EdgeInsets.symmetric(horizontal: 30),
        child: EmptyList(
          'Không có thông báo nào để hiển thị',
          subTitle: 'Khi có thông báo đến, sẽ được thông báo ở đây',
        ),
      );
    }
    return ListView.builder(
      addAutomaticKeepAlives: true,
      itemBuilder: (context, index) => _notificationRow(context, list[index]),
      itemCount: list.length,
    );
  }
}
