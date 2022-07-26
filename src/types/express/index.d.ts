import express from "express";

declare global {
  namespace Express {
    interface Request {
      userId?: Record<string, any>;
      email?: Record<string, any>;
      username?: Record<string, any>;
      token?: Record<string, any>;
    }
  }
}
