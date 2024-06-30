import JobModel from "../models/jobs.model.js";
import UserModel from "../models/users.model.js";
import sendEmail from "../utils/email.js";


// note:- 

// in this application we are storing two types of user -> ["Recruiter", "Seeker"]

// so accordingly we have designed routes, out of which some of the routes belongs to "Recruiter", some belongs to "Seeker" and some belongs to both

// so, whichever routes belongs to "recruiter" and both type of users,  to those routes controller methods, we are passing userFound variable with value to render view files with that data so that it will help to navigation bar to identify the user and perform conditional rendering

// and for routes that belongs to only "seeker", to those routes controller methods we are passing userFound variable which value will be "null" to render view files with that data





export default class JobContoller{

    //get homepage -> "Recruiter", "Seeker"

    getHomePage = (req, res) => {

        const userFound = UserModel.findByEmail(req.session?.userEmail || "");

        return res.render("home", {userEmail: req.session?.userEmail, userName: req.session?.userName, typeOfUser: req.cookies.typeOfUser, userFound});
    }

    //get all jobs posted in this application -> "Recruiter", "Seeker"
    getAllJobs = (req, res) => {
        const jobs = JobModel.getAll();

        const userFound = UserModel.findByEmail(req.session.userEmail);

        return res.render("jobs", {jobs, recruiterJobs: null, userEmail: req.session.userEmail, userName: req.session.userName, typeOfUser: req.cookies.typeOfUser, userFound});
    }


    //get jobs related to specific recruiter -> "Recruiter"

    getJobsForSpecificRecruiter = (req, res) => {

        //this user will definitely of type recruiter
        const {userId} = req.params; 

        
        //jobs that are posted by a specific recruiter
        const recruiterJobs = JobModel.getJobs(userId);


        const userFound = UserModel.findByEmail(req.session.userEmail);

        return res.render("jobs", {jobs: null, recruiterJobs, userEmail: req.session.userEmail, userName: req.session.userName, typeOfUser: req.cookies.typeOfUser, userFound});
    }

    //get form for create job -> "Recruiter"

    getCreateJobForm = (req, res) => {

        const userFound = UserModel.findByEmail(req.session.userEmail);

        return res.render("newjob-form", {userEmail: req.session.userEmail, userName: req.session.userName, typeOfUser: req.cookies.typeOfUser, userFound});
    }

    //get form for updation of job -> "Recruiter"

    getUpdateJobForm = (req, res) => {

        const {jobId} = req.params;

        const userFound = UserModel.findByEmail(req.session.userEmail);

        const jobFound = JobModel.getJobById(jobId);

        if(jobFound){

            return res.render("updatejob-form", {userEmail: req.session.userEmail, userName: req.session.userName, typeOfUser: req.cookies.typeOfUser, userFound, jobFound});
        }

        return res.status(401).send("Job is not found");

        
    }

    //post creatjob form data -> "Recruiter"

    postCreateJobForm = (req, res) => {

        //this user will definitely of type recruiter
        const {userId} = req.body;

        JobModel.addNewJob(req.body);

        //jobs that are posted by a specific recruiter
        const recruiterJobs = JobModel.getJobs(userId);

        const userFound = UserModel.findByEmail(req.session.userEmail);

        return res.render("jobs", {jobs: null, recruiterJobs, userEmail: req.session.userEmail, userName: req.session.userName, typeOfUser: req.cookies.typeOfUser, userFound});
        
        // return res.redirect(`/jobs/recruiter/${userId}`)
    }

    //post update job form data -> "Recruiter"

    postUpdateJobForm = (req, res) => {

        const {userId} = req.body;

        JobModel.updateJob(req.body);


        //jobs that are posted by a specific recruiter
        const recruiterJobs = JobModel.getJobs(userId);

        const userFound = UserModel.findByEmail(req.session.userEmail);

        return res.render("jobs", {jobs: null, recruiterJobs, userEmail: req.session.userEmail, userName: req.session.userName, typeOfUser: req.cookies.typeOfUser, userFound});
        
        // return res.redirect(`/jobs/recruiter/${userId}`)
    }

