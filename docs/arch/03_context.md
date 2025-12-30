---
date: December 2025
title: "VTT Audio Streamer - Architecture Context"
---

# Context and Scope

This chapter describes the environment and context of VTT Audio Streamer: who uses the system and on which other systems does the VTT Audio Streamer depend.

## Business Context

![Business Context](images/Business%20Context.svg)

### Dungeon Master

DM uses the Audio Environment Composing to create hierarchy of scenes. They compose scenes from audio samples, which can be categorized in ambient and one-shot sounds. Scenes can be grouped into hierarchies, where child scenes inherit audio samples from parent scenes and continue to play parents' samples during sibling-scene switching.

DM uses Audio Track Importing to upload their own audio files to the server and select playback range, if they want only part of the file to be played.

DM use Audio Listening to get audio feedback from their work and to listen to the final mix together with other players.

### Player

Players use Audio Listening to listen to audio mix in sync with DM and other players and configure playback volume.

## Technical Context

This section describes how technical interfaces (channels and transmission media) link VTT Audio Streamer to its environment.

*There is nothing fancy here.*

![Technical Context](images/Technical%20Context.svg)