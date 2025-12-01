import 'package:app/constants.dart';
import 'package:app/widgets/complaint.dart';
import 'package:flutter/material.dart';
import 'package:app/services/complaint_service.dart';
import 'package:app/models/complaint_model.dart';
import 'package:app/providers/auth_provider.dart';
import 'package:provider/provider.dart';

class MyComplaintsPageContents extends StatefulWidget {
  const MyComplaintsPageContents({super.key});

  @override
  State<MyComplaintsPageContents> createState() =>
      _MyComplaintsPageContentsState();
}

class _MyComplaintsPageContentsState extends State<MyComplaintsPageContents> {
  final ComplaintService _complaintService = ComplaintService();
  List<Complaint> _complaints = [];
  bool _isLoading = true;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _loadComplaints();
  }

  Future<void> _loadComplaints() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final result = await _complaintService.getUserComplaints();

      if (!mounted) return;

      if (result['success']) {
        setState(() {
          _complaints = result['complaints'] as List<Complaint>;
          _isLoading = false;
        });
      } else {
        setState(() {
          _errorMessage = result['message'] ?? 'Failed to load complaints';
          _isLoading = false;
        });
      }
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _errorMessage = 'Error: $e';
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Container(
        color: greyColor,
        width: MediaQuery.of(context).size.width,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.all(12.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.start,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Consumer<AuthProvider>(
                    builder: (context, authProvider, child) {
                      return Text(
                        "Hello, ${authProvider.userName}",
                        style: TextStyle(
                          color: darkGreyColor,
                          fontWeight: FontWeight.bold,
                          fontSize: 20,
                        ),
                      );
                    },
                  ),
                  Text(
                    "Your past complaints are as follows:",
                    style: TextStyle(fontSize: 14),
                  ),
                  SizedBox(height: 10),
                ],
              ),
            ),
            Expanded(
              child: _isLoading
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          CircularProgressIndicator(
                            color: blueColor,
                          ),
                          SizedBox(height: 16),
                          Text(
                            'Loading complaints...',
                            style: TextStyle(color: darkGreyColor),
                          ),
                        ],
                      ),
                    )
                  : _errorMessage != null
                      ? Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(
                                Icons.error_outline,
                                size: 48,
                                color: Colors.red,
                              ),
                              SizedBox(height: 16),
                              Text(
                                _errorMessage!,
                                textAlign: TextAlign.center,
                                style: TextStyle(color: Colors.red),
                              ),
                              SizedBox(height: 16),
                              ElevatedButton(
                                onPressed: _loadComplaints,
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: blueColor,
                                ),
                                child: Text(
                                  'Retry',
                                  style: TextStyle(color: Colors.white),
                                ),
                              ),
                            ],
                          ),
                        )
                      : _complaints.isEmpty
                          ? Center(
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Icon(
                                    Icons.inbox_outlined,
                                    size: 64,
                                    color: Colors.grey,
                                  ),
                                  SizedBox(height: 16),
                                  Text(
                                    'No complaints yet',
                                    style: TextStyle(
                                      color: darkGreyColor,
                                      fontSize: 18,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  SizedBox(height: 8),
                                  Text(
                                    'Your submitted complaints will appear here',
                                    style: TextStyle(
                                      color: Colors.grey,
                                      fontSize: 14,
                                    ),
                                  ),
                                ],
                              ),
                            )
                          : RefreshIndicator(
                              onRefresh: _loadComplaints,
                              color: blueColor,
                              child: ListView.builder(
                                itemCount: _complaints.length,
                                itemBuilder: (context, index) {
                                  return ComplaintBox(
                                    complaint: _complaints[index],
                                  );
                                },
                              ),
                            ),
            ),
          ],
        ),
      ),
    );
  }
}
