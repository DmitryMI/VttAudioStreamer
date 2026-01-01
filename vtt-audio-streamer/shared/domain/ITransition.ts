import type {IFade} from "#shared/domain/IFade";

/**
 * Defines how one scene transitions to another.
 */
export interface ITransition {
    /** Should fade-out and fade-in overlap? */
    overlap: boolean

    /** Optional fade-out for the previous scene */
    fadeOut?: IFade

    /** Optional fade-in for the next scene */
    fadeIn?: IFade
}
