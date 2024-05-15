import 'package:flutter/material.dart';
import 'package:flutter_twitter_clone/helper/enum.dart';
import 'package:flutter_twitter_clone/model/feedModel.dart';
import 'package:flutter_twitter_clone/myModel/myComment.dart';
import 'package:flutter_twitter_clone/myModel/myPost.dart';
import 'package:flutter_twitter_clone/state/feedState.dart';
import 'package:flutter_twitter_clone/state/postState.dart';
import 'package:flutter_twitter_clone/widgets/cache_image.dart';
import 'package:flutter_twitter_clone/ui/theme/theme.dart';
import 'package:provider/provider.dart';

class TweetImage extends StatelessWidget {
  const TweetImage(
      {Key? key, required this.model, this.type, this.isRetweetImage = false})
      : super(key: key);

  final myPost model;
  final TweetType? type;
  final bool isRetweetImage;
  @override
  Widget build(BuildContext context) {
    if (model.mediaUrl?.isEmpty == false) assert(type != null);
    final bool hasMedia = model.mediaUrl != null && model.mediaUrl!.isNotEmpty;
    final String? firstMediaUrl = hasMedia ? model.mediaUrl!.first.src : null;
    return AnimatedContainer(
      duration: const Duration(milliseconds: 500),
      alignment: Alignment.centerRight,
      child: model.mediaUrl?.isEmpty == true
          ? const SizedBox.shrink()
          : Padding(
              padding: const EdgeInsets.only(top: 8),
              child: InkWell(
                borderRadius: BorderRadius.all(
                  Radius.circular(isRetweetImage ? 0 : 20),
                ),
                onTap: () {
                  if (type == TweetType.ParentTweet) {
                    return;
                  }
                  var state = Provider.of<PostState>(context, listen: false);
                  state.getPostDetailFromDatabase(model.id);
                  Navigator.pushNamed(context, '/ImageViewPge');
                },
                child: ClipRRect(
                  borderRadius: BorderRadius.all(
                    Radius.circular(isRetweetImage ? 0 : 20),
                  ),
                  child: Container(
                    width:
                        context.width * (type == TweetType.Detail ? .95 : .8) -
                            8,
                    decoration: BoxDecoration(
                      color: Theme.of(context).scaffoldBackgroundColor,
                    ),
                    child: AspectRatio(
                      aspectRatio: 4 / 3,
                      child: CacheImage(
                        path: firstMediaUrl,
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                ),
              ),
            ),
    );
  }
}
