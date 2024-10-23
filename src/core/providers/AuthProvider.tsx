import { useEffect } from "react";
import { useAppDispatch } from "@/redux/store/store";
import { signOut, fetchAuthSession } from "aws-amplify/auth";
import { InactivityTracker } from "../inactivity_tracker/InactivityTracker";
import { resetAppState } from "@/redux/slices/AppSlice";

const AuthProvider = (props: any) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    printToken();
  }, []);

  useEffect(() => {
    InactivityTracker.reset();
    const interval = setInterval(() => {
      const isInactive = InactivityTracker.isInactive();
      if (isInactive) {
        dispatch(resetAppState());
        signOut();
      }
    }, 10 * 1000);

    return () => clearInterval(interval);
  }, [dispatch]);

  const printToken = async () => {
    const session = await fetchAuthSession();

    console.log("Amplify session:", session);
  };

  return <>{props.children}</>;
};

export default AuthProvider;
