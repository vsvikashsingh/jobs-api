
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {

  //custom error object
  let customError = {
    //set defaults
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong, please try again...'
  }

 //user friendly error-responses
  //handle duplicate value errors
  if(err.code && err.code === 11000){
    customError.statusCode = 400
    customError.msg = `Duplicate value for ${Object.keys(err.keyValue)} field, please choose another ${Object.keys(err.keyValue)}`
  }

  //handle cast error
  if(err.name ==='CastError'){
    customError.statusCode = 400,
    customError.msg = `No item found with ${err.path} : ${err.value}`
  }

  //handle validation errors
 if(err.name ==='ValidationError'){
    customError.statusCode = 400,
    customError.msg = `${Object.values(err.errors).map((item)=>item.message).join(',')}`
 }
  return res.status(customError.statusCode).send({msg: customError.msg})
}

module.exports = errorHandlerMiddleware
