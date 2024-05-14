import 'dart:async';

import 'package:firebase_database/firebase_database.dart';
import 'package:flutter_twitter_clone/helper/shared_prefrence_helper.dart';
import 'package:flutter_twitter_clone/helper/utility.dart';
import 'package:flutter_twitter_clone/model/bookmarkModel.dart';
import 'package:flutter_twitter_clone/model/feedModel.dart';
import 'package:flutter_twitter_clone/myModel/myPost.dart';
import 'package:flutter_twitter_clone/ui/page/common/locator.dart';
import 'appState.dart';

class BookmarkState extends AppState {
  BookmarkState() {
    getDataFromDatabase();
  }
  List<myPost>? _tweetList;
  List<BookmarkModel>? _bookmarkList;

  addBookmarkTweetToList(BookmarkModel model) {
    _bookmarkList ??= <BookmarkModel>[];

    if (!_bookmarkList!.any((element) => element.key == model.key)) {
      _bookmarkList!.add(model);
    }
  }

  List<myPost>? get tweetList => _tweetList;

  /// get [Notification list] from firebase realtime database
  void getDataFromDatabase() async {
    String userId = await getIt<SharedPreferenceHelper>()
        .getUserProfile()
        .then((value) => value!.id!);
    try {
      if (_tweetList != null) {
        return;
      }
      isBusy = true;
      kDatabase
          .child('bookmark')
          .child(userId)
          .once()
          .then((DatabaseEvent event) async {
        final snapshot = event.snapshot;
        if (snapshot.value != null) {
          var map = snapshot.value as Map<dynamic, dynamic>?;
          if (map != null) {
            map.forEach((bookmarkKey, value) {
              var map = value as Map<dynamic, dynamic>;
              var model = BookmarkModel.fromJson(map);
              model.key = bookmarkKey;
              addBookmarkTweetToList(model);
            });
          }

          if (_bookmarkList != null) {
            for (var bookmark in _bookmarkList!) {
              var tweet = await getTweetDetail(bookmark.tweetId);
              if (tweet != null) {
                _tweetList ??= <myPost>[];
                _tweetList!.add(tweet);
              }
            }
          }
        }
        isBusy = false;
      });
    } catch (error) {
      isBusy = false;
      cprint(error, errorIn: 'getDataFromDatabase');
    }
  }

  /// get `Tweet` present in notification
  Future<myPost?> getTweetDetail(String tweetId) async {
    myPost _tweetDetail;
    final event = await kDatabase.child('tweet').child(tweetId).once();

    final snapshot = event.snapshot;
    if (snapshot.value != null) {
      var map = snapshot.value as Map<String, dynamic>;
      _tweetDetail = myPost.fromJson(map);
      _tweetDetail.id = snapshot.key!;
      return _tweetDetail;
    } else {
      return null;
    }
  }
}
