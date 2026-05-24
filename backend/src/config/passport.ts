import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.model.js";
import 'dotenv/config'

import { Strategy as GitHubStrategy } from "passport-github2";
import type { Profile } from "passport-github2";
import type { VerifyCallback } from "passport-oauth2";

import axios from "axios";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL;

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GITHUB_CALLBACK_URL = process.env.GITHUB_CALLBACK_URL;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_CALLBACK_URL) {
  throw new Error(
    "Missing Google OAuth env vars. Set GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_CALLBACK_URL"
  );
}

if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET || !GITHUB_CALLBACK_URL) {
  throw new Error(
    "Missing GitHub OAuth env vars. Set GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, and GITHUB_CALLBACK_URL"
  );
}

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(new Error("Google account has no email"));

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

passport.use(
  new GitHubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: GITHUB_CALLBACK_URL,
    },

    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback,
    ) => {
      try {
        let email = profile.emails?.[0]?.value;

        // -----------------------------
        // FIX: fallback for private email
        // -----------------------------
        if (!email) {
          const { data } = await axios.get(
            "https://api.github.com/user/emails",
            {
              headers: {
                Authorization: `token ${accessToken}`,
                Accept: "application/vnd.github+json",
              },
            }
          );

          const primaryEmail = data.find(
            (e: any) => e.primary && e.verified
          );

          email = primaryEmail?.email;
        }

        if (!email) {
          return done(new Error("No verified GitHub email found"));
        }

        // -----------------------------
        // YOUR ORIGINAL LOGIC (UNCHANGED)
        // -----------------------------
        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            firstName:
              profile.displayName?.split(" ")[0] ?? "",

            lastName:
              profile.displayName?.split(" ").slice(1).join(" ") ?? "",

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