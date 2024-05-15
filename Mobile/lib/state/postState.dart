import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:firebase_database/firebase_database.dart';
import 'package:firebase_database/firebase_database.dart' as database;
import 'package:firebase_storage/firebase_storage.dart';
import 'package:flutter_twitter_clone/helper/ApiHelper.dart';
import 'package:flutter_twitter_clone/helper/enum.dart';
import 'package:flutter_twitter_clone/helper/shared_prefrence_helper.dart';
import 'package:flutter_twitter_clone/myModel/MiniUser.dart';
import 'package:flutter_twitter_clone/myModel/myPost.dart';
import 'package:flutter_twitter_clone/myModel/myComment.dart';
import 'package:flutter_twitter_clone/helper/utility.dart';
import 'package:flutter_twitter_clone/model/user.dart';
import 'package:flutter_twitter_clone/myModel/myUser.dart';
import 'package:flutter_twitter_clone/state/appState.dart';
import 'package:flutter_twitter_clone/state/authState.dart';
import 'package:flutter_twitter_clone/ui/page/common/locator.dart';
// import 'package:link_preview_generator/link_preview_generator.dart'
//     show WebInfo;
import 'package:path/path.dart' as path;
import 'package:translator/translator.dart';

class PostState extends AppState {
  bool isBusy = false;
  Map<String, List<myComment>?>? postReplyMap = {};
  myPost? _postToReplyModel;
  myPost? get tweetToReplyModel => _postToReplyModel;
  set setTweetToReply(myPost model) {
    _postToReplyModel = model;
  }

  late List<myComment> _commentList;

  List<myPost>? _feedList;
  List<myPost>? _tweetDetailModelList;

  List<myPost>? get tweetDetailModel => _tweetDetailModelList;

  /// `feedList` always [contain all tweets] fetched from firebase database
  List<myPost>? get feedList {
    if (_feedList == null) {
      return null;
    } else {
      return List.from(_feedList!.reversed);
    }
  }

  /// contain tweet list for home page
  List<myPost>? getTweetList(MyUser? miniUser) {
    if (miniUser == null) {
      return null;
    }
    List<myPost>? list;
    if (!isBusy && feedList != null && feedList!.isNotEmpty) {
      list = feedList!.where((x) {
        /// If Tweet is a comment then no need to add it in tweet list
        if (x.user!.id != miniUser.id) {
          return false;
        }
        /// Only include Tweets of logged-in user's and his following user's
        // if (x.user!.userId == userModel.userId ||
        //     (userModel.followingList != null &&
        //         userModel.followingList!.contains(x.user!.userId))) {
        //   return true;
        // } else {
        //   return false;
        // }
        return true;
      }).toList();
      if (list.isEmpty) {
        list = null;
      }
    }
    print(list);
    return list;
  }

  Map<String, dynamic> _linkWebInfos = {};
  Map<String, dynamic> get linkWebInfos => _linkWebInfos;
  void addWebInfo(String url, dynamic webInfo) {
    _linkWebInfos.addAll({url: webInfo});
  }

  Map<String, Translation?> _postsTranslations = {};
  Map<String, Translation?> get postsTranslations => _postsTranslations;
  void addTweetTranslation(String tweet, Translation? translation) {
    _postsTranslations.addAll({tweet: translation});
    notifyListeners();
  }

  /// set tweet for detail tweet page
  /// Setter call when tweet is tapped to view detail
  /// Add Tweet detail is added in _tweetDetailModelList
  /// It makes `Fwitter` to view nested Tweets
  set setmyPost(myPost model) {
    _tweetDetailModelList ??= [];

    /// [Skip if any duplicate tweet already present]

    _tweetDetailModelList!.add(model);
    cprint("Detail Tweet added. Total Tweet: ${_tweetDetailModelList!.length}");
    notifyListeners();
  }

