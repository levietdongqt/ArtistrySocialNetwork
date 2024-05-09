// ignore_for_file: avoid_print

import 'dart:async';
import 'dart:developer' as developer;

import 'package:firebase_analytics/firebase_analytics.dart';
import 'package:firebase_database/firebase_database.dart';
import 'package:firebase_dynamic_links/firebase_dynamic_links.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_twitter_clone/myModel/myUser.dart';
import 'package:intl/intl.dart';
import 'package:share_plus/share_plus.dart';
import 'package:url_launcher/url_launcher.dart';

import '../widgets/newWidget/customLoader.dart';

final kAnalytics = FirebaseAnalytics.instance;
final DatabaseReference kDatabase = FirebaseDatabase.instance.ref();
final kScreenLoader = CustomLoader();

void cprint(dynamic data,
    {String? errorIn, String? event, String label = 'Log'}) {
  /// Print logs only in development mode
  if (kDebugMode) {
    if (errorIn != null) {
      print(
          '****************************** error in cprint ******************************');
      developer.log('[Error]', error: data, name: errorIn);
      print(
          '****************************** error in cprint ******************************');
    } else if (data != null) {
      print(
          '****************************** LOG in cprint ******************************');
      developer.log(data, name: label);
    }
    if (event != null) {
      Utility.logEvent(event, parameter: {});
    }
  }
}

class Utility {
  static String getPostTime2(String? date) {
    if (date == null || date.isEmpty) {
      return '';
    }
    var dt = DateTime.parse(date).toLocal();
    var dat =
        DateFormat.jm().format(dt) + ' - ' + DateFormat("dd MMM yy").format(dt);
    return dat;
  }

  static String getDob(String? date) {
    if (date == null || date.isEmpty) {
      return '';
    }
    var dt = DateTime.parse(date).toLocal();
    var dat = DateFormat.yMMMd().format(dt);
    return dat;
  }

  static String getJoiningDate(String? date) {
    if (date == null || date.isEmpty) {
      return '';
    }
    var dt = DateTime.parse(date).toLocal();
    var dat = DateFormat("MMMM yyyy").format(dt);
    return 'Joined $dat';
  }

  static String getChatTime(String? date) {
    if (date == null || date.isEmpty) {
      return '';
    }
    String msg = '';
    var dt = DateTime.parse(date).toLocal();

    // if (DateTime.now().toLocal().isBefore(dt)) {
    //   return DateFormat.jm().format(DateTime.parse(date).toLocal()).toString();
    // }
    final DateFormat formatter1 = DateFormat('dd/MM/yyyy');
    final DateFormat formatter2 = DateFormat('dd/MM');

    var dur = DateTime.now().toLocal().difference(dt);
    if (dur.inDays > 365) {
      msg = formatter1.format(dt);
    } else if (dur.inDays > 30) {
      msg = formatter2.format(dt);
    } else if (dur.inDays > 0) {
      msg = '${dur.inDays} ngày';
    } else if (dur.inHours > 0) {
      String minus  = dt.minute<10 ? '0${dt.minute}' : dt.minute.toString();
      String hour = dt.hour<10 ? '0${dt.hour}': dt.hour.toString();
      msg = '${hour}:${minus}';
    }else if(dur.inMinutes > 1){
      msg = '${dur.inMinutes} phút';
    }
    else {
      msg = 'Hiện tại';
    }
    return msg;
  }

  static String getPollTime(String date) {
    int hr, mm;
    String msg = 'Poll ended';
    var endDate = DateTime.parse(date);
    if (DateTime.now().isAfter(endDate)) {
      return msg;
    }
    msg = 'Poll ended in';
    var dur = endDate.difference(DateTime.now());
    hr = dur.inHours - dur.inDays * 24;
    mm = dur.inMinutes - (dur.inHours * 60);
    if (dur.inDays > 0) {
      msg = ' ' + dur.inDays.toString() + (dur.inDays > 1 ? ' Days ' : ' Day');
    }
    if (hr > 0) {
      msg += ' ' + hr.toString() + ' hour';
    }
    if (mm > 0) {
      msg += ' ' + mm.toString() + ' min';
    }
    return (dur.inDays).toString() +
        ' Days ' +
        ' ' +
        hr.toString() +
        ' Hours ' +
        mm.toString() +
        ' min';
  }

  static String? getSocialLinks(String? url) {
    if (url != null && url.isNotEmpty) {
      url = url.contains("https://www") || url.contains("http://www")
          ? url
          : url.contains("www") &&
                  (!url.contains('https') && !url.contains('http'))
              ? 'https://' + url
              : 'https://www.' + url;
    } else {
      return null;
    }
    cprint('Launching URL : $url');
    return url;
  }

