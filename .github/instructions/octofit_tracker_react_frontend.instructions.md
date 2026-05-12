# OctoFit Tracker React Frontend Instructions

These instructions guide the setup and configuration of the OctoFit Tracker React frontend application. The frontend should be created in the `octofit-tracker/frontend` directory.

## React Framework Setup

1. Ensure the `octofit-tracker/frontend` directory exists.
2. Create a new React application using Vite in the `octofit-tracker/frontend` directory:
   - Use `npm create vite@latest frontend -- --template react --prefix` or equivalent.
   - This creates the React app structure with Vite as the build tool.

3. Install required dependencies:
   - `npm install react react-dom react-router-dom bootstrap`
   - Ensure the package.json includes these dependencies.

4. Import Bootstrap CSS in `src/index.js`:
   - Add `import 'bootstrap/dist/css/bootstrap.min.css'` at the top of the file.

5. Do not modify the `.gitignore` file.

## Component Updates

Update the following components to integrate with the Django REST API backend:

- `src/App.js` (or `src/App.jsx`)
- `src/index.js` (or `src/index.jsx`)
- `src/components/Activities.js` (or `.jsx`)
- `src/components/Leaderboard.js` (or `.jsx`)
- `src/components/Teams.js` (or `.jsx`)
- `src/components/Users.js` (or `.jsx`)
- `src/components/Workouts.js` (or `.jsx`)

### API Integration

- Replace all fetch URLs with the codespace URL for the Django REST framework backend:
  - Base URL: `https://$REACT_APP_CODESPACE_NAME-8000.app.github.dev/api/[component]/`
  - For example: `https://${codespaceName}-8000.app.github.dev/api/activities/`
- Ensure all components fetch data from the correct REST API endpoints for display in the React frontend.
- Use HTTPS protocol for codespace URLs.
- Add console.log statements to each component to log the fetched data and REST API endpoints.

### Data Handling

- Update all components to handle both paginated (.results) and plain array responses from the API.
- Implement proper error handling for fetch requests.

### Navigation

- Update `src/App.js` to include main navigation for all components using react-router-dom.
- Use BrowserRouter, Routes, and Route components.
- Ensure the React app displays the navigation menu and renders the components correctly.

## Styling with Bootstrap

- Use Bootstrap classes consistently across all components:
  - Tables: `table table-hover table-striped`
  - Buttons: `btn btn-primary`, `btn btn-outline-secondary`, etc.
  - Headings: `h1`, `h2`, etc.
  - Links: `nav-link`, `link-primary`
  - Navigation: `navbar navbar-expand-lg navbar-light bg-white`
  - Forms: `form-control`, `form-label`
  - Cards: `card`, `card-body`, `card-header`
  - Modals: `modal`, `modal-dialog`, `modal-content`

- Ensure consistent table layouts for all component data.

## Optional Enhancements

- Edit `App.css` to add custom styling:
  - Background colors
  - Text colors
  - Table colors
  - Button colors
  - Heading colors
  - Link colors
  - Navigation menu colors

- Add the octofitapp-small logo to the app, justified to the left.
- Add a favicon to the app.

## Running the Application

- Start the React app using `npm run dev` in the `octofit-tracker/frontend` directory.
- Verify the app runs on port 3000 and displays the navigation and components correctly.
- Check that API calls are made to the correct backend URLs and data is displayed.

## Validation

- Ensure all components fetch and display data from the REST API.
- Verify navigation between components works.
- Confirm Bootstrap styling is applied consistently.
- Check console logs for API endpoints and fetched data.