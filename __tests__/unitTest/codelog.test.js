/**
 @jest-environment jsdom
 */
// Import the functions to be tested
// import {
//     formatDate,
//     getSuffix
//   } from '../../src/scripts/main/public/js/feedback.js'; // Adjust the path to your JavaScript file
  
//   describe('Code Log Functions', () => {
  
//     test('should format date correctly', () => {
//       const date = new Date('06-05-2023');
//       const formattedDate = formatDate(date);
//       expect(formattedDate).toBe('June 5th, 2023');
//     });
  
//     test('should return correct suffix for day', () => {
//       expect(getSuffix(1)).toBe('st');
//       expect(getSuffix(2)).toBe('nd');
//       expect(getSuffix(3)).toBe('rd');
//       expect(getSuffix(4)).toBe('th');
//       expect(getSuffix(11)).toBe('th');
//       expect(getSuffix(21)).toBe('st');
//     });
//   });