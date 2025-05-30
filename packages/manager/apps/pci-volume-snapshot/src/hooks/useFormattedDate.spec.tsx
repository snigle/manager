import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as i18nApi from 'react-i18next';
import { renderHook } from '@testing-library/react';
import * as dateFns from 'date-fns';
import * as MRCApi from '@ovh-ux/manager-core-utils';
import { KeyPrefix } from 'i18next';
import { useFormattedDate } from './useFormattedDate';

describe('useFormattedDate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return an empty string if date is null', () => {
    const { result } = renderHook(() => useFormattedDate(null));
    expect(result.current).toBe(null);
  });

  it('should format date with default format string', () => {
    const testDate = '2023-05-15T10:30:00Z';
    const { result } = renderHook(() => useFormattedDate(testDate));

    expect(dateFns.format).toHaveBeenCalledWith(
      expect.any(Date),
      'PPpp',
      expect.objectContaining({
        locale: expect.objectContaining({ code: 'en' }),
      }),
    );
    expect(result.current).toContain('(en)');
  });

  it('should format date with custom format string', () => {
    const testDate = '2023-05-15T10:30:00Z';
    const customFormat = 'P p';

    const { result } = renderHook(() =>
      useFormattedDate(testDate, customFormat),
    );

    expect(dateFns.format).toHaveBeenCalledWith(
      expect.any(Date),
      customFormat,
      expect.objectContaining({
        locale: expect.objectContaining({ code: 'en' }),
      }),
    );
    expect(result.current).toContain('(en)');
  });

  it('should use different locales based on i18n language', () => {
    const testDate = '2023-05-15T10:30:00Z';

    // Mock different language
    vi.spyOn(i18nApi, 'useTranslation').mockReturnValue({
      i18n: {
        language: 'fr-FR',
      },
    } as i18nApi.UseTranslationResponse<string, KeyPrefix<string>>);

    const { result } = renderHook(() => useFormattedDate(testDate));

    expect(dateFns.format).toHaveBeenCalledWith(
      expect.any(Date),
      'PPpp',
      expect.objectContaining({
        locale: expect.objectContaining({ code: 'fr' }),
      }),
    );
    expect(result.current).toContain('(fr)');
  });

  it('should fall back to "fr" locale if user locale is not supported', () => {
    const testDate = '2023-05-15T10:30:00Z';

    // Mock unsupported language
    vi.spyOn(i18nApi, 'useTranslation').mockReturnValue({
      i18n: {
        language: 'unknown-LOCALE',
      },
    } as i18nApi.UseTranslationResponse<string, KeyPrefix<string>>);

    // Mock getDateFnsLocale to return an unsupported locale
    vi.spyOn(MRCApi, 'getDateFnsLocale').mockReturnValue('unsupported');

    renderHook(() => useFormattedDate(testDate));

    expect(dateFns.format).toHaveBeenCalledWith(
      expect.any(Date),
      'PPpp',
      expect.objectContaining({
        locale: expect.objectContaining({ code: 'fr' }),
      }),
    );
  });

  it('should memoize the result for the same input', () => {
    const testDate = '2023-05-15T10:30:00Z';

    const { result, rerender } = renderHook(() => useFormattedDate(testDate));
    const firstResult = result.current;

    // Clear mock to check if format is called again
    vi.mocked(dateFns.format).mockClear();

    // Rerender with the same date
    rerender();

    expect(result.current).toBe(firstResult);
    // Format should not be called again
    expect(dateFns.format).not.toHaveBeenCalled();
  });

  it('should recalculate when date changes', () => {
    const testDate = '2023-05-15T10:30:00Z';

    const { rerender } = renderHook(({ date }) => useFormattedDate(date), {
      initialProps: { date: testDate },
    });

    // Clear mock to check if format is called again
    vi.mocked(dateFns.format).mockClear();

    // Rerender with a different date
    const newDate = '2023-06-20T14:45:00Z';
    rerender({ date: newDate });

    // Format should be called again
    expect(dateFns.format).toHaveBeenCalled();
    expect(dateFns.format).toHaveBeenCalledWith(
      expect.any(Date),
      'PPpp',
      expect.anything(),
    );
  });

  it('should recalculate when format changes', () => {
    const testDate = '2023-05-15T10:30:00Z';
    const initialFormat = 'PPpp';

    const { rerender } = renderHook(
      ({ date, format }) => useFormattedDate(date, format),
      { initialProps: { date: testDate, format: initialFormat } },
    );

    // Clear mock to check if format is called again
    vi.mocked(dateFns.format).mockClear();

    // Rerender with a different format
    const newFormat = 'P p';
    rerender({ date: testDate, format: newFormat });

    // Format should be called again
    expect(dateFns.format).toHaveBeenCalled();
    expect(dateFns.format).toHaveBeenCalledWith(
      expect.any(Date),
      newFormat,
      expect.anything(),
    );
  });
});
