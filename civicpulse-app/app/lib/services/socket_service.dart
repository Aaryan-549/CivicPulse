import 'package:socket_io_client/socket_io_client.dart' as IO;
import '../config/api_config.dart';

class SocketService {
  static final SocketService _instance = SocketService._internal();
  factory SocketService() => _instance;
  SocketService._internal();

  IO.Socket? _socket;
  bool _isConnected = false;

  bool get isConnected => _isConnected;

  void connect(String token) {
    if (_socket != null && _socket!.connected) {
      return;
    }

    _socket = IO.io(
      ApiConfig.baseUrl,
      IO.OptionBuilder()
          .setTransports(['websocket'])
          .enableAutoConnect()
          .setAuth({'token': token})
          .build(),
    );

    _socket?.onConnect((_) {
      print('Socket connected');
      _isConnected = true;
    });

    _socket?.onDisconnect((_) {
      print('Socket disconnected');
      _isConnected = false;
    });

    _socket?.onConnectError((error) {
      print('Socket connection error: $error');
      _isConnected = false;
    });

    _socket?.onError((error) {
      print('Socket error: $error');
    });
  }

  void onComplaintUpdated(Function(Map<String, dynamic>) callback) {
    _socket?.on('complaint:updated', (data) {
      callback(data as Map<String, dynamic>);
    });
  }

  void disconnect() {
    _socket?.disconnect();
    _socket?.dispose();
    _socket = null;
    _isConnected = false;
  }

  void removeAllListeners() {
    _socket?.off('complaint:updated');
  }
}
