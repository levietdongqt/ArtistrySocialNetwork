import 'dart:collection';
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_twitter_clone/helper/enum.dart';
import 'package:flutter_twitter_clone/helper/utility.dart';
import 'package:flutter_twitter_clone/model/chatModel.dart';
import 'package:flutter_twitter_clone/myModel/MiniUser.dart';
import 'package:flutter_twitter_clone/myModel/MyConversation.dart';
import 'package:flutter_twitter_clone/myModel/myMessage.dart';
import 'package:flutter_twitter_clone/state/WebSocketState.dart';
import 'package:flutter_twitter_clone/state/authState.dart';
import 'package:flutter_twitter_clone/state/chats/chatState.dart';
import 'package:flutter_twitter_clone/ui/page/profile/widgets/circular_image.dart';
import 'package:flutter_twitter_clone/ui/theme/theme.dart';
import 'package:flutter_twitter_clone/widgets/url_text/customUrlText.dart';
import 'package:provider/provider.dart';

class ChatScreenPage extends StatefulWidget {
  const ChatScreenPage({
    Key? key,
  }) : super(key: key);

  @override
  _ChatScreenPageState createState() => _ChatScreenPageState();
}

class _ChatScreenPageState extends State<ChatScreenPage> {
  final messageController = TextEditingController();
  String? senderId;
  late String userImage;
  late HashMap<String,MiniUser> otherMembers;
  late ChatState state;
  late ScrollController _controller;
  late GlobalKey<ScaffoldState> _scaffoldKey;

  @override
  void dispose() {
    messageController.dispose();
    super.dispose();
  }

  @override
  void initState() {
    _scaffoldKey = GlobalKey<ScaffoldState>();
    _controller = ScrollController();
    final chatState = Provider.of<ChatState>(context, listen: false);
    final state = Provider.of<AuthState>(context, listen: false);
    final socketState = Provider.of<WebSocketState>(context, listen: false);
    otherMembers = HashMap<String,MiniUser>();
    chatState.otherMembers!.forEach((element) {
      otherMembers![element.id!] = element;
    });
    String payload = jsonEncode({
      "conversationId": chatState.currentConversation!.id,
      "senderId": state.myUser!.id!
    });
    socketState.stompClient
        ?.send(destination: "/app/chat.getConversation", body: payload);
    chatState.setIsChatScreenOpen = true;
    senderId = state.myUser!.id!;
    // chatState.databaseInit(chatState.chatUser!.userId!, state.userId);
    chatState.getChatDetailAsync();
    super.initState();
  }

  Widget _chatScreenBody() {
    final socketState = Provider.of<WebSocketState>(context);
    cprint("Length: ${socketState.myMessages?.length}",
        label: "chatScreenPage");
    if (socketState.myMessages == null || socketState.myMessages!.isEmpty) {
      return const Center(
        child: Text(
          'Hãy trò chuyện với nhau nào!',
          style: TextStyle(color: Colors.grey, fontWeight: FontWeight.bold),
        ),
      );
    }
    return ListView.builder(
      controller: _controller,
      shrinkWrap: true,
      reverse: true,
      physics: const BouncingScrollPhysics(),
      itemCount: socketState.myMessages!.length,
      itemBuilder: (context, index) =>
          chatMessage(socketState.myMessages![index]),
    );
  }

  Widget chatMessage(MyMessage message) {
    if (senderId == null) {
      return Container();
    }
    if (message.senderId == senderId) {
      return _message(message, true);
    } else {
      return _message(message, false);
    }
  }

