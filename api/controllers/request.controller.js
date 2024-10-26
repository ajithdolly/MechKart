import Request from "../models/request.model.js";
import createError from "../utils/createError.js";

export const getRequests = async (req, res, next) => {
  try {
    const requests = await Request.find();
    res.status(200).send(requests);
  } catch (err) {
    next(err);
  }
};

export const validateRequest = async (req,res,next) => {
  const {validRequest,value} = req.body;
  const validatedRequest = new Request({
    ...validRequest,
    status : value,
  })
  try{
    const request = await Request.findByIdAndUpdate(validRequest._id,validatedRequest);
    res.status(200).send("Successfully updated");
  }catch(error){
    next(error);
  }
}

export const getRequestsById = async (req, res, next) => {
  const userId = req.userId;
  try {
    const requests = await Request.find({user : userId});
    res.status(200).send(requests);
  } catch (err) {
    next(err);
  }
};

export const setRequests = async (req, res, next) => {
  console.log(req.body);
  const {  username, email, requests, quantity } = req.body;
  const userId = req.userId;
  const newRequest = new Request({
    user: userId,
    username: username,
    email: email,
    request: requests,
    quantity: quantity,
  });

  try {
    const savedRequest = await newRequest.save();
    res.status(201).send("Request has been added");
  } catch (err) {
    next(err);
  }
};
