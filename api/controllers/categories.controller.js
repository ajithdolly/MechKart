import Categories from "../models/category.model.js";
import createError from "../utils/createError.js";

export const getCategories = async (req, res,next) => {
  try {
    const categories = await Categories.find()
    res.status(200).send(categories);
  } catch (err) {
    next(err);
  }
};

export const createCategories = async (req, res, next) => {
  
  const {title,img,cat} = req.body;
  if(!req.isAdmin) return next(createError(403,"You are not authorised"));
    const newCategory = new Categories({
      title: title,
      img: img,
      cat: cat,
    });

    try{
        const savedCategory = await newCategory.save();
        res.status(201).send("Category has been added");
    }catch(err){
        next(err);
    }
};
