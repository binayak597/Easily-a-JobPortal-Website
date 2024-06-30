
export default class JobModel{

    constructor(_id, _userId, _jobCategory, _jobDesignation, _jobLocation, _companyName, _salary, _applyBy, _skills, _numofOpenings){
        this.id = _id;
        this.userId = _userId;
        this.jobCategory = _jobCategory;
        this.jobDesignation = _jobDesignation;
        this.jobLocation = _jobLocation;
        this.companyName = _companyName;
        this.salary = _salary;
        this.applyBy = _applyBy;
        this.skills = _skills;
        this.numofOpenings = _numofOpenings;
        this.applicants = [];
    }

    static getAll = () => {
        // console.log(jobs);
        return jobs;
    }

    static getJobs = (userId) => {

        return jobs.filter(job => job.userId === userId);
    }

    static getJobById = (jobId) => {
        return jobs.find(job => job.id === jobId);
    }


    static addNewJob = (jobData) => {

        const {userId, jobCategory, jobDesignation, jobLocation, companyName, salary, applyBy, skills, numofOpenings} = jobData;

        const newJob = new JobModel(String(jobs.length + 1), userId, jobCategory, jobDesignation, jobLocation, companyName, salary, applyBy, skills, numofOpenings);

        jobs.push(newJob);
    }



    static updateJob = (jobInfo) => {

        const {jobId, userId, jobCategory, jobDesignation, jobLocation, companyName, salary, applyBy, skills, numofOpenings} = jobInfo;

        const jobIndex = jobs.findIndex(job => job.id === jobId);

        const updatedJob = new JobModel(jobId, userId, jobCategory, jobDesignation, jobLocation, companyName, salary, applyBy, skills, numofOpenings)

        jobs[jobIndex] = updatedJob;
    }

    static addApplicant = (job, applicantInfo) => {

       const jobIndex = jobs.findIndex(j => j.id === job.id);

       if(jobIndex >= 0){
        jobs[jobIndex].applicants.push(applicantInfo);
       }

    }

    static getApplicants = (jobFound) => {

        return jobs.find(job => job.id === jobFound.id).applicants;
    }

    static filter = (jobRole) => {

        return jobs.filter(job => job.jobDesignation.toLowerCase() === jobRole.toLowerCase());
    }

    static delete = (jobId) => {

        const jobsDup = [...jobs];

        const jobIndex = jobsDup.findIndex(job => job.id === jobId);

        if(jobIndex >= 0){
            jobsDup.splice(jobIndex, 1);
        }

        jobs = [...jobsDup];
    }
}


let jobs = [
    {
        id: "1",
        userId: "1", //user who posted this job
        jobCategory: "Tech",
        jobDesignation: "SDE",
        jobLocation: "Bangalore",
        companyName: "Google",
        salary: "50000",
        applyBy: "2024-06-19",
        skills: ["HTML", "CSS", "JS", "DSA"],
        numofOpenings: "20",
        applicants: [
            {
                userId: "2", //user who applied to this job
                name: "abc",
                email: "abc@gmail.com",
                contactNo: "987654321",
                resume: "/uploadsResume/1718918132218-Binayak's Resume.pdf" || undefined
            }
        ]
    },
    // new JobModel(
    //     1,
    //     "Tech",
    //     "SDE",
    //     "Bangalore",
    //     "Google",
    //     50000,
    //     "19/06/2024",
    //     "HTML,CSS,JS",
    //     20
        
    // )
];