#ReadMe

-Các State giống Context ở nextjs
<h2>Kho lưu trữ như cookie ở helper/shared_prefrence_helper.dart</h2>
Lệnh gọi ra currentUser: await  getIt<SharedPreferenceHelper>().getUserProfile()

<h2>Ví dụ điều hướng sang trang con trong ui/page/Auth/selectAuthMethod.dart dòng 75</h2>
 var state = Provider.of<AuthState>(context, listen: false);
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) =>
                            SignIn(loginCallback: state.getCurrentUser),
                      ),
                    );

<h2> Để trở lại trang trước </h2>
      Navigator.pop(context);

<h2> Template call Api: helper/ApiHelper </h2>
Xem ví dụ ở /state/authState.dart dòng 102 (hàm signIn)

<h2> Không dùng print để log </h2>
Dùng: cprint(messgage, errorIn: 'errorLabel') 
      cprint(messgage, label: 'Label');


 


