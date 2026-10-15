 import express from "express";
import cors from "cors";
import serverless from "serverless-http";
import app from "../../server-side/index.js"; // server-side/index.js ke import kora holo

export const handler = serverless(app);