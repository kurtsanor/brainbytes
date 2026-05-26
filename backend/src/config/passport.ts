import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.model.js";
import "dotenv/config";

import { Strategy as GitHubStrategy } from "passport-github2";
import type { Profile } from "passport-github2";
import type { VerifyCallback } from "passport-oauth2";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL;

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GITHUB_CALLBACK_URL = process.env.GITHUB_CALLBACK_URL;

/**
 * Fail fast if the OAuth configuration is incomplete.
 */
if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_CALLBACK_URL) {
  throw new Error(
    "Missing Google OAuth env vars. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_CALLBACK_URL",
  );
}

if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET || !GITHUB_CALLBACK_URL) {
  throw new Error(
    "Missing GitHub OAuth env vars. Set GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, and GITHUB_CALLBACK_URL",
  );
}

/**
 * Register the Google OAuth strategy used for account sign-in and linking.
 */
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
    },
    /**
     * Resolve a Google profile into a local user record.
     *
     * @param accessToken - The OAuth access token returned by Google.
     * @param refreshToken - The OAuth refresh token returned by Google.
     * @param profile - The Google profile payload.
     * @param done - Passport callback used to complete authentication.
     * @returns Nothing. Calls done() with the resolved user or error.
     */
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Google accounts should always provide an email address for account linking.
        const email = profile.emails?.[0]?.value;
        if (!email) return done(new Error("Google account has no email"));

        // Reuse an existing user when possible, otherwise create a linked profile.
        let user = await User.findOne({ email });
        if (!user) {
          user = await User.create({
            firstName: profile.name?.givenName ?? "",
            lastName: profile.name?.familyName ?? "",
            email,
            googleId: profile.id,
            provider: "google",
          });
        } else if (!user.googleId) {
          user.googleId = profile.id;
          user.provider = "google";
          await user.save();
        }

        done(null, user);
      } catch (err) {
        done(err);
      }
    },
  ),
);

/**
 * Register the GitHub OAuth strategy used for account sign-in and linking.
 */
passport.use(
  new GitHubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: GITHUB_CALLBACK_URL,
    },

    /**
     * Resolve a GitHub profile into a local user record.
     *
     * @param accessToken - The OAuth access token returned by GitHub.
     * @param refreshToken - The OAuth refresh token returned by GitHub.
     * @param profile - The GitHub profile payload.
     * @param done - Passport callback used to complete authentication.
     * @returns Nothing. Calls done() with the resolved user or error.
     */
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback,
    ) => {
      try {
        const rawProfile = profile as Profile & {
          _json?: { email?: string | null };
        };

        // GitHub may omit the email field, so fall back to the API payload or a stable placeholder.
        const email =
          profile.emails?.[0]?.value ??
          rawProfile._json?.email ??
          `github-${profile.id}@users.noreply.github.com`;

        // Link OAuth identities to an existing account when one already exists.
        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            firstName: profile.displayName?.split(" ")[0] ?? "",

            lastName: profile.displayName?.split(" ").slice(1).join(" ") ?? "",

            email,

            githubId: profile.id,

            provider: "github",
          });
        } else if (!user.githubId) {
          user.githubId = profile.id;
          user.provider = "github";
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err as Error);
      }
    },
  ),
);

export default passport;
