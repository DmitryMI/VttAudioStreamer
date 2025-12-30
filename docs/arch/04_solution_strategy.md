---
date: December 2025
title: "VTT Audio Streamer - Architecture Solution Strategy"
---

# Solution Strategy

The main idea is to use Node.js, Vue and Vuetify to achieve good-looking UI without too much effort. 

For real-time audio streaming with sub-second latency [mediasoup](https://github.com/versatica/mediasoup) can be used.

In order to improve modularity, the system should be decomposed into Scene Composer, Audio Mixer and Audio Streamer. Audio Streamer should receive already mixed stream as input and broadcast it to all connected clients. This way we can separate the most technically complex part (streaming) from the UI and audio mixing.

It is expected that the whole project can be done entirely inside one Node.js package without need to write any native code or using any external services.

To keep everything simple, the web-service will only provide two pages: one for the DM and one for the players. DM's page is a superset of player's page. Both pages broadcast audio mix and allow to configure playback volume, but DM's page has controls for scene composition and control, while player's page does not.

While security is not the main focus of the app, HTTPS (TLS) and secured audio transmission should be supported.

On current stage we don't aim to implement complex account management. Just simple DM-password should be enough to restrict players' access to scene composition page. In the future we may create a separate account management application, but this is out of scope for now.

One unsolved problem remains: if the app is self-hosted, then non-technical users will struggle with bypassing their routers' NATs. We can try to implement UPnP protocol or some kind of NAT-bypass servers in future.