  static launchURL(String url) async {
    if (url == "") {
      return;
    }
    final uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) {
      await launchUrl(
        Uri.parse(url),
        mode: LaunchMode.externalApplication,
      );
    } else {
      cprint('Could not launch $url');
    }
  }

  static void logEvent(String event, {Map<String, dynamic>? parameter}) {
    kReleaseMode
        ? kAnalytics.logEvent(name: event, parameters: parameter)
        : print("[EVENT]: $event");
  }

  static void debugLog(String log, {dynamic param = ""}) {
    final String time = DateFormat("mm:ss:mmm").format(DateTime.now());
    print("[$time][Log]: $log, $param");
  }

  static void share(String message, {String? subject}) {
    Share.share(message, subject: subject);
  }

  static List<String> getHashTags(String text) {
    RegExp reg = RegExp(
        r"([#])\w+|(https?|ftp|file|#)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]*");
    Iterable<Match> _matches = reg.allMatches(text);
    List<String> resultMatches = <String>[];
    for (Match match in _matches) {
      if (match.group(0)!.isNotEmpty) {
        var tag = match.group(0);
        resultMatches.add(tag!);
      }
    }
    return resultMatches;
  }

  static String getUserName({
    required String id,
    required String name,
  }) {
    String userName = '';
    if (name.length > 15) {
      name = name.substring(0, 6);
    }
    name = name.split(' ')[0];
    id = id.substring(0, 4).toLowerCase();
    userName = '@$name$id';
    return userName;
  }

  static bool validateCredentials(
      BuildContext context, String? email, String? password) {
    if (email == null || email.isEmpty) {
      customSnackBar(context, 'Vui lòng nhập số điện thoại!');
      return false;
    } else if (password == null || password.isEmpty) {
      customSnackBar(context, 'Vui lòng nhập mật khẩu!');
      return false;
    } else if (password.length < 6) {
      customSnackBar(context, 'Mật khẩu tối thiểu 6 kí tự! ');
      return false;
    }

    var status = validatePhone(email);
    if (!status) {
      customSnackBar(context, 'Vui lòng nhập đúng định dạng số điện thoại');
      return false;
    }
    return true;
  }

  static customSnackBar(BuildContext context, String msg,
      {double height = 30, Color backgroundColor = Colors.black}) {
    ScaffoldMessenger.of(context).hideCurrentSnackBar();
    final snackBar = SnackBar(
      backgroundColor: backgroundColor,
      content: Text(
        msg,
        style: const TextStyle(
          color: Colors.white,
        ),
      ),
    );
    ScaffoldMessenger.of(context).showSnackBar(snackBar);
  }

  static bool validatePhone(String phone) {
    String p = r'(^0\d{9}$)|(^[1-9][0-9]{8}$)';

    RegExp regExp = RegExp(p);

    var status = regExp.hasMatch(phone);
    return status;
  }

  static Future<Uri> createLinkToShare(BuildContext context, String id,
      {required SocialMetaTagParameters socialMetaTagParameters}) async {
    final DynamicLinkParameters parameters = DynamicLinkParameters(
      uriPrefix: 'https://fwitter.page.link',
      link: Uri.parse('https://twitter.com/$id'),
      androidParameters: AndroidParameters(
        packageName: 'com.thealphamerc.flutter_twitter_clone_dev',
        minimumVersion: 0,
      ),
      socialMetaTagParameters: socialMetaTagParameters,
    );
    Uri url;
    final ShortDynamicLink shortLink =
        await FirebaseDynamicLinks.instance.buildShortLink(parameters);
    url = shortLink.shortUrl;
    return url;
  }

  static createLinkAndShare(BuildContext context, String id,
      {required SocialMetaTagParameters socialMetaTagParameters}) async {
    var url = await createLinkToShare(context, id,
        socialMetaTagParameters: socialMetaTagParameters);

    share(url.toString(), subject: "Tweet");
  }

  static shareFile(List<String> path, {String text = ""}) {
    try {
      final files = path.map((path) => XFile(path)).toList();
      Share.shareXFiles(files, text: text);
    } catch (error) {
      print(error);
    }
  }

  static void copyToClipBoard({
    required BuildContext context,
    required String text,
    required String message,
  }) {
    var data = ClipboardData(text: text);
    Clipboard.setData(data);
    customSnackBar(context, message);
  }

  static Locale getLocale(BuildContext context) {
    return Localizations.localeOf(context);
  }

  static MyUser mapperUser(MyUser source, MyUser destination) {
    destination.id = source.id;
    destination.fullName = source.fullName;
    destination.email = source.email;
    destination.status = source.status;
    destination.email = source.email;
    destination.accent = source.accent;
    destination.bio = source.bio;
    destination.coverImage = source.coverImage;
    destination.dateOfBirth = source.dateOfBirth;
    destination.password = source.password;
    destination.gender = source.gender;
    destination.verified = source.verified;
    destination.roles = source.roles;
    return destination;
  }
}
