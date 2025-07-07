import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useClipboard } from '../useClipboard'
import { nextTick } from 'vue'

describe('useClipboard', () => {
  const mockWriteText = vi.fn()
  const mockConsoleError = vi.fn()

  Object.defineProperty(navigator, 'clipboard', {
    value: {
      writeText: mockWriteText,
    },
    writable: true,
  })

  vi.stubGlobal('console', { error: mockConsoleError })

  beforeEach(() => {
    mockWriteText.mockClear()
    mockConsoleError.mockClear()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('should initialize with copied = false and error = null', () => {
    const { copied, error } = useClipboard()
    expect(copied.value).toBe(false)
    expect(error.value).toBe(null)
  })

  it('should copy text to clipboard successfully and reset copied state after 2 seconds', async () => {
    mockWriteText.mockResolvedValue(undefined)

    const { copied, error, copyToClipboard } = useClipboard()

    expect(copied.value).toBe(false)
    expect(error.value).toBe(null)
    expect(mockWriteText).not.toHaveBeenCalled()

    const textToCopy = 'Hello, world!'
    await copyToClipboard(textToCopy)

    // Assert writeText was called
    expect(mockWriteText).toHaveBeenCalledTimes(1)
    expect(mockWriteText).toHaveBeenCalledWith(textToCopy)

    expect(copied.value).toBe(true)
    expect(error.value).toBe(null)

    vi.advanceTimersByTime(1000)
    expect(copied.value).toBe(true)
    vi.advanceTimersByTime(1000)
    await nextTick()
    expect(copied.value).toBe(false)
    expect(error.value).toBe(null)
  })

  it('should set error state if copy to clipboard fails', async () => {
    const mockError = new Error('Permission denied')
    mockWriteText.mockRejectedValue(mockError)

    const { copied, error, copyToClipboard } = useClipboard()
    expect(copied.value).toBe(false)
    expect(error.value).toBe(null)

    const textToCopy = 'Failed text'
    await copyToClipboard(textToCopy)

    expect(mockWriteText).toHaveBeenCalledTimes(1)
    expect(mockWriteText).toHaveBeenCalledWith(textToCopy)

    expect(copied.value).toBe(false)
    expect(error.value).toBe(mockError)

    expect(mockConsoleError).toHaveBeenCalledTimes(1)
    expect(mockConsoleError).toHaveBeenCalledWith('Failed to copy to clipboard:', mockError)

    vi.advanceTimersByTime(2000)
    await nextTick()
    expect(copied.value).toBe(false)
    expect(error.value).toBe(mockError)
  })
})
