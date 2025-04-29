export interface Venue {
  id: string;               // Unique identifier for the venue
  name: string;             // Name of the venue
  address: string;          // Address of the venue
  status: boolean;          // Whether the venue is open (true) or closed (false)
  holidays: string[];       // List of holidays (ISO date strings, e.g., "2025-12-25")
  lunchBreak: {
    start: string;          // Start time of the lunch break (e.g., "13:00")
    end: string;            // End time of the lunch break (e.g., "14:00")
  };
  counters: Counter[];      // List of counters in the venue
  createdBy: string;        // UID of the user who created the venue
  createdAt: string;        // Timestamp of when the venue was created
}
export interface Counter {
  id: number;               // Unique identifier for the counter
  name: string;             // Name of the counter
  type: string;             // Type of the counter (e.g., "Info", "Service")
  isActive: boolean;        // Whether the counter is active
  queue: Queue;             // Queue associated with the counter
  qrString: string;         // QR code string for the counter
}
export interface Queue {
  id: number;               // Unique identifier for the queue
  length: number;           // Current length of the queue
  currentToken: number;     // Current token being served
}
