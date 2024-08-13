export type SeatType = {
  number: number;
  reserved: boolean;
  user: string | null;
};

export type ScheduleType = {
  hour: string;
  room: number;
  seats: SeatType[];
};

export type MovieType = {
  name: string;
  description: string;
  poster: string;
  schedules: ScheduleType[];
};