  /// `remove` last Tweet from tweet detail page stack
  /// Function called when navigating back from a Tweet detail
  /// `_tweetDetailModelList` is map which contain lists of comment Tweet list
  /// After removing Tweet from Tweet detail Page stack its comments tweet is also removed from `_tweetDetailModelList`
  void removeLastTweetDetail(String postId) {
    if (_tweetDetailModelList != null && _tweetDetailModelList!.isNotEmpty) {
      // var index = _tweetDetailModelList.in
      myPost removeTweet =
      _tweetDetailModelList!.lastWhere((x) => x.id == postId);
      _tweetDetailModelList!.remove(removeTweet);
      postReplyMap?.removeWhere((id, value) => id == postId);
      cprint(
          "Last index Tweet removed from list. Remaining Tweet: ${_tweetDetailModelList!.length}");
      notifyListeners();
    }
  }

  /// [clear all tweets] if any tweet present in tweet detail page or comment tweet
  void clearAllDetailAndReplyTweetStack() {
    if (_tweetDetailModelList != null) {
      _tweetDetailModelList!.clear();
    }
    if (postReplyMap != null) {
      postReplyMap!.clear();
    }
    cprint('Empty tweets from stack');
  }

  /// get [Tweet list] from firebase realtime database
  void getDataFromDatabase() async {
    try {
      var user = await getIt<SharedPreferenceHelper>().getUserProfile();
      var id = user?.id;
      isBusy = true;
      _feedList = null;
      notifyListeners();
      final response = await ApiHelper.callApi(HttpMethod.GET,"/posts/get-posts-pag/${id}",null,ServerDestination.Realtime_Service,true);
      if(response.status == 200){
        _feedList = <myPost>[];
        if (response.data != null) {
          response.data.forEach((item) {
            var model = myPost.fromJson(item);
            _feedList!.add(model);
          });
        } else {
          _feedList = null;
        }
        isBusy = false;
        notifyListeners();
      }else{
        print("loi 5000");
      }

    } catch (error) {
      isBusy = false;
      cprint(error, errorIn: 'getDataFromDatabase');
    }
  }

  /// get [Tweet Detail] from firebase realtime kDatabase
  /// If model is null then fetch tweet from firebase
  /// [getPostDetailFromDatabase] is used to set prepare Tweet to display Tweet detail
  /// After getting tweet detail fetch tweet comments from firebase
  void getPostDetailFromDatabase(String? postID, {myPost? model}) async {
    try {
      myPost? _postDetail;
      if (model != null) {
        // set tweet data from tweet list data.
        // No need to fetch tweet from firebase db if data already present in tweet list
        _postDetail = model;
        setmyPost = _postDetail;
        postID = model.id;
      } else {
        assert(postID != null);
        // Fetch tweet data from firebase
        final response = await ApiHelper.callApi(HttpMethod.GET, "/posts/get-post/${postID}", null,ServerDestination.Realtime_Service, true);
          final snapshot = response.data;
          if (snapshot != null) {
            var map = snapshot as Map<String, dynamic>;
            _postDetail = myPost.fromJson(map);
            setmyPost = _postDetail!;
          }

      }
      if (_postDetail != null) {
        // Fetch comment tweets
        _commentList = <myComment>[];
        // Check if parent tweet has reply tweets or not
        var commentData = await ApiHelper.callApi(HttpMethod.GET, "/posts/comments/${postID}", null, ServerDestination.Realtime_Service, true);
        if (commentData.data > 0) {
              final snapshot = commentData!.data;
              if (snapshot.value != null) {
                var commentModel = myComment.fromJson(snapshot);
                String key = snapshot.key;
                _commentList.add(commentModel);
              }
          } else {
          postReplyMap!.putIfAbsent(postID!, () => _commentList);
          notifyListeners();
        }
      }
    } catch (error) {
      cprint(error, errorIn: 'getPostDetailFromDatabase');
    }
  }


