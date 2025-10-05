import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const sortByDate = (fecha1: Date, fecha2: Date) => {
  if (fecha1 < fecha2) {
    return 1;
  }

  if (fecha1 > fecha2) {
    return -1;
  }

  return 0;
};

export const sortByName = (nombre1: string, nombre2: string) => {
  if (nombre1 < nombre2) {
    return 1;
  }

  if (nombre1 > nombre2) {
    return -1;
  }

  return 0;
};
