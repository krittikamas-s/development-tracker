const DEFAULT_STATE = {
  "profile": {
    "nickname": "Erika",
    "name": "Krittikamas S.",
    "age": "25",
    "birthday": "2000-12-11"
  },
  "config": {
    "levels": [
      {
        "id": "l0",
        "label": "Not Started",
        "value": 0
      },
      {
        "id": "l1",
        "label": "Novice / Started",
        "value": 10
      },
      {
        "id": "l2",
        "label": "Learning / Active",
        "value": 40
      },
      {
        "id": "l3",
        "label": "Consistent / Habit",
        "value": 70
      },
      {
        "id": "l4",
        "label": "Expert / Goal Met",
        "value": 100
      }
    ]
  },
  "skills": [
    {
      "id": 100,
      "name": "SAP Career Path (Key Player)",
      "levelId": "l2",
      "startDate": "2026-01-01",
      "deadline": "2026-12-31",
      "parentId": null,
      "note": "Roadmap to becoming a Senior SAP Developer",
      "active": true
    },
    {
      "id": 101,
      "name": "ABAP on GUI Expertise",
      "levelId": "m_1",
      "startDate": "2026-01-01",
      "deadline": "2026-06-30",
      "parentId": 100,
      "active": true,
      "note": "Focus on Performance Tuning, SQL, and Legacy Code refactoring.",
      "milestones": [
        {
          "id": "m_1",
          "value": 0,
          "label": "Basic Syntax"
        },
        {
          "id": "m_2",
          "value": 50,
          "label": "Advanced Debugging & ALV"
        },
        {
          "id": "m_3",
          "value": 100,
          "label": "Performance Tuning Expert"
        }
      ]
    },
    {
      "id": 102,
      "name": "ABAP RAP & Eclipse (Cloud)",
      "levelId": "r_0",
      "startDate": "2026-01-01",
      "deadline": "2026-12-31",
      "parentId": 100,
      "active": true,
      "note": "Modern SAP development. Track progress by building a full Fiori App.",
      "milestones": [
        {
          "id": "r_0",
          "value": 0,
          "label": "Not Started"
        },
        {
          "id": "r_1",
          "value": 20,
          "label": "Eclipse Setup & Hello World"
        },
        {
          "id": "r_2",
          "value": 50,
          "label": "CDS Views & Data Model"
        },
        {
          "id": "r_3",
          "value": 80,
          "label": "Behavior Definitions (CRUD)"
        },
        {
          "id": "r_4",
          "value": 100,
          "label": "Deployed Fiori App"
        }
      ]
    },
    {
      "id": 103,
      "name": "English Communication",
      "levelId": "e_1",
      "startDate": "2026-01-01",
      "deadline": "2026-12-31",
      "parentId": 100,
      "active": true,
      "note": "Goal: Speak fluently in daily stand-ups.",
      "milestones": [
        {
          "id": "e_1",
          "value": 0,
          "label": "Shy to speak"
        },
        {
          "id": "e_2",
          "value": 50,
          "label": "Comfortable in Daily Updates"
        },
        {
          "id": "e_3",
          "value": 100,
          "label": "Fluent Presentation"
        }
      ]
    },
    {
      "id": 104,
      "name": "Daily Writing Habit",
      "levelId": "w_1",
      "startDate": "2026-01-01",
      "deadline": "2026-12-31",
      "parentId": 100,
      "active": true,
      "note": "Tool: Obsidian/Notion. Track streak of daily technical logs or journal.",
      "milestones": [
        {
          "id": "w_1",
          "value": 0,
          "label": "0 Days Streak"
        },
        {
          "id": "w_2",
          "value": 30,
          "label": "1 Month Consistent"
        },
        {
          "id": "w_3",
          "value": 100,
          "label": "Year-long Habit"
        }
      ]
    },
    {
      "id": 105,
      "name": "Discipline (Room & Bed)",
      "levelId": "l0",
      "startDate": "2026-01-01",
      "deadline": "2026-12-31",
      "parentId": 100,
      "active": true,
      "note": "Small wins: Make bed immediately, Clean room before sleep."
    },
    {
      "id": 200,
      "name": "Physical Health",
      "levelId": "l2",
      "startDate": "2026-01-01",
      "deadline": "2026-12-31",
      "parentId": null,
      "active": true
    },
    {
      "id": 201,
      "name": "Running Habit",
      "levelId": "run_0",
      "startDate": "2026-01-01",
      "deadline": "2026-12-31",
      "parentId": 200,
      "active": true,
      "note": "Tool: Strava. Goal: 5km under 30mins.",
      "milestones": [
        {
          "id": "run_0",
          "value": 0,
          "label": "Not Started"
        },
        {
          "id": "run_1",
          "value": 10,
          "label": "Can run 1km"
        },
        {
          "id": "run_2",
          "value": 50,
          "label": "5km Completed"
        },
        {
          "id": "run_3",
          "value": 100,
          "label": "10km / Regular Runner"
        }
      ]
    },
    {
      "id": 202,
      "name": "Body & Diet",
      "levelId": "l0",
      "startDate": "2026-01-01",
      "deadline": "2026-06-30",
      "parentId": 200,
      "active": true,
      "note": "Less fries/sweet drinks. Measure: Body Fat % or Mirror Test."
    },
    {
      "id": 203,
      "name": "Sleep Hygiene",
      "levelId": "l0",
      "startDate": "2026-01-01",
      "deadline": "2026-12-31",
      "parentId": 200,
      "active": true,
      "note": "Target: 7.5 Hours. No phone 30m before bed."
    },
    {
      "id": 300,
      "name": "Financial Stability",
      "levelId": "l2",
      "startDate": "2026-01-01",
      "deadline": "2026-12-31",
      "parentId": null,
      "active": true,
      "note": "Salary: 29,000. Goal: Emergency Fund + GF Birthday."
    },
    {
      "id": 301,
      "name": "First Savings Pot",
      "levelId": "sav_1",
      "startDate": "2026-01-01",
      "deadline": "2026-12-31",
      "parentId": 300,
      "active": true,
      "note": "Target: 6 months expenses (approx 100k?). Save 20% (5,800) monthly.",
      "milestones": [
        {
          "id": "sav_1",
          "value": 0,
          "label": "0 Baht"
        },
        {
          "id": "sav_2",
          "value": 25,
          "label": "25,000 Baht"
        },
        {
          "id": "sav_3",
          "value": 50,
          "label": "50,000 Baht"
        },
        {
          "id": "sav_4",
          "value": 100,
          "label": "Target Reached"
        }
      ]
    },
    {
      "id": 302,
      "name": "GF Birthday Fund",
      "levelId": "l0",
      "startDate": "2026-01-01",
      "deadline": "2026-10-01",
      "parentId": 300,
      "active": true,
      "note": "Specific fund separate from main savings."
    },
    {
      "id": 400,
      "name": "Reading List 2025",
      "levelId": "l1",
      "startDate": "2026-01-01",
      "deadline": "2026-12-31",
      "parentId": null,
      "active": true
    },
    {
      "id": 401,
      "name": "Clean Code / Tech Books",
      "levelId": "l0",
      "startDate": "2026-01-01",
      "deadline": "2026-12-31",
      "parentId": 400,
      "active": true,
      "note": "Read 'Clean Code' or 'Refactoring' to improve ABAP skills."
    },
    {
      "id": 402,
      "name": "Self-Help / Finance",
      "levelId": "l0",
      "startDate": "2026-01-01",
      "deadline": "2026-12-31",
      "parentId": 400,
      "active": true,
      "note": "Books like 'Atomic Habits' or 'The Psychology of Money'."
    }
  ],
  "settings": {
    "currentFilter": "yearly",
    "sidebarCollapsed": false
  }
};