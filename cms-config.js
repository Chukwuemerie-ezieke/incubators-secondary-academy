/**
 * INCUSA Website — Google Sheets CMS Configuration
 * =================================================
 * Each URL points to a live Google Sheet that feeds a page on the website.
 * To update content, just edit the corresponding sheet — no coding needed.
 *
 * IMPORTANT: Each sheet must be set to "Anyone with the link can view"
 * (Share > General access > Anyone with the link > Viewer)
 *
 * Sheet URLs (Google Sheets IDs):
 */

const INCUSA_CMS = {

  // Discipleship page — A Word to My Students (weekly posts)
  wordToStudents: 'https://docs.google.com/spreadsheets/d/1aO4sQYGtQ0_TSifn7bpSxjsU-O-p0uV6mAY7zq-HqGQ/gviz/tq?tqx=out:csv&sheet=Posts',

  // Gallery page — School photos (upload to Google Drive, paste link here)
  gallery: 'https://docs.google.com/spreadsheets/d/1zaO5DQpDvRLqnsMmsc2-cnvwn0bz_JtiLiwxun4aMR4/gviz/tq?tqx=out:csv&sheet=Photos',

  // Events page — School announcements and news
  announcements: 'https://docs.google.com/spreadsheets/d/1RKPghbySgDqRM-RGcoNNs8qaxmcsdNlSlrjmxOGoG8c/gviz/tq?tqx=out:csv&sheet=Announcements',

  // Events page — Academic calendar / important dates
  calendar: 'https://docs.google.com/spreadsheets/d/1I0C2BfxgwpePToR7zkiFCArzg7soC_KTH4hjVdiCP6Q/gviz/tq?tqx=out:csv&sheet=Calendar',

  // About page — Staff directory
  staff: 'https://docs.google.com/spreadsheets/d/1kM6x-WD4qpuIMKZ369CEuKl7POywWsmRcYzm-M5Bw6o/gviz/tq?tqx=out:csv&sheet=Staff',

  // Admissions page — Requirements, fees, documents, steps
  admissions: 'https://docs.google.com/spreadsheets/d/1fu7ylT8rSVdQYIPzD0XeiGmbCjPxPEX40186TFWSAts/gviz/tq?tqx=out:csv&sheet=Admissions',

  // Home page — Parent and student testimonials
  testimonials: 'https://docs.google.com/spreadsheets/d/1CuXUcYvVv-7Et9OSplqcNY1rlN3JvYY7Qfr9KpXD-lk/gviz/tq?tqx=out:csv&sheet=Testimonials',

  // Discipleship page — Weekly chapel programme
  chapelSchedule: 'https://docs.google.com/spreadsheets/d/1ndgWQljmbPkuXnq2ZDkYuPksHO1PqDLdr4tAEgCUtLg/gviz/tq?tqx=out:csv&sheet=Schedule',

  // Boarding Life page — Hostel news and updates
  boardingUpdates: 'https://docs.google.com/spreadsheets/d/1Hqhvrm64v-7cr-iwc6OPXJMnSk476CgI-lec9Z6-T04/gviz/tq?tqx=out:csv&sheet=Updates',

  // Parents Newsletter — Termly newsletters (PDF links)
  newsletter: 'https://docs.google.com/spreadsheets/d/1wnJmLVeGN6F_VNLkRnYXj7DnII82nMe1nX_Wudo_JL4/gviz/tq?tqx=out:csv&sheet=Newsletters',
};
