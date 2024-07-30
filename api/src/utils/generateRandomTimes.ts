import { getRandomNumber } from "./getRandomNumber";

function getRandomHour(): string {
  const hour = getRandomNumber(23, 10); // Horário entre 10 e 23
  const minute = Math.floor(Math.random() * 6) * 10; // Minutos alternando de 10 em 10
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export function generateRandomTimes(count: number = 1): string | string[] {
  const timesSet = new Set<string>(); // Usar Set para evitar duplicados

  while (timesSet.size < count) {
    timesSet.add(getRandomHour());
  }

  const times = Array.from(timesSet);

  return count > 1 ? times.sort() : times[0];
}
