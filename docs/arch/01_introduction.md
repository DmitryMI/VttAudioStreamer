---
date: December 2025
title: "VTT Audio Streamer - Architecture Introduction"
---

# Introduction and Goals

## Requirements Overview

**What is VTT Audio Streamer?**

The main purpose of VTT Audio Streamer is to broadcast sound environment created by Dungeon Master (table-top game host) to their players across the internet. 

While organizing immersive virtual environments for table-top games, we encountered some problems with sharing DM's audio experience and ideas that cannot be effectively solved by existing software:

1. Streaming audio using existing video-conferensing applications does not work well due to different nature of voice and music soundwaves. Many conferensing applications try to noise-cancel music and other sound effects, which leads to terrible player experience.

2. There is a limited number of sound-streaming application in existance. Some of them do not allow composing complex scenes with smooth and fade-in/outs, some have UIs not convenient enough for the DM.

3. Some commercial sound-streaming applications do not allow streaming third-party or custom audio files due to fear of legal prosecution. This is a big issue, because DM cannot compose the scene with custom music files, even if they are legally owned. Some services offer this feature only for extra fees.

VTT Sound Streaming is aimed to solve these problems. Its UI will allow the DM to compose *hierarchical* scenes that separate *ambient* and *one-shot* sound tracks and allow to configure smooth transitions between the scenes. 

The application will mix DM's audio files into a single audio stream (with appropriate timings and scene configuration) and broadcast it to connected web-clients. DM will be able to issue commands to switch active scene, mute selected tracks and fire one-shot effects.

## Quality Goals

| #            |      Quality    | Motivation          |
|--------------|-----------------|---------------------|
| 1            | Ease of use     | DM's controlls should be simple enough to allow one-click actions to switch between scene during campaign progression |
| 2            | Low latency     | The players should not be able to notice scene transitions and any delay between DM's actions and player's playback. |
| 3            | Import freedom  | Clients should not be restricted in any way on what audio to stream. |

## Stakeholders

| Role/Name      | Expectations        |
|----------------|---------------------|
| Developers     | Expected to follow the architecture!|
| Dungeon Master | Is looking for a self-hosted audio streaming and composing application |
| Player | Wants an immersive sound experience without delays and distortions |