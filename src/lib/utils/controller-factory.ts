// utils
import { AppError } from '../error/app-error'
import { AppResponse } from './app-response'
import { catchAsync } from '../error/catch-async'

// types
import { HttpStatusCode } from '../../types/http-status-code'

const createRecord = (Model: any) =>
  catchAsync(async (req, res, next) => {
    // Create a new record
    const record = await Model.create({ data: req.body })

    // Respond
    new AppResponse({
      data: record,
      message: 'Record created!',
      res,
      statusCode: HttpStatusCode.CREATED,
    }).respond()
    return
  })

const readRecord = (Model: any) =>
  catchAsync(async (req, res, next) => {
    // Find the record by id
    const record = await Model.findUnique({
      where: {
        id: req.params.id,
      },
    })

    // If no record, respond with an error
    if (!record) {
      throw new AppError({
        message: 'Record not found!',
        statusCode: HttpStatusCode.NOT_FOUND,
      })
    }

    // Respond
    new AppResponse({
      data: record,
      message: 'Record found!',
      res,
      statusCode: HttpStatusCode.OK,
    }).respond()
    return
  })

const readAllRecords = (Model: any) =>
  catchAsync(async (req, res, next) => {
    // Find all records
    const records = await Model.findMany()

    // Respond
    new AppResponse({
      data: records,
      message: 'All records found!',
      res,
      statusCode: HttpStatusCode.OK,
    }).respond()
    return
  })

const updateRecord = (Model: any) =>
  catchAsync(async (req, res, next) => {
    // Update record
    const updatedRecord = await Model.update({
      where: {
        id: req.params.id,
      },
      data: req.body,
    })

    // Respond
    new AppResponse({
      data: updatedRecord,
      message: 'Updated record!',
      res,
      statusCode: HttpStatusCode.OK,
    }).respond()
    return
  })

const deleteRecord = (Model: any) =>
  catchAsync(async (req, res, next) => {
    // Delete record
    await Model.delete({
      where: {
        id: req.params.id,
      },
    })

    // Respond
    new AppResponse({
      message: 'Deleted record!',
      res,
      statusCode: HttpStatusCode.OK,
    }).respond()
    return
  })

export const controllerFactory = {
  createRecord,
  readRecord,
  readAllRecords,
  updateRecord,
  deleteRecord,
}
