# App Flow Document for EIS Visualization Dashboard

## Onboarding and Sign-In/Sign-Up

When a new user visits the application for the first time, they are directed to the landing page. If they are not already signed in, they see the sign-in screen by default. On this screen, the user can enter their email address and password to log in or choose the link to create a new account. To sign up, the user provides their name, a valid email address, and a password. After submitting this form, the system immediately creates the new account and logs the user in, redirecting them to the main dashboard.

If the user forgets their password, they can select the “Forgot Password” link on the sign-in page. They are prompted to enter their registered email address. The system sends a password reset link to that email. Clicking the link takes the user to a secure reset password page, where they can enter and confirm a new password. Once the new password is saved, the user is taken back to the sign-in screen to log in with their updated credentials.

Signing out is straightforward. In the header of every authenticated page, the user’s avatar appears in the top-right corner. Clicking the avatar opens a small menu that includes a “Sign Out” option. Selecting this logs the user out and returns them to the public landing page.

## Main Dashboard or Home Page

After successfully signing in, the user lands on the dashboard page. This area serves as the central hub for accessing all visualization features. Along the left side of the screen is a collapsible sidebar that displays the application logo and navigation links. The top of the page shows a header bar that includes the page title and the user’s avatar menu. The dashboard view itself is split into two main sections: a data table showing detailed records of network circuits and an interactive chart summary presenting key metrics such as circuit status and counts by region.

The sidebar includes links to switch between the Dashboard view and the Map View. The Dashboard link brings the user to the table and chart layout, and the Map View link opens a page showing an interactive map of circuit endpoints. The header’s breadcrumb text also updates to reflect the current view. Clicking the logo at any time returns the user to the Dashboard view.

## Detailed Feature Flows and Page Transitions

When the user arrives on the dashboard, the application runs a server-side request to the secure ASP.NET API endpoint to fetch the latest circuit data. Once the data arrives, it is passed as props into the DataTable component, which displays rows for each circuit record, including fields like CircuitID, Description, Status, and ServiceType. At the top of the table, the user can type into a search box to filter results or click on column headers to sort the data.

Below the table, the Chart component renders dynamic visualizations based on the fetched data. For example, a pie chart breaks down circuits by status and a bar chart shows counts by region. Hovering over a chart segment highlights related rows in the data table, and selecting a segment filters the table to show only matching records.

If the user clicks on a button in the sidebar labeled “Map View,” the app navigates to a new route. On this map page, the server-side code again fetches the full data set. A map library displays all circuit endpoints as markers and draws lines between end-point pairs. Users can zoom and pan on the map. Clicking on a marker or line opens a small popup that shows summary details for that circuit.

At any point the user can click on a row in the data table to open a detail panel on the right side of the screen. This panel slides in and shows all available fields for that circuit, including latitude and longitude values, customer name, partner, and service type. The user can close the panel to return to the full dashboard view.

## Settings and Account Management

The user can manage their personal profile by clicking the avatar icon in the header and selecting “Profile Settings.” On the Profile Settings page, they can update their name and email address. If they change their email, they must confirm it by clicking a link sent to the new address. The user can also navigate to the “Change Password” tab on this page, where they provide their current password followed by a new password and confirmation.

In the Settings area, there is also a Preferences section. Here the user can toggle between light mode and dark mode for the entire application. Their choice is saved immediately and applied across all pages. After making changes in Settings, the user clicks “Save” and the app returns them to the dashboard with their new preferences in effect.

## Error States and Alternate Paths

If the user enters invalid credentials on the sign-in page, an inline error message appears beneath the form indicating that the email or password is incorrect. In the password reset flow, if an unrecognized email is submitted, the user sees a message stating that no account was found for that address. When fetching data for the dashboard or map, if the server returns an error or if the network is unavailable, a dismissible banner appears at the top of the page explaining that data could not be loaded and offering a “Retry” button.

If the user attempts to navigate directly to a protected route without being authenticated, they are immediately redirected to the sign-in page. If an authenticated user tries to access an area for which they lack permission, a 403 Forbidden page is displayed with a link to return to the dashboard.

## Conclusion and Overall App Journey

A typical user journey begins with discovering the public landing page, creating an account, and signing in. Once signed in, the user is brought to the dashboard, from which they can explore the table of network circuits, interact with visual charts, or switch to a map view to see geographic endpoints. They can dive into details for any specific circuit, update their personal profile or password in Settings, and adjust their display preferences. Throughout this flow, clear error messages guide the user back on track if anything goes wrong. By following these steps, users can securely view, analyze, and manage their executive-level network circuit data in a modern and interactive interface.