import { jest } from '@jest/globals'
import TestUtil from '../_util/testUtil.js'
import config from '../../../server/config.js'
import { Controller } from '../../../server/controller.js'
import { handler } from '../../../server/routes.js'

describe('#Routes - test suite for api response', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
    jest.clearAllMocks()
  })

  it('GET / - should redirect to home page', async () => {
    const params = TestUtil.defaultHandleParams()
    params.request.method = 'GET'
    params.request.url = '/'

    await handler(...params.values())

    expect(params.response.writeHead).toHaveBeenCalledWith(302, {
      Location: config.location.home,
    })
    expect(params.response.end).toHaveBeenCalled()
  })

  it(`GET /home - should respond with ${config.pages.homeHTML} file stream`, async () => {
    const params = TestUtil.defaultHandleParams()
    params.request.method = 'GET'
    params.request.url = '/home'
    const mockFileStream = TestUtil.generateReadableStream(['data'])

    jest
      .spyOn(Controller.prototype, Controller.prototype.getFileStream.name)
      .mockResolvedValue({ stream: mockFileStream })
    jest.spyOn(mockFileStream, 'pipe').mockReturnValue()

    await handler(...params.values())

    expect(Controller.prototype.getFileStream).toHaveBeenCalledWith(
      config.pages.homeHTML
    )
    expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response)
  })

  it(`GET /controller - should respond with ${config.pages.controllerHTML} file stream`, async () => {
    const params = TestUtil.defaultHandleParams()
    params.request.method = 'GET'
    params.request.url = '/controller'
    const mockFileStream = TestUtil.generateReadableStream(['data'])

    jest
      .spyOn(Controller.prototype, Controller.prototype.getFileStream.name)
      .mockResolvedValue({ stream: mockFileStream })
    jest.spyOn(mockFileStream, 'pipe').mockReturnValue()

    await handler(...params.values())

    expect(Controller.prototype.getFileStream).toHaveBeenCalledWith(
      config.pages.controllerHTML
    )
    expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response)
  })

  it('GET /index.html - should respond with file stream', async () => {
    const params = TestUtil.defaultHandleParams()
    const filename = '/index.html'
    params.request.method = 'GET'
    params.request.url = filename
    const expectedType = '.html'
    const mockFileStream = TestUtil.generateReadableStream(['data'])

    jest
      .spyOn(Controller.prototype, Controller.prototype.getFileStream.name)
      .mockResolvedValue({
        stream: mockFileStream,
        type: expectedType,
      })
    jest.spyOn(mockFileStream, 'pipe').mockReturnValue()

    await handler(...params.values())

    expect(Controller.prototype.getFileStream).toHaveBeenCalledWith(filename)
    expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response)
    expect(params.response.writeHead).toHaveBeenCalledWith(200, {
      'Content-Type': config.constants.CONTENT_TYPE[expectedType],
    })
  })

  it('GET /file.ext - should respond with file stream', async () => {
    const params = TestUtil.defaultHandleParams()
    const filename = '/file.ext'
    params.request.method = 'GET'
    params.request.url = filename
    const expectedType = '.ext'
    const mockFileStream = TestUtil.generateReadableStream(['data'])

    jest
      .spyOn(Controller.prototype, Controller.prototype.getFileStream.name)
      .mockResolvedValue({
        stream: mockFileStream,
        type: expectedType,
      })
    jest.spyOn(mockFileStream, 'pipe').mockReturnValue()

    await handler(...params.values())

    expect(Controller.prototype.getFileStream).toHaveBeenCalledWith(filename)
    expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response)
    expect(params.response.writeHead).not.toHaveBeenCalled()
  })

  it('POST /unknown - giver an nonexistent route should respond with 404', async () => {
    const params = TestUtil.defaultHandleParams()
    params.request.method = 'POST'
    params.request.url = '/unknown'

    await handler(...params.values())

    expect(params.response.writeHead).toHaveBeenCalledWith(404)
    expect(params.response.end).toHaveBeenCalled()
  })

  describe('exceptions', () => {
    it('given an nonexistent file it should respond with 404', async () => {
      const params = TestUtil.defaultHandleParams()
      params.request.method = 'GET'
      params.request.url = '/index.png'

      jest
        .spyOn(Controller.prototype, Controller.prototype.getFileStream.name)
        .mockRejectedValue(
          new Error('Error: ENOENT: no such file or directory')
        )

      await handler(...params.values())

      expect(params.response.writeHead).toHaveBeenCalledWith(404)
      expect(params.response.end).toHaveBeenCalled()
    })

    it('given an error it should respond with 500', async () => {
      const params = TestUtil.defaultHandleParams()
      params.request.method = 'GET'
      params.request.url = '/index.png'

      jest
        .spyOn(Controller.prototype, Controller.prototype.getFileStream.name)
        .mockRejectedValue(new Error('Error'))

      await handler(...params.values())

      expect(params.response.writeHead).toHaveBeenCalledWith(500)
      expect(params.response.end).toHaveBeenCalled()
    })
  })
})