  /// Fetch `Retweet` model from firebase realtime kDatabase.
  /// Retweet itself  is a type of `Tweet`
  Future<myPost?> fetchTweet(String postID) async {
    myPost? _tweetDetail;
    final user = await getIt<SharedPreferenceHelper>().getUserProfile();
    /// If tweet is available in feedList then no need to fetch it from firebase
    if (feedList!.any((x) => x.id == postID)) {
      _tweetDetail = feedList!.firstWhere((x) => x.id == postID);
    }
    /// If tweet is not available in feedList then need to fetch it from firebase
    else {
      cprint("Fetched from DB: " + postID);
      var model = await ApiHelper.callApi(HttpMethod.GET,"/posts/get-post/${postID}",null,ServerDestination.Realtime_Service,true);
          final snapshot = model?.data;
          if (snapshot != null) {
            var map = snapshot as Map<String, dynamic>;
            _tweetDetail = myPost.fromJson(map);
            _tweetDetail.id = snapshot.keys as String?;
            print(_tweetDetail.id);
          }
      if (model != null) {
        _tweetDetail = model?.data;
      } else {
        cprint("Fetched null value from  DB");
      }
    }
    return _tweetDetail;
  }

  /// create [New Tweet]
  /// returns Tweet id
  Future<String?> createTweet(myPost model,MyUser user) async {
    ///  Create tweet in [Firebase kDatabase]
    isBusy = true;
    notifyListeners();
    String? tweetid;
    try {
      String data = jsonEncode({
        'content': model.content,
        'mediaUrl': model.mediaUrl ?? null,
        'sendUserId': user.id,
        'sendFullName': user.fullName,
        'sendUserAvatarUrl': user.avatar,
        'sendUserCoverImage': user.coverImage,
        'sendUserBio': user.bio
      });

      var response = await ApiHelper.callApi(HttpMethod.POST, "/posts/post-create",
          data, ServerDestination.Realtime_Service,true);
      tweetid = response.data?.id;
    } catch (error) {
      cprint(error, errorIn: 'tạo post');
    }
    isBusy = false;
    notifyListeners();
    return tweetid;
  }

  ///  It will create tweet in [Firebase kDatabase] just like other normal tweet.
  ///  update retweet count for retweet model
  // Future<String?> createReTweet(myPost model) async {
  //   String? tweetid;
  //   try {
  //     tweetid = await createTweet(model);
  //     if (_tweetToReplyModel != null) {
  //       if (_tweetToReplyModel!.retweetCount == null) {
  //         _tweetToReplyModel!.retweetCount = 0;
  //       }
  //       _tweetToReplyModel!.retweetCount =
  //           _tweetToReplyModel!.retweetCount! + 1;
  //       updateTweet(_tweetToReplyModel!);
  //     }
  //   } catch (error) {
  //     cprint(error, errorIn: 'createReTweet');
  //   }
  //   return tweetid;
  // }

  /// [Delete tweet] in Firebase kDatabase
  /// Remove Tweet if present in home page Tweet list
  /// Remove Tweet if present in Tweet detail page or in comment
  deleteTweet(String tweetId, TweetType type, {String? parentid} //FIXME
      ) {
    try {
      /// Delete tweet if it is in nested tweet detail page
      kDatabase.child('tweet').child(tweetId).remove().then((_) {
        if (type == TweetType.Detail &&
            _tweetDetailModelList != null &&
            _tweetDetailModelList!.isNotEmpty) {
          // var deletedTweet =
          //     _tweetDetailModelList.firstWhere((x) => x.id == tweetId);
          _tweetDetailModelList!.remove(_tweetDetailModelList!);
          if (_tweetDetailModelList!.isEmpty) {
            _tweetDetailModelList = null;
          }

          cprint('Tweet deleted from nested tweet detail page tweet');
        }
      });
    } catch (error) {
      cprint(error, errorIn: 'deleteTweet');
    }
  }

