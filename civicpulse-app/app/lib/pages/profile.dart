import 'package:app/constants.dart';
import 'package:flutter/material.dart';
import 'package:app/services/auth_service.dart';
import 'package:app/pages/login.dart';
import 'package:app/providers/auth_provider.dart';
import 'package:provider/provider.dart';

class ProfilePageContents extends StatefulWidget {
  const ProfilePageContents({super.key});

  @override
  State<ProfilePageContents> createState() => _ProfilePageContentsState();
}

class _ProfilePageContentsState extends State<ProfilePageContents> {
  Future<void> _logout() async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    await authProvider.logout();
    if (!mounted) return;

    Navigator.of(context).pushAndRemoveUntil(
      MaterialPageRoute(builder: (_) => LoginPage()),
      (route) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<AuthProvider>(
      builder: (context, authProvider, child) {
        return SafeArea(
          child: Container(
            color: greyColor,
            width: MediaQuery.of(context).size.width,
            child: Padding(
              padding: const EdgeInsets.all(12.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    mainAxisAlignment: MainAxisAlignment.start,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Padding(
                        padding: const EdgeInsets.all(20),
                        child: const CircleAvatar(
                          radius: 50,
                          backgroundImage: AssetImage("assets/profile.png"),
                        ),
                      ),
                      Text(
                        authProvider.userName,
                        style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          color: darkGreyColor,
                        ),
                      ),
                      Text(
                        authProvider.userEmail,
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: darkGreyColor,
                        ),
                      ),
                      if (authProvider.userPhone.isNotEmpty)
                        Padding(
                          padding: const EdgeInsets.only(top: 8.0),
                          child: Text(
                            authProvider.userPhone,
                            style: TextStyle(
                              fontSize: 16,
                              color: darkGreyColor,
                            ),
                          ),
                        ),
                    ],
                  ),
              Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.start,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    GestureDetector(
                      onTap: _logout,
                      child: Container(
                        width: MediaQuery.of(context).size.width * 0.6,
                        height: 45,
                        decoration: BoxDecoration(
                          color: Colors.white,
                          border: Border.all(
                            color: redColor.withValues(alpha: 0.5),
                            width: 2,
                          ),
                          borderRadius: BorderRadius.circular(10),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.grey.withValues(alpha: 0.7),
                              spreadRadius: 2,
                              blurRadius: 7,
                              offset: const Offset(0, 1),
                            ),
                          ],
                        ),
                        child: Center(
                          child: Text(
                            "Sign out",
                            style: TextStyle(
                              color: redColor,
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                              letterSpacing: 1,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}
