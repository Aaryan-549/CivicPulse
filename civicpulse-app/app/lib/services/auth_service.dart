import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../config/api_config.dart';
import '../models/user_model.dart';

class AuthService {
  final storage = const FlutterSecureStorage();

  // Helper method to retry API calls with different URLs
  Future<T> _retryWithDifferentUrls<T>(Future<T> Function() apiCall) async {
    ApiConfig.resetUrl(); // Start with first URL
    
    for (int i = 0; i < 5; i++) { // Try up to 5 different URLs
      try {
        print('Attempting connection to: ${ApiConfig.baseUrl}');
        return await apiCall();
      } catch (e) {
        print('Connection failed with ${ApiConfig.baseUrl}: $e');
        if (i < 4) { // Don't switch URL on last attempt
          ApiConfig.tryNextUrl();
          await Future.delayed(Duration(milliseconds: 500)); // Brief delay
        }
      }
    }
    
    throw Exception('Unable to connect to server. Please check your internet connection and ensure the backend server is running.');
  }

  Future<Map<String, dynamic>> register(String name, String email, String phone, String password) async {
    return await _retryWithDifferentUrls(() async {
      final response = await http.post(
        Uri.parse('${ApiConfig.authBase}/user/register'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'name': name,
          'email': email,
          'phone': phone,
          'password': password,
        }),
      ).timeout(Duration(seconds: ApiConfig.timeoutDuration));

      final data = jsonDecode(response.body);

      if (response.statusCode == 201 && data['success']) {
        await storage.write(key: 'token', value: data['data']['token']);
        await storage.write(key: 'userId', value: data['data']['user']['id']);
        return {'success': true, 'user': User.fromJson(data['data']['user'])};
      } else {
        return {'success': false, 'message': data['message'] ?? 'Registration failed'};
      }
    });
  }

  Future<Map<String, dynamic>> login(String email, String password) async {
    return await _retryWithDifferentUrls(() async {
      final response = await http.post(
        Uri.parse('${ApiConfig.authBase}/user/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'email': email,
          'password': password,
        }),
      ).timeout(Duration(seconds: ApiConfig.timeoutDuration));

      final data = jsonDecode(response.body);

      if (response.statusCode == 200 && data['success']) {
        await storage.write(key: 'token', value: data['data']['token']);
        await storage.write(key: 'userId', value: data['data']['user']['id']);
        return {'success': true, 'user': User.fromJson(data['data']['user'])};
      } else {
        return {'success': false, 'message': data['message'] ?? 'Login failed'};
      }
    });
  }

  Future<void> logout() async {
    await storage.delete(key: 'token');
    await storage.delete(key: 'userId');
  }

  Future<String?> getToken() async {
    return await storage.read(key: 'token');
  }

  Future<String?> getUserId() async {
    return await storage.read(key: 'userId');
  }

  Future<bool> isLoggedIn() async {
    final token = await getToken();
    return token != null;
  }

  Future<Map<String, dynamic>> getUserProfile() async {
    final token = await getToken();
    if (token == null) {
      throw Exception('Not authenticated');
    }

    return await _retryWithDifferentUrls(() async {
      final response = await http.get(
        Uri.parse('${ApiConfig.baseUrl}/api/users/profile'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
      ).timeout(Duration(seconds: ApiConfig.timeoutDuration));

      final data = jsonDecode(response.body);

      if (response.statusCode == 200 && data['success']) {
        return data['data'];
      } else {
        throw Exception(data['message'] ?? 'Failed to get profile');
      }
    });
  }
}
