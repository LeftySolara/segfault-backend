import express from "express";

declare global {
  namespace Express {
    interface Request {
      id?: Record<string, any>;
      email?: Record<string, any>;
      username?: Record<string, any>;
      token?: Record<string, any>;
    }
  }
}
