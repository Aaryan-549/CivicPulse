import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/complaint_model.dart';

class ComplaintBox extends StatelessWidget {
  final Complaint complaint;

  const ComplaintBox({super.key, required this.complaint});

  Color _getStatusColorValue() {
    switch (complaint.status.toLowerCase()) {
      case 'pending':
        return Colors.orange;
      case 'in_progress':
      case 'inprogress':
        return Colors.blue;
      case 'resolved':
        return Colors.green;
      case 'rejected':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  String _formatDate(DateTime date) {
    return DateFormat('dd-MM-yyyy hh:mm a').format(date);
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        // Can add navigation to detail page here
      },
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        child: Container(
          width: MediaQuery.of(context).size.width,
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(15.0),
            boxShadow: [
              BoxShadow(
                color: Colors.grey.withValues(alpha: 0.7),
                spreadRadius: 2,
                blurRadius: 7,
                offset: const Offset(0, 1),
              ),
            ],
          ),
          child: Padding(
            padding: const EdgeInsets.all(12),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.start,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            complaint.category,
                            style: TextStyle(
                              color: Colors.black,
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          SizedBox(height: 2),
                          Text(
                            "(${complaint.subcategory})",
                            style: TextStyle(color: Colors.black, fontSize: 14),
                          ),
                          if (complaint.type == 'TRAFFIC' && complaint.plateNumber != null)
                            Padding(
                              padding: const EdgeInsets.only(top: 4),
                              child: Text(
                                "Plate: ${complaint.plateNumber}",
                                style: TextStyle(
                                  color: Colors.grey[700],
                                  fontSize: 12,
                                  fontStyle: FontStyle.italic,
                                ),
                              ),
                            ),
                        ],
                      ),
                    ),
                    Column(
                      mainAxisAlignment: MainAxisAlignment.start,
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text(
                          "Last updated:",
                          style: TextStyle(color: Colors.grey, fontSize: 11),
                        ),
                        Text(
                          _formatDate(complaint.updatedAt),
                          style: TextStyle(color: Colors.grey, fontSize: 11),
                        ),
                      ],
                    ),
                  ],
                ),
                SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Text(
                        complaint.description.length > 50
                            ? '${complaint.description.substring(0, 50)}...'
                            : complaint.description,
                        style: TextStyle(
                          color: Colors.grey[700],
                          fontSize: 12,
                        ),
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 8),
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: _getStatusColorValue().withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(
                      color: _getStatusColorValue(),
                      width: 1,
                    ),
                  ),
                  child: Text(
                    "Status: ${complaint.status.toUpperCase()}",
                    style: TextStyle(
                      color: _getStatusColorValue(),
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
