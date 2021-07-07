export interface Connection {
  ip: string;
  asn: string;
  city: string;
  country: string;
  map: string;
}

export interface ServiceStatus {
  id?: string;
  host?: string;
}

export interface NetworkLogs {
  id: string;
  meetingId: string;
  audioRecv: number;
  audioSend: number;
  videoRecv: number;
  videoSend: number;
}

export interface Invite {
  id: string;
  email: string;
}

export interface Analytics {
  query: object;
  network: Connection;
  headers: object;
  serviceId: string;
  device: Bowser.Parser.ParsedResult;
}

export interface Device {
  browser: string;
  os: string;
  platform: string;
}

export interface SocketData {
  roomId?: string;
  user?: Record<string, any>;
  msgData?: string;
  userId?: string | number;
}
