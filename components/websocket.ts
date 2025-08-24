import { Client, Frame, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

let stompClient: Client | null = null;

export function connectWebSocket(onMessageReceived: (msg: any) => void): void {
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('authToken='))
    ?.split('=')[1];

  console.log('WebSocket token:', token);

  stompClient = new Client({
    webSocketFactory: () => new SockJS('http://localhost:8080/adhunnikkethi-ws'),
    connectHeaders: {
      Authorization: token ? `Bearer ${token}` : '',
    },

    debug: (str: string) => {
      console.log(str);
    },

    // onConnect is called when the connection is established
    onConnect: (frame: Frame) => {
      console.log('Connected to WebSocket:', frame);

      // Subscribe to the /topic/users topic and handle incoming messages
      const subscription: StompSubscription | undefined = stompClient?.subscribe('/topic/users', (message) => {
        onMessageReceived(JSON.parse(message.body));
      });
    },

    onStompError: (frame: Frame) => {
      console.error('Broker reported error:', frame.headers['message']);
      console.error('Details:', frame.body);
    },

    onWebSocketClose: (event: CloseEvent) => {
      console.warn('WebSocket closed unexpectedly:', event);
      // Optionally try reconnecting here if desired
    },

    onWebSocketError: (event: Event) => {
      console.error('WebSocket error observed:', event);
    },
  });

  stompClient.activate();
}

export function disconnectWebSocket(): void {
  if (stompClient !== null) {
    stompClient.deactivate();
    stompClient = null;
  }
}
