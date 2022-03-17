import { jest } from '@jest/globals'
import { Controller } from '../../../server/controller.js'
import TestUtil from '../_util/testUtil.js'
import { Service } from '../../../server/service.js'
import config from '../../../server/config.js'

describe('#Controller - test suit for controller calls', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
    jest.clearAllMocks()
  })

  it('getFileStream() - should return file stream', async () => {
    const controller = new Controller()
    const mockFileStream = TestUtil.generateReadableStream([])
    const expectedType = '.html'

    const mockGetFileStream = jest
      .spyOn(Service.prototype, Service.prototype.getFileStream.name)
      .mockResolvedValue({
        stream: mockFileStream,
        type: expectedType,
      })

    const result = await controller.getFileStream(config.pages.homeHTML)

    expect(mockGetFileStream).toHaveBeenCalledWith(config.pages.homeHTML)
    expect(result).toEqual({
      stream: mockFileStream,
      type: expectedType,
    })
  })
})
