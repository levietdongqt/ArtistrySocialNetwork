import 'dart:async';

import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_database/firebase_database.dart';
import 'package:firebase_database/firebase_database.dart' as dabase;
import 'package:flutter/foundation.dart';
import 'package:flutter_twitter_clone/helper/ApiHelper.dart';
import 'package:flutter_twitter_clone/helper/enum.dart';
import 'package:flutter_twitter_clone/helper/shared_prefrence_helper.dart';
import 'package:flutter_twitter_clone/helper/utility.dart';
import 'package:flutter_twitter_clone/myModel/myUser.dart';
import 'package:flutter_twitter_clone/model/user.dart';
import 'package:flutter_twitter_clone/ui/page/common/locator.dart';
import 'package:get_it/get_it.dart';

import 'authState.dart';

class ProfileState extends ChangeNotifier {
  ProfileState(this.profileId) {
    // databaseInit();
    init();
    _getProfileUser(profileId);
    getIt<SharedPreferenceHelper>().getUserProfile().then((myUser) {
      userId = myUser!.id!;
      _getloggedInUserProfile(myUser.id!);
    });
    // userId = FirebaseAuth.instance.currentUser!.uid;
  }

  /// This is the id of user who is logegd into the app.
  late String userId;

  /// Profile data of logged in user.
  late UserModel _userModel;

  UserModel get userModel => _userModel;

  dabase.Query? _profileQuery;
  late StreamSubscription<DatabaseEvent> profileSubscription;

  /// This is the id of user whose profile is open.
  final String profileId;

  /// Profile data of user whose profile is open.
  late UserModel _profileUserModel;

  UserModel get profileUserModel => _profileUserModel;

  bool _isBusy = true;

  bool get isbusy => _isBusy;

  set loading(bool value) {
    _isBusy = value;
    notifyListeners();
  }

  // databaseInit() {
  //   try {
  //     if (_profileQuery == null) {
  //       _profileQuery = kDatabase.child("profile").child(profileId);
  //       profileSubscription = _profileQuery!.onValue.listen(_onProfileChanged);
  //     }
  //   } catch (error) {
  //     cprint(error, errorIn: 'databaseInit');
  //   }
  // }
  void init() {}

  bool get isMyProfile => profileId == userId;

  /// Fetch profile of logged in  user
  void _getloggedInUserProfile(String userId) async {
    // kDatabase.child("profile").child(userId).once().then((DatabaseEvent event) {
    //   final snapshot = event.snapshot;
    //   if (snapshot.value != null) {
    //     var map = snapshot.value as Map<dynamic, dynamic>?;
    //     if (map != null) {
    //       _userModel = UserModel.fromJson(map);
    //     }
    //   }
    // });
    ApiHelper.callApi(HttpMethod.GET, '/user/get/${userId}', null,
            ServerDestination.Main_Service)
        .then((response) {
      if (response.status == 200) {
        // _userModel = MyUser.fromJson(response.data);
      }
    });
  }

  /// Fetch profile data of user whoose profile is opened
  void _getProfileUser(String? userProfileId) {
    assert(userProfileId != null);
    try {
      loading = true;
      kDatabase
          .child("profile")
          .child(userProfileId!)
          .once()
          .then((DatabaseEvent event) {
        final snapshot = event.snapshot;
        if (snapshot.value != null) {
          var map = snapshot.value as Map;
          // ignore: unnecessary_null_comparison
          if (map != null) {
            _profileUserModel = UserModel.fromJson(map);
            Utility.logEvent('get_profile_2', parameter: {});
          }
        }
        loading = false;
      });
    } catch (error) {
      loading = false;
      cprint(error, errorIn: 'getProfileUser');
    }
  }

  /// Follow / Unfollow user
  ///
  /// If `removeFollower` is true then remove user from follower list
  ///
  /// If `removeFollower` is false then add user to follower list
  followUser({bool removeFollower = false}) {
    /// `userModel` is user who is logged-in app.
    /// `profileUserModel` is user whoose profile is open in app.
    try {
      if (removeFollower) {
        /// If logged-in user `alredy follow `profile user then
        /// 1.Remove logged-in user from profile user's `follower` list
        /// 2.Remove profile user from logged-in user's `following` list
        profileUserModel.followersList!.remove(userModel.userId);

        /// Remove profile user from logged-in user's following list
        userModel.followingList!.remove(profileUserModel.userId);
        cprint('user removed from following list', event: 'remove_follow');
      } else {
        /// if logged in user is `not following` profile user then
        /// 1.Add logged in user to profile user's `follower` list
        /// 2. Add profile user to logged in user's `following` list
        profileUserModel.followersList ??= [];
        profileUserModel.followersList!.add(userModel.userId!);
        // Adding profile user to logged-in user's following list
        userModel.followingList ??= [];
        addFollowNotification();
        userModel.followingList!.add(profileUserModel.userId!);
      }
      // update profile user's user follower count
      profileUserModel.followers = profileUserModel.followersList!.length;
      // update logged-in user's following count
      userModel.following = userModel.followingList!.length;
      kDatabase
          .child('profile')
          .child(profileUserModel.userId!)
          .child('followerList')
          .set(profileUserModel.followersList);
      kDatabase
          .child('profile')
          .child(userModel.userId!)
          .child('followingList')
          .set(userModel.followingList);
      cprint('user added to following list', event: 'add_follow');

      notifyListeners();
    } catch (error) {
      cprint(error, errorIn: 'followUser');
    }
  }

  void addFollowNotification() {   // 
    // Sends notification to user who created tweet
    // UserModel owner can see notification on notification page
    kDatabase.child('notification').child(profileId).child(userId).set({
      'type': NotificationType.Follow.toString(),
      'createdAt': DateTime.now().toUtc().toString(),
      'data': UserModel(
              displayName: userModel.displayName,
              profilePic: userModel.profilePic,
              isVerified: userModel.isVerified,
              userId: userModel.userId,
              bio: userModel.bio == "Edit profile to update bio"
                  ? ""
                  : userModel.bio,
              userName: userModel.userName)
          .toJson()
    });
  }

  /// Trigger when logged-in user's profile change or updated
  /// Firebase event callback for profile update
  void _onProfileChanged(DatabaseEvent event) {
    final updatedUser = UserModel.fromJson(event.snapshot.value as Map);
    if (updatedUser.userId == profileId) {
      _profileUserModel = updatedUser;
    }
    notifyListeners();
  }

  @override
  void dispose() {
    // _profileQuery!.onValue.drain();
    // profileSubscription.cancel();
    super.dispose();
  }
}
