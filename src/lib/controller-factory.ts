// utils
import { catchAsync } from './catch-async'
import { responseService } from './response-service'

const createRecord = (Model: any) =>
  catchAsync(async (req, res, next) => {
    // Create a new record
    const record = await Model.create({ data: req.body })

    // Respond
    res.status(responseService.statusCodes.created).json(
      responseService.created({
        message: 'Successfully created record!',
        data: record,
      })
    )
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
      return res.status(responseService.statusCodes.notFound).json(
        responseService.notFound({
          message: 'No record found with provided id!',
        })
      )
    }

    // Respond
    res.status(responseService.statusCodes.ok).json(
      responseService.ok({
        message: 'Successfully found record!',
        data: record,
      })
    )
  })

const readAllRecords = (Model: any) =>
  catchAsync(async (req, res, next) => {
    // Find all records
    const records = await Model.findMany()

    // Respond
    res.status(responseService.statusCodes.ok).json(
      responseService.ok({
        message: 'Successfully found all records!',
        data: records,
      })
    )
  })

const updateRecord = (Model: any) =>
  catchAsync(async (req, res, next) => {
    // Update record
    const updatedRecord = await Model.update({
      where: {
        id: req.params.id,
      },
      data: { ...req.body, updatedAt: new Date() },
    })

    // Respond
    res.status(responseService.statusCodes.ok).json(
      responseService.ok({
        message: 'Successfully updated record!',
        data: updatedRecord,
      })
    )
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
    res
      .status(responseService.statusCodes.noContent)
      .json(
        responseService.noContent({ message: 'Successfully deleted record!' })
      )
    return
  })

export const controllerFactory = {
  createRecord,
  readRecord,
  readAllRecords,
  updateRecord,
  deleteRecord,
}
