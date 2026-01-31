import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueName = String(req.email);
        cb(null, uniqueName);
    }
});

const upload = multer({ storage: storage });

export default upload;