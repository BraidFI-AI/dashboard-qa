import { useEffect, useState } from "react";
import { useAppDispatch } from "@/redux/store/store";
import { signOut, fetchAuthSession } from "aws-amplify/auth";
import { InactivityTracker } from "../inactivity_tracker/InactivityTracker";
import { resetAppState } from "@/redux/slices/AppSlice";
import { INACTIVITY_THRESHOLD } from "../constants";
import MyText from "../components/Text/Text";
import MyRedButton from "../components/Button/MyRedButton";
import MyBlueButton from "../components/Button/MyBlueButton";

const AuthProvider = (props: any) => {
  const dispatch = useAppDispatch();
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const [warningTimeoutId, setWarningTimeoutId] =
    useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    printToken();
  }, []);

  useEffect(() => {
    InactivityTracker.reset();
    const interval = setInterval(() => {
      const inactiveTime = InactivityTracker.getInactiveTime();
      const warningThreshold = INACTIVITY_THRESHOLD - 1 * 60 * 1000; // 29 minutes (exactly 1 min before 30-min timeout)
      const timeoutThreshold = INACTIVITY_THRESHOLD; // 30 minutes

      // Show warning dialog when 1 minute is left
      if (
        inactiveTime >= warningThreshold &&
        inactiveTime < timeoutThreshold &&
        !showWarningDialog
      ) {
        setShowWarningDialog(true);
        // Set a timeout to sign out exactly 1 minute after warning appears
        const timeoutId = setTimeout(() => {
          dispatch(resetAppState());
          signOut();
        }, 60 * 1000); // 1 minute
        setWarningTimeoutId(timeoutId);
      }

      // Sign out if timeout reached (fallback for edge cases)
      if (inactiveTime >= timeoutThreshold) {
        dispatch(resetAppState());
        signOut();
      }
    }, 10 * 1000);

    return () => {
      clearInterval(interval);
      if (warningTimeoutId) {
        clearTimeout(warningTimeoutId);
      }
    };
  }, [dispatch, showWarningDialog, warningTimeoutId]);

  const handleExtendSession = () => {
    InactivityTracker.reset();
    setShowWarningDialog(false);
    // Clear the warning timeout since user extended session
    if (warningTimeoutId) {
      clearTimeout(warningTimeoutId);
      setWarningTimeoutId(null);
    }
  };

  const handleSignOut = () => {
    dispatch(resetAppState());
    signOut();
  };

  const printToken = async () => {
    const session = await fetchAuthSession();

    console.log("Amplify session:", session);
  };

  return (
    <>
      {showWarningDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-1000">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <MyText size="lg">Session Timeout Warning</MyText>
            <MyText>
              Your session will expire in 1 minute due to inactivity. Would you
              like to extend your session?
            </MyText>
            <div className="flex gap-3 justify-end pt-6">
              <div className="w-fit">
                <MyRedButton onClick={handleSignOut}>Sign Out</MyRedButton>
              </div>
              <div className="w-fit">
                <MyBlueButton onClick={handleExtendSession}>
                  Extend Session
                </MyBlueButton>
              </div>
            </div>
          </div>
        </div>
      )}
      {props.children}
    </>
  );
};

export default AuthProvider;
