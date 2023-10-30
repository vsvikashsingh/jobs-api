const Job = require('../models/Job')

const { BadRequestError, UnauthenticatedError , NotFoundError } = require('../errors')
const { StatusCodes } = require('http-status-codes')

const getAllJobs = async(req, res) => {
    const jobs = await Job.find({ createdBy : req.user.userId })
    res.status(StatusCodes.OK).json({ jobs, count: jobs.length })
}

const getJob = async(req, res)=>{
    const {
        user:{ userId},
        params: { id: jobId }
    } = req
    const job = await Job.findOne({ _id: jobId, createdBy: userId })
    if(!job){
        throw new NotFoundError(`No job found with id: ${jobId}`)
    }
    res.status(StatusCodes.OK).json({ job })
}

const createJob = async(req, res)=>{
    //add created by property to request body object
    req.body.createdBy = req.user.userId
    const job = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json({ job })
}

const updateJob = async(req, res)=>{
    const {
        body: { company,  position },
        user: { userId },
        params: { jobId }
    } = req

    if(company==='' || position===''){
        throw new BadRequestError('Company and position can not be empty values')
    }
    const job = await Job.findByIdAndUpdate(
        { _id:jobId, createdBy: userId },
         req.body,
          { new: true, runValidators: true })
    
    if(!job){
        throw new NotFoundError(`No job found with id: ${jobId}`)
    }
    res.status(StatusCodes.OK).json({ job })
}

const deleteJob = async(req, res)=>{
    const {
        user: { userId },
        params: { id: jobId },
      } = req
    
      const job = await Job.findByIdAndRemove({
        _id: jobId,
        createdBy: userId,
      })
      if (!job) {
        throw new NotFoundError(`No job with id ${jobId}`)
      }
      res.status(StatusCodes.OK).send('Deleted job post')
}

module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
}