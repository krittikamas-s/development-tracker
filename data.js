const DEFAULT_STATE = {
    profile: {
        nickname: "Erika",
        name: "Erika (Demo User)",
        age: 26,
        birthday: "1999-05-20"
    },
    config: {
        levels: [
            { id: "l1", label: "Not Started", value: 0 },
            { id: "l2", label: "Basic/Learning", value: 25 },
            { id: "l3", label: "Intermediate", value: 50 },
            { id: "l4", label: "Advanced", value: 75 },
            { id: "l5", label: "Expert/Goal Met", value: 100 }
        ]
    },
    skills: [
        // ==========================================
        // YEAR 2025
        // ==========================================

        // --- PARENT 1: Engineering ---
        { 
            id: 1, 
            name: "Software Engineering Path", 
            levelId: "l3", 
            startDate: "2025-01-01", 
            deadline: "2025-12-31", 
            parentId: null 
        },
            { 
                id: 2, 
                name: "Frontend Development", 
                levelId: "l4", 
                startDate: "2025-01-01", 
                deadline: "2025-06-30", 
                parentId: 1 
            },
            { 
                id: 3, 
                name: "Backend Development", 
                levelId: "l2", 
                startDate: "2025-01-01", 
                deadline: "2025-08-30", 
                parentId: 1 
            },

        // --- PARENT 2: Running ---
        { 
            id: 7, 
            name: "Marathon Training", 
            levelId: "c_2", 
            startDate: "2025-01-01", 
            deadline: "2025-11-01", 
            parentId: null,
            note: "Just finished my first 10k race!",
            milestones: [
                { id: "c_0", value: 0, label: "Couch Potato" },
                { id: "c_1", value: 25, label: "5k Run" },
                { id: "c_2", value: 50, label: "10k Run" },
                { id: "c_3", value: 75, label: "Half Marathon (21k)" },
                { id: "c_4", value: 100, label: "Full Marathon (42k)" }
            ]
        },

        // --- PARENT 3: Languages (Fixes 2025 Chart Shape) ---
        {
            id: 20,
            name: "Language Skills",
            levelId: "l2",
            startDate: "2025-01-01",
            deadline: "2025-12-31",
            parentId: null
        },
            {
                id: 21,
                name: "Business English",
                levelId: "l4",
                startDate: "2025-01-01",
                deadline: "2025-06-01",
                parentId: 20
            },
            {
                id: 22,
                name: "Japanese (N3)",
                levelId: "l1",
                startDate: "2025-06-01",
                deadline: "2025-12-31",
                parentId: 20
            },

        // ==========================================
        // YEAR 2026
        // ==========================================
        
        // --- 1. ARCHITECT ---
        { 
            id: 100, 
            name: "Software Architect Path", 
            levelId: "l1", 
            startDate: "2026-01-01", 
            deadline: "2026-12-31", 
            parentId: null 
        },
        { 
            id: 101, 
            name: "Cloud & Microservices", 
            levelId: "l1", 
            startDate: "2026-01-01", 
            deadline: "2026-06-30", 
            parentId: 100 
        },

        // --- 2. FINANCIAL ---
        { 
            id: 103, 
            name: "Financial Freedom", 
            levelId: "f_0", 
            startDate: "2026-01-01", 
            deadline: "2026-12-31", 
            parentId: null,
            milestones: [
                { id: "f_0", value: 0, label: "Start Saving" },
                { id: "f_1", value: 25, label: "Emergency Fund" },
                { id: "f_2", value: 50, label: "First Investment" },
                { id: "f_3", value: 100, label: "Passive Goal Met" }
            ]
        },

        // --- 3. WELL-BEING (ADDED TO FIX RADAR CHART SHAPE) ---
        {
            id: 105,
            name: "Personal Well-being",
            levelId: "l1",
            startDate: "2026-01-01",
            deadline: "2026-12-31",
            parentId: null
        }
    ],
    settings: {
        currentFilter: 'yearly',
        sidebarCollapsed: false
    }
};