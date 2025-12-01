class ApiConfig {
  // Multiple endpoint options - try in order until one works
  static const List<String> _baseUrls = [
    'http://10.0.2.2:5000',           // Android emulator
    'http://172.16.213.109:5000',     // Your computer's actual IP
    'http://172.16.0.2:5000',         // CloudflareWARP IP
    'http://localhost:5000',           // Local development
    'http://127.0.0.1:5000',          // Localhost alternative
  ];
  
  static String _currentBaseUrl = _baseUrls[0];
  static const String apiVersion = '/api';

  static String get baseUrl => _currentBaseUrl;
  static String get authBase => '$_currentBaseUrl$apiVersion/auth';
  static String get complaintsBase => '$_currentBaseUrl$apiVersion/complaints';
  static String get mediaBase => '$_currentBaseUrl$apiVersion/media';

  static const int timeoutDuration = 10; // Reduced timeout for faster fallback
  
  // Method to try different URLs if connection fails
  static void tryNextUrl() {
    int currentIndex = _baseUrls.indexOf(_currentBaseUrl);
    if (currentIndex < _baseUrls.length - 1) {
      _currentBaseUrl = _baseUrls[currentIndex + 1];
      print('Switching to URL: $_currentBaseUrl');
    }
  }
  
  // Reset to first URL
  static void resetUrl() {
    _currentBaseUrl = _baseUrls[0];
  }
}
