/**
 * Normalized volume level.
 * 0 = silent, 1 = full volume.
 */
export type Volume = number

export function createVolume(value: number): Volume {
    if (value < 0 || value > 1) {
        throw new Error('Volume must be between 0 and 1')
    }
    return value
}
