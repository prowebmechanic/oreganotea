# **App Name**: OrgaNote

## Core Features:

- Intuitive Layout: Clean and intuitive layout for easy note creation and organization.
- Note Editor: Text editor interface for creating notes.
- Note Saving: Allow the saving of notes locally as text files.
- AI Summarization: AI-powered tool to summarize notes and extract key topics.

## Style Guidelines:

- Use a calm color palette with a light background.
- Accent color: Soft green (#A7D1AB) to indicate actions and highlight elements.
- Clean and readable sans-serif fonts.
- Spacious layout with good use of whitespace.
- Use clear visual hierarchy.
-   .app-container {
    display: grid;
    grid-template-columns: 1fr 3fr 1fr 0.5fr;
    grid-template-rows: auto auto 1fr 1fr 1fr auto;
    height: 100vh;
    width: 100vw;
    gap: 2px;
    background-color: #000;
    color: #fff;
    font-family: Arial, sans-serif;
  }
  .calendar-section {
    grid-column: 2 / 3;
    grid-row: 1 / 2;
    background-color: #000;
    padding: 10px;
    border: 1px solid #fff;
  }
  .calendar-header, .planning-period, .default-drag, .calendar-days {
    border: 1px solid #fff;
    margin: 2px 0;
    padding: 5px;
  }
  .logo-section {
    grid-column: 1 / 2;
    grid-row: 1 / 2;
    background-color: #000;
    padding: 10px;
    border: 1px solid #fff;
  }
  .files-section {
    grid-column: 1 / 2;
    grid-row: 2 / 6;
    background-color: #000;
    padding: 10px;
    border: 1px solid #fff;
  }
  .files-header, .files-content {
    border: 1px solid #fff;
    margin: 2px 0;
    padding: 5px;
  }
  .main-window {
    grid-column: 2 / 3;
    grid-row: 2 / 6;
    background-color: #000;
    padding: 10px;
    border: 1px solid #fff;
  }
  .main-header, .editor-section, .calendar-full-view {
    border: 1px solid #fff;
    margin: 2px 0;
    padding: 5px;
  }
  .notes-section {
    grid-column: 3 / 4;
    grid-row: 1 / 2;
    background-color: #000;
    padding: 10px;
    border: 1px solid #fff;
  }
  .expand-section {
    grid-column: 3 / 4;
    grid-row: 2 / 3;
    background-color: #000;
    padding: 10px;
    border: 1px solid #fff;
  }
  .expand-header, .send-gemini {
    border: 1px solid #fff;
    margin: 2px 0;
    padding: 5px;
  }
  .app-files-section {
    grid-column: 3 / 4;
    grid-row: 3 / 4;
    background-color: #000;
    padding: 10px;
    border: 1px solid #fff;
  }
  .tray-section {
    grid-column: 3 / 4;
    grid-row: 4 / 5;
    background-color: #000;
    padding: 10px;
    border: 1px solid #fff;
  }
  .upload-section {
    grid-column: 4 / 5;
    grid-row: 1 / 2;
    background-color: #000;
    padding: 10px;
    border: 1px solid #fff;
  }
  .links {
    border: 1px solid #fff;
    margin: 2px 0;
    padding: 5px;
  }
  .sidebar-right {
    grid-column: 4 / 5;
    grid-row: 2 / 6;
    background-color: #800000;
    padding: 10px;
    border: 1px solid #fff;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  .make-html, .save-drive, .toggle-editor, .send-share {
    border: 1px solid #fff;
    padding: 5px;
    background-color: #000;
  }
  .footer {
    grid-column: 1 / 5;
    grid-row: 6 / 7;
    background-color: #000;
    padding: 10px;
    border: 1px solid #fff;
    display: flex;
    justify-content: space-around;
  }
  .footer button {
    background-color: #000;
    color: #fff;
    border: 1px solid #fff;
    padding: 5px 10px;
    cursor: pointer;
  }
  .footer button:hover {
    background-color: #333;
  }