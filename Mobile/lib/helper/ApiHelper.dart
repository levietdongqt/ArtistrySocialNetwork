import 'dart:collection';
import 'dart:convert';

import 'package:flutter_twitter_clone/dto/responseObject.dart';
import 'package:flutter_twitter_clone/helper/enum.dart';
import 'package:flutter_twitter_clone/helper/shared_prefrence_helper.dart';
import 'package:flutter_twitter_clone/helper/utility.dart';
import 'package:flutter_twitter_clone/ui/page/common/locator.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_twitter_clone/myModel/myPost.dart';
class ApiHelper {
  static String _scheme = 'http';
  static String _host = '10.0.2.2';
  static int _port = 8060;
  late String path;
  late String? body;
  late String? method;
  late ServerDestination destination;

  ApiHelper({
    required this.method,
    required this.path,
    this.body,
    required this.destination,
  });

  static Future<ResponseObject> callApi(HttpMethod method, String path,
      String? jsonBody, ServerDestination destination,bool isAuth) async {
    if (destination == ServerDestination.Realtime_Service) {
      path = '/api/realtime${path}';
    } else {
      path = '/api/main${path}';
    }
    Map<String, String> headers = HashMap();
    headers['Content-Type'] = 'application/json';
    if(isAuth){
      String? accessToken = await getIt<SharedPreferenceHelper>().getAccessToken();
      headers['Authorization'] = 'Bearer ${accessToken}';
    }
    headers['Accept'] = 'application/json';
    var url = Uri(scheme: _scheme, host: _host, port: _port, path: path);
    var response;
    try {
      switch (method) {
        case HttpMethod.GET:
          response = await http.get(url, headers: headers);
          break;
        case HttpMethod.POST:
          response = await http.post(url, body: jsonBody, headers: headers);
          break;
        case HttpMethod.PUT:
          response = await http.put(url, body: jsonBody, headers: headers);
          break;
        case HttpMethod.DELETE:
          response = await http.delete(url, body: jsonBody, headers: headers);
          break;
        default:
          throw Exception("Invalid Http method");
      }
      if (response.statusCode == 200) {
        final String decodedBody = utf8.decode(response.bodyBytes);
        final responseData = json.decode(decodedBody);
        ResponseObject responseObject = ResponseObject.fromJson(responseData,null);
        return responseObject;
      }
      throw Exception("ApiHelper: call api failed with status code: ${response.statusCode}");
    } catch (exception) {
      cprint(exception, errorIn: 'ApiHelper');
      return ResponseObject(status: 500, message: "ApiHelper: call api failed");
    }
  }
}
