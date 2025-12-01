import 'package:app/pages/civic_issue_complaint.dart';
import 'package:app/pages/traffic_complaint.dart';
import 'package:flutter/material.dart';
import 'package:app/pages/civic_issue_select.dart';
import 'package:app/pages/login.dart';
import 'package:app/services/auth_service.dart';
import 'package:app/providers/auth_provider.dart';
import 'package:app/providers/location_provider.dart';
import 'package:provider/provider.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (context) => AuthProvider()),
        ChangeNotifierProvider(create: (context) => LocationProvider()),
      ],
      child: MaterialApp(
        debugShowCheckedModeBanner: false,
        home: AuthCheck(),
        routes: {
          "/civic_issue_complaint": (context) => const CivicIssueComplaint(),
          "/traffic_complaint": (context) => const TrafficComplaint(),
        },
      ),
    );
  }
}

class AuthCheck extends StatefulWidget {
  const AuthCheck({super.key});

  @override
  State<AuthCheck> createState() => _AuthCheckState();
}

class _AuthCheckState extends State<AuthCheck> {
  @override
  void initState() {
    super.initState();
    // AuthProvider will automatically check auth status and fetch user profile
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<AuthProvider>(
      builder: (context, authProvider, child) {
        if (authProvider.isLoading) {
          return const Scaffold(
            body: Center(
              child: CircularProgressIndicator(),
            ),
          );
        }

        return authProvider.isAuthenticated ? CivicIssueSelect() : LoginPage();
      },
    );
  }
}
