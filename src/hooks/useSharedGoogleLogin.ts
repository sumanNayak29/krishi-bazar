import { useGoogleLogin } from "@react-oauth/google";

interface GoogleUser {
  name: string;
  email: string;
  picture?: string;
}

interface UseGoogleAuthProps {
  onLoginSuccess: (user: GoogleUser) => void;
}

export function useSharedGoogleLogin({ onLoginSuccess }: UseGoogleAuthProps) {
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log("Google login success:", tokenResponse);
      try {
        const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });
        const userInfo = await res.json();
        console.log("Google User Info:", userInfo);
        onLoginSuccess({
          name: userInfo.name || userInfo.given_name || "Google User",
          email: userInfo.email,
          picture: userInfo.picture,
        });
      } catch (err) {
        console.error("Failed to fetch user info:", err);
      }
    },
    onError: (error) => {
      console.error("Google login failed:", error);
    },
  });

  return googleLogin;
}
