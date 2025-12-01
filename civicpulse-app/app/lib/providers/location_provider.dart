import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'package:geocoding/geocoding.dart';
import '../services/location_service.dart';

class LocationProvider with ChangeNotifier {
  final LocationService _locationService = LocationService();
  Position? _currentPosition;
  String _locationText = 'Getting location...';
  bool _isLoading = true;

  Position? get currentPosition => _currentPosition;
  String get locationText => _locationText;
  bool get isLoading => _isLoading;
  double? get latitude => _currentPosition?.latitude;
  double? get longitude => _currentPosition?.longitude;

  LocationProvider() {
    _initLocation();
  }

  Future<void> _initLocation() async {
    await updateLocation();
  }

  Future<void> updateLocation() async {
    _isLoading = true;
    notifyListeners();

    try {
      print('LocationProvider: Requesting location...');

      // Check if location services are enabled
      bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        print('LocationProvider: Location services are disabled');
        _locationText = 'Location disabled';
        _currentPosition = null;
        _isLoading = false;
        notifyListeners();
        return;
      }

      // Check permissions
      LocationPermission permission = await Geolocator.checkPermission();
      print('LocationProvider: Permission status: $permission');

      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        print('LocationProvider: Requested permission, new status: $permission');
        if (permission == LocationPermission.denied) {
          _locationText = 'Permission denied';
          _currentPosition = null;
          _isLoading = false;
          notifyListeners();
          return;
        }
      }

      if (permission == LocationPermission.deniedForever) {
        _locationText = 'Permission denied';
        _currentPosition = null;
        _isLoading = false;
        notifyListeners();
        return;
      }

      final position = await _locationService.getCurrentLocation();
      print('LocationProvider: Got position: $position');

      if (position != null) {
        _currentPosition = position;
        print('LocationProvider: Lat: ${position.latitude}, Lng: ${position.longitude}');

        // Get address from coordinates using reverse geocoding
        try {
          List<Placemark> placemarks = await placemarkFromCoordinates(
            position.latitude,
            position.longitude,
          );

          if (placemarks.isNotEmpty) {
            final place = placemarks[0];
            String location = '';

            if (place.locality != null && place.locality!.isNotEmpty) {
              location = place.locality!;
            } else if (place.subLocality != null && place.subLocality!.isNotEmpty) {
              location = place.subLocality!;
            } else if (place.administrativeArea != null && place.administrativeArea!.isNotEmpty) {
              location = place.administrativeArea!;
            }

            _locationText = location.isNotEmpty ? location : 'Location found';
            print('LocationProvider: Location text set to: $_locationText');
          } else {
            _locationText = 'Location found';
          }
        } catch (e) {
          print('LocationProvider: Geocoding error: $e');
          _locationText = 'Location found';
        }
      } else {
        print('LocationProvider: Position is null');
        _locationText = 'Enable location';
        _currentPosition = null;
      }
    } catch (e) {
      print('LocationProvider: Error getting location: $e');
      _locationText = 'Location error';
      _currentPosition = null;
    }

    _isLoading = false;
    notifyListeners();
  }

  String getFullAddress() {
    if (_currentPosition != null) {
      return '${_currentPosition!.latitude.toStringAsFixed(6)}, ${_currentPosition!.longitude.toStringAsFixed(6)}';
    }
    return 'Location not available';
  }
}
