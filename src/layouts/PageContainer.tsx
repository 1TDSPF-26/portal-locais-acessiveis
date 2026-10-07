import { Outlet } from "react-router-dom";

export function PageContainer() {
  return (
    <div className="page-container">
      <Outlet />
    </div>
  );
}