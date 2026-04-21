# FC Luzern Research Explorer

A GitHub-ready React/Vite prototype for a claim-centered research interface on the institutional and financial crisis of FC Luzern between 1969 and 1976.

## Purpose

This repository is not a fan page and not a finished research database. It is a structured prototype for:

- separating claims from sources
- exposing evidence and uncertainty
- documenting research gaps explicitly
- preparing a later research-cut / public-cut architecture

## Current Scope

The prototype includes:

- a claim explorer
- a source layer
- an evidence layer
- a research gap layer
- explicit methodological notes

## Current Limitations

The current version is based on structured seed data derived from prior source work. It does **not** yet include:

- full verbatim quotations from newspapers
- archival page references
- transcript-level television evidence
- adjudicated conflict sets
- direct spreadsheet ingestion

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Suggested next steps

1. replace seed data with parsed XLSX/JSON data
2. add verbatim evidence excerpts with page and date references
3. add timeline and entity views
4. add conflict sets and confidence logic
5. separate research-cut from public-cut output

## Methodological Position

This prototype follows a claim-centered model:

- **Source Layer**: archival or historiographic carrier objects
- **Evidence Layer**: claim-relevant excerpts or segments
- **Claim Layer**: analytical statements separated from raw sources

The aim is not narrative compression, but visible epistemic structure.
