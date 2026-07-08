"use client";

/*
  The ONLY place GSAP plugins are registered. Every motion component
  imports from here, keeping GSAP in a single shared client chunk and
  out of the server-rendered shell entirely.
*/
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

export { gsap, ScrollTrigger, SplitText, useGSAP };