  Widget _message(MyMessage message, bool isMyMessage) {
    return Column(
      crossAxisAlignment:
      isMyMessage ? CrossAxisAlignment.end : CrossAxisAlignment.start,
      mainAxisAlignment:
      isMyMessage ? MainAxisAlignment.end : MainAxisAlignment.start,
      children: <Widget>[
        Row(
          crossAxisAlignment: CrossAxisAlignment.end,
          children: <Widget>[
            const SizedBox(
              width: 15,
            ),
            isMyMessage
                ? const SizedBox()
                : CircleAvatar(
              backgroundColor: Colors.transparent,
              backgroundImage: customAdvanceNetworkImage(otherMembers[message.senderId]!.avatar!),
            ),
            Expanded(
              child: Container(
                alignment:
                isMyMessage ? Alignment.centerRight : Alignment.centerLeft,
                margin: EdgeInsets.only(
                  right: isMyMessage ? 10 : (context.width / 4),
                  top: 20,
                  left: isMyMessage ? (context.width / 4) : 10,
                ),
                child: Stack(
                  children: <Widget>[
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        borderRadius: getBorder(isMyMessage),
                        color: isMyMessage
                            ? TwitterColor.dodgeBlue
                            : TwitterColor.mystic,
                      ),
                      child: UrlText(
                        text: message.content!,
                        style: TextStyle(
                          fontSize: 16,
                          color:
                          isMyMessage ? TwitterColor.white : Colors.black,
                        ),
                        urlStyle: TextStyle(
                          fontSize: 16,
                          color: isMyMessage
                              ? TwitterColor.white
                              : TwitterColor.dodgeBlue,
                          decoration: TextDecoration.underline,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
        Padding(
          padding: const EdgeInsets.only(right: 10, left: 10),
          child: Text(
            Utility.getChatTime(message.sendTime!.toIso8601String()),
            style: Theme
                .of(context)
                .textTheme
                .bodySmall,
          ),
        )
      ],
    );
  }

  BorderRadius getBorder(bool myMessage) {
    return BorderRadius.only(
      topLeft: const Radius.circular(20),
      topRight: const Radius.circular(20),
      bottomRight:
      myMessage ? const Radius.circular(0) : const Radius.circular(20),
      bottomLeft:
      myMessage ? const Radius.circular(20) : const Radius.circular(0),
    );
  }

  Widget _bottomEntryField() {
    return Align(
      alignment: Alignment.bottomLeft,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.end,
        children: <Widget>[
          const Divider(
            thickness: 0,
            height: 1,
          ),
          TextField(
            onSubmitted: (val) async {
              submitMessage();
            },
            controller: messageController,
            decoration: InputDecoration(
              contentPadding:
              const EdgeInsets.symmetric(horizontal: 10, vertical: 13),
              alignLabelWithHint: true,
              hintText: 'Tin nhắn mới ...',
              suffixIcon: IconButton(
                  icon: const Icon(Icons.send), onPressed: submitMessage),
            ),
          ),
        ],
      ),
    );
  }

  Future<bool> _onWillPop() async {
    state.setIsChatScreenOpen = false;
    state.onChatScreenClosed();
    return true;
  }

  void submitMessage() {
    if (messageController.text.isEmpty) {
      return;
    }

    var socketState = Provider.of<WebSocketState>(context, listen: false);
    var authState = Provider.of<AuthState>(context, listen: false);

    MyMessage message = MyMessage(
      content: messageController.text,
      sendTime: DateTime.now(),
      senderId: authState.myUser!.id!,
      seen: false,
      conversationId: state.currentConversation!.id,
      type: 'html',
    );

    var updatedMembers = state.currentConversation!.members.map((member) {
      member.notSeen = member.id != authState.myUser!.id;
      return member;
    },).toList();

    String payload = jsonEncode({
      "members": updatedMembers,
      "name": state.currentConversation!.name,
      "id": state.currentConversation!.id,
      "type": state.currentConversation!.type?.name,
      "messages": [message],
    });
    socketState.stompClient!.send(destination: "/app/chat.sendPrivate",body: payload);

    Future.delayed(const Duration(milliseconds: 50)).then((_) {
      messageController.clear();
    });
    try {
      if (state.messageList != null &&
          state.messageList!.length > 1 &&
          _controller.offset > 0) {
        _controller.animateTo(
          0.0,
          curve: Curves.easeOut,
          duration: const Duration(milliseconds: 300),
        );
      }
    } catch (e) {
      print("[Error] $e");
    }
  }

  @override
  Widget build(BuildContext context) {
    state = Provider.of<ChatState>(context, listen: false);
    // userImage = state.myChatUser!.avatar!;
    return WillPopScope(
      onWillPop: _onWillPop,
      child: Scaffold(
        key: _scaffoldKey,
        appBar: AppBar(
          title: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              UrlText(
                text: state.currentConversation!.name ?? state.otherMembers![0].nickname as String,
                style: const TextStyle(
                    color: Colors.black87,
                    fontSize: 20,
                    fontWeight: FontWeight.bold),
              ),
              // Text(
              //   state.myChatUser!.nickname,
              //   style: const TextStyle(color: AppColor.darkGrey, fontSize: 15),
              // )
            ],
          ),
          iconTheme: const IconThemeData(color: Colors.blue),
          backgroundColor: Colors.white,
          actions: <Widget>[
            IconButton(
                icon: const Icon(Icons.info, color: AppColor.primary),
                onPressed: () {
                  // Navigator.pushNamed(context, '/ConversationInformation');
                  Utility.customSnackBar(context, 'Tính năng đang phát triển !');

                })
          ],
        ),
        body: SafeArea(
          child: Stack(
            children: <Widget>[
              Align(
                alignment: Alignment.topRight,
                child: Padding(
                  padding: const EdgeInsets.only(bottom: 50),
                  child: _chatScreenBody(),
                ),
              ),
              _bottomEntryField()
            ],
          ),
        ),
      ),
    );
  }
}
