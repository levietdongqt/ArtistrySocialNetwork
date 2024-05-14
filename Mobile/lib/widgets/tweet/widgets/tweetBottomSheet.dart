import 'package:firebase_dynamic_links/firebase_dynamic_links.dart';
import 'package:flutter/material.dart';
import 'package:flutter_twitter_clone/helper/enum.dart';
import 'package:flutter_twitter_clone/helper/utility.dart';
import 'package:flutter_twitter_clone/model/user.dart';
import 'package:flutter_twitter_clone/myModel/MiniUser.dart';
import 'package:flutter_twitter_clone/myModel/myComment.dart';
import 'package:flutter_twitter_clone/myModel/myPost.dart';
import 'package:flutter_twitter_clone/state/authState.dart';
import 'package:flutter_twitter_clone/state/feedState.dart';
import 'package:flutter_twitter_clone/state/postState.dart';
import 'package:flutter_twitter_clone/ui/theme/theme.dart';
import 'package:flutter_twitter_clone/widgets/customWidgets.dart';
import 'package:flutter_twitter_clone/widgets/share_widget.dart';
import 'package:flutter_twitter_clone/widgets/tweet/tweet.dart';
import 'package:provider/provider.dart';

import '../../../myModel/myUser.dart';

class TweetBottomSheet {
  Widget tweetOptionIcon(BuildContext context,
      {required myPost model,
      required TweetType type,
      required GlobalKey<ScaffoldState> scaffoldKey}) {
    return Container(
      width: 25,
      height: 25,
      decoration: const BoxDecoration(
        shape: BoxShape.circle,
      ),
      child: customIcon(context,
          icon: AppIcon.arrowDown,
          isTwitterIcon: true,
          iconColor: AppColor.lightGrey),
    ).ripple(
      () {
        _openBottomSheet(context,
            type: type, model: model, scaffoldKey: scaffoldKey);
      },
      borderRadius: BorderRadius.circular(20),
    );
  }

