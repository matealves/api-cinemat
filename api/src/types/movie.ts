export type SeatType = {
  number: number;
  reserved: boolean;
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
