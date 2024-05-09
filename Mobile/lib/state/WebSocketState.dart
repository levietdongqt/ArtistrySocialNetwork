import 'dart:async';
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_twitter_clone/helper/utility.dart';
import 'package:stomp_dart_client/stomp_dart_client.dart';

class WebSocketState extends ChangeNotifier {
  StompClient? stompClient;
  initWebSocket(String token) {
    stompClient = StompClient(
      config: StompConfig(
        url: 'ws://10.0.2.2:8060/api/realtime/socket.io',
        onConnect: onConnect,
        beforeConnect: () async {
          cprint('waiting to connect...', label: "WEBSOCKET");
          await Future.delayed(const Duration(milliseconds: 200));
          print('connecting...');
        },
        onWebSocketError: (dynamic error) =>
            cprint(error.toString(), errorIn: "WEBSOCKET ERROR: "),
        stompConnectHeaders: {'Authorization': 'Bearer ${token}'},
        webSocketConnectHeaders: {'Authorization': 'Bearer ${token}'},
      ),
    );
    stompClient!.activate();
  }

  void onConnect(StompFrame frame) {
    cprint("CONNECTED IN ONCONNECT", errorIn: "WEBSOCKET");
    stompClient!.subscribe(
      destination: '/topic/test/subscription',
      callback: (frame) {
        List<dynamic>? result = json.decode(frame.body!);
        print(result);
      },
    );

    // Timer.periodic(const Duration(seconds: 10), (_) {
    //   stompClient!.send(
    //     destination: '/app/test/endpoints',
    //     body: json.encode({'a': 123}),
    //   );
    // });
  }
}
