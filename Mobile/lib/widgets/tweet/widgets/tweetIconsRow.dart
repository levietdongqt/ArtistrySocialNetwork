import 'package:flutter/material.dart';
import 'package:flutter_twitter_clone/helper/customRoute.dart';
import 'package:flutter_twitter_clone/helper/enum.dart';
import 'package:flutter_twitter_clone/helper/utility.dart';
import 'package:flutter_twitter_clone/model/feedModel.dart';
import 'package:flutter_twitter_clone/myModel/myComment.dart';
import 'package:flutter_twitter_clone/myModel/myPost.dart';
import 'package:flutter_twitter_clone/state/authState.dart';
import 'package:flutter_twitter_clone/state/feedState.dart';
import 'package:flutter_twitter_clone/ui/page/common/usersListPage.dart';
import 'package:flutter_twitter_clone/ui/theme/theme.dart';
import 'package:flutter_twitter_clone/widgets/customWidgets.dart';
import 'package:flutter_twitter_clone/widgets/tweet/widgets/tweetBottomSheet.dart';
import 'package:provider/provider.dart';

class TweetIconsRow extends StatelessWidget {
  final myPost model;
  final Color iconColor;
  final Color iconEnableColor;
  final double? size;
  final bool isTweetDetail;
  final TweetType? type;
  final GlobalKey<ScaffoldState> scaffoldKey;
  const TweetIconsRow(
      {Key? key,
      required this.model,
      required this.iconColor,
      required this.iconEnableColor,
      this.size,
      this.isTweetDetail = false,
      this.type,
      required this.scaffoldKey})
      : super(key: key);

  Widget _likeCommentsIcons(BuildContext context, myPost model) {
    var authState = Provider.of<AuthState>(context, listen: false);

    return Container(
      color: Colors.transparent,
      padding: const EdgeInsets.only(bottom: 0, top: 0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.start,
        children: <Widget>[
          const SizedBox(
            width: 20,
          ),
          _iconWidget(
            context,
            text: isTweetDetail ? '' : model.totalLikes.toString(),
            icon: AppIcon.reply,
            iconColor: iconColor,
            size: size ?? 20,
            onPressed: () {
              var state = Provider.of<myPost>(context, listen: false);
              Navigator.of(context).pushNamed('/ComposeTweetPage');
            },
          ),
          _iconWidget(context,
              text: isTweetDetail ? '' : model.totalComments.toString(),
              icon: AppIcon.retweet,
              iconColor: iconColor,
              size: size ?? 20, onPressed: () {
            TweetBottomSheet().openRetweetBottomSheet(context,
                type: type, model: model, scaffoldKey: scaffoldKey);
          }),
          _iconWidget(
            context,
            text: isTweetDetail ? '' : model.totalLikes.toString(),
            icon: model.userPostLikes!.any((userId) => userId == authState.myUser?.id)
                ? AppIcon.heartFill
                : AppIcon.heartEmpty,
            onPressed: () {
              addLikeToTweet(context);
            },
            iconColor:
                model.userPostLikes!.any((userId) => userId == authState.myUser?.id)
                    ? iconEnableColor
                    : iconColor,
            size: size ?? 20,
          ),
          _iconWidget(context, text: '', icon: null, sysIcon: Icons.share,
              onPressed: () {
            shareTweet(context);
          }, iconColor: iconColor, size: size ?? 20),
        ],
      ),
    );
  }

  Widget _iconWidget(BuildContext context,
      {required String text,
      IconData? icon,
      Function? onPressed,
      IconData? sysIcon,
      required Color iconColor,
      double size = 20}) {
    if (sysIcon == null) assert(icon != null);
    if (icon == null) assert(sysIcon != null);

    return Expanded(
      child: Row(
        children: <Widget>[
          IconButton(
            onPressed: () {
              if (onPressed != null) onPressed();
            },
            icon: sysIcon != null
                ? Icon(sysIcon, color: iconColor, size: size)
                : customIcon(
                    context,
                    size: size,
                    icon: icon!,
                    isTwitterIcon: true,
                    iconColor: iconColor,
                  ),
          ),
          customText(
            text,
            style: TextStyle(
              fontWeight: FontWeight.bold,
              color: iconColor,
              fontSize: size - 5,
            ),
            context: context,
          ),
        ],
      ),
    );
  }

