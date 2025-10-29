flowchart TD
    Start[Start] --> AuthCheck{User authenticated}
    AuthCheck -- Yes --> FetchData[Fetch data from C# API]
    AuthCheck -- No --> LoginPage[Show login page]
    LoginPage --> AuthProcess[Process login]
    AuthProcess --> AuthCheck
    FetchData --> SerializeData[Serialize JSON response]
    SerializeData --> RenderDashboard[Render dashboard page]
    RenderDashboard --> DataTable[Display data table]
    RenderDashboard --> ChartView[Display charts]
    RenderDashboard --> MapView[Display map visualization]
    DataTable --> End[End]
    ChartView --> End
    MapView --> End