import 'dart:io';
import 'package:app/constants.dart';
import 'package:app/widgets/submit_cancel_button.dart';
import 'package:app/widgets/upload_image_button.dart';
import 'package:flutter/material.dart';
import 'package:app/services/complaint_service.dart';
import 'package:app/providers/location_provider.dart';
import 'package:provider/provider.dart';

class CivicIssueComplaint extends StatefulWidget {
  const CivicIssueComplaint({super.key});

  @override
  State<CivicIssueComplaint> createState() => _CivicIssueComplaintState();
}

class _CivicIssueComplaintState extends State<CivicIssueComplaint> {
  final _addressController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _complaintService = ComplaintService();
  bool _isSubmitting = false;
  File? _selectedImage;

  @override
  void dispose() {
    _addressController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }

  Future<void> _submitComplaint(String category, String subcategory) async {
    if (_addressController.text.isEmpty || _descriptionController.text.isEmpty || _selectedImage == null) {
      String message = "Please fill in all fields";
      if (_selectedImage == null) {
        message = "Please upload an image";
      } else if (_addressController.text.isEmpty) {
        message = "Please enter the complaint address";
      } else if (_descriptionController.text.isEmpty) {
        message = "Please enter a description";
      }

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Center(child: Text(message)),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    // Get current location from provider
    final locationProvider = Provider.of<LocationProvider>(context, listen: false);

    if (locationProvider.latitude == null || locationProvider.longitude == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Center(child: Text("Unable to get location. Please try again.")),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    setState(() => _isSubmitting = true);

    try {
      final result = await _complaintService.submitCivicComplaint(
        category: category,
        subcategory: subcategory,
        description: _descriptionController.text,
        address: _addressController.text,
        latitude: locationProvider.latitude!,
        longitude: locationProvider.longitude!,
        image: _selectedImage,
      );

      if (!mounted) return;

      if (result['success']) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Center(child: Text("Your complaint has been registered")),
            backgroundColor: Colors.green,
          ),
        );
        Navigator.pop(context);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Center(child: Text(result['message'] ?? 'Failed to submit')),
            backgroundColor: Colors.red,
          ),
        );
      }
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Center(child: Text("Error: $e")),
          backgroundColor: Colors.red,
        ),
      );
    } finally {
      if (mounted) setState(() => _isSubmitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final args = ModalRoute.of(context)!.settings.arguments as Map;

    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: Text(
          "CivicPulse",
          style: TextStyle(
            color: greyColor,
            fontWeight: FontWeight.bold,
            fontSize: 24,
          ),
        ),
        actions: [
          Consumer<LocationProvider>(
            builder: (context, locationProvider, child) {
              return Row(
                children: [
                  Icon(Icons.location_on, color: greyColor),
                  Padding(
                    padding: const EdgeInsets.fromLTRB(3, 0, 15, 0),
                    child: Text(
                      locationProvider.locationText,
                      style: TextStyle(
                        color: greyColor,
                        fontWeight: FontWeight.bold,
                        fontSize: 18,
                      ),
                    ),
                  ),
                ],
              );
            },
          ),
        ],
        backgroundColor: blueColor,
        elevation: 2,
        scrolledUnderElevation: 2,
      ),
      body: SafeArea(
        child: Container(
          color: greyColor,
          width: MediaQuery.of(context).size.width,
          height: MediaQuery.of(context).size.height,
          child: Padding(
            padding: const EdgeInsets.all(12.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Column(
                  children: [
                    Text(
                      "Report a civic issue related to",
                      style: TextStyle(fontSize: 15),
                    ),
                    SizedBox(height: 8),
                    Text(
                      args['cat'],
                      style: TextStyle(
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                        color: darkGreyColor,
                      ),
                    ),
                    Text(
                      "(${args['subcat']})",
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: darkGreyColor,
                      ),
                    ),
                  ],
                ),
                UploadImageButton(
                  onImageSelected: (File? image) {
                    setState(() {
                      _selectedImage = image;
                    });
                  },
                ),
                Column(
                  children: [
                    Row(
                      children: [
                        Text(
                          "Complaint Address:",
                          style: TextStyle(fontSize: 15),
                        ),
                      ],
                    ),
                    Padding(
                      padding: const EdgeInsets.fromLTRB(15, 5, 15, 10),
                      child: Container(
                        decoration: BoxDecoration(
                          boxShadow: [
                            BoxShadow(
                              color: Colors.grey.withValues(alpha: 0.3),
                              spreadRadius: 1,
                              blurRadius: 7,
                              offset: const Offset(0, 1),
                            ),
                          ],
                        ),
                        child: TextSelectionTheme(
                          data: TextSelectionThemeData(
                            selectionHandleColor: blueColor,
                            cursorColor: blueColor,
                          ),
                          child: TextField(
                            controller: _addressController,
                            keyboardType: TextInputType.multiline,
                            minLines: 1,
                            maxLines: 2,
                            cursorColor: blueColor,
                            decoration: InputDecoration(
                              labelStyle: TextStyle(color: blueColor),
                              filled: true,
                              fillColor: Colors.white,
                              enabledBorder: OutlineInputBorder(
                                borderSide: BorderSide(
                                  color: Colors.black,
                                  width: 1,
                                ),
                                borderRadius: BorderRadius.circular(10),
                              ),
                              focusedBorder: OutlineInputBorder(
                                borderSide: BorderSide(
                                  color: blueColor,
                                  width: 2,
                                ),
                                borderRadius: BorderRadius.circular(10),
                              ),
                              // Add subtle padding inside the field
                              contentPadding: const EdgeInsets.all(5),
                            ),
                            style: const TextStyle(
                              color: Colors.black,
                              fontSize: 15,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                Column(
                  children: [
                    Row(
                      children: [
                        Text(
                          "Describe your complaint:",
                          style: TextStyle(fontSize: 15),
                        ),
                      ],
                    ),
                    Padding(
                      padding: const EdgeInsets.fromLTRB(15, 5, 15, 10),
                      child: Container(
                        decoration: BoxDecoration(
                          boxShadow: [
                            BoxShadow(
                              color: Colors.grey.withValues(alpha: 0.3),
                              spreadRadius: 1,
                              blurRadius: 7,
                              offset: const Offset(0, 1),
                            ),
                          ],
                        ),
                        child: TextSelectionTheme(
                          data: TextSelectionThemeData(
                            selectionHandleColor: blueColor,
                            cursorColor: blueColor,
                          ),
                          child: TextField(
                            controller: _descriptionController,
                            keyboardType: TextInputType.multiline,
                            minLines: 5,
                            maxLines: 5,
                            cursorColor: blueColor,
                            decoration: InputDecoration(
                              labelStyle: TextStyle(color: blueColor),
                              filled: true,
                              fillColor: Colors.white,
                              enabledBorder: OutlineInputBorder(
                                borderSide: BorderSide(
                                  color: Colors.black,
                                  width: 1,
                                ),
                                borderRadius: BorderRadius.circular(10),
                              ),
                              focusedBorder: OutlineInputBorder(
                                borderSide: BorderSide(
                                  color: blueColor,
                                  width: 2,
                                ),
                                borderRadius: BorderRadius.circular(10),
                              ),
                              contentPadding: const EdgeInsets.all(5),
                            ),
                            style: const TextStyle(
                              color: Colors.black,
                              fontSize: 15,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                SubmitCancelButton(
                  text: _isSubmitting ? "Submitting..." : "Submit",
                  onTap: _isSubmitting
                    ? () {}
                    : () => _submitComplaint(args['cat'], args['subcat']),
                ),
                SubmitCancelButton(
                  text: "Cancel",
                  onTap: () {
                    Navigator.pop(context);
                  },
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
