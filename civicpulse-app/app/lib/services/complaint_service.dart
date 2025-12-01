import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:http_parser/http_parser.dart';
import 'package:mime/mime.dart';
import '../config/api_config.dart';
import '../models/complaint_model.dart';
import 'auth_service.dart';

class ComplaintService {
  final AuthService _authService = AuthService();

  Future<Map<String, String>> _getHeaders() async {
    final token = await _authService.getToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    };
  }

  Future<Map<String, dynamic>> submitCivicComplaint({
    required String category,
    required String subcategory,
    required String description,
    required String address,
    required double latitude,
    required double longitude,
    File? image,
  }) async {
    try {
      final token = await _authService.getToken();
      var request = http.MultipartRequest(
        'POST',
        Uri.parse('${ApiConfig.complaintsBase}/civic'),
      );

      request.headers['Authorization'] = 'Bearer $token';
      request.fields['category'] = category;
      request.fields['subcategory'] = subcategory;
      request.fields['description'] = description;
      request.fields['address'] = address;
      request.fields['latitude'] = latitude.toString();
      request.fields['longitude'] = longitude.toString();

      if (image != null) {
        final imageBytes = await image.readAsBytes();
        final filename = image.path.split('/').last.split('\\').last;
        final mimeType = lookupMimeType(filename, headerBytes: imageBytes) ?? 'image/jpeg';
        final contentType = MediaType.parse(mimeType);

        request.files.add(
          http.MultipartFile.fromBytes(
            'image',
            imageBytes,
            filename: filename,
            contentType: contentType,
          ),
        );
      }

      final streamedResponse = await request.send().timeout(Duration(seconds: ApiConfig.timeoutDuration));
      final response = await http.Response.fromStream(streamedResponse);
      final data = jsonDecode(response.body);

      if (response.statusCode == 201 && data['success']) {
        return {'success': true, 'complaint': Complaint.fromJson(data['data'])};
      } else {
        return {'success': false, 'message': data['message'] ?? 'Failed to submit complaint'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Connection error: $e'};
    }
  }

  Future<Map<String, dynamic>> submitTrafficComplaint({
    required String category,
    required String subcategory,
    required String description,
    required String address,
    required double latitude,
    required double longitude,
    String? plateNumber,
    File? image,
  }) async {
    try {
      final token = await _authService.getToken();
      var request = http.MultipartRequest(
        'POST',
        Uri.parse('${ApiConfig.complaintsBase}/traffic'),
      );

      request.headers['Authorization'] = 'Bearer $token';
      request.fields['category'] = category;
      request.fields['subcategory'] = subcategory;
      request.fields['description'] = description;
      request.fields['address'] = address;
      request.fields['latitude'] = latitude.toString();
      request.fields['longitude'] = longitude.toString();
      if (plateNumber != null) {
        request.fields['plateNumber'] = plateNumber;
      }

      if (image != null) {
        final imageBytes = await image.readAsBytes();
        final filename = image.path.split('/').last.split('\\').last;
        final mimeType = lookupMimeType(filename, headerBytes: imageBytes) ?? 'image/jpeg';
        final contentType = MediaType.parse(mimeType);

        request.files.add(
          http.MultipartFile.fromBytes(
            'image',
            imageBytes,
            filename: filename,
            contentType: contentType,
          ),
        );
      }

      final streamedResponse = await request.send().timeout(Duration(seconds: ApiConfig.timeoutDuration));
      final response = await http.Response.fromStream(streamedResponse);
      final data = jsonDecode(response.body);

      if (response.statusCode == 201 && data['success']) {
        return {'success': true, 'complaint': Complaint.fromJson(data['data'])};
      } else {
        return {'success': false, 'message': data['message'] ?? 'Failed to submit complaint'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Connection error: $e'};
    }
  }

  Future<Map<String, dynamic>> getUserComplaints() async {
    try {
      final headers = await _getHeaders();
      final response = await http.get(
        Uri.parse('${ApiConfig.complaintsBase}/user'),
        headers: headers,
      ).timeout(Duration(seconds: ApiConfig.timeoutDuration));

      final data = jsonDecode(response.body);

      if (response.statusCode == 200 && data['success']) {
        final complaints = (data['data'] as List).map((c) => Complaint.fromJson(c)).toList();
        return {'success': true, 'complaints': complaints};
      } else {
        return {'success': false, 'message': data['message'] ?? 'Failed to fetch complaints'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Connection error: $e'};
    }
  }

  Future<Map<String, dynamic>> getComplaintById(String id) async {
    try {
      final headers = await _getHeaders();
      final response = await http.get(
        Uri.parse('${ApiConfig.complaintsBase}/$id'),
        headers: headers,
      ).timeout(Duration(seconds: ApiConfig.timeoutDuration));

      final data = jsonDecode(response.body);

      if (response.statusCode == 200 && data['success']) {
        return {'success': true, 'complaint': Complaint.fromJson(data['data'])};
      } else {
        return {'success': false, 'message': data['message'] ?? 'Failed to fetch complaint'};
      }
    } catch (e) {
      return {'success': false, 'message': 'Connection error: $e'};
    }
  }
}
