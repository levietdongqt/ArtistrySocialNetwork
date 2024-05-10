import 'package:flutter/material.dart';
import 'package:flutter_twitter_clone/helper/utility.dart';
import 'package:flutter_twitter_clone/myModel/MyNotification.dart';
import 'package:flutter_twitter_clone/state/WebSocketState.dart';
import 'package:flutter_twitter_clone/state/authState.dart';
import 'package:flutter_twitter_clone/state/notificationState.dart';
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
    // var state = Provider.of<NotificationState>(context);
    // var authState = Provider.of<AuthState>(context, listen: false);
    // state.getListNotification(authState.userId,context);
    // cprint("fgfg");
    
  }

  void onSettingIconPressed() {
    Navigator.pushNamed(context, '/NotificationPage');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: TwitterColor.bondiBlue,
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
    var state = Provider.of<NotificationState>(context);
    // var state = Provider.of<NotificationState>(context, listen: false);
      return FollowNotificationTile(
        model: model,
      );

    // }
    // return FutureBuilder(
    //   future: state.getTweetDetail(model.tweetKey!),
    //   builder: (BuildContext context, AsyncSnapshot<FeedModel?> snapshot) {
    //     if (snapshot.hasData) {
    //       return PostLikeTile(model: snapshot.data!);
    //     } else if (snapshot.connectionState == ConnectionState.waiting ||
    //         snapshot.connectionState == ConnectionState.active) {
    //       return const SizedBox(
    //         height: 4,
    //         child: LinearProgressIndicator(),
    //       );
    //     } else {
    //       /// remove notification from firebase db if tweet in not available or deleted.
    //       var authState = Provider.of<AuthState>(context);
    //       state.removeNotification(authState.userId, model.tweetKey!);
    //       return const SizedBox();
    //     }
    //   },
    // );
  }

  @override
  Widget build(BuildContext context) {
    var socketState =  Provider.of<WebSocketState>(context, listen: false);
    var list = socketState.myNotifications;
    if (list == null || list.isEmpty) {
      return const Padding(
        padding: EdgeInsets.symmetric(horizontal: 30),
        child: EmptyList(
          'No Notification available yet',
          subTitle: 'When new notification found, they\'ll show up here.',
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
