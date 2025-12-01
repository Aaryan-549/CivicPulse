import 'dart:io';
import 'package:app/constants.dart';
import 'package:app/widgets/submit_cancel_button.dart';
import 'package:app/widgets/upload_image_button.dart';
import 'package:flutter/material.dart';
import 'package:app/providers/location_provider.dart';
import 'package:app/services/complaint_service.dart';
import 'package:provider/provider.dart';

class TrafficComplaint extends StatefulWidget {
  const TrafficComplaint({super.key});

  @override
  State<TrafficComplaint> createState() => _TrafficComplaintState();
}

class _TrafficComplaintState extends State<TrafficComplaint> {
  final _plateNumberController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _complaintService = ComplaintService();
  bool _isSubmitting = false;
  File? _selectedImage;

  @override
  void dispose() {
    _plateNumberController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }

  Future<void> _submitComplaint(String category, String subcategory) async {
    if (_descriptionController.text.isEmpty || _selectedImage == null) {
      String message = "Please fill in all fields";
      if (_selectedImage == null) {
        message = "Please upload an image";
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
      final result = await _complaintService.submitTrafficComplaint(
        category: category,
        subcategory: subcategory,
        description: _descriptionController.text,
        address: locationProvider.getFullAddress(),
        latitude: locationProvider.latitude!,
        longitude: locationProvider.longitude!,
        plateNumber: _plateNumberController.text.isNotEmpty ? _plateNumberController.text : null,
        image: _selectedImage,
      );

      if (!mounted) return;

      if (result['success']) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Center(child: Text("Your traffic complaint has been registered")),
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
                        Text("Number Plate:", style: TextStyle(fontSize: 15)),
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
                            controller: _plateNumberController,
                            keyboardType: TextInputType.text,
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
