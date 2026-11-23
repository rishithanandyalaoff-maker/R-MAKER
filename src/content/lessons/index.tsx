import type { ComponentType } from "react";
import { Lesson01 } from "@/content/lessons/01-why-start-now";
import { Lesson02 } from "@/content/lessons/02-your-paycheck";
import { Lesson03 } from "@/content/lessons/03-budget";
import { Lesson04 } from "@/content/lessons/04-safety-net";
import { Lesson05 } from "@/content/lessons/05-debt";
import { Lesson06 } from "@/content/lessons/06-retirement-accounts";
import { Lesson07 } from "@/content/lessons/07-getting-money-out";
import { Lesson08 } from "@/content/lessons/08-what-to-invest-in";
import { Lesson09 } from "@/content/lessons/09-visa-and-cross-border";
import { Lesson10 } from "@/content/lessons/10-protection";
import { Lesson11 } from "@/content/lessons/11-build-your-plan";

export const LESSON_COMPONENTS: Record<string, ComponentType> = {
  "01-why-start-now": Lesson01,
  "02-your-paycheck": Lesson02,
  "03-budget": Lesson03,
  "04-safety-net": Lesson04,
  "05-debt": Lesson05,
  "06-retirement-accounts": Lesson06,
  "07-getting-money-out": Lesson07,
  "08-what-to-invest-in": Lesson08,
  "09-visa-and-cross-border": Lesson09,
  "10-protection": Lesson10,
  "11-build-your-plan": Lesson11,
};
