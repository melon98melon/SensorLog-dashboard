# Greenhouse Sensor Log Portal

## Overview

The Greenhouse Sensor Log Portal is a web application that allows greenhouse technicians to monitor and log environmental sensor data. The system validates sensor readings, classifies environmental conditions, stores entries locally in the browser, and provides tools for managing historical telemetry records.

The portal is designed to help greenhouse staff quickly identify environmental problems and maintain an organized record of sensor measurements.

---

## User Stories

### Story 1: Controlled Sensor Entry

As a greenhouse technician, I want to record telemetry readings for a specific bay with real-time numeric bounds enforcement so that invalid sensor inputs (e.g., pH outside 0–14 or negative values) are rejected immediately.

### Story 2: Status Feedback

As an agronomist, I want the portal to calculate and display an environmental status tag ("Optimal", "Warning", "Critical Hazard") immediately upon input submission.

### Story 3: Offline Session Persistence

As a field worker moving between greenhouses, I want logged sensor entries saved to localStorage so that refreshing the browser retains active log history.

### Story 4: Log Removal & Queue Purging

As an operations supervisor, I want to delete resolved logs individually or purge the entire log history.

### Story 5: Dynamic Out-of-Bound Indicators

As a technician typing values into the form, I want input fields to show instant visual error feedback whenever entered numbers exceed acceptable plant growth ranges.

---

## User Funnel

### Step 1: Sensor Data Entry

The user enters telemetry information into the sensor-entry form.

- Bay identification
- Sensor measurements
- Numeric fields restricted to valid ranges
- Instant visual feedback for invalid values
- Validation warnings displayed when inputs fall outside allowed limits

### Step 2: Submission & Status Calculation

When the user submits the form:

- Input values are validated
- Environmental conditions are analyzed
- A status label is calculated:
  - Optimal
  - Warning
  - Critical Hazard
- The form resets for the next entry

### Step 3: Entry Card Generation

After successful submission:

- A telemetry log card is created
- Environmental measurements are displayed
- Status indicator is displayed
- Dashboard statistics update automatically:
  - Total entries
  - Optimal entries
  - Warning entries
  - Critical Hazard entries

### Step 4: Log Management

The user can:

- View all logged telemetry records
- Scroll through historical entries
- Delete individual records
- Clear the entire log history
- Continue viewing records after page refresh through localStorage persistence

---

## HTML Element Tree

```text
html
│
├── head
│   ├── meta
│   ├── title
│   ├── link (stylesheet)
│
└── body
    │
    ├── header
    │   ├── Application Logo
    │   ├── Application Title
    │   └── Status Dashboard
    │       └── Total Entries
    │
    ├── main
    │
    │   ├── Sensor Entry Section
    │   │   ├── Form
    │   │   │
    │   │   ├── Sensor Identifier Input
    │   │   ├── Temperature Input
    │   │   ├── Humidity Input
    │   │   ├── Electrical Conductivity Input
    │   │   ├── pH Input
    │   │   │
    │   │   ├── Validation Warning Area
    │   │   └── Submit Button
    │   │
    │   └── Dynamic Error Indicators
    │
    │
    │   ├── Telemetry Records Section
    │   │   ├── Entry List Container
    │   │   │   ├── Optimal Count
    │   │   │   ├── Warning Count
    │   │   │   └── Critical Hazard Count
    │   │   │
    │   │   ├── Entry Card
    │   │   │   ├── Sensor ID
    │   │   │   ├── Sensor Measurements
    │   │   │   ├── Environmental Status Tag
    │   │   │   ├── Timestamp
    │   │   │   └── Delete Button
    │   │   │
    │   │   └── Scrollable Log History
    │   │
    │   └── Clear All Button
    │
    ├── script
    │
    └── footer
        ├── Application Information
        └── Copyright
```

---

## User Story Implementation Mapping

| User Story | Implementation                                                                                       |
| ---------- | ---------------------------------------------------------------------------------------------------- |
| Story 1    | Form inputs with numeric constraints, validation logic, immediate rejection of invalid sensor values |
| Story 2    | JavaScript status evaluation algorithm that generates Optimal, Warning, or Critical Hazard tags      |
| Story 3    | Browser localStorage used to save and reload telemetry records between sessions                      |
| Story 4    | Individual delete controls on entry cards and a Clear All button for queue purging                   |
| Story 5    | Dynamic visual feedback, error styling, and warning messages while entering data                     |

---

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6)
- LocalStorage API
- DOM Manipulation
- Form Validation

---

## Author

**Maria Leon Carrera**

CSI 3150 – Web Development

---

This project was created as part of a web development assignment focused on implementing user stories through client-side validation, local data persistence, dynamic user interfaces, and telemetry monitoring workflows.
