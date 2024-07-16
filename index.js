import dotenv from 'dotenv';

dotenv.config();

import express from 'express';
import path from "path";
import ejsLayout from "express-ejs-layouts";
import session from 'express-session';
import cookieParser from 'cookie-parser';
import UserController from './src/controllers/users.controller.js';
import JobContoller from './src/controllers/jobs.controller.js';
import { auth } from './src/middlewares/auth.middleware.js';
import {uploadMiddleware} from './src/middlewares/fileupload.middleware.js';
import userValidation from './src/middlewares/userValidation.middleware.js';
const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(path.resolve(), 'src', 'views'));


// application level middleware

app.use(express.static("public"));
app.use(express.static("src/views"));
app.use(express.urlencoded({extended: true}));
app.use(ejsLayout);

app.use(cookieParser());

app.use(session({
    secret: "secretKey",
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}));

// create an instance of UserController class
const  userController = new UserController();

// create an instance of  JobController class
const jobController = new JobContoller();

app.get("/", jobController.getHomePage);
app.get("/register", userController.getRegisterForm);
app.post("/register", userValidation, userController.postRegisterForm);
app.get("/login", userController.getLoginForm);
app.post("/login", userController.postLoginForm);
app.get("/logout", userController.logout);
app.get("/jobs", auth, jobController.getAllJobs);
app.get("/job/:jobId", auth, jobController.viewJobDetails);
app.get("/newjob", auth, jobController.getCreateJobForm);
app.post("/newjob", auth, jobController.postCreateJobForm);
app.get("/updatejob/:jobId", auth, jobController.getUpdateJobForm);
app.post("/updatejob", auth, jobController.postUpdateJobForm);
app.get("/job/apply/:jobId", auth, jobController.applyJobForm);
app.post("/job/apply", auth, uploadMiddleware, jobController.postAppliedJobForm);
app.get("/job/applicants/job/:jobId", auth, jobController.getApplicantDetails);
app.get("/jobs/recruiter/:userId", auth, jobController.getJobsForSpecificRecruiter);

app.delete("/delete-job/:jobId", auth, jobController.deleteJob);

app.post("/jobs/filter", auth, jobController.getFilteredJobs);

app.listen(3500, () => {
    console.log("server is running on port 3500");
});