import type { StartSSOFlowParams, StartSSOFlowReturnType } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";

export async function signIn(startSSOFlow: (startSSOFlowParams: StartSSOFlowParams) => Promise<StartSSOFlowReturnType>) {
  const redirectUrl = Linking.createURL("/");
  try {
      // Start the authentication process by calling `startSSOFlow()`
      const { createdSessionId, setActive } = await startSSOFlow({
          strategy: 'oauth_google',
          // Defaults to current path
          redirectUrl,
      })

      // If sign in was successful, set the active session
      if (createdSessionId) {
          setActive!({ session: createdSessionId })
      }

  } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
  }
}