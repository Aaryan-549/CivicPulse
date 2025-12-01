class Complaint {
  final String id;
  final String type;
  final String category;
  final String subcategory;
  final String description;
  final String address;
  final double latitude;
  final double longitude;
  final String status;
  final String? plateNumber;
  final double? confidenceScore;
  final String validationStatus;
  final String userId;
  final String? workerId;
  final DateTime createdAt;
  final DateTime updatedAt;
  final DateTime? resolvedAt;
  final List<Media>? media;
  final Worker? worker;

  Complaint({
    required this.id,
    required this.type,
    required this.category,
    required this.subcategory,
    required this.description,
    required this.address,
    required this.latitude,
    required this.longitude,
    required this.status,
    this.plateNumber,
    this.confidenceScore,
    required this.validationStatus,
    required this.userId,
    this.workerId,
    required this.createdAt,
    required this.updatedAt,
    this.resolvedAt,
    this.media,
    this.worker,
  });

  factory Complaint.fromJson(Map<String, dynamic> json) {
    return Complaint(
      id: json['id'],
      type: json['type'],
      category: json['category'],
      subcategory: json['subcategory'],
      description: json['description'],
      address: json['address'],
      latitude: json['latitude'].toDouble(),
      longitude: json['longitude'].toDouble(),
      status: json['status'],
      plateNumber: json['plateNumber'],
      confidenceScore: json['confidenceScore']?.toDouble(),
      validationStatus: json['validationStatus'],
      userId: json['userId'],
      workerId: json['workerId'],
      createdAt: DateTime.parse(json['createdAt']),
      updatedAt: DateTime.parse(json['updatedAt']),
      resolvedAt: json['resolvedAt'] != null ? DateTime.parse(json['resolvedAt']) : null,
      media: json['media'] != null ? (json['media'] as List).map((m) => Media.fromJson(m)).toList() : null,
      worker: json['worker'] != null ? Worker.fromJson(json['worker']) : null,
    );
  }
}

class Media {
  final String id;
  final String complaintId;
  final String url;
  final String publicId;
  final String type;
  final DateTime createdAt;

  Media({
    required this.id,
    required this.complaintId,
    required this.url,
    required this.publicId,
    required this.type,
    required this.createdAt,
  });

  factory Media.fromJson(Map<String, dynamic> json) {
    return Media(
      id: json['id'],
      complaintId: json['complaintId'],
      url: json['url'],
      publicId: json['publicId'],
      type: json['type'],
      createdAt: DateTime.parse(json['createdAt']),
    );
  }
}

class Worker {
  final String id;
  final String name;
  final String? email;
  final String? phone;

  Worker({
    required this.id,
    required this.name,
    this.email,
    this.phone,
  });

  factory Worker.fromJson(Map<String, dynamic> json) {
    return Worker(
      id: json['id'],
      name: json['name'],
      email: json['email'],
      phone: json['phone'],
    );
  }
}
