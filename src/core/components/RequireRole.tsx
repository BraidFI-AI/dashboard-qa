"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import AdminSpecificView from "./views/userSpecificUtil/AdminSpecificView";
import InvalidUserView from "./views/userSpecificUtil/invalidUserView";

const RequireRole = (
  WrappedComponent: React.FunctionComponent<any>,
  allowedRoles: string[]
) => {
  const ComponentWithAccess = (props: any) => {
    const [access, setAccess] = useState(0); // 0 - loading, 1 - can access, 2 - cannot access, 3 - invalid user
    const userType = useSelector((state: any) => state.app.userType);

    useEffect(() => {
      const checkUserType = async () => {
        let type = userType;

        console.log("USERTYPE:", type);

        if (type == null) {
          setAccess(3);
          return;
        } else {
          if (!allowedRoles.includes(type)) {
            setAccess(2);
            return;
          }
        }
        setAccess(1);
      };

      checkUserType();
    }, [access, userType]);

    if (access === 0) {
      return (
        <div className="flex flex-col items-center justify-center">
          <CircularProgress></CircularProgress>
        </div>
      );
    } else if (access === 2) {
      return <AdminSpecificView />;
    } else if (access === 3) {
      return <InvalidUserView />;
    }

    return <WrappedComponent {...props} />;
  };

  ComponentWithAccess.displayName = `RequireRole(${getDisplayName(
    WrappedComponent
  )})`;

  return ComponentWithAccess;
};

function getDisplayName(WrappedComponent: React.FunctionComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}

export default RequireRole;
