import { Outlet } from "react-router-dom";

function App() {
  return (
    <div>
      {/* A header or navbar could go here later */}
      <main className="p-4">
        <Outlet /> {/* Page content will be rendered here */}
      </main>
      {/* A footer could go here later */}
    </div>
  );
}

export default App;