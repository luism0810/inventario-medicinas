import { describe, it, expect, vi } from 'vitest';
import { debounce } from './utils';

describe('debounce', () => {
	it('should only call the function once after the delay', () => {
		vi.useFakeTimers();
		const func = vi.fn();
		const debouncedFunc = debounce(func, 500);

		debouncedFunc();
		debouncedFunc();
		debouncedFunc();

		// Fast-forward time
		vi.advanceTimersByTime(500);

		expect(func).toHaveBeenCalledTimes(1);
		vi.useRealTimers();
	});

	it('should not call the function if the delay has not passed', () => {
		vi.useFakeTimers();
		const func = vi.fn();
		const debouncedFunc = debounce(func, 500);

		debouncedFunc();
		debouncedFunc();
		debouncedFunc();

		// Fast-forward time
		vi.advanceTimersByTime(250);

		expect(func).not.toHaveBeenCalled();
		vi.useRealTimers();
	});
});
