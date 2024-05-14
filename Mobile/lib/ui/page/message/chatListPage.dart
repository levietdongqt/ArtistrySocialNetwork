import 'package:flutter/material.dart';
import 'package:flutter_twitter_clone/helper/constant.dart';
import 'package:flutter_twitter_clone/helper/utility.dart';
import 'package:flutter_twitter_clone/model/chatModel.dart';
import 'package:flutter_twitter_clone/model/user.dart';
import 'package:flutter_twitter_clone/myModel/MiniUser.dart';
import 'package:flutter_twitter_clone/myModel/MyConversation.dart';
import 'package:flutter_twitter_clone/myModel/myMessage.dart';
import 'package:flutter_twitter_clone/myModel/myUser.dart';
import 'package:flutter_twitter_clone/state/WebSocketState.dart';
import 'package:flutter_twitter_clone/state/authState.dart';
import 'package:flutter_twitter_clone/state/chats/chatState.dart';
import 'package:flutter_twitter_clone/state/searchState.dart';
import 'package:flutter_twitter_clone/ui/page/profile/profilePage.dart';
import 'package:flutter_twitter_clone/ui/page/profile/widgets/circular_image.dart';
import 'package:flutter_twitter_clone/ui/theme/theme.dart';
import 'package:flutter_twitter_clone/widgets/customAppBar.dart';
import 'package:flutter_twitter_clone/widgets/customWidgets.dart';
import 'package:flutter_twitter_clone/widgets/newWidget/customLoader.dart';
import 'package:flutter_twitter_clone/widgets/newWidget/emptyList.dart';
import 'package:flutter_twitter_clone/widgets/newWidget/rippleButton.dart';
import 'package:flutter_twitter_clone/widgets/newWidget/title_text.dart';
import 'package:provider/provider.dart';
import 'package:avatar_stack/avatar_stack.dart';

class ChatListPage extends StatefulWidget {
  final GlobalKey<ScaffoldState> scaffoldKey;

  const ChatListPage({Key? key, required this.scaffoldKey}) : super(key: key);

  @override
  _ChatListPageState createState() => _ChatListPageState();
}

class _ChatListPageState extends State<ChatListPage> {
  @override
  void initState() {
    final chatState = Provider.of<ChatState>(context, listen: false);
    final state = Provider.of<AuthState>(context, listen: false);
    chatState.setIsChatScreenOpen = true;
    // chatState.databaseInit(state.profileUserModel.userId,state.userId);
    chatState.getUserChatList(state.myUser!.id!, context);
    super.initState();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (mounted) context.read<SearchState>().resetFilterList();
  }

  Widget _body() {
    final state = Provider.of<ChatState>(context);
    final searchState = Provider.of<SearchState>(context, listen: false);
    final socketState = Provider.of<WebSocketState>(context, listen: true);
    final authState = Provider.of<AuthState>(context, listen: false);
    if (state.isLoading) {
      return CustomScreenLoader(
        height: double.infinity,
        width: double.infinity,
        backgroundColor: Colors.white,
      );
    }
    if (state.myChatUserList == null) {
      return const Padding(
        padding: EdgeInsets.symmetric(horizontal: 30),
        child: EmptyList(
          'Không có tin nhắn',
          subTitle: 'Khi ai đó gửi cho bạn tin nhắn, nó sẽ được hiển thị ở đây',
        ),
      );
    } else {
      return ListView.separated(
        physics: const BouncingScrollPhysics(),
        itemCount: socketState.myConversations!.length,
        // itemBuilder: (context, index) => _userCard(
        //   searchState.userlist!.firstWhere(
        //     (x) => x.userId == state.chatUserList![index].key,
        //     orElse: () => UserModel(userName: "Unknown"),
        //   ),
        //   state.chatUserList![index],
        // ),
        itemBuilder: (context, index) => _myUserCard(
          socketState.myConversations![index].members
              .where((member) => member.id != authState.myUser!.id!)
              .toList(),
          socketState.myConversations![index].lastMessage,
          socketState.myConversations![index],
        ),
        separatorBuilder: (context, index) {
          return const Divider(
            height: 0,
          );
        },
      );
    }
  }

