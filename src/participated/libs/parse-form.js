import path from "path";
import formidable from "formidable";
export const FormidableError = formidable.errors.FormidableError;
export const parseForm = async (req) => {
  return  new Promise((resolve, reject) => {
  const form = new formidable.IncomingForm({ uploadDir:path.join(process.cwd(),'public','uploads'), keepExtensions: true  });
  form.parse(req, function (err, fields, files) {
    if (err) return reject(err);
    resolve({ fields, files });
  });
  });
};
