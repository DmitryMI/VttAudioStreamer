---
date: December 2025
title: "VTT Audio Streamer - Architecture Constraints"
---

# Constraints

At this project stage not all constraints are known.

## Known Constraints

These are the constraints that are definitely true.

| #       | Constraint          | Background        |
|---------|---------------------|-------------------|
| TC1     | Should be web-based | Web-basis significantly reduces UI and streaming-implementation workload. Also we want to get web-dev experience. |
| TC2     | Should be runnable on: Windows PC, Linux PC and Linux server. | The application should be able to work in both self-hosted and dedicated-server modes. Therefore wide OS support is required. |

## Assumed Constraints

These are the constraints that are possibly true.

| #       | Constraint          | Background        |
|---------|---------------------|-------------------|
| TC3     | Probably Nuxt.js + Vuetify/NuxtUI stack | This stack offers nice UI looks. Also both devs have some experience with it. |
| TC4     | Single room must support up to at least 10 clients (including Host/DM) | This is the maximum number of players in DnD (plus margin) |

## Unknown Constraints

These are the constraints that are questionable.

| #       | Constraint          | Background        |
|---------|---------------------|-------------------|

## Conventions

| #       | Convention          | Background        |
|---------|---------------------|-------------------|
| C1      | Architecture Documentation | Structure based on english arc42-template in version 9.0 |
| C2      | Coding conventions | *To be defined* |
| C3      | Development Language | English |
=======
| TC5     | Single room should be stand-alone web-server, runnable without login infrastructure | Ability to run a single room inside custom VPN/LAN environment without need to create user accounts, routing and proxies will simplify end-user setup workload. |
