export type SentType = {
  number: number;
  reserved: false;
};

export type ScheduleType = {
  hour: string;
  room: number;
  sents: SentType[];
};

export type MovieType = {
  name: string;
  description: string;
  poster: string;
  schedules: ScheduleType[];
};
