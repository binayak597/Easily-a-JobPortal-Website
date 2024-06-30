import multer from "multer";

export const uploadMiddleware = (req, res, next) => {
    const storageConfig = multer.diskStorage({
        destination: function (req, file, cb){
            cb(null, "public/uploadsResume/");
        },
        filename: function(req, file, cb){
            const filename = Date.now() + "-" + file.originalname;
            cb(null, filename);
        }
    });

    const fileFilter = (req, file, cb) => {
        if(file.mimetype === "application/pdf" || file.mimetype === "application/doc"){

            //accepting .doc and .pdf files only
            cb(null, true);
        }else{
            //rejecting the files
            cb(new Error("only doc and pdf files are allowed"), false);
        }
    }

    const uploadFile = multer({storage: storageConfig, fileFilter});

    
    uploadFile.single("resume")(req, res, (err) => {

        if(err instanceof multer.MulterError){
            // return res.render("error");
            console.log(err);

        }else if(err){
            // return res.render("error");
            console.log(err);
        }

        next();
    });
}
