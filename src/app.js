import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

//app.use() is used for middleware configs etc
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// This is middleware configuration

//routes import
import userRouter from './routes/user.routes.js'
import projectRouter from './routes/project.routes.js'

// routes declaration
app.use("/api/v1/user", userRouter) // whenever someone requests "/users", control will be with the userRouter
app.use("/api/v1/project", projectRouter)


// now when I go to http://localhost:8000/api/v1/user, I will see "Hello from home controller"
// http://localhost:8000/api/v1/user/register => "Hello from Register Controller"

export { app };