  void _openBottomSheet(BuildContext context,
      {required TweetType type,
      required myPost model,
      required GlobalKey<ScaffoldState> scaffoldKey}) async {
    var authState = Provider.of<AuthState>(context, listen: false);
    bool isMyTweet = authState.userId == model.user?.id;
    await showModalBottomSheet(
      backgroundColor: Colors.transparent,
      context: context,
      builder: (context) {
        return Container(
            padding: const EdgeInsets.only(top: 5, bottom: 0),
            height: context.height *
                (type == TweetType.Tweet
                    ? (isMyTweet ? .25 : .44)
                    : (isMyTweet ? .38 : .52)),
            width: double.infinity,
            decoration: BoxDecoration(
              color: Theme.of(context).bottomSheetTheme.backgroundColor,
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(20),
                topRight: Radius.circular(20),
              ),
            ),
            child: type == TweetType.Tweet
                ? _tweetOptions(context,
                    scaffoldKey: scaffoldKey,
                    isMyTweet: isMyTweet,
                    model: model,
                    type: type)
                : _tweetDetailOptions(context,
                    scaffoldKey: scaffoldKey,
                    isMyTweet: isMyTweet,
                    model: model,
                    type: type));
      },
    );
  }

  Widget _tweetDetailOptions(BuildContext context,
      {required bool isMyTweet,
      required myPost model,
      required TweetType type,
      required GlobalKey<ScaffoldState> scaffoldKey}) {
    return Column(
      children: <Widget>[
        Container(
          width: context.width * .1,
          height: 5,
          decoration: BoxDecoration(
            color: Theme.of(context).dividerColor,
            borderRadius: const BorderRadius.all(
              Radius.circular(10),
            ),
          ),
        ),
        _widgetBottomSheetRow(context, AppIcon.link,
            text: 'Copy link to post', isEnable: true, onPressed: () async {
          Navigator.pop(context);
          var uri = await Utility.createLinkToShare(
            context,
            "tweet/${model.id}",
            socialMetaTagParameters: SocialMetaTagParameters(
                description: model.content ??
                    "${model.user!.fullName} Đăng bài trên social.",
                title: "Social on Fwitter app",
                imageUrl: Uri.parse(
                    "https://play-lh.googleusercontent.com/e66XMuvW5hZ7HnFf8R_lcA3TFgkxm0SuyaMsBs3KENijNHZlogUAjxeu9COqsejV5w=s180-rw")),
          );

          Utility.copyToClipBoard(
              context: context,
              text: uri.toString(),
              message: "Tweet link copy to clipboard");
        }),
        isMyTweet
            ? _widgetBottomSheetRow(
                context,
                AppIcon.delete,
                text: 'Delete Tweet',
                onPressed: () {
                  showDialog(
                    context: context,
                    builder: (_) => AlertDialog(
                      title: const Text("Delete"),
                      content: const Text('Do you want to delete this Tweet?'),
                      actions: [
                        TextButton(
                          onPressed: () {
                            Navigator.pop(context);
                            Navigator.pop(context);
                          },
                          child: const Text('Cancel'),
                        ),
                        TextButton(
                          style: ButtonStyle(
                            backgroundColor: MaterialStateProperty.all(
                              TwitterColor.dodgeBlue,
                            ),
                            foregroundColor: MaterialStateProperty.all(
                              TwitterColor.white,
                            ),
                          ),
                          onPressed: () {
                            Navigator.pop(context);
                            _deleteTweet(
                              context,
                              type,
                              model.id!,
                              parentkey: model.id,
                            );
                          },
                          child: const Text('Confirm'),
                        ),
                      ],
                    ),
                  );
                },
                isEnable: true,
              )
            : Container(),
        isMyTweet
            ? _widgetBottomSheetRow(
                context,
                AppIcon.unFollow,
                text: 'Pin to profile',
              )
            : _widgetBottomSheetRow(
                context,
                AppIcon.unFollow,
                text: 'Unfollow ${model.user!.fullName}',
              ),
        isMyTweet
            ? Container()
            : _widgetBottomSheetRow(
                context,
                AppIcon.mute,
                text: 'Mute ${model.user!.fullName}',
              ),
        _widgetBottomSheetRow(
          context,
          AppIcon.mute,
          text: 'Mute this conversation',
        ),
        _widgetBottomSheetRow(
          context,
          AppIcon.viewHidden,
          text: 'View hidden replies',
        ),
        isMyTweet
            ? Container()
            : _widgetBottomSheetRow(
                context,
                AppIcon.block,
                text: 'Block ${model.user!.fullName}',
              ),
        isMyTweet
            ? Container()
            : _widgetBottomSheetRow(
                context,
                AppIcon.report,
                text: 'Report Tweet',
              ),
      ],
    );
  }

  Widget _tweetOptions(BuildContext context,
      {required bool isMyTweet,
      required myPost model,
      required TweetType type,
      required GlobalKey<ScaffoldState> scaffoldKey}) {
    return Column(
      children: <Widget>[
        Container(
          width: context.width * .1,
          height: 5,
          decoration: BoxDecoration(
            color: Theme.of(context).dividerColor,
            borderRadius: const BorderRadius.all(
              Radius.circular(10),
            ),
          ),
        ),
        _widgetBottomSheetRow(context, AppIcon.link,
            text: 'Copy link to tweet', isEnable: true, onPressed: () async {
          var uri = await Utility.createLinkToShare(
            context,
            "tweet/${model.id}",
            socialMetaTagParameters: SocialMetaTagParameters(
                description: model.content ??
                    "${model.user!.fullName} posted a tweet on Fwitter.",
                title: "Tweet on Fwitter app",
                imageUrl: Uri.parse(
                    "https://play-lh.googleusercontent.com/e66XMuvW5hZ7HnFf8R_lcA3TFgkxm0SuyaMsBs3KENijNHZlogUAjxeu9COqsejV5w=s180-rw")),
          );

          Navigator.pop(context);
          Utility.copyToClipBoard(
              context: context,
              text: uri.toString(),
              message: "Tweet link copy to clipboard");
        }),
        isMyTweet
            ? _widgetBottomSheetRow(
                context,
                AppIcon.delete,
                text: 'Delete Tweet',
                onPressed: () {
                  showDialog(
                    context: context,
                    builder: (_) => AlertDialog(
                      title: const Text("Delete"),
                      content: const Text('Do you want to delete this Tweet?'),
                      actions: [
                        TextButton(
                          onPressed: () {
                            Navigator.pop(context);
                            Navigator.pop(context);
                          },
                          child: const Text('Cancel'),
                        ),
                        TextButton(
                          style: ButtonStyle(
                            backgroundColor: MaterialStateProperty.all(
                              TwitterColor.dodgeBlue,
                            ),
                            foregroundColor: MaterialStateProperty.all(
                              TwitterColor.white,
                            ),
                          ),
                          onPressed: () {
                            Navigator.pop(context);
                            _deleteTweet(
                              context,
                              type,
                              model.id!,
                              parentkey: model.id,
                            );
                          },
                          child: const Text('Confirm'),
                        ),
                      ],
                    ),
                  );
                },
                isEnable: true,
              )
            : Container(),
        isMyTweet
            ? _widgetBottomSheetRow(
                context,
                AppIcon.thumbpinFill,
                text: 'Pin to profile',
              )
            : _widgetBottomSheetRow(
                context,
                AppIcon.sadFace,
                text: 'Not interested in this',
              ),
        isMyTweet
            ? Container()
            : _widgetBottomSheetRow(
                context,
                AppIcon.unFollow,
                text: 'Unfollow ${model.user!.fullName}',
              ),
        isMyTweet
            ? Container()
            : _widgetBottomSheetRow(
                context,
                AppIcon.mute,
                text: 'Mute ${model.user!.fullName}',
              ),
        isMyTweet
            ? Container()
            : _widgetBottomSheetRow(
                context,
                AppIcon.block,
                text: 'Block ${model.user!.fullName}',
              ),
        isMyTweet
            ? Container()
            : _widgetBottomSheetRow(
                context,
                AppIcon.report,
                text: 'Report Tweet',
              ),
      ],
    );
  }

  Widget _widgetBottomSheetRow(BuildContext context, IconData icon,
      {required String text, Function? onPressed, bool isEnable = false}) {
    return Expanded(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20),
        child: Row(
          children: <Widget>[
            customIcon(
              context,
              icon: icon,
              isTwitterIcon: true,
              size: 25,
              paddingIcon: 8,
              iconColor:
                  onPressed != null ? AppColor.darkGrey : AppColor.lightGrey,
            ),
            const SizedBox(
              width: 15,
            ),
            customText(
              text,
              context: context,
              style: TextStyle(
                color: isEnable ? AppColor.secondary : AppColor.lightGrey,
                fontSize: 18,
                fontWeight: FontWeight.w400,
              ),
            )
          ],
        ),
      ).ripple(() {
        if (onPressed != null) {
          onPressed();
        } else {
          Navigator.pop(context);
        }
      }),
    );
  }

  void _deleteTweet(BuildContext context, TweetType type, String tweetId,
      {String? parentkey}) {
    var state = Provider.of<FeedState>(context, listen: false);
    state.deleteTweet(tweetId, type, parentkey: parentkey);
    // CLose bottom sheet
    Navigator.of(context).pop();
    if (type == TweetType.Detail) {
      // Close Tweet detail page
      Navigator.of(context).pop();
      // Remove last tweet from tweet detail stack page
      state.removeLastTweetDetail(tweetId);
    }
  }

  void openRetweetBottomSheet(BuildContext context,
      {TweetType? type,
      required myPost model,
      required GlobalKey<ScaffoldState> scaffoldKey}) async {
    await showModalBottomSheet(
      backgroundColor: Colors.transparent,
      context: context,
      builder: (context) {
        return Container(
            padding: const EdgeInsets.only(top: 5, bottom: 0),
            height: 130,
            width: context.width,
            decoration: BoxDecoration(
              color: Theme.of(context).bottomSheetTheme.backgroundColor,
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(20),
                topRight: Radius.circular(20),
              ),
            ),
            child: _retweet(context, model, type));
      },
    );
  }

  Widget _retweet(BuildContext context, myPost model, TweetType? type) {
    return Column(
      children: <Widget>[
        Container(
          width: context.width * .1,
          height: 5,
          decoration: BoxDecoration(
            color: Theme.of(context).dividerColor,
            borderRadius: const BorderRadius.all(
              Radius.circular(10),
            ),
          ),
        ),
        _widgetBottomSheetRow(
          context,
          AppIcon.retweet,
          isEnable: true,
          text: 'Retweet',
          onPressed: () async {
            var state = Provider.of<PostState>(context, listen: false);
            var authState = Provider.of<AuthState>(context, listen: false);
            var myUser = authState.myUser;
            myUser = MyUser(
                email: myUser!.fullName ?? myUser.email!.split('@')[0],
                avatar: myUser.avatar,
                id: myUser.id,
                verified: authState.userModel!.isVerified,
                fullName: authState.userModel!.userName);
            // Prepare current Tweet model to reply
            myPost post = myPost(
                createdAt: DateTime.now().toUtc().toString(),
                user: myUser as MiniUser,
                createdBy: myUser.id!
            );
            state.createTweet(post,myUser);
            Navigator.pop(context);
            var sharedPost = await state.fetchTweet(post.id!);
            if (sharedPost != null) {
              sharedPost.totalShares ??= 0;
              sharedPost.totalShares = sharedPost.totalShares! + 1;
              state.updateTweet(sharedPost);
            }
          },
        ),
        _widgetBottomSheetRow(
          context,
          AppIcon.edit,
          text: 'Retweet with comment',
          isEnable: true,
          onPressed: () {
            var state = Provider.of<PostState>(context, listen: false);
            // Prepare current Tweet model to reply
            state.setTweetToReply = model;
            Navigator.pop(context);

            /// `/ComposeTweetPage/retweet` route is used to identify that tweet is going to be retweet.
            /// To simple reply on any `Tweet` use `ComposeTweetPage` route.
            Navigator.of(context).pushNamed('/ComposeTweetPage/retweet');
          },
        )
      ],
    );
  }

  void openShareTweetBottomSheet(
      BuildContext context, myPost model, TweetType? type) async {
    await showModalBottomSheet(
      backgroundColor: Colors.transparent,
      context: context,
      builder: (context) {
        return Container(
            padding: const EdgeInsets.only(top: 5, bottom: 0),
            height: 180,
            width: context.width,
            decoration: BoxDecoration(
              color: Theme.of(context).bottomSheetTheme.backgroundColor,
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(20),
                topRight: Radius.circular(20),
              ),
            ),
            child: _shareTweet(context, model, type));
      },
    );
  }

  Widget _shareTweet(BuildContext context, myPost model, TweetType? type) {
    var socialMetaTagParameters = SocialMetaTagParameters(
        description: model.content ?? "",
        title: "${model.user!.fullName} posted a tweet on Fwitter.",
        imageUrl: Uri.parse(model.user?.avatar ??
            "https://play-lh.googleusercontent.com/e66XMuvW5hZ7HnFf8R_lcA3TFgkxm0SuyaMsBs3KENijNHZlogUAjxeu9COqsejV5w=s180-rw"));
    return Column(
      children: <Widget>[
        Container(
          width: context.width * .1,
          height: 5,
          decoration: BoxDecoration(
            color: Theme.of(context).dividerColor,
            borderRadius: const BorderRadius.all(
              Radius.circular(10),
            ),
          ),
        ),
        const SizedBox(height: 8),
        _widgetBottomSheetRow(
          context,
          AppIcon.bookmark,
          isEnable: true,
          text: 'Bookmark',
          onPressed: () async {
            var state = Provider.of<FeedState>(context, listen: false);
            await state.addBookmark(model.id!);
            Navigator.pop(context);
            ScaffoldMessenger.maybeOf(context)!.showSnackBar(
              const SnackBar(content: Text("Bookmark saved!!")),
            );
          },
        ),
        const SizedBox(height: 8),
        _widgetBottomSheetRow(
          context,
          AppIcon.link,
          isEnable: true,
          text: 'Share Link',
          onPressed: () async {
            Navigator.pop(context);
            var url = Utility.createLinkToShare(
              context,
              "tweet/${model.id}",
              socialMetaTagParameters: socialMetaTagParameters,
            );
            var uri = await url;
            Utility.share(uri.toString(), subject: "Tweet");
          },
        ),
        const SizedBox(height: 8),
        _widgetBottomSheetRow(
          context,
          AppIcon.image,
          text: 'Share with Tweet thumbnail',
          isEnable: true,
          onPressed: () {
            socialMetaTagParameters = SocialMetaTagParameters(
                description: model.content ?? "",
                title: "${model.user!.fullName} posted a tweet on Fwitter.",
                imageUrl: Uri.parse(model.user?.avatar ??
                    "https://play-lh.googleusercontent.com/e66XMuvW5hZ7HnFf8R_lcA3TFgkxm0SuyaMsBs3KENijNHZlogUAjxeu9COqsejV5w=s180-rw"));
            Navigator.pop(context);
            Navigator.push(
              context,
              ShareWidget.getRoute(
                  child: type != null
                      ? Tweet(
                          model: model,
                          type: type,
                          scaffoldKey: GlobalKey<ScaffoldState>(),
                        )
                      : Tweet(
                          model: model,
                          scaffoldKey: GlobalKey<ScaffoldState>()),
                  id: "tweet/${model.id}",
                  socialMetaTagParameters: socialMetaTagParameters),
            );
          },
        ),
        const SizedBox(height: 12),
      ],
    );
  }
}