  Widget _timeWidget(BuildContext context) {
    return Column(
      children: <Widget>[
        const SizedBox(height: 8),
        Row(
          children: <Widget>[
            const SizedBox(width: 5),
            customText(Utility.getPostTime2(model.createdAt),
                style: TextStyles.textStyle14),
            const SizedBox(width: 10),
            customText('Fwitter for Android',
                style: TextStyle(color: Theme.of(context).primaryColor))
          ],
        ),
        const SizedBox(height: 5),
      ],
    );
  }

  Widget _likeCommentWidget(BuildContext context) {
    bool isLikeAvailable =
        model.totalLikes != null ? model.totalLikes! > 0 : false;
    bool isRetweetAvailable = model.totalComments! > 0;
    bool isLikeRetweetAvailable = isRetweetAvailable || isLikeAvailable;
    return Column(
      children: <Widget>[
        const Divider(
          endIndent: 10,
          height: 0,
        ),
        AnimatedContainer(
          padding:
              EdgeInsets.symmetric(vertical: isLikeRetweetAvailable ? 12 : 0),
          duration: const Duration(milliseconds: 500),
          child: !isLikeRetweetAvailable
              ? const SizedBox.shrink()
              : Row(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  mainAxisAlignment: MainAxisAlignment.start,
                  children: <Widget>[
                    !isRetweetAvailable
                        ? const SizedBox.shrink()
                        : customText(model.totalComments.toString(),
                            style:
                                const TextStyle(fontWeight: FontWeight.bold)),
                    !isRetweetAvailable
                        ? const SizedBox.shrink()
                        : const SizedBox(width: 5),
                    AnimatedCrossFade(
                      firstChild: const SizedBox.shrink(),
                      secondChild: customText('Retweets',
                          style: TextStyles.subtitleStyle),
                      crossFadeState: !isRetweetAvailable
                          ? CrossFadeState.showFirst
                          : CrossFadeState.showSecond,
                      duration: const Duration(milliseconds: 800),
                    ),
                    !isRetweetAvailable
                        ? const SizedBox.shrink()
                        : const SizedBox(width: 20),
                    InkWell(
                      onTap: () {
                        onLikeTextPressed(context);
                      },
                      child: AnimatedCrossFade(
                        firstChild: const SizedBox.shrink(),
                        secondChild: Row(
                          children: <Widget>[
                            customSwitcherWidget(
                              duraton: const Duration(milliseconds: 300),
                              child: customText(model.totalLikes.toString(),
                                  style: const TextStyle(
                                      fontWeight: FontWeight.bold),
                                  key: ValueKey(model.totalLikes)),
                            ),
                            const SizedBox(width: 5),
                            customText('Likes', style: TextStyles.subtitleStyle)
                          ],
                        ),
                        crossFadeState: !isLikeAvailable
                            ? CrossFadeState.showFirst
                            : CrossFadeState.showSecond,
                        duration: const Duration(milliseconds: 300),
                      ),
                    )
                  ],
                ),
        ),
        !isLikeRetweetAvailable
            ? const SizedBox.shrink()
            : const Divider(
                endIndent: 10,
                height: 0,
              ),
      ],
    );
  }

  Widget customSwitcherWidget(
      {required child, Duration duraton = const Duration(milliseconds: 500)}) {
    return AnimatedSwitcher(
      duration: duraton,
      transitionBuilder: (Widget child, Animation<double> animation) {
        return ScaleTransition(child: child, scale: animation);
      },
      child: child,
    );
  }

  void addLikeToTweet(BuildContext context) {
    var state = Provider.of<myPost>(context, listen: false);
    var authState = Provider.of<AuthState>(context, listen: false);
    // state.addLikeToTweet(model, authState.userId);
  }

  void onLikeTextPressed(BuildContext context) {
    Navigator.of(context).push(
      CustomRoute<bool>(
        builder: (BuildContext context) => UsersListPage(
          pageTitle: "Thích bởi",
          userIdsList: model.userPostLikes!.map((user) => user.id as String).toList(),
          emptyScreenText: "Bài đăng này chưa ai thích",
          emptyScreenSubTileText:
              "Mỗi khi người thích ở đây, danh sách người dùng xuất hiện ở đây",
        ),
      ),
    );
  }

  void shareTweet(BuildContext context) async {
    TweetBottomSheet().openShareTweetBottomSheet(context, model, type);
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: <Widget>[
        isTweetDetail ? _timeWidget(context) : const SizedBox(),
        isTweetDetail ? _likeCommentWidget(context) : const SizedBox(),
        _likeCommentsIcons(context, model)
      ],
    );
  }
}
