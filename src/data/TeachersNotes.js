import { sstSlides } from "../assets/SstNotes/sstDataExport.js";
import { Book1C1, Book1C2 } from "../assets/ScienceNotes/scienceDataExport.js";

export const Alakhsirnotes = [
  {
    id: "T005-1-1",
    type: "carousel",
    icon: "BsHeartPulse",
    title: "Life Processes",
    subtitle: "Core life functions",
    detailedDescription:
      "This section covers the fundamental life processes such as nutrition, respiration, transportation, excretion, and reproduction in living organisms.",
    carouselMetaData: [
      { id: "T005-1-1-1", type: "img", src: Book1C1.imgS1 },
      { id: "T005-1-1-2", type: "img", src: Book1C1.imgS2 },
      { id: "T005-1-1-3", type: "img", src: Book1C1.imgS3 },
      { id: "T005-1-1-4", type: "img", src: Book1C1.imgS4 },
      { id: "T005-1-1-5", type: "img", src: Book1C1.imgS5 },
      { id: "T005-1-1-6", type: "img", src: Book1C1.imgS6 },
    ],
  },
  {
    id: "T005-1-2",
    type: "carousel",
    icon: "BsSun",
    title: "Nutrition in Living Organisms",
    subtitle: "How plants and animals obtain and use food",
    detailedDescription:
      "This carousel explains how different organisms obtain nutrition to sustain life. You will learn how autotrophs make their own food using sunlight, and how heterotrophs—like humans and animals—depend on other organisms for energy. Fun comparisons and visual examples make the concepts easy and relatable.",
    carouselMetaData: [
      { id: "T005-1-2-1", type: "gif", src: Book1C2.plantOrder },
      { id: "T005-1-2-2", type: "gif", src: Book1C2.makingFood },
      { id: "T005-1-2-3", type: "gif", src: Book1C2.exampleTime },
      { id: "T005-1-2-4", type: "gif", src: Book1C2.challenge },
      { id: "T005-1-2-5", type: "gif", src: Book1C2.burgur },
      { id: "T005-1-2-6", type: "gif", src: Book1C2.cooking },
      { id: "T005-1-2-7", type: "gif", src: Book1C2.exampleTime1 },
    ],
  },
];

/**
 * DATA SHAPE
 * ----------
 * TeachersNotes: Array<{
 *   teacherId: string,
 *   teacherMetadata: Array<{
 *     bookId: number,
 *     bookMetadata: Array<Card>
 *   }>
 * }>
 *
 * Card:
 * - type: "carousel" | "videoClip" | "infografic"  // (kept "infografic" for compatibility)
 * - icon: string                                    // e.g. "BsHeartPulse"
 * - title: string
 * - subtitle?: string
 * - detailedDescription?: string
 * - carouselMetaData?: Array<{ id: string, type: "img"|"gif"|"video", src: string }>
 * - videoClipSrc?: string
 * - imgSrc?: string
 */

export const TeachersNotes = [
  /* ===================== T005 — Alakh Pandey ===================== */
  {
    teacherId: "T005",
    teacherMetadata: [
      // Book 1
      {
        bookId: "B001",
        bookMetadata: [
          {
            id: "T005-1-1",
            type: "carousel",
            icon: "BsHeartPulse",
            title: "Life Processes",
            subtitle: "Core life functions",
            detailedDescription:
              "This section covers the fundamental life processes such as nutrition, respiration, transportation, excretion, and reproduction in living organisms.",
            carouselMetaData: [
              { id: "T005-1-1-1", type: "img", src: Book1C1.imgS1 },
              { id: "T005-1-1-2", type: "img", src: Book1C1.imgS2 },
              { id: "T005-1-1-3", type: "img", src: Book1C1.imgS3 },
              { id: "T005-1-1-4", type: "img", src: Book1C1.imgS4 },
              { id: "T005-1-1-5", type: "img", src: Book1C1.imgS5 },
              { id: "T005-1-1-6", type: "img", src: Book1C1.imgS6 },
            ],
          },
          {
            id: "T005-1-2",
            type: "carousel",
            icon: "BsSun",
            title: "Nutrition in Living Organisms",
            subtitle: "How plants and animals obtain and use food",
            detailedDescription:
              "This carousel explains how different organisms obtain nutrition to sustain life. You will learn how autotrophs make their own food using sunlight, and how heterotrophs—like humans and animals—depend on other organisms for energy. Fun comparisons and visual examples make the concepts easy and relatable.",
            carouselMetaData: [
              { id: "T005-1-2-1", type: "gif", src: Book1C2.plantOrder },
              { id: "T005-1-2-2", type: "gif", src: Book1C2.makingFood },
              { id: "T005-1-2-3", type: "gif", src: Book1C2.exampleTime },
              { id: "T005-1-2-4", type: "gif", src: Book1C2.challenge },
              { id: "T005-1-2-5", type: "gif", src: Book1C2.burgur },
              { id: "T005-1-2-6", type: "gif", src: Book1C2.cooking },
              { id: "T005-1-2-7", type: "gif", src: Book1C2.exampleTime1 },
            ],
          },
        ],
      },
    ],
  },

  /* ===================== T008 - Shidhart Sir ===================== */
  {
    teacherId: "T008",
    teacherMetadata: [
      // Book 1
      {
        bookId: "B001",
        bookMetadata: [
          {
            id: "T005-2-1",
            type: "carousel",
            icon: "BsPeople",
            title: "Collective Identity",
            subtitle: "Shared identity roots",
            detailedDescription:
              "How collective identity emerges from shared experiences, beliefs, and narratives; fostering solidarity and cooperation.",
            carouselMetaData: [
              { id: "T005-2-1-1", type: "img", src: sstSlides.img1 },
              { id: "T005-2-1-2", type: "img", src: sstSlides.img2 },
              { id: "T005-2-1-3", type: "img", src: sstSlides.img3 },
              { id: "T005-2-1-4", type: "img", src: sstSlides.img4 },
            ],
          },
          {
            id: "T005-2-3",
            type: "videoClip",
            icon: "BsPlayCircle",
            title: "Identity in Action",
            subtitle: "Identity in action",
            detailedDescription:
              "Real-world examples where group identity shapes movements and outcomes.",
            videoClipSrc: sstSlides.vedioClip1,
          },
          {
            id: "T005-2-4",
            type: "infografic", // kept original key for compatibility
            icon: "BsClockHistory",
            title: "Identity Over Time",
            subtitle: "Identity over time",
            detailedDescription:
              "From tribal affiliations to modern national and digital identities.",
            imgSrc: sstSlides.inf1,
          },
        ],
      },
    ],
  },
];
