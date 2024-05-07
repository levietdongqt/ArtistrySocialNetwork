import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:flutter_twitter_clone/helper/utility.dart';
import 'package:flutter_twitter_clone/myModel/myUser.dart';
import 'package:flutter_twitter_clone/state/WebSocketState.dart';
import 'package:flutter_twitter_clone/state/suggestionUserState.dart';
import 'package:get_it/get_it.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';

import 'package:flutter_twitter_clone/state/searchState.dart';
import 'package:flutter_twitter_clone/ui/page/common/locator.dart';
import 'package:flutter_twitter_clone/ui/theme/theme.dart';
import 'package:stomp_dart_client/stomp_dart_client.dart';

import 'helper/routes.dart';
import 'state/appState.dart';
import 'state/authState.dart';
import 'state/chats/chatState.dart';
import 'state/feedState.dart';
import 'state/notificationState.dart';

StompClient? stompClient;
String token = 'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJST0xFX1VTRVIiXSwiaWQiOiJlMzJhN2ExYy05OGUyLTQ5OGMtOTdlMi02NTQwNGU0ZmQzNTYiLCJzdGF0dXMiOiJBQ1RJVkVEIiwic3ViIjoiYm90aGFuZ2JhbnF0QGdtYWlsLmNvbSIsImlhdCI6MTcxNTAxODk2MywiZXhwIjoxNzE1MDIyNTYzfQ.M8qaSIWrzCypEVt99j68nn5L-D_xVdf9aIta6zdEYL8';

void main() async {
  // GetIt locator = GetIt.instance;
  // setupLocator(locator);
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  setupDependencies();


  runApp(const MyApp());
}


// void setupLocator(GetIt locator) {
//   locator.registerSingleton<MyUser>(MyUser());
// }
class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider<AppState>(create: (_) => AppState()),
        ChangeNotifierProvider<AuthState>(create: (_) => AuthState()),
        ChangeNotifierProvider<FeedState>(create: (_) => FeedState()),
        ChangeNotifierProvider<ChatState>(create: (_) => ChatState()),
        ChangeNotifierProvider<SearchState>(create: (_) => SearchState()),
        ChangeNotifierProvider<WebSocketState>(create: (_) => WebSocketState()),
        ChangeNotifierProvider<NotificationState>(
            create: (_) => NotificationState()),
        ChangeNotifierProvider<SuggestionsState>(
            create: (_) => SuggestionsState()),
      ],
      child: MaterialApp(
        title: 'SnapConnect',
        theme: AppTheme.appTheme.copyWith(
          textTheme: GoogleFonts.mulishTextTheme(
            Theme.of(context).textTheme,
          ),
        ),
        debugShowCheckedModeBanner: false,
        routes: Routes.route(),
        onGenerateRoute: (settings) => Routes.onGenerateRoute(settings),
        onUnknownRoute: (settings) => Routes.onUnknownRoute(settings),
        initialRoute: "SplashPage",
      ),
    );
  }
}
