import rateLimit from "express-rate-limit";

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: { message: "Too many requests, please try again later" },
});

export const uploadLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  limit: 5,
  message: { message: "Upload limit reached, try again tommorow" },
});
