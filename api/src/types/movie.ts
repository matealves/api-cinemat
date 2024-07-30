export type Sents = {
  number: number;
  reserved: false;
};

export type Schedules = {
  hour: string;
  room: number;
  sents: Sents[];
};

export type MovieType = {
  name: string;
  description: string;
  poster: string;
  schedules: Schedules[];
};
