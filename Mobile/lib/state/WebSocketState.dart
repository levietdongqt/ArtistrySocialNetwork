import 'dart:async';
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_twitter_clone/helper/enum.dart';
import 'package:flutter_twitter_clone/helper/utility.dart';
import 'package:flutter_twitter_clone/myModel/MyConversation.dart';
import 'package:flutter_twitter_clone/myModel/MyNotification.dart';
import 'package:flutter_twitter_clone/myModel/myMessage.dart';
import 'package:flutter_twitter_clone/myModel/responseSocket.dart';
import 'package:stomp_dart_client/stomp_dart_client.dart';

class WebSocketState extends ChangeNotifier {
  StompClient? stompClient;

  List<MyConversation>? myConversations = <MyConversation>[];
  List<MyMessage>? myMessages = <MyMessage>[];
  List<MyNotification>? myNotifications = <MyNotification>[];
  

  initWebSocket(String token) {
    stompClient = StompClient(
      config: StompConfig(
        url: 'ws://10.0.2.2:8060/api/realtime/socket.io',
        onConnect: onConnect,
        beforeConnect: () async {
          cprint('waiting to connect...', label: "WEBSOCKET");
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
    cprint("Websocket CONNECTED !", errorIn: "WebSocketState");
    stompClient!.subscribe(
      destination: '/user/chat/message',
      callback: (frame) {
        var result = ResponseSocket.fromJson(json.decode(frame.body!));
        cprint("socketCallBack: ${result.type}", label: "WebSocketState");
        if (result.data == null || result.data.length == 0) {
          cprint("socketCallBack is null: ${result.type}",
              label: "WebSocketState");
          return;
        }
        switch (result.type) {
          case ResponseSocketType.SEND_MESSAGE:
            var conversation = MyConversation.fromJson(result.data);
            myMessages!.insert(0, conversation.lastMessage!);

            int index = myConversations!.indexWhere((item) => item.id == conversation.id);
            if(index == -1) {
              myConversations!.add(conversation);
            }else{
              myConversations![index] = conversation;
            }
            myConversations!.sort((a, b) => a.updateAt!.isAfter(b.updateAt!)? 0: 1);
            notifyListeners();
            break;

          case ResponseSocketType.SEEN_FLAG:
            notifyListeners();
            break;

          case ResponseSocketType.GET_CONVERSATION:
            var list = result.data as List<dynamic>?;
            myMessages = <MyMessage>[];
            list?.forEach((message) {
              myMessages?.add(MyMessage.fromJson(message));
            });
            if (myMessages!.length > 1) {
              myMessages!
                  .sort((a, b) => a.sendTime!.isAfter(b.sendTime!) ? 0 : 1);
            }
            cprint("GET_CONVERSATION: ${myMessages?.length}",
                label: "WebsocketState");
            notifyListeners();
            break;

          default:
            break;
        }
      },
    );

    stompClient!.subscribe(
      destination: '/user/topic/private-notification', 
      callback: (frame){
         var notification = MyNotification.fromJson(json.decode(frame.body!));
         myNotifications!.insert(0,notification);
         notifyListeners();
         return;
      });

  }

  void disconnect() {
    stompClient!.deactivate();
    cprint("Websocket disconnected", event: "Websocket");
  }
}
