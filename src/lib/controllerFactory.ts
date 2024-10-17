import { catchAsync } from './catchAsync'

const errors404 = { query: 'No record found with provided id' }

export const createRecord = (Model: any) =>
  catchAsync(async (req, res, next) => {
    // 1. Create a new record
    const record = await Model.create({ data: req.body })

    // 2. Respond
    res.status(201).json(record)
  })

export const readRecord = (Model: any) =>
  catchAsync(async (req, res, next) => {
    // 1. Find the record by id
    const record = await Model.findUnique({
      where: {
        id: req.params.id,
      },
    })

    // 2. If no record, respond with an error
    if (!record) {
      return res.status(404).json(errors404)
    }

    // 3. Respond
    res.status(200).json(record)
  })

export const updateRecord = (Model: any) =>
  catchAsync(async (req, res, next) => {
    // 1. Create a new record
    const record = await Model.update({
      where: {
        id: req.params.id,
      },
      data: { ...req.body, updatedAt: new Date() },
    })

    // 2. If no record, respond with an error
    if (!record) {
      return res.status(404).json(errors404)
    }

    // 3. Respond
    res.status(201).json(record)
  })

export const deleteRecord = (Model: any) =>
  catchAsync(async (req, res, next) => {
    // 1. Find record by id
    const record = await Model.delete({
      where: {
        id: req.params.id,
      },
    })

    // 2. If no record, respond with an error
    if (!record) {
      return res.status(404).json(errors404)
    }

    // 3. Respond
    res.status(204).json({ status: 'success' })
  })