    //get a detailed page for a specific job -> "Recruiter", "Seeker"

    viewJobDetails = (req, res) => {
        const {jobId} = req.params;

        const jobFound = JobModel.getJobById(jobId);

        // console.log(JobModel.getAll());

        // console.log(jobFound);

        const userFound = UserModel.findByEmail(req.session.userEmail);

        // const jobs = JobModel.getAll();

        if(jobFound) {
            return res.render("viewJobDetails", {job: jobFound, userEmail: req.session.userEmail, userName: req.session.userName, typeOfUser: req.cookies.typeOfUser, userFound});
        }
        
        // return res.redirect("/jobs");

        return res.status(401).send("Job is not found");
    }


    //get apply job form page -> "Seeker"

    applyJobForm = (req, res) => {

        const {jobId} = req.params;

        const jobFound = JobModel.getJobById(jobId);
        // console.log(jobFound);
        const userFound = UserModel.findByEmail(req.session.userEmail);
        // console.log(userFound);
        if(jobFound) return res.render("applyJob", {job: jobFound, userEmail: req.session.userEmail, userName: req.session.userName, typeOfUser: req.cookies.typeOfUser, userFound});

        return res.status(401).send("Job is not Found");

    }

    //post applied job form data -> "Seeker"

    postAppliedJobForm = (req, res) => {

        // const data = req.body;
        // let jobId, rest;

        
        // ({jobId, ...rest} = {jobId, ...data});


        const {jobId, userId, userEmail, name, email, contact} = req.body;
        const userFound = UserModel.findByEmail(userEmail);
        if(userFound){
            const jobFound = JobModel.getJobById(jobId);
            const applicantInfo = {userId, name, email, contact};
            if(jobFound){

                //resume that uploaded by user 

                const resume = "/uploadsResume/" + req.file?.filename;

                JobModel.addApplicant(jobFound, {...applicantInfo, resume});
                sendEmail(email, jobFound.companyName, jobFound.jobDesignation);
                return res.redirect("/jobs");
            }

            return res.status(401).send("Job is not Found");
        }
        
        return res.status(401).send("User is not found");

    }

    //get all jobs based on job position specified by user -> "Recruiter", "Seeker"

    getFilteredJobs = (req, res) => {

        const {jobRole} = req.body;

        const filteredJobs = JobModel.filter(jobRole);

        const userFound = UserModel.findByEmail(req.session.userEmail);

        if(filteredJobs.length === 0) return res.status(401).send("Sorry We dont have any jobs based on your choice right Now. Explore other jobs");

        return res.render("filteredJobs", {jobs: filteredJobs, userEmail: req.session.userEmail, userName: req.session.userName, typeOfUser: req.cookies.typeOfUser, userFound})
    }

    //deletion of a job post -> "Recruiter"

    deleteJob = (req, res) => {

        const {jobId} = req.params;

        const jobFound = JobModel.getJobById(jobId);

        if(!jobFound){
            return res.status(401).send("Job is not Found");
        }

        JobModel.delete(jobId);

        //jobs that are posted by a specific recruiter
        const recruiterJobs = JobModel.getJobs(jobFound.userId);

        const userFound = UserModel.findByEmail(req.session.userEmail);

        return res.render("jobs", {jobs: null, recruiterJobs, userEmail: req.session.userEmail, userName: req.session.userName, typeOfUser: req.cookies.typeOfUser, userFound});

        // return res.redirect(`/jobs/recruiter/${jobFound.userId}`);
    }

    //get all applicant details for a specific job -> "Recruiter"

    getApplicantDetails = (req, res) => {
        const {jobId} = req.params;

        const jobFound = JobModel.getJobById(jobId);
        const userFound = UserModel.findByEmail(req.session.userEmail);
        if(jobFound){
            const applicants = JobModel.getApplicants(jobFound);
            return res.render("applicantDetails", {jobFound, applicants, userEmail: req.session.userEmail, userName: req.session.userName, typeOfUser: req.cookies.typeOfUser, userFound});
        }

        return res.status(401).send("Job is not found");
       
    }
}