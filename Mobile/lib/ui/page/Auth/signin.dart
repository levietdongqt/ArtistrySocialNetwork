import 'package:flutter/material.dart';
import 'package:flutter_twitter_clone/helper/enum.dart';
import 'package:flutter_twitter_clone/helper/utility.dart';
import 'package:flutter_twitter_clone/state/authState.dart';
import 'package:flutter_twitter_clone/ui/page/Auth/widget/googleLoginButton.dart';
import 'package:flutter_twitter_clone/ui/page/homePage.dart';
import 'package:flutter_twitter_clone/ui/theme/theme.dart';
import 'package:flutter_twitter_clone/widgets/customFlatButton.dart';
import 'package:flutter_twitter_clone/widgets/customWidgets.dart';
import 'package:flutter_twitter_clone/widgets/newWidget/customLoader.dart';
import 'package:provider/provider.dart';

class SignIn extends StatefulWidget {
  final VoidCallback? loginCallback;

  const SignIn({Key? key, this.loginCallback}) : super(key: key);

  @override
  State<StatefulWidget> createState() => _SignInState();
}

class _SignInState extends State<SignIn> {
  late TextEditingController _phoneController;
  late TextEditingController _passwordController;
  late CustomLoader loader;
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  void initState() {
    _phoneController = TextEditingController();
    _passwordController = TextEditingController();
    loader = CustomLoader();
    super.initState();
  }

  @override
  void dispose() {
    _phoneController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Widget _body(BuildContext context) {
    return SingleChildScrollView(
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 30),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.start,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: <Widget>[
            const SizedBox(height: 150),
            _entryField('Số điện thoại', controller: _phoneController),
            _entryField('Mật khẩu',
                controller: _passwordController, isPassword: true),
            _phoneLoginButton(context),
            const SizedBox(height: 20),
            _labelButton('Quên mật khẩu?', onPressed: () {
              Navigator.of(context).pushNamed('/ForgetPasswordPage');
            }),
            const Divider(
              height: 30,
            ),
            const SizedBox(
              height: 30,
            ),
            GoogleLoginButton(
              loginCallback: widget.loginCallback!,
              loader: loader,
            ),
            const SizedBox(height: 100),
          ],
        ),
      ),
    );
  }

  Widget _entryField(String hint,
      {required TextEditingController controller, bool isPassword = false}) {
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 15),
      decoration: BoxDecoration(
        color: Colors.grey.shade200,
        borderRadius: BorderRadius.circular(30),
      ),
      child: TextField(
        controller: controller,
        keyboardType: TextInputType.emailAddress,
        style: const TextStyle(
          fontStyle: FontStyle.normal,
          fontWeight: FontWeight.normal,
        ),
        obscureText: isPassword,
        decoration: InputDecoration(
          hintText: hint,
          border: InputBorder.none,
          focusedBorder: const OutlineInputBorder(
              borderRadius: BorderRadius.all(Radius.circular(30.0)),
              borderSide: BorderSide(color: Colors.blue)),
          contentPadding:
              const EdgeInsets.symmetric(vertical: 15, horizontal: 20),
        ),
      ),
    );
  }

  Widget _labelButton(String title, {Function? onPressed}) {
    return TextButton(
      onPressed: () {
        if (onPressed != null) {
          onPressed();
        }
      },
      child: Text(
        title,
        style: TextStyle(
            color: TwitterColor.dodgeBlue, fontWeight: FontWeight.bold),
      ),
    );
  }

  Widget _phoneLoginButton(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 35),
      child: CustomFlatButton(
        label: "Đăng nhập",
        onPressed: _phoneLogin,
        borderRadius: 30,
      ),
    );
  }

  void _phoneLogin() {
    var state = Provider.of<AuthState>(context, listen: false);
    if (state.isbusy) {
      return;
    }
    loader.showLoader(context);
    var isValid = Utility.validateCredentials(
        context, _phoneController.text, _passwordController.text);
    if (isValid) {
      var finalPhone = _phoneController.text[0] == '0'
          ? '+84${_phoneController.text.substring(1)}'
          : '+84${_phoneController.text}';
      state
          .signIn(finalPhone, _passwordController.text, context: context)
          .then((userId) {
        // if (state.user != null) {
        if (userId != null) {
          print("LOGIN OKE: ");
          loader.hideLoader();
          // Navigator.pop(context);
          widget.loginCallback!();
        } else {
          Utility.customSnackBar(context, 'Thông tin đăng nhập không hợp lệ!');
          cprint('Unable to login', errorIn: '_phoneLoginButton');
          loader.hideLoader();
        }
      });
    } else {
      loader.hideLoader();
    }
  }

  @override
  Widget build(BuildContext context) {
    var state = Provider.of<AuthState>(context, listen: false);
    return Scaffold(
      key: _scaffoldKey,
      appBar: AppBar(
        title: customText('Đăng nhập',
            context: context, style: const TextStyle(fontSize: 20)),
        centerTitle: true,
      ),
      body: state.authStatus == AuthStatus.NOT_LOGGED_IN ||
              state.authStatus == AuthStatus.NOT_DETERMINED
          ? _body(context)
          : const HomePage(),
    );
  }
}
