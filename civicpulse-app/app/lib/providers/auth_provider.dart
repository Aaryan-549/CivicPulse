import 'package:flutter/material.dart';
import '../models/user_model.dart';
import '../services/auth_service.dart';

class AuthProvider with ChangeNotifier {
  final AuthService _authService = AuthService();
  User? _user;
  bool _isAuthenticated = false;
  bool _isLoading = true;

  User? get user => _user;
  bool get isAuthenticated => _isAuthenticated;
  bool get isLoading => _isLoading;

  AuthProvider() {
    checkAuthStatus();
  }

  Future<void> checkAuthStatus() async {
    _isLoading = true;
    notifyListeners();

    try {
      _isAuthenticated = await _authService.isLoggedIn();
      
      if (_isAuthenticated) {
        try {
          final profileData = await _authService.getUserProfile();
          _user = User.fromJson(profileData);
        } catch (e) {
          // If profile fetch fails, clear auth state to force re-login
          print('Failed to fetch user profile: $e');
          await _authService.logout();
          _isAuthenticated = false;
          _user = null;
        }
      }
    } catch (e) {
      print('Error checking auth status: $e');
      _isAuthenticated = false;
      _user = null;
    }
    
    _isLoading = false;
    notifyListeners();
  }

  Future<Map<String, dynamic>> register(String name, String email, String phone, String password) async {
    try {
      final result = await _authService.register(name, email, phone, password);
      if (result['success']) {
        _user = result['user'];
        _isAuthenticated = true;
        notifyListeners();
      }
      return result;
    } catch (e) {
      print('Register error: $e');
      return {'success': false, 'message': 'Connection error. Please check your internet connection.'};
    }
  }

  Future<Map<String, dynamic>> login(String email, String password) async {
    try {
      final result = await _authService.login(email, password);
      if (result['success']) {
        _user = result['user'];
        _isAuthenticated = true;
        
        // Fetch complete user profile
        try {
          final profileData = await _authService.getUserProfile();
          _user = User.fromJson(profileData);
        } catch (e) {
          print('Failed to fetch user profile after login: $e');
          // Still consider login successful even if profile fetch fails
        }
        
        notifyListeners();
      }
      return result;
    } catch (e) {
      print('Login error: $e');
      return {'success': false, 'message': 'Connection error. Please check your internet connection.'};
    }
  }

  Future<void> logout() async {
    await _authService.logout();
    _user = null;
    _isAuthenticated = false;
    notifyListeners();
  }

  void setUser(User user) {
    _user = user;
    _isAuthenticated = true;
    notifyListeners();
  }

  String get userName => _user?.name ?? (_isLoading ? 'Loading...' : 'User');
  String get userEmail => _user?.email ?? (_isLoading ? 'Loading...' : 'Not connected');
  String get userPhone => _user?.phone ?? (_isLoading ? 'Loading...' : 'Not available');
}