  /// upload [file] to firebase storage and return its  path url
  Future<String?> uploadFile(File file) async {
    try {
      isBusy = true;
      notifyListeners();
      var storageReference = FirebaseStorage.instance
          .ref()
          .child("tweetImage")
          .child(path.basename(DateTime.now().toIso8601String() + file.path));
      await storageReference.putFile(file);

      var url = await storageReference.getDownloadURL();
      // ignore: unnecessary_null_comparison
      if (url != null) {
        return url;
      }
      return null;
    } catch (error) {
      cprint(error, errorIn: 'uploadFile');
      return null;
    }
  }

  /// [Delete file] from firebase storage
  Future<void> deleteFile(String url, String baseUrl) async {
    try {
      var filePath = url.split(".com/o/")[1];
      filePath = filePath.replaceAll(RegExp(r'%2F'), '/');
      filePath = filePath.replaceAll(RegExp(r'(\?alt).*'), '');
      //  filePath = filePath.replaceAll('tweetImage/', '');
      cprint('[Path]' + filePath);
      var storageReference = FirebaseStorage.instance.ref();
      await storageReference.child(filePath).delete().catchError((val) {
        cprint('[Error]' + val);
      }).then((_) {
        cprint('[Success] Image deleted');
      });
    } catch (error) {
      cprint(error, errorIn: 'deleteFile');
    }
  }

  /// [update] tweet
  Future<void> updateTweet(myPost model) async {
    await kDatabase.child('tweet').child(model.id!).set(model.toJson());
  }

  /// Add/Remove like on a Tweet
  /// [postId] is tweet id, [userId] is user's id who like/unlike Tweet
  addLikeToTweet(String postId, MiniUser user) async {
    try {
        String data = jsonEncode({
          'postId': postId,
          'byUser': {
            'id': user.id ,
            'fullName': user.fullName,
            'avatar': user.avatar,
            'coverImage': user.coverImage,
            'bio': user.bio,
            'verified': user.verified
          }
        });
        final response = await ApiHelper.callApi(HttpMethod.POST, "/posts/likes",
            data, ServerDestination.Main_Service,false);
    } catch (error) {
      cprint(error, errorIn: 'addLikeToTweet');
    }
  }
  addLikeToComment(String commentId, MiniUser user) async {
    try {
      String data = jsonEncode({
        'commentId': commentId,
        'byUser': {
          'id': user.id ,
          'fullName': user.fullName,
          'avatar': user.avatar,
          'coverImage': user.coverImage,
          'bio': user.bio,
          'verified': user.verified
        }
      });
      final response = await ApiHelper.callApi(HttpMethod.POST, "/posts/likes",
          data, ServerDestination.Main_Service,false);
    } catch (error) {
      cprint(error, errorIn: 'addLikeToTweet');
    }
  }

  // Add [new comment tweet] to any tweet
  // Comment is a Tweet itself
  Future<String?> addCommentToPost(myPost replyTweet,MiniUser user) async {
    try {
      isBusy = true;
      notifyListeners();
      // String tweetid;
      if (_postToReplyModel != null) {
        myPost tweet =
        _feedList!.firstWhere((x) => x.id == _postToReplyModel!.id);
        String data = jsonEncode({
          'postId': replyTweet.id,
          'content': replyTweet.content,
          'byUser': {
            'id': user.id,
            'fullName': user.fullName,
            'avatar': user.avatar,
            'coverImage': user.coverImage,
            'bio': user.bio,
            'verified': user.verified
          }});
        var response = await ApiHelper.callApi(HttpMethod.POST, "/posts/comments", data,ServerDestination.Realtime_Service, true);
        return response.data.id;
      } else {
        return null;
      }
    } catch (error) {
      cprint(error, errorIn: 'addCommentToPost');
      return null;
    } finally {
      isBusy = false;
      notifyListeners();
    }
  }

  /// Add Tweet in bookmark
  Future addBookmark(String tweetId) async {
    final pref = getIt<SharedPreferenceHelper>();
    var userId = await pref.getUserProfile().then((value) => value!.id);
    DatabaseReference dbReference =
    kDatabase.child('bookmark').child(userId!).child(tweetId);
    await dbReference.set(
        {"tweetId": tweetId, "created_at": DateTime.now().toUtc().toString()});
  }

