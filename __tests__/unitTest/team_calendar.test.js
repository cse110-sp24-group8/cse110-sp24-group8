/**
 * @jest-environment jsdom
 */
import {
  formatTimeTo12Hr,
  formatTimeTo24Hr,
} from '../../src/scripts/main/public/js/team_calendar.js';

describe('team_calendar', () => {
  describe('formatTimeTo12Hr', () => {
    it('formats 24-hour time to 12-hour time with AM/PM', () => {
      expect(formatTimeTo12Hr('13:45')).toEqual('1:45 PM');
      expect(formatTimeTo12Hr('00:00')).toEqual('12:00 AM');
      expect(formatTimeTo12Hr('12:00')).toEqual('12:00 PM');
      expect(formatTimeTo12Hr('')).toEqual('');
      expect(formatTimeTo12Hr(null)).toEqual('');
    });
  });

  describe('formatTimeTo24Hr', () => {
    it('formats 12-hour time with AM/PM to 24-hour time', () => {
      expect(formatTimeTo24Hr('1:45 PM')).toEqual('13:45');
      expect(formatTimeTo24Hr('12:00 AM')).toEqual('00:00');
      expect(formatTimeTo24Hr('12:00 PM')).toEqual('12:00');
    });
  });
});