  Widget _userCard(UserModel model, ChatMessage? lastMessage) {
    return Container(
      color: Colors.white,
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 10),
        onTap: () {
          final chatState = Provider.of<ChatState>(context, listen: false);
          final searchState = Provider.of<SearchState>(context, listen: false);
          chatState.setChatUser = model;
          if (searchState.userlist!.any((x) => x.userId == model.userId)) {
            chatState.setChatUser = searchState.userlist!
                .where((x) => x.userId == model.userId)
                .first;
          }
          Navigator.pushNamed(context, '/ChatScreenPage');
        },
        leading: RippleButton(
          onPressed: () {
            Navigator.push(
                context, ProfilePage.getRoute(profileId: model.userId!));
          },
          borderRadius: BorderRadius.circular(28),
          child: Container(
            height: 56,
            width: 56,
            decoration: BoxDecoration(
              border: Border.all(color: Colors.white, width: 2),
              borderRadius: BorderRadius.circular(28),
              image: DecorationImage(
                  image: customAdvanceNetworkImage(
                    model.profilePic ?? Constants.dummyProfilePic,
                  ),
                  fit: BoxFit.cover),
            ),
          ),
        ),
        title: TitleText(
          model.displayName ?? "NA",
          fontSize: 16,
          fontWeight: FontWeight.w800,
          overflow: TextOverflow.ellipsis,
        ),
        subtitle: customText(
          getLastMessage(lastMessage?.message) ?? '@${model.displayName}',
          style:
              TextStyles.onPrimarySubTitleText.copyWith(color: Colors.black54),
          maxLines: 2,
          overflow: TextOverflow.ellipsis,
        ),
        trailing: lastMessage == null
            ? const SizedBox.shrink()
            : Text(
                Utility.getChatTime(lastMessage.createdAt).toString(),
                style: TextStyles.onPrimarySubTitleText.copyWith(
                  color: Colors.black54,
                  fontSize: 12,
                ),
              ),
      ),
    );
  }

  Widget _myUserCard(List<MiniUser> otherMembers, MyMessage? lastMessage,
      MyConversation currentCon) {
    return Container(
      color: Colors.white,
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 10),
        onTap: () {
          final chatState = Provider.of<ChatState>(context, listen: false);
          final searchState = Provider.of<SearchState>(context, listen: false);
          chatState.setOtheMembers = otherMembers;
          chatState.currentConversation = currentCon;
          // if (searchState.userlist!.any((x) => x.userId == model.userId)) {
          //   chatState.setChatUser = searchState.userlist!
          //       .where((x) => x.userId == model.userId)
          //       .first;
          // }
          Navigator.pushNamed(context, '/ChatScreenPage');
        },
        leading: RippleButton(
          onPressed: () {
            final chatState = Provider.of<ChatState>(context, listen: false);
            final searchState = Provider.of<SearchState>(context, listen: false);
            chatState.setOtheMembers = otherMembers;
            chatState.currentConversation = currentCon;
            Navigator.pushNamed(context, '/ChatScreenPage');

          },
          borderRadius: BorderRadius.circular(28),
          child: otherMembers.length == 1
              ? Container(
                height: 56,
                width: 60,
                decoration: BoxDecoration(
                  border: Border.all(color: Colors.white, width: 2),
                  borderRadius: BorderRadius.circular(28),
                  image: DecorationImage(
                      image: customAdvanceNetworkImage(
                        otherMembers[0].avatar ?? Constants.dummyProfilePic,
                      ),
                      fit: BoxFit.cover),
                ),
              )
              : AvatarStack(
                  height: 30,
                  width: 60,
                  avatars: [
                    for (var n = 0; n < otherMembers.length; n++)
                      NetworkImage(otherMembers[n].avatar!),
                    // NetworkImage(model.avatar!),
                  ],
                ),
        ),
        title: TitleText(
          currentCon.name ?? otherMembers[0].nickname as String,
          fontSize: 16,
          fontWeight: FontWeight.w800,
          overflow: TextOverflow.ellipsis,
        ),
        subtitle: customText(
          getLastMessage(lastMessage?.content) ?? 'Bắt đầu trò chuyện nào!',
          style:
              TextStyles.onPrimarySubTitleText.copyWith(color: Colors.black54),
          maxLines: 2,
          overflow: TextOverflow.ellipsis,
        ),
        trailing: lastMessage == null
            ? const SizedBox.shrink()
            : Text(
                Utility.getChatTime(lastMessage.sendTime!.toIso8601String())
                    .toString(),
                style: TextStyles.onPrimarySubTitleText.copyWith(
                  color: Colors.black54,
                  fontSize: 12,
                ),
              ),
      ),
    );
  }

  FloatingActionButton _newMessageButton() {
    return FloatingActionButton(
      onPressed: () {
        Navigator.of(context).pushNamed('/NewMessagePage');
      },
      child: customIcon(
        context,
        icon: AppIcon.newMessage,
        isTwitterIcon: true,
        iconColor: Theme.of(context).colorScheme.onPrimary,
        size: 25,
      ),
    );
  }

  void onSettingIconPressed() {
    cprint("onSettingIconPressed", label: "ChatListPage");
    Navigator.pushNamed(context, '/DirectMessagesPage');
  }

  String? getLastMessage(String? message) {
    if (message != null && message.isNotEmpty) {
      if (message.length > 100) {
        message = message.substring(0, 80) + '...';
        return message;
      } else {
        return message;
      }
    }
    return null;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CustomAppBar(
        scaffoldKey: widget.scaffoldKey,
        title: customTitleText(
          'Tin nhắn',
        ),
        icon: AppIcon.settings,
        onActionPressed: onSettingIconPressed,
      ),
      floatingActionButton: _newMessageButton(),
      backgroundColor: TwitterColor.mystic,
      body: _body(),
    );
  }
}