  /// Trigger when any tweet changes or update
  /// When any tweet changes it update it in UI
  /// No matter if Tweet is in home page or in detail page or in comment section.
  // _onTweetChanged(DatabaseEvent event) {
  //   var model =
  //   myPost.fromJson(event.snapshot.value as Map<dynamic, dynamic>);
  //   model.id = event.snapshot.id!;
  //   if (_feedList!.any((x) => x.id == model.id)) {
  //     var oldEntry = _feedList!.lastWhere((entry) {
  //       return entry.id == event.snapshot.id;
  //     });
  //     _feedList![_feedList!.indexOf(oldEntry)] = model;
  //   }
  //
  //   if (_tweetDetailModelList != null && _tweetDetailModelList!.isNotEmpty) {
  //     if (_tweetDetailModelList!.any((x) => x.id == model.id)) {
  //       var oldEntry = _tweetDetailModelList!.lastWhere((entry) {
  //         return entry.id == event.snapshot.id;
  //       });
  //       _tweetDetailModelList![_tweetDetailModelList!.indexOf(oldEntry)] =
  //           model;
  //     }
  //     if (tweetReplyMap != null && tweetReplyMap!.isNotEmpty) {
  //       if (true) {
  //         var list = tweetReplyMap![model.parentid];
  //         //  var list = tweetReplyMap.values.firstWhere((x) => x.any((y) => y.id == model.id));
  //         if (list != null && list.isNotEmpty) {
  //           var index =
  //           list.indexOf(list.firstWhere((x) => x.id == model.id));
  //           list[index] = model;
  //         } else {
  //           list = [];
  //           list.add(model);
  //         }
  //       }
  //     }
  //   }
  //   // if (event.snapshot != null) {
  //   cprint('Tweet updated');
  //   isBusy = false;
  //   notifyListeners();
  //   // }
  // }

  /// Trigger when new tweet added
  /// It will add new Tweet in home page list.
  /// IF Tweet is comment it will be added in comment section too.
  // _onTweetAdded(DatabaseEvent event) {
  //   myPost tweet = myPost.fromJson(event.snapshot.value as Map);
  //   tweet.id = event.snapshot.id!;
  //
  //   /// Check if Tweet is a comment
  //   _onCommentAdded(tweet);
  //   tweet.id = event.snapshot.id!;
  //   _feedList ??= <myPost>[];
  //   if ((_feedList!.isEmpty || _feedList!.any((x) => x.id != tweet.id)) &&
  //       tweet.isValidTweet) {
  //     _feedList!.add(tweet);
  //     cprint('Tweet Added');
  //   }
  //   isBusy = false;
  //   notifyListeners();
  // }

  /// Trigger when comment tweet added
  /// Check if Tweet is a comment
  /// If Yes it will add tweet in comment list.
  /// add [new tweet] comment to comment list
  // _onCommentAdded(myPost tweet) {
  //   if (tweet.childRetwetid != null) {
  //     /// if Tweet is a type of retweet then it can not be a comment.
  //     return;
  //   }
  //   if (tweetReplyMap != null && tweetReplyMap!.isNotEmpty) {
  //     if (tweetReplyMap![tweet.parentid] != null) {
  //       /// Insert new comment at the top of all available comment
  //       tweetReplyMap![tweet.parentid]!.insert(0, tweet);
  //     } else {
  //       tweetReplyMap![tweet.parentid!] = [tweet];
  //     }
  //     cprint('Comment Added');
  //   }
  //   isBusy = false;
  //   notifyListeners();
  // }

