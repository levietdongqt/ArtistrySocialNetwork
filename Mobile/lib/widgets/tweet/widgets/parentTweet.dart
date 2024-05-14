import 'package:flutter/material.dart';
import 'package:flutter_twitter_clone/helper/enum.dart';
import 'package:flutter_twitter_clone/model/feedModel.dart';
import 'package:flutter_twitter_clone/myModel/myPost.dart';
import 'package:flutter_twitter_clone/state/feedState.dart';
import 'package:flutter_twitter_clone/state/postState.dart';
import 'package:flutter_twitter_clone/ui/page/feed/feedPostDetail.dart';
import 'package:flutter_twitter_clone/widgets/tweet/tweet.dart';
import 'package:flutter_twitter_clone/widgets/tweet/widgets/unavailableTweet.dart';
import 'package:provider/provider.dart';

class ParentTweetWidget extends StatelessWidget {
  const ParentTweetWidget(
      {Key? key,
      required this.childRetwetkey,
      required this.type,
      this.trailing})
      : super(key: key);

  final String childRetwetkey;
  final TweetType type;
  final Widget? trailing;

  void onTweetPressed(BuildContext context, myPost model) {
    var postState = Provider.of<PostState>(context, listen: false);
    postState.getPostDetailFromDatabase(null, model: model);
    Navigator.push(context, FeedPostDetail.getRoute(model.id!));
  }

  @override
  Widget build(BuildContext context) {
    var postState = Provider.of<PostState>(context, listen: false);
    return FutureBuilder(
      future: postState.fetchTweet(childRetwetkey),
      builder: (context, AsyncSnapshot<myPost?> snapshot) {
        if (snapshot.hasData) {
          return Tweet(
            model: snapshot.data!,
            type: TweetType.ParentTweet,
            trailing: trailing,
            scaffoldKey: GlobalKey<ScaffoldState>(),
          );
        }
        if ((snapshot.connectionState == ConnectionState.done ||
                snapshot.connectionState == ConnectionState.waiting) &&
            !snapshot.hasData) {
          return UnavailableTweet(
            snapshot: snapshot,
            type: type,
          );
        } else {
          return const SizedBox.shrink();
        }
      },
    );
  }
}