  /// Trigger when Tweet `Deleted`
  /// It removed Tweet from home page list, Tweet detail page list and from comment section if present
  // _onTweetRemoved(DatabaseEvent event) async {
  //   myPost tweet = myPost.fromJson(event.snapshot.value as Map);
  //   tweet.id = event.snapshot.id!;
  //   var tweetId = tweet.id;
  //   var parentid = tweet.parentid;
  //
  //   ///  Delete tweet in [Home Page]
  //   try {
  //     late myPost deletedTweet;
  //     if (_feedList!.any((x) => x.id == tweetId)) {
  //       /// Delete tweet if it is in home page tweet.
  //       deletedTweet = _feedList!.firstWhere((x) => x.id == tweetId);
  //       _feedList!.remove(deletedTweet);
  //
  //       if (deletedTweet.parentid != null &&
  //           _feedList!.isNotEmpty &&
  //           _feedList!.any((x) => x.id == deletedTweet.parentid)) {
  //         // Decrease parent Tweet comment count and update
  //         var parentModel =
  //         _feedList!.firstWhere((x) => x.id == deletedTweet.parentid);
  //         parentModel.replyTweetidList!.remove(deletedTweet.id);
  //         parentModel.commentCount = parentModel.replyTweetidList!.length;
  //         updateTweet(parentModel);
  //       }
  //       if (_feedList!.isEmpty) {
  //         _feedList = null;
  //       }
  //       cprint('Tweet deleted from home page tweet list');
  //     }
  //
  //     /// [Delete tweet] if it is in nested tweet detail comment section page
  //     if (parentid != null &&
  //         parentid.isNotEmpty &&
  //         tweetReplyMap != null &&
  //         tweetReplyMap!.isNotEmpty &&
  //         tweetReplyMap!.ids.any((x) => x == parentid)) {
  //       // (type == TweetType.Reply || tweetReplyMap.length > 1) &&
  //       deletedTweet =
  //           tweetReplyMap![parentid]!.firstWhere((x) => x.id == tweetId);
  //       tweetReplyMap![parentid]!.remove(deletedTweet);
  //       if (tweetReplyMap![parentid]!.isEmpty) {
  //         tweetReplyMap![parentid] = null;
  //       }
  //
  //       if (_tweetDetailModelList != null &&
  //           _tweetDetailModelList!.isNotEmpty &&
  //           _tweetDetailModelList!.any((x) => x.id == parentid)) {
  //         var parentModel =
  //         _tweetDetailModelList!.firstWhere((x) => x.id == parentid);
  //         parentModel.replyTweetidList!.remove(deletedTweet.id);
  //         parentModel.commentCount = parentModel.replyTweetidList!.length;
  //         cprint('Parent tweet comment count updated on child tweet removal');
  //         updateTweet(parentModel);
  //       }
  //
  //       cprint('Tweet deleted from nested tweet detail comment section');
  //     }
  //
  //     /// Delete tweet image from firebase storage if exist.
  //     if (deletedTweet.imagePath != null &&
  //         deletedTweet.imagePath!.isNotEmpty) {
  //       deleteFile(deletedTweet.imagePath!, 'tweetImage');
  //     }
  //
  //     /// If a retweet is deleted then retweetCount of original tweet should be decrease by 1.
  //     if (deletedTweet.childRetwetid != null) {
  //       await fetchTweet(deletedTweet.childRetwetid!)
  //           .then((myPost? retweetModel) {
  //         if (retweetModel == null) {
  //           return;
  //         }
  //         if (retweetModel.retweetCount! > 0) {
  //           retweetModel.retweetCount = retweetModel.retweetCount! - 1;
  //         }
  //         updateTweet(retweetModel);
  //       });
  //     }
  //
  //     /// Delete notification related to deleted Tweet.
  //     if (deletedTweet.likeCount! > 0) {
  //       kDatabase
  //           .child('notification')
  //           .child(tweet.userId)
  //           .child(tweet.id!)
  //           .remove();
  //     }
  //     notifyListeners();
  //   } catch (error) {
  //     cprint(error, errorIn: '_onTweetRemoved');
  //   }
  // }
}
